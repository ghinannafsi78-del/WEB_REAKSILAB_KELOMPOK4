/**
 * data/experiments.js
 * Daftar Eksperimen Virtual Kimia Laju Reaksi (Model A + B -> Produk) - REAKSI LAB
 * Sesuai spesifikasi PRD Bab 8, Bab 11, & AGENT.md Bab 5
 */

export const EXPERIMENTS_DATA = [
  {
    id: 'exp-konsentrasi',
    code: 'LAB-01',
    title: 'Pengaruh Konsentrasi Reaktan A terhadap Frekuensi Tumbukan',
    description: 'Eksplorasi hubungan kerapatan partikel zat pereaksi A dengan frekuensi tumbukan molekul A-B dan laju pembentukan produk.',
    reaction: 'A + B → Produk',
    factor: 'Konsentrasi A',
    badge: 'Kerapatan Partikel A',
    manipulatedVariable: 'concA',
    variables: {
      independent: 'Konsentrasi Reaktan A (0.1 M - 2.0 M)',
      dependent: 'Frekuensi Tumbukan A-B & Laju Pembentukan Produk',
      controlled: 'Konsentrasi B (1.0 M), Suhu (25°C), Volume Tetap, Tanpa Katalis'
    },
    defaultParameters: {
      concA: 1.0,
      concB: 1.0,
      temperature: 25,
      hasCatalyst: false
    },
    parameterRanges: {
      concA: { min: 0.1, max: 2.0, step: 0.1, unit: 'M' },
      concB: { min: 0.1, max: 2.0, step: 0.1, unit: 'M' },
      temperature: { min: 10, max: 80, step: 5, unit: '°C' }
    },
    learningObjectives: [
      'Mengamati representasi mikroskopik pertambahan jumlah/kepadatan partikel A saat konsentrasi A dinaikkan.',
      'Membuktikan bahwa peningkatan konsentrasi A meningkatkan peluang pertemuan dan frekuensi tumbukan A-B.',
      'Membedakan frekuensi tumbukan total dari tumbukan efektif yang menghasilkan produk.'
    ],
    scientificNote: 'Model konseptual A + B → Produk: peningkatan konsentrasi reaktan memperbesar peluang tumbukan per satuan waktu.'
  },
  {
    id: 'exp-konsentrasi-b',
    code: 'LAB-02',
    title: 'Pengaruh Konsentrasi Reaktan B terhadap Frekuensi Tumbukan',
    description: 'Investigasi pengaruh manipulasi konsentrasi pereaksi B secara independen sementara konsentrasi A dijaga konstan.',
    reaction: 'A + B → Produk',
    factor: 'Konsentrasi B',
    badge: 'Kerapatan Partikel B',
    manipulatedVariable: 'concB',
    variables: {
      independent: 'Konsentrasi Reaktan B (0.1 M - 2.0 M)',
      dependent: 'Frekuensi Tumbukan A-B & Laju Pembentukan Produk',
      controlled: 'Konsentrasi A (1.0 M), Suhu (25°C), Volume Tetap, Tanpa Katalis'
    },
    defaultParameters: {
      concA: 1.0,
      concB: 0.5,
      temperature: 25,
      hasCatalyst: false
    },
    parameterRanges: {
      concA: { min: 0.1, max: 2.0, step: 0.1, unit: 'M' },
      concB: { min: 0.1, max: 2.0, step: 0.1, unit: 'M' },
      temperature: { min: 10, max: 80, step: 5, unit: '°C' }
    },
    learningObjectives: [
      'Memverifikasi bahwa konsentrasi B dapat diubah secara independen dari konsentrasi A.',
      'Mengamati efek kepadatan partikel B terhadap intensitas tumbukan antarpartikel reaktan.',
      'Menilai pengaruh rasio stoikiometri partikel terhadap pembentukan produk akhir.'
    ],
    scientificNote: 'Menjaga konsentrasi A tetap konstan merupakan prinsip variabel kontrol untuk pengujian yang adil.'
  },
  {
    id: 'exp-suhu',
    code: 'LAB-03',
    title: 'Pengaruh Suhu terhadap Energi Kinetik & Tumbukan Efektif',
    description: 'Investigasi pengaruh kenaikan suhu sistem terhadap kecepatan acak gerak partikel dan lonjakan persentase tumbukan efektif.',
    reaction: 'A + B → Produk',
    factor: 'Suhu Sistem',
    badge: 'Energi Kinetik Partikel',
    manipulatedVariable: 'temperature',
    variables: {
      independent: 'Suhu Sistem Reaksi (10°C - 80°C)',
      dependent: 'Kecepatan Partikel, Fraksi Tumbukan Efektif, & Laju Reaksi',
      controlled: 'Konsentrasi A (1.0 M), Konsentrasi B (1.0 M), Volume Tetap, Tanpa Katalis'
    },
    defaultParameters: {
      concA: 1.0,
      concB: 1.0,
      temperature: 30,
      hasCatalyst: false
    },
    parameterRanges: {
      concA: { min: 0.1, max: 2.0, step: 0.1, unit: 'M' },
      concB: { min: 0.1, max: 2.0, step: 0.1, unit: 'M' },
      temperature: { min: 10, max: 80, step: 5, unit: '°C' }
    },
    learningObjectives: [
      'Melihat korelasi langsung antara kenaikan suhu dengan kelajuan gerak mikroskopik partikel.',
      'Menjelaskan bahwa kenaikan suhu meningkatkan energi kinetik rata-rata partikel sehingga lebih banyak partikel melampaui energi aktivasi (Ea).',
      'Mengidentifikasi bahwa peningkatan suhu menaikkan laju reaksi secara signifikan melalui peningkatan fraksi tumbukan efektif.'
    ],
    scientificNote: 'Pada model teori tumbukan, kenaikan suhu menaikkan energi kinetik rata-rata sehingga memperbanyak fraksi tumbukan berenergi ≥ Ea.'
  },
  {
    id: 'exp-katalis',
    code: 'LAB-04',
    title: 'Pengaruh Katalis terhadap Energi Aktivasi Reaksi',
    description: 'Analisis peran katalis dalam menyediakan rute reaksi alternatif dengan energi aktivasi lebih rendah tanpa ikut dikonsumsi.',
    reaction: 'A + B → Produk (dengan Katalis)',
    factor: 'Katalis',
    badge: 'Penurunan Energi Aktivasi (Ea)',
    manipulatedVariable: 'hasCatalyst',
    variables: {
      independent: 'Penggunaan Katalis (Tanpa Katalis vs Dengan Katalis)',
      dependent: 'Persentase Tumbukan Efektif & Waktu Selesai Reaksi',
      controlled: 'Konsentrasi A (1.0 M), Konsentrasi B (1.0 M), Suhu (25°C)'
    },
    defaultParameters: {
      concA: 1.0,
      concB: 1.0,
      temperature: 25,
      hasCatalyst: true
    },
    parameterRanges: {
      concA: { min: 0.1, max: 2.0, step: 0.1, unit: 'M' },
      concB: { min: 0.1, max: 2.0, step: 0.1, unit: 'M' },
      temperature: { min: 10, max: 80, step: 5, unit: '°C' }
    },
    learningObjectives: [
      'Memahami bahwa katalis mempercepat laju reaksi dengan menurunkan energi aktivasi reaksi.',
      'Menyaksikan bahwa katalis tidak digambarkan habis atau berubah menjadi produk reaktan.',
      'Membandingkan laju pembentukan produk antara kondisi tanpa katalis dan dengan katalis pada parameter lain yang identik.'
    ],
    scientificNote: 'Katalis memfasilitasi orientasi yang tepat dan menurunkan hambatan energi aktivasi sehingga fraksi tumbukan efektif meningkat.'
  }
];

export default EXPERIMENTS_DATA;
