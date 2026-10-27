/**
 * data/experiments.js
 * Daftar Eksperimen Virtual Kimia Laju Reaksi - REAKSI LAB
 * Sesuai spesifikasi PRD Bab 8 & Bab 11
 */

export const EXPERIMENTS_DATA = [
  {
    id: 'exp-konsentrasi',
    code: 'LAB-01',
    title: 'Pengaruh Konsentrasi terhadap Laju Reaksi',
    description: 'Eksplorasi hubungan kerapatan partikel zat pereaksi dengan frekuensi tumbukan molekul dan waktu pembentukan produk.',
    factor: 'Konsentrasi',
    badge: 'Kerapatan Partikel',
    variables: {
      independent: 'Konsentrasi Reaktan A (0.1 M - 2.0 M)',
      dependent: 'Laju Reaksi (v) & Waktu Reaksi (t)',
      controlled: 'Suhu (25°C), Volume Total (100 mL), Tanpa Katalis'
    },
    defaultParameters: {
      concentration: 1.0,
      temperature: 25,
      surfaceArea: 'medium',
      hasCatalyst: false
    },
    learningObjectives: [
      'Melihat representasi mikroskopik pertambahan jumlah partikel per satuan volume saat konsentrasi dinaikkan.',
      'Mengamati grafik penurunan konsentrasi reaktan dan pertambahan produk terhadap waktu.'
    ]
  },
  {
    id: 'exp-suhu',
    code: 'LAB-02',
    title: 'Pengaruh Suhu terhadap Laju Reaksi',
    description: 'Investigasi peningkatan energi kinetik partikel dan lonjakan persentase tumbukan efektif yang melampaui energi aktivasi.',
    factor: 'Suhu',
    badge: 'Energi Kinetik',
    variables: {
      independent: 'Suhu Reaksi (10°C - 80°C)',
      dependent: 'Kecepatan Gerak Partikel & Laju Reaksi',
      controlled: 'Konsentrasi (1.0 M), Luas Permukaan (Sedang), Tanpa Katalis'
    },
    defaultParameters: {
      concentration: 1.0,
      temperature: 30,
      surfaceArea: 'medium',
      hasCatalyst: false
    },
    learningObjectives: [
      'Mengamati kecepatan acak gerak partikel saat suhu dinaikkan.',
      'Memahami aturan perkiraan bahwa setiap kenaikan 10°C laju reaksi meningkat kira-kira 2 kali lipat.'
    ]
  },
  {
    id: 'exp-luas-permukaan',
    code: 'LAB-03',
    title: 'Pengaruh Luas Permukaan Bidang Sentuh',
    description: 'Simulasi interaksi partikel padat dalam bentuk bongkahan, kepingan, dan serbuk halus terhadap frekuensi kontak tumbukan.',
    factor: 'Luas Permukaan',
    badge: 'Bidang Kontak',
    variables: {
      independent: 'Bentuk Fisik Padatan (Bongkahan, Butiran, Serbuk Halus)',
      dependent: 'Area Kontak Reaksi & Waktu Penyelesaian',
      controlled: 'Massa Padatan (5 gram), Konsentrasi Asam (1.0 M), Suhu (25°C)'
    },
    defaultParameters: {
      concentration: 1.0,
      temperature: 25,
      surfaceArea: 'serbuk',
      hasCatalyst: false
    },
    learningObjectives: [
      'Membandingkan jumlah partikel luar yang terpapar langsung ke reaktan cair pada serbuk vs bongkahan.',
      'Menghubungkan percepatan reaksi dengan pertambahan luas bidang sentuh total.'
    ]
  },
  {
    id: 'exp-katalis',
    code: 'LAB-04',
    title: 'Pengaruh Katalis terhadap Energi Aktivasi',
    description: 'Analisis jalur reaksi alternatif dengan energi aktivasi lebih rendah (Ea) menggunakan katalis homogen maupun heterogen.',
    factor: 'Katalis',
    badge: 'Jalur Alternatif Ea',
    variables: {
      independent: 'Penggunaan Katalis (Tanpa Katalis vs Dengan Katalis)',
      dependent: 'Energi Aktivasi (Ea) & Waktu Reaksi',
      controlled: 'Konsentrasi Pereaksi (1.0 M), Suhu (25°C), Volume (100 mL)'
    },
    defaultParameters: {
      concentration: 1.0,
      temperature: 25,
      surfaceArea: 'medium',
      hasCatalyst: true
    },
    learningObjectives: [
      'Meninjau kurva profil diagram energi potensial reaksi dengan dan tanpa katalis.',
      'Memverifikasi bahwa katalis mempercepat laju tanpa ikut habis terpakai atau mengubah kestabilan produk.'
    ]
  }
];

export default EXPERIMENTS_DATA;
