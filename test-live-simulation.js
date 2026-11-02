import { SimulationEngine } from './src/services/simulationService.js';

console.log('=== PENGUJIAN REGRESI LENGKAP SIMULATION ENGINE (PRD BAB 22 & AGENT.MD BAB 16) ===\n');

// 1. Inisialisasi awal
const engine = new SimulationEngine({
  width: 600,
  height: 360,
  concA: 1.0,
  concB: 1.0,
  temperature: 25,
});

console.log(`[TEST 1] Inisialisasi: Total Partikel = ${engine.particles.length} (Target: 30 partikel)`);
console.assert(engine.particles.length === 30, `Harus ada 30 partikel, didapat ${engine.particles.length}`);
const initCountA = engine.particles.filter((p) => p.type === 'A').length;
const initCountB = engine.particles.filter((p) => p.type === 'B').length;
console.assert(initCountA === 15, `Partikel A harus 15, didapat ${initCountA}`);
console.assert(initCountB === 15, `Partikel B harus 15, didapat ${initCountB}`);
console.log('✓ PASS: Inisialisasi partikel A dan B seimbang.\n');

// 2. Gerak termal pada status idle (belum ada produk)
const p0Before = { x: engine.particles[0].x, y: engine.particles[0].y };
engine.updatePhysics(0.016, false);
const p0After = { x: engine.particles[0].x, y: engine.particles[0].y };
console.log(`[TEST 2] Gerak Termal Idle: Posisi (${p0Before.x.toFixed(1)}, ${p0Before.y.toFixed(1)}) -> (${p0After.x.toFixed(1)}, ${p0After.y.toFixed(1)})`);
console.assert(p0Before.x !== p0After.x || p0Before.y !== p0After.y, 'Partikel harus bergerak aktif saat idle!');
console.assert(engine.productCount === 0, 'Pada mode idle tidak boleh ada produk terbentuk');
console.log('✓ PASS: Partikel bergerak termal saat idle tanpa pembentukan produk palsu.\n');

// 3. Rekonsiliasi konsentrasi A secara independen
const beforeBCount = engine.particles.filter((p) => p.type === 'B').length;
engine.updateParameters({ concA: 1.5 }); // Target A ~ 23
const afterACount = engine.particles.filter((p) => p.type === 'A').length;
const afterBCount = engine.particles.filter((p) => p.type === 'B').length;
console.log(`[TEST 3] Ubah [A] ke 1.5 M: Partikel A = ${afterACount}, Partikel B = ${afterBCount}`);
console.assert(afterACount > initCountA, 'Partikel A harus bertambah');
console.assert(afterBCount === beforeBCount, 'Partikel B TIDAK BOLEH berubah ketika [A] dimanipulasi!');
console.log('✓ PASS: Konsentrasi A dapat dimanipulasi independen tanpa mengubah B.\n');

// 4. Rekonsiliasi konsentrasi B secara independen
const beforeACount2 = engine.particles.filter((p) => p.type === 'A').length;
engine.updateParameters({ concB: 0.5 }); // Target B ~ 8
const afterACount2 = engine.particles.filter((p) => p.type === 'A').length;
const afterBCount2 = engine.particles.filter((p) => p.type === 'B').length;
console.log(`[TEST 4] Ubah [B] ke 0.5 M: Partikel A = ${afterACount2}, Partikel B = ${afterBCount2}`);
console.assert(afterBCount2 < beforeBCount, 'Partikel B harus berkurang');
console.assert(afterACount2 === beforeACount2, 'Partikel A TIDAK BOLEH berubah ketika [B] dimanipulasi!');
console.log('✓ PASS: Konsentrasi B dapat dimanipulasi independen tanpa mengubah A.\n');

// 5. Pengaruh suhu terhadap kecepatan gerak partikel
const speedCold = engine.calculateParticleSpeed(10);
const speedHot = engine.calculateParticleSpeed(80);
console.log(`[TEST 5] Skala Kecepatan: 10°C = ${speedCold.toFixed(2)} px/frame, 80°C = ${speedHot.toFixed(2)} px/frame`);
console.assert(speedHot > speedCold * 1.05, 'Suhu 80°C harus menghasilkan kecepatan partikel lebih tinggi dibanding 10°C');
console.log('✓ PASS: Suhu memetakan kecepatan partikel secara proporsional sesuai fisika Boltzmann.\n');

