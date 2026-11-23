/**
 * data/labQuizQuestions.js
 * Bank Soal Kuis Interaktif Berbasis Eksperimen Laboratorium Virtual REAKSI LAB
 * Sesuai spesifikasi PRD Bab 8.12, Bab 10, Bab 11 & AGENT.md Bab 7
 *
 * Mengelompokkan soal kuis berdasarkan eksperimen yang sedang aktif:
 * - LAB-01 (exp-konsentrasi): Konsentrasi Reaktan A & Teori Tumbukan
 * - LAB-02 (exp-konsentrasi-b): Konsentrasi Reaktan B & Variabel Kontrol
 * - LAB-03 (exp-suhu): Suhu Sistem, Energi Kinetik, & Energi Aktivasi
 * - LAB-04 (exp-katalis): Peran Katalis & Penurunan Energi Aktivasi
 */

export const LAB_QUIZ_QUESTIONS = [
  // ==========================================
  // LAB-01: PENGARUH KONSENTRASI REAKTAN A
  // ==========================================
  {
    id: 'lab-q1-concA-1',
    category: 'Konsentrasi & Kerapatan',
    relatedExperimentId: 'exp-konsentrasi',
    difficulty: 'Mudah',
    question: 'Berdasarkan pengamatan pada simulasi, apa yang terjadi pada tingkat mikroskopik saat konsentrasi reaktan A dinaikkan sementara variabel lain konstan?',
    options: [
      'Jumlah partikel A bertambah di dalam wadah sehingga kerapatannya meningkat dan frekuensi tumbukan A-B menjadi lebih tinggi',
      'Kecepatan gerak masing-masing partikel A bertambah cepat tanpa perubahan jumlah partikel',
      'Energi aktivasi reaksi langsung turun menjadi setengahnya',
      'Partikel A dan B berhenti bertumbukan dan seketika berubah menjadi produk'
    ],
    correctAnswer: 0,
    explanation: 'Peningkatan konsentrasi diartikan sebagai peningkatan jumlah partikel zat pereaksi per satuan volume. Kerapatan yang semakin tinggi memperbesar kemungkinan partikel A bertemu dan bertumbukan dengan partikel B.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Luar biasa, pemahaman konsep mikroskopik kamu sangat tepat!',
      reason: 'Sesuai teori tumbukan, konsentrasi yang lebih tinggi meningkatkan kerapatan partikel per satuan volume, sehingga frekuensi tumbukan per satuan waktu meningkat secara proporsional.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Konsentrasi berkaitan dengan kerapatan jumlah partikel dalam wadah, bukan kecepatan gerak partikel atau perubahan nilai energi aktivasi.',
      concept: 'Menaikkan konsentrasi A menambah kepadatan partikel A di wadah simulasi, sehingga peluang partikel A bertumbukan dengan partikel B meningkat pesat.'
    }
  },
  {
    id: 'lab-q1-concA-2',
    category: 'Tumbukan Efektif',
    relatedExperimentId: 'exp-konsentrasi',
    difficulty: 'Sedang',
    question: 'Mengapa pada hasil pengamatan simulasi, jumlah tumbukan total antara partikel A dan B selalu lebih banyak daripada jumlah produk yang terbentuk?',
    options: [
      'Karena sebagian partikel keluar dari wadah tertutup simulasi',
      'Karena partikel produk langsung terurai kembali seketika setelah terbentuk',
      'Karena hanya tumbukan yang memiliki energi cukup (≥ Ea) dan orientasi yang tepat yang mampu menghasilkan reaksi (tumbukan efektif)',
      'Karena sensor penghitung simulasi mengalami jeda waktu pembacaan'
    ],
    correctAnswer: 2,
    explanation: 'Reaksi kimia mensyaratkan terjadinya tumbukan efektif. Tumbukan yang energinya di bawah energi aktivasi hanya akan memantul secara lenting tanpa memutus dan membentuk ikatan baru.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Tepat sekali! Ini adalah inti dari Teori Tumbukan.',
      reason: 'Hanya fraksi tumbukan yang memiliki energi ≥ Ea serta orientasi tumbukan yang tepat yang menghasilkan reaksi. Tumbukan lainnya hanyalah tumbukan lenting biasa.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Tumbukan molekuler tidak serta-merta selalu menghasilkan ikatan kimia baru.',
      concept: 'Reaksi kimia hanya terjadi pada tumbukan efektif, yaitu tumbukan yang energinya melampaui energi aktivasi (Ea). Oleh sebab itu, jumlah tumbukan total pasti lebih banyak daripada jumlah tumbukan efektif.'
    }
  },
  {
    id: 'lab-q1-concA-3',
    category: 'Laju Reaksi Model',
    relatedExperimentId: 'exp-konsentrasi',
    difficulty: 'Sedang',
    question: 'Jika dalam durasi 10 detik simulasi terbentuk 15 partikel produk [AB], berapakah nilai laju reaksi model pembentukan produk tersebut?',
    options: [
      '150 produk/detik',
      '1.5 produk/detik',
      '0.67 produk/detik',
      '25 produk/detik'
    ],
    correctAnswer: 1,
    explanation: 'Laju reaksi model didefinisikan sebagai perubahan jumlah produk per satuan waktu pengamatan: v = Δ[Produk] / Δt = 15 produk / 10 detik = 1.5 produk/detik.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Perhitungan kamu sangat akurat!',
      reason: 'Laju reaksi menyatakan pertambahan jumlah produk per satuan waktu (v = ΔProduk / Δwaktu = 15 / 10 = 1.5 produk/detik).'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Gunakan definisi laju pembentukan produk: laju = (jumlah produk yang terbentuk) dibagi (selang waktu pengamatan).',
      concept: 'Laju reaksi dihitung dengan membagi perubahan kuantitas produk dengan interval waktu: 15 produk / 10 detik = 1.5 produk/detik.'
    }
  },
  {
    id: 'lab-q1-concA-4',
    category: 'Variabel Kontrol',
    relatedExperimentId: 'exp-konsentrasi',
    difficulty: 'Mudah',
    question: 'Saat menguji pengaruh konsentrasi pereaksi A, mengapa suhu dan konsentrasi pereaksi B harus dijaga tetap pada nilai yang sama?',
    options: [
      'Agar memastikan pengujian yang adil (fair test) sehingga perubahan frekuensi tumbukan murni disebabkan oleh variasi konsentrasi A',
      'Agar partikel A tidak dapat bergerak memantul pada dinding wadah',
      'Karena konsentrasi B dan suhu tidak memiliki pengaruh apa pun terhadap laju reaksi kimia',
      'Supaya reaksi kimia tidak menghasilkan panas berlebih pada sistem komputer'
    ],
    correctAnswer: 0,
    explanation: 'Dalam metode ilmiah eksperimen, variabel kontrol harus dijaga konstan agar perubahan variabel terikat (laju reaksi dan tumbukan) dapat dipastikan semata-mata diakibatkan oleh variabel bebas yang sedang diuji.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Prinsip metode ilmiah kamu sangat matang!',
      reason: 'Variabel kontrol dipertahankan sama agar kita yakin bahwa perubahan hasil eksperimen murni merupakan akibat dari manipulasi konsentrasi A.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Pikirkan kembali tujuan penetapan variabel kontrol dalam suatu investigasi ilmiah.',
      concept: 'Variabel kontrol dijaga konstan agar perbandingan kondisi percobaan bersifat adil (fair test) dan kesimpulan yang ditarik bersifat valid.'
    }
  },
  {
    id: 'lab-q1-concA-5',
    category: 'Hubungan Kuantitatif Konsentrasi & Laju',
    relatedExperimentId: 'exp-konsentrasi',
    difficulty: 'Sedang',
    question: 'Berdasarkan data pengamatan simulasi, jika konsentrasi pereaksi A dinaikkan dari 0.5 M menjadi 1.0 M (2 kali lipat) pada kondisi variabel lain konstan, bagaimanakah kecenderungan frekuensi tumbukan total antarpartikel di dalam wadah?',
    options: [
      'Frekuensi tumbukan total meningkat sekitar 2 kali lipat secara proporsional',
      'Frekuensi tumbukan total menurun menjadi setengahnya',
      'Frekuensi tumbukan total tidak mengalami perubahan sama sekali',
      'Frekuensi tumbukan langsung bernilai nol karena larutan menjadi terlalu pekat'
    ],
    correctAnswer: 0,
    explanation: 'Frekuensi tumbukan berbanding lurus dengan kerapatan partikel di dalam wadah. Ketika konsentrasi A digandakan (2x) dalam volume tetap, jumlah partikel A bertambah dua kali lipat, sehingga peluang dan frekuensi tumbukan dengan partikel lain juga meningkat sekitar 2 kali lipat.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Luar biasa! Analisis hubungan kuantitatif kamu sangat presisi.',
      reason: 'Jumlah tumbukan berbanding lurus dengan konsentrasi zat pereaksi. Menggandakan konsentrasi A melipatgandakan kerapatan dan frekuensi tumbukannya.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Tinjau hubungan kesebandingan antara jumlah partikel per satuan volume dengan frekuensi tumbukan.',
      concept: 'Frekuensi tumbukan berbanding lurus dengan konsentrasi zat pereaksi. Jika konsentrasi naik 2 kali lipat, frekuensi tumbukan juga naik sekitar 2 kali lipat.'
    }
  },

  // ==========================================
  // LAB-02: PENGARUH KONSENTRASI REAKTAN B
  // ==========================================
  {
    id: 'lab-q2-concB-1',
    category: 'Manipulasi Independen',
    relatedExperimentId: 'exp-konsentrasi-b',
    difficulty: 'Mudah',
    question: 'Pada eksperimen LAB-02, saat kamu menaikkan konsentrasi B dari 0.5 M menjadi 1.5 M, apa yang terjadi pada populasi partikel A?',
    options: [
      'Jumlah partikel A ikut bertambah secara otomatis untuk mengimbangi partikel B',
      'Jumlah partikel A tetap konstan karena konsentrasi A bertindak sebagai variabel kontrol',
      'Partikel A menghilang dari wadah karena terdesak oleh partikel B',
      'Partikel A berubah warna menjadi oranye mengikuti partikel B'
    ],
    correctAnswer: 1,
    explanation: 'Konsentrasi A dan B adalah dua variabel independen. Ketika menguji pengaruh B, konsentrasi A dijaga tetap sebagai variabel kontrol.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Hebat, kamu cermat mengamati variabel kontrol!',
      reason: 'Konsentrasi A dan B dapat dimanipulasi secara mandiri. Menjaga A tetap saat mengubah B membuktikan prinsip variabel kontrol dalam penyelidikan ilmiah.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Ingat bahwa konsentrasi B adalah variabel bebas yang sedang diuji, sedangkan konsentrasi A adalah variabel kontrol.',
      concept: 'Dalam sistem pengujian independen, perubahan konsentrasi B tidak mengubah jumlah partikel A yang ada pada kondisi awal.'
    }
  },
  {
    id: 'lab-q2-concB-2',
    category: 'Peluang Tumbukan A-B',
    relatedExperimentId: 'exp-konsentrasi-b',
    difficulty: 'Sedang',
    question: 'Mengapa penambahan partikel pereaksi B ke dalam wadah dapat mempercepat pembentukan produk AB meskipun jumlah partikel A tetap?',
    options: [
      'Karena partikel B memancarkan energi panas yang meningkatkan suhu larutan',
      'Karena setiap partikel A kini memiliki peluang lebih besar dan lebih sering berpapasan dengan partikel B',
      'Karena partikel B dapat bereaksi sendiri menjadi produk AB tanpa memerlukan partikel A',
      'Karena ukuran partikel B membesar sehingga memenuhi seluruh ruang wadah'
    ],
    correctAnswer: 1,
    explanation: 'Peningkatan konsentrasi salah satu reaktan meningkatkan probabilitas pertemuan antar molekul pereaksi yang berbeda, sehingga laju tumbukan A-B per satuan waktu melonjak.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Analisis probabilitas molekuler kamu sangat baik!',
      reason: 'Makin banyak partikel B yang bertebaran di wadah, makin sering partikel A bertabrakan dengan partikel B, sehingga frekuensi tumbukan A-B meningkat.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Tinjau kembali hubungan jumlah target tumbukan dengan peluang pertemuan di ruang bervolume tetap.',
      concept: 'Reaksi A + B memerlukan pertemuan kedua jenis molekul. Menambah partikel B memperbanyak frekuensi pertemuan dengan partikel A.'
    }
  },
  {
    id: 'lab-q2-concB-3',
    category: 'Stoikiometri Reaksi',
    relatedExperimentId: 'exp-konsentrasi-b',
    difficulty: 'Sedang',
    question: 'Jika di dalam wadah terdapat 15 partikel A dan 8 partikel B, berapakah jumlah maksimum partikel produk [AB] yang dapat terbentuk jika seluruh reaksi berlangsung tuntas?',
    options: [
      '23 partikel produk',
      '15 partikel produk',
      '8 partikel produk',
      '4 partikel produk'
    ],
    correctAnswer: 2,
    explanation: 'Reaksi A + B → AB memiliki rasio koefisien 1:1. Partikel B berjumlah 8 dan bertindak sebagai pereaksi pembatas, sehingga produk maksimal yang dapat terbentuk adalah 8 unit AB (dengan sisa 7 partikel A).',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Luar biasa! Pemahaman stoikiometri pereaksi pembatas kamu sangat mantap.',
      reason: 'Karena setiap 1 unit produk membutuhkan 1 partikel A dan 1 partikel B, reaksi terhenti ketika pereaksi pembatas (B = 8 partikel) habis terkonsumsi.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Perhatikan persamaan reaksi A + B → AB. 1 produk membutuhkan 1 reaktan A dan 1 reaktan B. Manakah reaktan yang habis lebih dahulu?',
      concept: 'Partikel B berjumlah lebih sedikit (8) dibanding A (15). Maka pembentukan produk dibatasi oleh partikel B, menghasilkan maksimal 8 partikel produk AB.'
    }
  },
  {
    id: 'lab-q2-concB-4',
    category: 'Peran Variabel Bebas & Terikat',
    relatedExperimentId: 'exp-konsentrasi-b',
    difficulty: 'Mudah',
    question: 'Dalam investigasi LAB-02, manakah yang bertindak berturut-turut sebagai variabel bebas (dimanipulasi) dan variabel terikat (diukur responnya)?',
    options: [
      'Variabel bebas: Suhu sistem; Variabel terikat: Konsentrasi reaktan B',
      'Variabel bebas: Konsentrasi reaktan B; Variabel terikat: Frekuensi tumbukan dan laju pembentukan produk',
      'Variabel bebas: Jumlah produk; Variabel terikat: Konsentrasi reaktan A',
      'Variabel bebas: Volume wadah; Variabel terikat: Jenis katalis'
    ],
    correctAnswer: 1,
    explanation: 'Variabel bebas adalah faktor yang sengaja diubah oleh peneliti (konsentrasi reaktan B), sedangkan variabel terikat adalah respon atau keluaran yang diukur akibat perubahan tersebut (frekuensi tumbukan partikel dan laju pembentukan produk).',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Tepat sekali! Identifikasi variabel saintifik kamu sangat kuat.',
      reason: 'Konsentrasi B sengaja diubah-ubah nilainya (variabel bebas), dan pengaruhnya diamati pada frekuensi tumbukan serta laju produk (variabel terikat).'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Ingat kembali: variabel bebas adalah yang diubah, variabel terikat adalah hasil yang diukur/diamati.',
      concept: 'Pada LAB-02, peneliti memanipulasi konsentrasi B untuk melihat dampaknya terhadap frekuensi tumbukan dan laju pembentukan produk.'
    }
  },
  {
    id: 'lab-q2-concB-5',
    category: 'Analisis Grafik & Data Laju',
    relatedExperimentId: 'exp-konsentrasi-b',
    difficulty: 'Sedang',
    question: 'Jika data simulasi menunjukkan bahwa kenaikan konsentrasi B dari 0.5 M ke 1.5 M (3 kali semula) menyebabkan laju reaksi pembentukan produk AB meningkat dari 2 produk/detik menjadi 6 produk/detik, berapakah orde reaksi terhadap pereaksi B?',
    options: [
      'Orde 0',
      'Orde 1',
      'Orde 2',
      'Orde 3'
    ],
    correctAnswer: 1,
    explanation: 'v ~ [B]ⁿ => (6 / 2) = (1.5 / 0.5)ⁿ => 3 = (3)ⁿ => n = 1. Laju reaksi berbanding lurus secara linier dengan konsentrasi B, sehingga reaksinya berorde 1 terhadap B.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Hebat! Penentuan orde reaksi dari data laju kamu sangat akurat.',
      reason: 'Kenaikan konsentrasi B 3 kali lipat menghasilkan laju reaksi 3 kali lebih cepat (3¹ = 3), membuktikan orde reaksi terhadap B adalah 1.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Bandingkan rasio perubahan laju reaksi dengan rasio perubahan konsentrasi B: (v₂/v₁) = ([B₂]/[B₁])ⁿ.',
      concept: 'Ketika konsentrasi B naik 3x dan laju reaksi juga naik tepat 3x (proporsional 1:1), maka nilai eksponen orde reaksi (n) adalah 1.'
    }
  },

  // ==========================================
  // LAB-03: PENGARUH SUHU SISTEM REAKSI
  // ==========================================
  {
    id: 'lab-q3-temp-1',
    category: 'Suhu & Kecepatan Partikel',
    relatedExperimentId: 'exp-suhu',
    difficulty: 'Mudah',
    question: 'Bagaimana pengaruh langsung kenaikan suhu sistem reaksi (misalnya dari 25°C ke 70°C) terhadap gerak partikel mikroskopik pada simulasi?',
    options: [
      'Jumlah partikel di dalam wadah bertambah secara spontan',
      'Partikel bergerak lebih cepat karena energi kinetik rata-ratanya meningkat',
      'Partikel berhenti bergerak dan mengendap di dasar wadah',
      'Partikel A dan B menyusut ukurannya menjadi separuh semula'
    ],
    correctAnswer: 1,
    explanation: 'Suhu adalah ukuran energi kinetik rata-rata partikel. Kenaikan suhu menyebabkan partikel bergerak dengan kelajuan yang lebih tinggi (v ~ √T).',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Tepat sekali! Hubungan termodinamika mikroskopik kamu sangat akurat.',
      reason: 'Suhu berbanding lurus dengan energi kinetik rata-rata partikel zat. Kenaikan suhu membuat partikel bergerak lebih gesit dan cepat.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Kenaikan suhu tidak menambah jumlah partikel materi ataupun mengubah ukuran partikel.',
      concept: 'Kenaikan suhu meningkatkan energi kinetik partikel, yang terlihat secara visual sebagai peningkatan kecepatan gerak partikel di area simulasi.'
    }
  },
  {
    id: 'lab-q3-temp-2',
    category: 'Energi Aktivasi (Ea)',
    relatedExperimentId: 'exp-suhu',
    difficulty: 'Tinggi',
    question: 'Mengapa kenaikan suhu dapat meningkatkan laju reaksi secara jauh lebih dramatis daripada sekadar peningkatan frekuensi tumbukan biasa?',
    options: [
      'Karena suhu menurunkan nilai energi aktivasi reaksi menjadi nol',
      'Karena lonjakan suhu memperbesar fraksi molekul yang memiliki energi kinetik cukup untuk melampaui energi aktivasi (E ≥ Ea)',
      'Karena suhu tinggi mengubah reaktan menjadi unsur radioaktif',
      'Karena pada suhu tinggi partikel tidak lagi memerlukan orientasi tumbukan yang tepat'
    ],
    correctAnswer: 1,
    explanation: 'Menurut distribusi Maxwell-Boltzmann dan persamaan Arrhenius, kenaikan suhu sedikit saja melipatgandakan fraksi molekul yang energinya melampaui Ea, sehingga persentase tumbukan efektif melonjak tajam.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Spektakuler! Kamu memahami konsep paling mendalam dari teori tumbukan Arrhenius.',
      reason: 'Peningkatan suhu tidak hanya mempercepat frekuensi tumbukan, melainkan melipatgandakan proporsi tumbukan berenergi ≥ Ea (tumbukan efektif).'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Ingat bahwa nilai energi aktivasi (Ea) merupakan karakteristik bawaan reaksi dan tidak diturunkan oleh suhu.',
      concept: 'Kenaikan suhu tidak mengubah nilai Ea, melainkan memperbanyak jumlah partikel yang memiliki energi cukup untuk melompati rintangan Ea tersebut.'
    }
  },
  {
    id: 'lab-q3-temp-3',
    category: 'Interpretasi Data Suhu',
    relatedExperimentId: 'exp-suhu',
    difficulty: 'Sedang',
    question: 'Jika pada suhu 20°C diperoleh laju reaksi 0.5 produk/detik, dan laju reaksi meningkat 2 kali lipat setiap kenaikan suhu 10°C, berapakah estimasi laju reaksi pada suhu 40°C?',
    options: [
      '1.0 produk/detik',
      '2.0 produk/detik',
      '4.0 produk/detik',
      '0.25 produk/detik'
    ],
    correctAnswer: 1,
    explanation: 'Kenaikan suhu dari 20°C ke 40°C adalah ΔT = 20°C (dua kali kenaikan 10°C). v = v₀ × 2^(ΔT/10) = 0.5 × 2^(20/10) = 0.5 × 4 = 2.0 produk/detik.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Perhitungan kenaikan suhu kamu sangat tepat!',
      reason: 'Sesuai aturan kenaikan suhu: v = v₀ × 2^(ΔT/10). Dengan kenaikan 20°C, laju menjadi 4 kali lipat dari 0.5, yaitu 2.0 produk/detik.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Gunakan rumus kenaikan laju terhadap suhu: v₂ = v₁ × 2^((T₂ - T₁) / 10).',
      concept: 'Kenaikan 20°C berarti terjadi 2 kali penggandaan laju: 0.5 → 1.0 (pada 30°C) → 2.0 produk/detik (pada 40°C).'
    }
  },
  {
    id: 'lab-q3-temp-4',
    category: 'Grafik Distribusi Maxwell-Boltzmann',
    relatedExperimentId: 'exp-suhu',
    difficulty: 'Sedang',
    question: 'Berdasarkan kurva distribusi energi kinetik Maxwell-Boltzmann, apa yang terjadi pada kurva saat suhu sistem reaksi dinaikkan?',
    options: [
      'Puncak kurva bergeser ke kanan dan melebar, sehingga luas area partikel dengan energi ≥ Ea bertambah besar',
      'Kurva bergeser ke kiri dan menyempit ke arah energi kinetik nol',
      'Garis ambang batas energi aktivasi (Ea) bergeser ke kiri mendekati nol',
      'Bentuk kurva tidak berubah karena energi partikel selalu tetap'
    ],
    correctAnswer: 0,
    explanation: 'Kenaikan suhu menyebabkan energi kinetik rata-rata partikel bertambah, sehingga puncak kurva distribusi bergeser ke kanan (ke nilai energi yang lebih tinggi) dan mendatar. Akibatnya, luas area di bawah kurva di sebelah kanan garis Ea (partikel yang mampu bereaksi) bertambah secara signifikan.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Luar biasa! Pemahaman kurva distribusi kinetik Maxwell-Boltzmann kamu sangat mendalam.',
      reason: 'Suhu tinggi mendistribusikan lebih banyak molekul ke wilayah energi kinetik tinggi (kanan kurva), memperbanyak partikel yang melampaui Ea.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Tinjau kembali efek kenaikan suhu terhadap persebaran energi kinetik molekul dan nilai Ea.',
      concept: 'Kenaikan suhu tidak mengubah posisi garis Ea, melainkan menggeser puncak distribusi energi ke kanan sehingga fraksi partikel dengan E ≥ Ea melonjak.'
    }
  },
  {
    id: 'lab-q3-temp-5',
    category: 'Waktu Reaksi & Suhu',
    relatedExperimentId: 'exp-suhu',
    difficulty: 'Sedang',
    question: 'Jika suatu reaksi kimia selesai dalam waktu 40 detik pada suhu 30°C, dan setiap kenaikan suhu 10°C laju reaksi meningkat 2 kali lipat, berapakah waktu yang diperlukan untuk menyelesaikan reaksi tersebut pada suhu 50°C?',
    options: [
      '20 detik',
      '10 detik',
      '5 detik',
      '80 detik'
    ],
    correctAnswer: 1,
    explanation: 'Kenaikan suhu dari 30°C ke 50°C adalah ΔT = 20°C (2 kali kenaikan 10°C). Laju reaksi menjadi 2^(20/10) = 4 kali lebih cepat. Karena waktu reaksi berbanding terbalik dengan laju (t₂ = t₁ / n^(ΔT/10)), maka t₂ = 40 detik / 4 = 10 detik.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Perhitungan waktu reaksi kinetika kamu sangat tepat!',
      reason: 'Laju reaksi meningkat 4 kali lipat pada kenaikan 20°C, sehingga waktu yang dibutuhkan untuk menyelesaikan reaksi menjadi seperempatnya (40 / 4 = 10 detik).'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Ingat bahwa waktu reaksi berbanding terbalik dengan laju reaksi: waktu baru = waktu lama dibagi faktor kelipatan laju.',
      concept: 'Kenaikan 20°C mempercepat laju 4x lipat (2² = 4). Maka waktu reaksi berkurang menjadi 40 detik / 4 = 10 detik.'
    }
  },

  // ==========================================
  // LAB-04: PENGARUH KATALIS REAKSI
  // ==========================================
  {
    id: 'lab-q4-cat-1',
    category: 'Mekanisme Katalis',
    relatedExperimentId: 'exp-katalis',
    difficulty: 'Mudah',
    question: 'Bagaimana peranan katalis dalam mempercepat pembentukan produk pada reaksi kimia konseptual A + B → Produk?',
    options: [
      'Menyediakan rute reaksi alternatif dengan energi aktivasi (Ea) yang lebih rendah',
      'Ikut bereaksi dan habis menjadi bagian dari partikel produk akhir',
      'Menaikkan suhu sistem secara drastis dari dalam larutan',
      'Menambah jumlah mol partikel reaktan secara kimiawi'
    ],
    correctAnswer: 0,
    explanation: 'Katalis bekerja dengan cara menyediakan mekanisme atau jalur reaksi alternatif yang membutuhkan energi aktivasi lebih rendah, sehingga lebih banyak tumbukan yang berhasil menghasilkan reaksi.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Bagus sekali! Pemahaman konsep katalis kamu sangat tepat.',
      reason: 'Katalis menurunkan hambatan energi aktivasi (Ea), sehingga fraksi tumbukan efektif meningkat tanpa katalis ikut terkonsumsi.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Katalis tidak bertindak sebagai reaktan yang habis, tidak menambah partikel reaktan, dan tidak menaikkan suhu sistem.',
      concept: 'Katalis menurunkan nilai energi aktivasi reaksi sehingga partikel-partikel pereaksi lebih mudah mencapai keadaan transisi pada suhu yang sama.'
    }
  },
  {
    id: 'lab-q4-cat-2',
    category: 'Sifat Katalis',
    relatedExperimentId: 'exp-katalis',
    difficulty: 'Sedang',
    question: 'Berdasarkan prinsip keilmuan dan representasi model simulasi, apa yang membedakan katalis dengan reaktan A atau reaktan B?',
    options: [
      'Katalis tidak boleh digambarkan habis atau berubah menjadi produk reaksi di akhir proses',
      'Katalis hanya dapat bekerja jika suhu sistem berada di bawah 0°C',
      'Katalis selalu mengubah warna larutan menjadi hijau pekat',
      'Katalis menghambat tumbukan antarpartikel reaktan'
    ],
    correctAnswer: 0,
    explanation: 'Katalis memfasilitasi terjadinya reaksi namun tidak terkonsumsi secara permanen. Di akhir reaksi, jumlah dan struktur katalis diperoleh kembali dalam keadaan utuh.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Tepat sekali! Ini adalah karakteristik fundamental suatu katalis.',
      reason: 'Katalis tidak ikut menjadi produk dan tidak habis terkonsumsi, membedakannya dari reaktan A dan B yang berkurang seiring berjalannya reaksi.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Perhatikan definisi katalis: zat yang mempercepat reaksi kimia tanpa dirinya mengalami perubahan kimiawi permanen di akhir reaksi.',
      concept: 'Katalis bukan reaktan; katalis tidak berkurang secara neto dan tidak berubah menjadi molekul produk.'
    }
  },
  {
    id: 'lab-q4-cat-3',
    category: 'Komparasi Efektivitas',
    relatedExperimentId: 'exp-katalis',
    difficulty: 'Sedang',
    question: 'Pada suhu dan konsentrasi yang sama persis, apa perbedaan utama yang teramati pada data simulasi antara kondisi "Tanpa Katalis" dan "Dengan Katalis"?',
    options: [
      'Frekuensi tumbukan total partikel A-B melonjak 100 kali lipat',
      'Persentase tumbukan efektif dan laju reaksi pembentukan produk meningkat secara nyata pada kondisi dengan katalis',
      'Partikel A dan B bergerak lebih lambat pada kondisi dengan katalis',
      'Tidak ada perbedaan data kuantitatif sama sekali'
    ],
    correctAnswer: 1,
    explanation: 'Karena hambatan energi aktivasi diturunkan oleh katalis, proporsi tumbukan A-B yang berhasil menjadi tumbukan efektif (E ≥ Ea_baru) meningkat drastis, sehingga produk terbentuk lebih cepat.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Analisis komparasi data laboratorium kamu sangat tajam!',
      reason: 'Dengan rintangan energi yang lebih rendah, fraksi tumbukan efektif melonjak signifikan sehingga laju reaksi model menjadi jauh lebih cepat.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Tumbukan total terutama ditentukan oleh konsentrasi dan suhu; katalis secara spesifik memengaruhi efektivitas dari tumbukan tersebut.',
      concept: 'Katalis membuat tumbukan yang tadinya tidak efektif menjadi efektif karena ambang energi aktivasi yang harus dilompati kini lebih rendah.'
    }
  },
  {
    id: 'lab-q4-cat-4',
    category: 'Diagram Profil Energi Reaksi',
    relatedExperimentId: 'exp-katalis',
    difficulty: 'Sedang',
    question: 'Pada diagram profil energi potensial suatu reaksi kimia, bagian manakah yang mengalami penurunan nilai ketika katalis ditambahkan ke dalam sistem?',
    options: [
      'Tinggi puncak keadaan transisi (energi aktivasi / Ea)',
      'Nilai perubahan entalpi reaksi (ΔH)',
      'Tingkat energi potensial awal zat pereaksi (reaktan)',
      'Tingkat energi potensial akhir produk reaksi'
    ],
    correctAnswer: 0,
    explanation: 'Katalis hanya menurunkan tinggi puncak rintangan keadaan transisi (energi aktivasi, Ea). Katalis TIDAK mengubah tingkat energi awal reaktan, tingkat energi akhir produk, maupun nilai perubahan entalpi reaksi (ΔH).',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Tepat sekali! Membaca diagram energi kinetika kimia adalah keterampilan penting.',
      reason: 'Katalis menurunkan rintangan keadaan transisi (Ea) melalui rute alternatif, tanpa memengaruhi tingkat energi reaktan, produk, atau nilai ΔH.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Pikirkan besaran apa yang diturunkan oleh katalis pada kurva energi reaksi kimia.',
      concept: 'Katalis hanya menurunkan puncak energi aktivasi (Ea). Entalpi (ΔH) serta energi awal dan akhir tidak diubah sama sekali oleh katalis.'
    }
  },
  {
    id: 'lab-q4-cat-5',
    category: 'Selektivitas & Mekanisme Katalis',
    relatedExperimentId: 'exp-katalis',
    difficulty: 'Sedang',
    question: 'Manakah pernyataan yang paling tepat membedakan cara kerja katalis dengan cara kerja peningkatan suhu dalam mempercepat laju reaksi?',
    options: [
      'Katalis dan suhu bekerja dengan mekanisme yang persis sama yaitu menaikkan energi kinetik partikel',
      'Katalis menurunkan hambatan energi aktivasi (Ea), sedangkan peningkatan suhu memperbesar energi kinetik rata-rata partikel agar melampaui Ea',
      'Katalis menaikkan suhu larutan secara spontan menjadi mendidih',
      'Katalis hanya dapat bekerja jika reaksi dilakukan pada wadah hampa udara'
    ],
    correctAnswer: 1,
    explanation: 'Meskipun keduanya mempercepat laju reaksi, cara kerjanya berbeda secara mendasar: katalis menurunkan nilai ambang energi aktivasi (Ea) yang harus dicapai, sedangkan suhu meningkatkan energi kinetik rata-rata partikel agar lebih banyak yang mampu melampaui ambang Ea tersebut.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Spektakuler! Perbandingan konseptual kamu sangat komprehensif dan akurat.',
      reason: 'Suhu bekerja dari sisi partikel (menambah energi kinetik), sedangkan katalis bekerja dari sisi rintangan reaksi (merendahkan hambatan Ea).'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Bedakan apakah faktor tersebut memengaruhi energi kinetik partikel pereaksi atau nilai energi aktivasi reaksi.',
      concept: 'Suhu menaikkan energi kinetik partikel untuk melompati rintangan Ea, sedangkan katalis memperendah rintangan Ea itu sendiri.'
    }
  }
];

/**
 * Mengambil daftar soal kuis khusus untuk eksperimen yang sedang aktif
 * Jika experimentId tidak ditemukan, mengembalikan bank soal umum laboratorium
 */
export function getQuestionsByExperiment(experimentId) {
  if (!experimentId) return LAB_QUIZ_QUESTIONS;
  const filtered = LAB_QUIZ_QUESTIONS.filter((q) => q.relatedExperimentId === experimentId);
  return filtered.length > 0 ? filtered : LAB_QUIZ_QUESTIONS;
}

export default LAB_QUIZ_QUESTIONS;
