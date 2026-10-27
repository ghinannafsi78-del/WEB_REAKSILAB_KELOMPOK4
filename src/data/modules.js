/**
 * data/modules.js
 * Sumber data materi pembelajaran Laju Reaksi - REAKSI LAB
 * Sesuai spesifikasi PRD Bab 7 & Bab 11
 */

export const MODULES_DATA = [
  {
    id: 'modul-01',
    order: 1,
    label: 'Modul 01',
    title: 'Konsep Dasar Laju Reaksi',
    tagline: 'Memahami fenomena laju perubahan konsentrasi dan teori tumbukan partikel.',
    description: 'Memahami pengertian laju reaksi, perubahan konsentrasi terhadap waktu, laju rata-rata dan sesaat, teori tumbukan, tumbukan efektif, dan energi aktivasi (Ea).',
    badge: 'Dasar & Konseptual',
    iconType: 'collision',
    duration: '45 menit',
    objectives: [
      'Menjelaskan definisi laju reaksi berdasarkan pengurangan reaktan atau penambahan produk per satuan waktu.',
      'Membedakan laju reaksi rata-rata dengan laju reaksi sesaat dari grafik konsentrasi terhadap waktu.',
      'Menganalisis syarat terjadinya tumbukan efektif (energi kinetik cukup dan orientasi molekul tepat).',
      'Memahami peran energi aktivasi (Ea) sebagai energi minimum untuk memulai reaksi kimia.'
    ],
    sections: [
      {
        id: 'sec-01',
        title: 'Pengertian Laju Reaksi',
        content: 'Laju reaksi menyatakan laju berkurangnya konsentrasi pereaksi (reaktan) atau bertambahnya konsentrasi hasil reaksi (produk) tiap satuan waktu, dinyatakan dalam satuan M/detik atau mol·L⁻¹·s⁻¹.'
      },
      {
        id: 'sec-02',
        title: 'Teori Tumbukan dan Tumbukan Efektif',
        content: 'Reaksi kimia terjadi ketika partikel-partikel zat yang bereaksi saling bertumbukan. Namun, tidak semua tumbukan menghasilkan reaksi. Hanya tumbukan yang memiliki energi cukup (mencapai energi aktivasi) dan arah orientasi yang tepat yang dinamakan tumbukan efektif.'
      },
      {
        id: 'sec-03',
        title: 'Energi Aktivasi (Ea)',
        content: 'Energi aktivasi adalah energi kinetik minimum yang harus dimiliki oleh partikel-partikel pereaksi agar dapat melampaui keadaan transisi dan membentuk produk reaksi.'
      }
    ],
    workedExamples: [
      {
        id: 'we-01',
        problem: 'Dalam wadah 2 Liter, gas N2O5 terurai dari 0.8 mol menjadi 0.2 mol dalam waktu 20 detik. Tentukan laju penguraian N2O5!',
        solution: 'Δ[N2O5] = (0.8 - 0.2) mol / 2 L = 0.3 M. Waktu Δt = 20 s. Maka laju reaksi v = 0.3 M / 20 s = 0.015 M/s.'
      }
    ],
    summary: [
      'Laju reaksi sebanding dengan perubahan konsentrasi per satuan waktu (v = ± Δ[C]/Δt).',
      'Tumbukan efektif membutuhkan orientasi ruang yang pas dan energi kinetik ≥ Ea.',
      'Reaksi dengan Ea rendah berlangsung lebih cepat pada suhu ruang dibanding reaksi dengan Ea tinggi.'
    ],
    relatedExperimentIds: ['exp-konsentrasi'],
    quizCategoryIds: ['konsep-dasar', 'teori-tumbukan']
  },
  {
    id: 'modul-02',
    order: 2,
    label: 'Modul 02',
    title: 'Faktor-Faktor Laju Reaksi',
    tagline: 'Mengeksplorasi pengaruh konsentrasi, suhu, luas permukaan, dan katalis.',
    description: 'Mengeksplorasi pengaruh konsentrasi pereaksi, suhu lingkungan, luas permukaan sentuh, dan katalis terhadap frekuensi tumbukan serta laju reaksi.',
    badge: 'Eksperimental & Praktikum',
    iconType: 'factors',
    duration: '60 menit',
    objectives: [
      'Menghubungkan peningkatan konsentrasi dengan peningkatan kerapatan partikel dan frekuensi tumbukan.',
      'Menjelaskan kenaikan suhu yang meningkatkan energi kinetik partikel sehingga persentase tumbukan efektif melonjak.',
      'Menganalisis luas bidang sentuh pada padatan (serbuk vs bongkahan) terhadap peluang terjadinya tumbukan antarpartikel.',
      'Memahami mekanisme kerja katalis yang menyediakan jalur reaksi alternatif dengan energi aktivasi lebih rendah tanpa ikut terkonsumsi secara permanen.'
    ],
    sections: [
      {
        id: 'sec-21',
        title: 'Pengaruh Konsentrasi',
        content: 'Makin tinggi konsentrasi, makin rapat partikel-partikel dalam larutan. Kerapatan ini memperbesar kemungkinan partikel saling bertumbukan, sehingga laju reaksi meningkat.'
      },
      {
        id: 'sec-22',
        title: 'Pengaruh Suhu',
        content: 'Kenaikan suhu meningkatkan energi kinetik rata-rata partikel. Partikel bergerak lebih gesit dan fraksi molekul yang memiliki energi melampaui Ea bertambah drastis. Umumnya setiap kenaikan 10°C, laju reaksi meningkat sekitar 2 kali lipat.'
      },
      {
        id: 'sec-23',
        title: 'Pengaruh Luas Permukaan Bidang Sentuh',
        content: 'Pada zat padat heterogen, reaksi hanya berlangsung pada permukaan sentuh. Zat berukuran serbuk halus memiliki total luas bidang sentuh yang jauh lebih besar dibanding bongkahan besar dengan massa sama.'
      },
      {
        id: 'sec-24',
        title: 'Pengaruh Katalis',
        content: 'Katalis adalah zat yang mempercepat reaksi kimia dengan cara menurunkan energi aktivasi reaksi (membuka mekanisme reaksi alternatif) tanpa terkonsumsi secara tetap di akhir reaksi.'
      }
    ],
    workedExamples: [
      {
        id: 'we-21',
        problem: 'Mengapa tablet antasida effervescent yang digerus menjadi serbuk bereaksi jauh lebih cepat menghasilkan gelembung CO2 dalam air dibanding tablet utuh?',
        solution: 'Karena serbuk memiliki luas permukaan bidang sentuh antarpartikel zat terlarut dengan molekul air yang jauh lebih luas, meningkatkan frekuensi tumbukan efektif secara signifikan.'
      }
    ],
    summary: [
      '4 Faktor Utama: Konsentrasi (frekuensi tumbukan), Suhu (energi kinetik partikel), Luas Permukaan (area bidang kontak), Katalis (menurunkan Ea).',
      'Katalis tidak mengubah entalpi reaksi (ΔH), hanya mempercepat tercapainya kesetimbangan.'
    ],
    relatedExperimentIds: ['exp-konsentrasi', 'exp-suhu', 'exp-luas-permukaan', 'exp-katalis'],
    quizCategoryIds: ['faktor-faktor']
  },
  {
    id: 'modul-03',
    order: 3,
    label: 'Modul 03',
    title: 'Persamaan dan Perhitungan',
    tagline: 'Menentukan hukum laju, orde reaksi, dan konstanta laju dari data eksperimen.',
    description: 'Mempelajari persamaan laju reaksi, orde reaksi (0, 1, 2), tetapan laju k, serta penentuan hukum laju dan pengaruh suhu matematis dari data eksperimen.',
    badge: 'Analisis & Matematis',
    iconType: 'math',
    duration: '60 menit',
    objectives: [
      'Menuliskan bentuk umum persamaan laju reaksi v = k [A]^m [B]^n.',
      'Menghitung orde reaksi masing-masing pereaksi menggunakan perbandingan data hasil eksperimen laboratorium.',
      'Menentukan nilai dan satuan tetapan laju reaksi (k) yang sesuai.',
      'Menerapkan rumus hubungan kenaikan suhu dengan laju reaksi: v_t = v_0 · n^((T2-T1)/ΔT).'
    ],
    sections: [
      {
        id: 'sec-31',
        title: 'Hukum Laju Reaksi',
        content: 'Bentuk umum persamaan laju reaksi untuk aA + bB → cC + dD adalah v = k [A]^m [B]^n, di mana m dan n adalah orde reaksi yang hanya dapat ditentukan lewat percobaan (bukan dari koefisien stoikiometri).'
      },
      {
        id: 'sec-32',
        title: 'Makna Orde Reaksi',
        content: 'Orde 0: Laju tidak dipengaruhi konsentrasi. Orde 1: Laju berbanding lurus dengan konsentrasi. Orde 2: Laju berbanding lurus dengan kuadrat konsentrasi.'
      },
      {
        id: 'sec-33',
        title: 'Perhitungan Pengaruh Suhu',
        content: 'Jika setiap kenaikan ΔT laju reaksi naik n kali, maka hubungan laju pada suhu T1 dan T2 dirumuskan dengan v2 = v1 × n^((T2 - T1) / ΔT) atau waktu reaksi t2 = t1 × (1/n)^((T2 - T1) / ΔT).'
      }
    ],
    workedExamples: [
      {
        id: 'we-31',
        problem: 'Pada reaksi A + B → C, jika [A] dinaikkan 2 kali pada [B] tetap, laju menjadi 4 kali semula. Tentukan orde reaksi terhadap A!',
        solution: 'v2/v1 = ([A2]/[A1])^m => 4 = (2)^m => m = 2. Jadi orde reaksi terhadap pereaksi A adalah 2.'
      }
    ],
    summary: [
      'Orde reaksi hanya diperoleh lewat eksperimen, bukan koefisien reaksi setara.',
      'Tetapan laju (k) bergantung pada sifat reaktan dan suhu, tidak bergantung pada konsentrasi.',
      'Waktu reaksi (t) berbanding terbalik dengan laju reaksi (v = 1/t).'
    ],
    relatedExperimentIds: ['exp-konsentrasi', 'exp-suhu'],
    quizCategoryIds: ['persamaan-laju', 'interpretasi-grafik']
  }
];

export default MODULES_DATA;
