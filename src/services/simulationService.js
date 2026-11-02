/**
 * services/simulationService.js
 * Mesin Simulasi Mikroskopik Reaksi Kimia Konseptual A + B -> Produk
 * Sesuai spesifikasi PRD Bab 8, Bab 9, Bab 22 & AGENT.md Bab 5, 11, 16
 *
 * Mengelola partikel A, partikel B, dan partikel Produk dalam koordinat 2D:
 * - Partikel langsung bergerak thermal (Brownian) sejak awal pada suhu T.
 * - Kecepatan partikel proporsional terhadap akar kuadrat suhu mutlak (T dalam Kelvin).
 * - Saat reaksi dimulai ('running'), tumbukan A-B dievaluasi untuk membentuk produk.
 * - Dilengkapi status kontak (touching pairs debounce) untuk mencegah hitung ganda tumbukan.
 * - Jeda (pause) benar-benar membatalkan requestAnimationFrame dan membekukan posisi & metrik.
 * - Konsentrasi A dan B dapat diubah secara independen tanpa memengaruhi partikel jenis lain.
 * - Rendering langsung ke kanvas 60 FPS untuk performa maksimal.
 * - Emisi data metrik di-throttle agar rendering React tetap ringan dan responsif.
 */

const safeRequestAnimationFrame =
  typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame.bind(window)
    : (cb) => setTimeout(() => cb(Date.now()), 16);

const safeCancelAnimationFrame =
  typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function'
    ? window.cancelAnimationFrame.bind(window)
    : (id) => clearTimeout(id);

export class SimulationEngine {
  constructor(options = {}) {
    this.width = options.width || 600;
    this.height = options.height || 360;

    // Parameter eksperimen
    this.concA = options.concA ?? 1.0; // 0.1 - 2.0 M
    this.concB = options.concB ?? 1.0; // 0.1 - 2.0 M
    this.temperature = options.temperature ?? 25; // 10 - 80 °C
    this.hasCatalyst = options.hasCatalyst ?? false;

    // State partikel & efek visual
    this.particles = [];
    this.collisionFlashes = [];
    // Set pasangan partikel yang sedang bersentuhan untuk mencegah hitung ganda (debounce kontak)
    this.activeTouchingPairs = new Set();

    // State simulasi:
    // 'idle' = partikel bergerak termal, reaksi belum dimulai (timer & hitungan = 0)
    // 'running' = reaksi aktif, deteksi tumbukan bereaksi, timer berjalan
    // 'paused' = seluruh gerak dibekukan sementara (frame dibatalkan)
    // 'completed' = waktu pengamatan selesai
    this.status = 'idle';
    this.elapsedTime = 0; // dalam detik
    this.lastTimestamp = 0;
    this.animationFrameId = null;

    // Metrik live
    this.collisionCount = 0;
    this.effectiveCollisionCount = 0;
    this.productCount = 0;

    // Time-series history untuk grafik
    this.timeSeries = [];
    this.lastSampleTime = 0;
    this.lastMetricsEmitTime = 0;

    // Canvas target
    this.canvas = null;

    // Callbacks
    this.onMetricsUpdate = options.onMetricsUpdate || null;
    this.onComplete = options.onComplete || null;

    // Durasi maksimal percobaan
    this.maxDuration = options.maxDuration || 30;

    this.initParticles();
    // Jalankan loop gerak mikroskopik sejak awal
    this.startLoop();
  }

  /**
   * Menghubungkan elemen kanvas langsung ke engine
   */
  attachCanvas(canvasElement) {
    this.canvas = canvasElement;
    if (this.canvas) {
      this.drawCanvas();
    }
  }

  /**
   * Melepas kanvas
   */
  detachCanvas() {
    this.canvas = null;
  }