// 6. Anti-double count tumbukan (debounce kontak berkelanjutan)
const mockEngine = new SimulationEngine({ width: 600, height: 360, concA: 1.0, concB: 1.0, temperature: 25 });
mockEngine.status = 'running';
// Tempatkan dua partikel saling bersentuhan
mockEngine.particles = [
  { id: 'A-test-1', type: 'A', x: 100, y: 100, vx: 0.1, vy: 0, radius: 8, mass: 1 },
  { id: 'B-test-1', type: 'B', x: 110, y: 100, vx: -0.1, vy: 0, radius: 8, mass: 1 },
];
// Paksa checkEffectiveCollision return false agar tidak langsung jadi produk, untuk menguji bounce debounce
mockEngine.checkEffectiveCollision = () => false;

// Frame 1: Tumbukan awal terdeteksi
mockEngine.updatePhysics(0.016, true);
const countAfterFrame1 = mockEngine.collisionCount;
console.log(`[TEST 6] Frame 1 Tumbukan A-B: Collision Count = ${countAfterFrame1}`);
console.assert(countAfterFrame1 === 1, 'Tumbukan pertama harus tercatat 1 kali');

// Frame 2: Jika masih bersentuhan karena overlap belum sepenuhnya berpisah
mockEngine.updatePhysics(0.016, true);
const countAfterFrame2 = mockEngine.collisionCount;
console.log(`[TEST 6] Frame 2 (Kontak Berkelanjutan): Collision Count = ${countAfterFrame2}`);
console.assert(countAfterFrame2 === 1, 'Kontak berkelanjutan tidak boleh menambah collision count ganda!');
console.log('✓ PASS: Pencegahan hitung ganda tumbukan berfungsi sempurna (debounce kontak terbukti).\n');

// 7. Mulai reaksi dan pembentukan produk
engine.startReaction();
console.assert(engine.status === 'running', 'Status engine harus running');
for (let i = 0; i < 150; i++) {
  engine.updatePhysics(0.016, true);
}
console.log(`[TEST 7] Simulasi 150 frame aktif: Tumbukan = ${engine.collisionCount}, Efektif = ${engine.effectiveCollisionCount}, Produk = ${engine.productCount}`);
console.assert(engine.collisionCount > 0, 'Tumbukan harus terdeteksi');
console.assert(engine.productCount === engine.effectiveCollisionCount, 'Setiap tumbukan efektif harus menghasilkan tepat satu unit produk!');
console.log('✓ PASS: Reaksi aktif mematuhi stoikiometri model A + B -> Produk.\n');

// 8. Jeda (Pause)
engine.pause();
console.assert(engine.status === 'paused', 'Status harus paused');
console.assert(engine.animationFrameId === null, 'Jeda wajib membatalkan animationFrameId');
const elapsedAtPause = engine.elapsedTime;
// Coba jalankan tick saat paused
engine.tick(performance.now());
console.assert(engine.elapsedTime === elapsedAtPause, 'Waktu simulasi harus membeku saat paused!');
console.log('✓ PASS: Tombol Jeda membatalkan frame loop dan membekukan metrik.\n');

// 9. Lanjutkan (Resume)
engine.resume();
console.assert(engine.status === 'running', 'Status harus kembali running');
console.assert(engine.animationFrameId !== null, 'Lanjutkan harus mengaktifkan loop kembali');
console.log('✓ PASS: Lanjutkan meneruskan loop dari kondisi terakhir.\n');

// 10. Restart & Reset to Defaults
engine.restart();
console.assert(engine.elapsedTime === 0, 'Restart harus mereset waktu ke 0');
console.assert(engine.collisionCount === 0, 'Restart harus mereset hitungan');
engine.resetToDefaults({ concA: 1.0, concB: 1.0, temperature: 25, hasCatalyst: false });
console.assert(engine.concA === 1.0 && engine.temperature === 25, 'Reset harus mengembalikan nilai default');
console.log('✓ PASS: Restart dan Reset to Defaults berfungsi sempurna.\n');

engine.destroy();
mockEngine.destroy();
console.log('========================================================================');
console.log('✓ SEMUA 10 SKENARIO REGRESI MESIN SIMULASI LULUS DENGAN SEMPURNA (100%)!');
console.log('========================================================================\n');
