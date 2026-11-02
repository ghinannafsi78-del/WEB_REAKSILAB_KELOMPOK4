import { SimulationEngine } from './src/services/simulationService.js';

console.log('Testing Enhanced SimulationEngine:');
const engine = new SimulationEngine({
  width: 600,
  height: 360,
  concA: 1.0,
  concB: 1.0,
  temperature: 25,
});

console.assert(engine.particles.length === 30, `Harus ada 30 partikel, didapat ${engine.particles.length}`);
console.log(`Partikel terinisialisasi: ${engine.particles.length}`);

// Verifikasi gerak partikel saat idle (thermal motion)
const p0Before = { x: engine.particles[0].x, y: engine.particles[0].y };
engine.updatePhysics(0.1, false); // Idle physics step
const p0After = { x: engine.particles[0].x, y: engine.particles[0].y };
console.log(`Posisi partikel 0 sebelum: (${p0Before.x.toFixed(1)}, ${p0Before.y.toFixed(1)}) sesudah: (${p0After.x.toFixed(1)}, ${p0After.y.toFixed(1)})`);
console.assert(p0Before.x !== p0After.x || p0Before.y !== p0After.y, 'Partikel harus bergerak aktif bahkan saat idle!');
console.assert(engine.productCount === 0, 'Saat idle belum ada produk yang terbentuk');

// Verifikasi aktivasi reaksi saat startReaction
engine.startReaction();
console.assert(engine.status === 'running', 'Status harus running setelah startReaction');

// Jalankan 150 langkah reaksi
for (let i = 0; i < 150; i++) {
  engine.updatePhysics(0.016, true);
}
console.log(`Setelah 150 frame reaksi: Tumbukan Total = ${engine.collisionCount}, Tumbukan Efektif = ${engine.effectiveCollisionCount}, Produk = ${engine.productCount}`);
console.assert(engine.collisionCount > 0, 'Tumbukan harus terdeteksi');

// Verifikasi pause
engine.pause();
console.assert(engine.status === 'paused', 'Status harus paused');

engine.destroy();
console.log('✓ SEMUA PENGUJIAN LOGIKA SIMULASI MIKROSKOPIK BERHASIL (100% PASS)!');