  /**
   * Menginisialisasi populasi partikel A dan B
   */
  initParticles() {
    this.particles = [];
    this.collisionFlashes = [];
    this.activeTouchingPairs.clear();
    this.collisionCount = 0;
    this.effectiveCollisionCount = 0;
    this.productCount = 0;
    this.elapsedTime = 0;
    this.timeSeries = [];
    this.lastSampleTime = 0;

    // Jumlah partikel sebanding dengan konsentrasi
    const countA = Math.max(3, Math.min(32, Math.round(this.concA * 15)));
    const countB = Math.max(3, Math.min(32, Math.round(this.concB * 15)));
    const speed = this.calculateParticleSpeed(this.temperature);
    const radius = 8;
    const padding = 20;

    // Inisialisasi Partikel A (Cyan)
    for (let i = 0; i < countA; i++) {
      const angle = Math.random() * Math.PI * 2;
      this.particles.push({
        id: `A-${i}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'A',
        x: padding + Math.random() * (this.width - padding * 2),
        y: padding + Math.random() * (this.height - padding * 2),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: radius,
        mass: 1,
        color: '#00e5ff',
      });
    }

    // Inisialisasi Partikel B (Amber)
    for (let i = 0; i < countB; i++) {
      const angle = Math.random() * Math.PI * 2;
      this.particles.push({
        id: `B-${i}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'B',
        x: padding + Math.random() * (this.width - padding * 2),
        y: padding + Math.random() * (this.height - padding * 2),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: radius,
        mass: 1,
        color: '#ff9100',
      });
    }

    this.recordTimeSeriesSample();
  }

  /**
   * Menghitung magnitudo kecepatan partikel berdasarkan suhu (°C)
   * Menggunakan prinsip fisika Maxwell-Boltzmann: v ~ sqrt(T_Kelvin)
   * Suhu 10°C: ~1.4 px/frame, Suhu 80°C: ~3.4 px/frame
   */
  calculateParticleSpeed(tempC) {
    const tKelvin = tempC + 273.15;
    const tRefKelvin = 298.15; // Suhu acuan 25°C
    const baseSpeed = 2.2;
    return baseSpeed * Math.sqrt(tKelvin / tRefKelvin);
  }

  /**
   * Rekonsiliasi populasi satu jenis partikel (A atau B) secara independen
   * Mencegah perubahan partikel jenis lain saat konsentrasi salah satu diubah
   */
  reconcileParticles(type, targetConc) {
    const targetCount = Math.max(3, Math.min(32, Math.round(targetConc * 15)));
    const currentOfType = this.particles.filter((p) => p.type === type);
    const diff = targetCount - currentOfType.length;

    if (diff > 0) {
      // Tambahkan partikel baru tanpa mereset partikel yang sedang ada
      const speed = this.calculateParticleSpeed(this.temperature);
      const radius = 8;
      const padding = 20;
      const color = type === 'A' ? '#00e5ff' : '#ff9100';

      for (let i = 0; i < diff; i++) {
        const angle = Math.random() * Math.PI * 2;
        this.particles.push({
          id: `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          type: type,
          x: padding + Math.random() * (this.width - padding * 2),
          y: padding + Math.random() * (this.height - padding * 2),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: radius,
          mass: 1,
          color: color,
        });
      }
    } else if (diff < 0) {
      // Hapus partikel berlebih tipe tersebut secara aman dari belakang
      const toRemoveCount = Math.abs(diff);
      let removed = 0;
      this.particles = this.particles.filter((p) => {
        if (p.type === type && removed < toRemoveCount) {
          removed++;
          return false;
        }
        return true;
      });
    }

    this.drawCanvas();
  }

  /**
   * Memperbarui parameter eksperimen secara reaktif dan aman
   */
  updateParameters(params = {}) {
    let concAChanged = false;
    let concBChanged = false;

    if (params.concA !== undefined && params.concA !== this.concA) {
      this.concA = params.concA;
      concAChanged = true;
    }
    if (params.concB !== undefined && params.concB !== this.concB) {
      this.concB = params.concB;
      concBChanged = true;
    }
    if (params.temperature !== undefined) {
      this.temperature = params.temperature;
      // Perbarui kelajuan seluruh partikel aktif secara langsung dan mulus
      const newSpeed = this.calculateParticleSpeed(this.temperature);
      this.particles.forEach((p) => {
        const curMag = Math.hypot(p.vx, p.vy) || 1;
        p.vx = (p.vx / curMag) * newSpeed;
        p.vy = (p.vy / curMag) * newSpeed;
      });
    }
    if (params.hasCatalyst !== undefined) {
      this.hasCatalyst = params.hasCatalyst;
    }

    // Jika konsentrasi diubah saat idle atau completed, rekonsiliasi independen
    if (this.status === 'idle' || this.status === 'completed') {
      if (concAChanged) {
        this.reconcileParticles('A', this.concA);
      }
      if (concBChanged) {
        this.reconcileParticles('B', this.concB);
      }
    }

    this.emitMetrics(true);
  }

  /**
   * Mulai loop animasi utama (idempoten - tidak akan membuat loop ganda)
   */
  startLoop() {
    if (this.animationFrameId) return;
    this.lastTimestamp = performance.now();
    this.tick = this.tick.bind(this);
    this.animationFrameId = safeRequestAnimationFrame(this.tick);
  }

  /**
   * Memastikan loop berjalan (misal setelah unmount/remount di React StrictMode)
   */
  ensureRunningLoop() {
    if (this.status !== 'paused' && !this.animationFrameId) {
      this.startLoop();
    }
  }

  /**
   * Memulai reaksi simulasi (tombol "Mulai Simulasi")
   */
  startReaction() {
    if (this.status === 'idle' || this.status === 'completed') {
      this.initParticles();
    }
    this.status = 'running';
    this.lastTimestamp = performance.now();
    this.startLoop();
    this.emitMetrics(true);
  }

  /**
   * Menjeda reaksi dan gerak partikel
   * Sesuai AGENT.md 16.3: Membatalkan frame yang terjadwal & membekukan seluruh metrik waktu
   */
  pause() {
    if (this.status !== 'running') return;
    this.status = 'paused';
    if (this.animationFrameId) {
      safeCancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    // Gambar satu frame untuk memperlihatkan overlay jeda
    this.drawCanvas();
    this.emitMetrics(true);
  }

  /**
   * Melanjutkan reaksi dari jeda tanpa membuat loop ganda atau reset data
   */
  resume() {
    if (this.status !== 'paused') return;
    this.status = 'running';
    this.lastTimestamp = performance.now();
    this.startLoop();
    this.emitMetrics(true);
  }

  /**
   * Mengulang reaksi dari detik ke-0 dengan parameter saat ini
   */
  restart() {
    this.initParticles();
    this.status = 'running';
    this.lastTimestamp = performance.now();
    this.startLoop();
    this.emitMetrics(true);
  }

  /**
   * Menghentikan reaksi dan kembali ke mode idle
   */
  stopReaction() {
    this.status = 'idle';
    this.initParticles();
    this.startLoop();
    this.emitMetrics(true);
  }

  /**
   * Reset seluruh variabel ke nilai default acuan
   */
  resetToDefaults(defaultParams = {}) {
    this.concA = defaultParams.concA ?? 1.0;
    this.concB = defaultParams.concB ?? 1.0;
    this.temperature = defaultParams.temperature ?? 25;
    this.hasCatalyst = defaultParams.hasCatalyst ?? false;
    this.status = 'idle';
    this.initParticles();
    this.startLoop();
    this.emitMetrics(true);
  }

  /**
   * Loop animasi utama 60 FPS dengan delta-time terkontrol
   */
  tick(timestamp) {
    // Jika sedang dijeda, hentikan penjadwalan frame berikutnya
    if (this.status === 'paused') {
      this.animationFrameId = null;
      return;
    }

    const curTime = timestamp || performance.now();
    const rawDelta = curTime - (this.lastTimestamp || curTime);
    // Batasi delta maksimum 60ms untuk mencegah lompatan posisi setelah tab background
    const deltaMs = Math.max(0, Math.min(60, rawDelta));
    this.lastTimestamp = curTime;
    const dt = deltaMs / 1000;

    const isReacting = this.status === 'running';

    if (isReacting) {
      this.elapsedTime += dt;
    }

    this.updatePhysics(dt, isReacting);
    this.updateFlashes(dt);

    if (isReacting) {
      // Ambil sampel data grafik tiap 0.5s
      if (this.elapsedTime - this.lastSampleTime >= 0.5) {
        this.recordTimeSeriesSample();
        this.lastSampleTime = this.elapsedTime;
      }

      // Cek batas durasi atau kehabisan reaktan
      const remainingA = this.particles.filter((p) => p.type === 'A').length;
      const remainingB = this.particles.filter((p) => p.type === 'B').length;

      if (this.elapsedTime >= this.maxDuration || (remainingA === 0 && remainingB === 0)) {
        this.status = 'completed';
        this.recordTimeSeriesSample();
        this.emitMetrics(true);
        if (this.onComplete) {
          this.onComplete(this.getMetrics());
        }
      }
    }

    // Gambar frame langsung ke kanvas jika terhubung
    this.drawCanvas();

    // Emisi metrik React secara terkontrol (setiap 250ms saat running)
    const now = performance.now();
    if (this.status === 'running' && now - this.lastMetricsEmitTime >= 250) {
      this.emitMetrics(false);
      this.lastMetricsEmitTime = now;
    }

    // Jadwalkan frame berikutnya hanya jika tidak dijeda
    if (this.status !== 'paused') {
      this.animationFrameId = safeRequestAnimationFrame(this.tick);
    } else {
      this.animationFrameId = null;
    }
  }

  /**
   * Fisika gerak partikel, pantulan dinding, dan tumbukan dengan pencegahan hitung ganda
   */
  updatePhysics(dt, isReacting) {
    const particles = this.particles;
    const num = particles.length;

    // 1. Integrasi posisi dan pantulan lenting dinding wadah
    for (let i = 0; i < num; i++) {
      const p = particles[i];
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;

      if (p.x - p.radius < 0) {
        p.x = p.radius;
        p.vx = Math.abs(p.vx);
      } else if (p.x + p.radius > this.width) {
        p.x = this.width - p.radius;
        p.vx = -Math.abs(p.vx);
      }

      if (p.y - p.radius < 0) {
        p.y = p.radius;
        p.vy = Math.abs(p.vy);
      } else if (p.y + p.radius > this.height) {
        p.y = this.height - p.radius;
        p.vy = -Math.abs(p.vy);
      }
    }

    // 2. Deteksi tumbukan antar partikel dengan debounce kontak (anti-double count)
    const newProducts = [];
    const particlesToRemove = new Set();
    const currentFrameTouchingPairs = new Set();

    for (let i = 0; i < num; i++) {
      const p1 = particles[i];
      if (particlesToRemove.has(p1.id)) continue;

      for (let j = i + 1; j < num; j++) {
        const p2 = particles[j];
        if (particlesToRemove.has(p2.id)) continue;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.hypot(dx, dy);
        const minDist = p1.radius + p2.radius;

        if (dist < minDist && dist > 0) {
          // Buat key pasangan unik kanonikal
          const pairKey = p1.id < p2.id ? `${p1.id}:${p2.id}` : `${p2.id}:${p1.id}`;
          currentFrameTouchingPairs.add(pairKey);

          // Cek apakah ini tumbukan baru atau masih kontak bersambung dari frame lalu
          const isNewCollision = !this.activeTouchingPairs.has(pairKey);

          // Pisahkan posisi agar tidak overlapping
          const overlap = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;

          p1.x -= nx * overlap;
          p1.y -= ny * overlap;
          p2.x += nx * overlap;
          p2.y += ny * overlap;

          // Pantulan lenting momentum 2D elastis
          const kx = p1.vx - p2.vx;
          const ky = p1.vy - p2.vy;
          const p = (2 * (nx * kx + ny * ky)) / (p1.mass + p2.mass);

          p1.vx -= p * p2.mass * nx;
          p1.vy -= p * p2.mass * ny;
          p2.vx += p * p1.mass * nx;
          p2.vy += p * p1.mass * ny;

          const isAB =
            (p1.type === 'A' && p2.type === 'B') ||
            (p1.type === 'B' && p2.type === 'A');

          if (isAB) {
            if (isReacting) {
              // HANYA hitung satu kali per peristiwa kontak fisik awal
              if (isNewCollision) {
                this.collisionCount++;

                const isEffective = this.checkEffectiveCollision();

                if (isEffective) {
                  this.effectiveCollisionCount++;
                  this.productCount++;

                  // Efek visual kilatan tumbukan efektif berpendar hijau
                  this.collisionFlashes.push({
                    x: (p1.x + p2.x) / 2,
                    y: (p1.y + p2.y) / 2,
                    radius: 20,
                    life: 1.0,
                    color: '#00e676',
                  });

                  particlesToRemove.add(p1.id);
                  particlesToRemove.add(p2.id);

                  // Buat partikel Produk [AB] dari konversi kedua reaktan
                  const prodVx = (p1.vx + p2.vx) * 0.55;
                  const prodVy = (p1.vy + p2.vy) * 0.55;

                  newProducts.push({
                    id: `P-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    type: 'P',
                    x: (p1.x + p2.x) / 2,
                    y: (p1.y + p2.y) / 2,
                    vx: prodVx,
                    vy: prodVy,
                    radius: 10,
                    mass: 2,
                    color: '#10b981',
                  });

                  break;
                } else {
                  // Tumbukan lenting biasa (tidak memenuhi kriteria efektif)
                  this.collisionFlashes.push({
                    x: (p1.x + p2.x) / 2,
                    y: (p1.y + p2.y) / 2,
                    radius: 9,
                    life: 0.35,
                    color: 'rgba(255, 255, 255, 0.45)',
                  });
                }
              }
            } else {
              // Jika status idle, partikel bergerak dan memantul termal
              if (isNewCollision) {
                this.collisionFlashes.push({
                  x: (p1.x + p2.x) / 2,
                  y: (p1.y + p2.y) / 2,
                  radius: 7,
                  life: 0.25,
                  color: 'rgba(56, 189, 248, 0.3)',
                });
              }
            }
          }
        }
      }
    }

    // Perbarui set pasangan kontak aktif untuk frame selanjutnya
    this.activeTouchingPairs = currentFrameTouchingPairs;

    // Terapkan konversi reaktan ke produk
    if (particlesToRemove.size > 0) {
      this.particles = this.particles.filter((p) => !particlesToRemove.has(p.id));
      this.particles.push(...newProducts);
    }
  }

  /**
   * Peluang tumbukan efektif berbasis model Arrhenius:
   * Peluang = f(T, Katalis) di mana kenaikan suhu meningkatkan fraksi partikel dengan E >= Ea
   * Katalis menurunkan energi aktivasi sehingga fraksi tumbukan efektif meningkat signifikan
   */
  checkEffectiveCollision() {
    const tempRatio = Math.max(0, Math.min(1, (this.temperature - 10) / 70));
    let prob = 0.12 + 0.63 * Math.pow(tempRatio, 1.4);
    if (this.hasCatalyst) {
      prob = Math.min(0.92, prob * 1.85);
    }
    return Math.random() < prob;
  }

  /**
   * Perbarui decay kilatan visual
   */
  updateFlashes(dt) {
    for (let i = this.collisionFlashes.length - 1; i >= 0; i--) {
      const f = this.collisionFlashes[i];
      f.life -= dt * 3.5;
      if (f.life <= 0) {
        this.collisionFlashes.splice(i, 1);
      }
    }
  }

  /**
   * Rekam sampel time-series untuk grafik kinetika
   */
  recordTimeSeriesSample() {
    const curTime = Number(this.elapsedTime.toFixed(1));
    const countA = this.particles.filter((p) => p.type === 'A').length;
    const countB = this.particles.filter((p) => p.type === 'B').length;
    const currentRate = this.calculateCurrentRate();

    this.timeSeries.push({
      time: curTime,
      countA,
      countB,
      totalReactants: countA + countB,
      productCount: this.productCount,
      rate: Number(currentRate.toFixed(2)),
    });
  }

  calculateCurrentRate() {
    if (this.elapsedTime < 0.2) return 0;
    return this.productCount / this.elapsedTime;
  }

  /**
   * Render kanvas 60 FPS dengan penskalaan resolusi DPR dan kontras tinggi
   */
  drawCanvas() {
    const canvas = this.canvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || this.width;
    const h = rect.height || this.height;

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Background gradient bertema laboratorium kimia gelap
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#0a101d');
    bgGrad.addColorStop(1, '#0d1829');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Garis grid mikroskopik lembut
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    for (let x = 30; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 30; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const scaleX = w / this.width;
    const scaleY = h / this.height;

    // 3. Efek kilatan tumbukan
    this.collisionFlashes.forEach((f) => {
      const fx = f.x * scaleX;
      const fy = f.y * scaleY;
      const alpha = Math.max(0, Math.min(1, f.life));

      ctx.save();
      ctx.beginPath();
      ctx.arc(fx, fy, f.radius * (2 - alpha), 0, Math.PI * 2);
      ctx.fillStyle = f.color.includes('rgba')
        ? f.color
        : `rgba(0, 230, 118, ${alpha * 0.75})`;
      ctx.shadowColor = '#00e676';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.restore();
    });

    // 4. Gambar partikel A, B, Produk
    this.particles.forEach((p) => {
      const px = p.x * scaleX;
      const py = p.y * scaleY;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, p.radius, 0, Math.PI * 2);

      if (p.type === 'A') {
        const grad = ctx.createRadialGradient(px - 2, py - 2, 1, px, py, p.radius);
        grad.addColorStop(0, '#80f7ff');
        grad.addColorStop(0.6, '#00d2eb');
        grad.addColorStop(1, '#008394');
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#051824';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('A', px, py);
      } else if (p.type === 'B') {
        const grad = ctx.createRadialGradient(px - 2, py - 2, 1, px, py, p.radius);
        grad.addColorStop(0, '#ffca80');
        grad.addColorStop(0.6, '#ff9100');
        grad.addColorStop(1, '#c46000');
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(255, 145, 0, 0.5)';
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#261200';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('B', px, py);
      } else if (p.type === 'P') {
        const grad = ctx.createRadialGradient(px - 2, py - 2, 1, px, py, p.radius);
        grad.addColorStop(0, '#a7f3d0');
        grad.addColorStop(0.5, '#10b981');
        grad.addColorStop(1, '#047857');
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
        ctx.shadowBlur = 12;
        ctx.fill();

        ctx.strokeStyle = '#d1fae5';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#022c22';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('AB', px, py);
      }

      ctx.restore();
    });

    ctx.restore();
  }

  /**
   * Mengembalikan snapshot metrik terhitung
   */
  getMetrics() {
    const timeSafe = Math.max(0.5, this.elapsedTime);
    const collisionFrequency = Number((this.collisionCount / timeSafe).toFixed(2));
    const reactionRate = Number(this.calculateCurrentRate().toFixed(2));
    const countA = this.particles.filter((p) => p.type === 'A').length;
    const countB = this.particles.filter((p) => p.type === 'B').length;
    const countP = this.particles.filter((p) => p.type === 'P').length;

    return {
      status: this.status,
      elapsedTime: Number(this.elapsedTime.toFixed(1)),
      maxDuration: this.maxDuration,
      collisionCount: this.collisionCount,
      collisionFrequency,
      effectiveCollisionCount: this.effectiveCollisionCount,
      productCount: this.productCount,
      reactionRate,
      remainingA: countA,
      remainingB: countB,
      currentProductCount: countP,
      parameters: {
        concA: this.concA,
        concB: this.concB,
        temperature: this.temperature,
        hasCatalyst: this.hasCatalyst,
      },
      timeSeries: [...this.timeSeries],
    };
  }

  /**
   * Mengatur handler pembaruan metrik
   */
  setOnMetricsUpdate(fn) {
    this.onMetricsUpdate = fn;
  }

  /**
   * Panggil callback pembaruan metrik ke React
   */
  emitMetrics(_force = false) {
    if (this.onMetricsUpdate) {
      this.onMetricsUpdate(this.getMetrics());
    }
  }

  /**
   * Bersihkan loop dan referensi
   */
  destroy() {
    if (this.animationFrameId) {
      safeCancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.canvas = null;
    this.onMetricsUpdate = null;
    this.onComplete = null;
  }
}

export default SimulationEngine;
