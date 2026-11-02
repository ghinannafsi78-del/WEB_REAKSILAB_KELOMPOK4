/**
 * data/labQuizQuestions.js
 * Soal Kuis Interaktif Laboratorium Virtual REAKSI LAB
 * Sesuai spesifikasi PRD Bab 8.12, Bab 11, & AGENT.md Bab 7
 */

export const LAB_QUIZ_QUESTIONS = [
  {
    id: 'lab-q1',
    category: 'Konsentrasi & Tumbukan',
    relatedExperimentId: 'exp-konsentrasi',
    difficulty: 'Mudah',
    question: 'Berdasarkan pengamatan pada simulasi, apa yang terjadi ketika konsentrasi reaktan A dinaikkan sementara variabel lain dijaga konstan?',
    options: [
      'Jumlah partikel A bertambah sehingga kerapatannya meningkat dan frekuensi tumbukan A-B menjadi lebih tinggi',
      'Kecepatan masing-masing partikel A bergerak jauh lebih cepat tanpa mengubah jumlah partikel',
      'Energi aktivasi reaksi langsung turun menjadi setengahnya',
      'Partikel A dan B berhenti bertumbukan dan langsung menjadi produk'
    ],
    correctAnswer: 0,
    explanation: 'Peningkatan konsentrasi diartikan sebagai peningkatan jumlah partikel zat pereaksi per satuan volume. Kerapatan yang semakin tinggi memperbesar kemungkinan partikel A bertemu dan bertumbukan dengan partikel B.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Luar biasa, pemahaman konsep kamu sangat tepat!',
      reason: 'Sesuai teori tumbukan, konsentrasi yang lebih tinggi meningkatkan kerapatan partikel, sehingga frekuensi tumbukan per satuan waktu meningkat secara proporsional.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Konsentrasi berkaitan dengan kerapatan jumlah partikel per satuan volume, bukan kecepatan gerak partikel ataupun perubahan energi aktivasi.',
      concept: 'Menaikkan konsentrasi A menambah kepadatan partikel A di wadah, sehingga peluang partikel A bertumbukan dengan partikel B meningkat, yang menghasilkan kenaikan frekuensi tumbukan.'
    }
  },
  {
    id: 'lab-q2',
    category: 'Suhu & Energi Kinetik',
    relatedExperimentId: 'exp-suhu',
    difficulty: 'Sedang',
    question: 'Bagaimana pengaruh kenaikan suhu sistem terhadap partikel pada simulasi mikroskopik?',
    options: [
      'Menambah jumlah total partikel reaktan secara spontan di dalam wadah',
      'Meningkatkan energi kinetik rata-rata dan kecepatan gerak partikel, sehingga memperbesar fraksi tumbukan efektif',
      'Mengurangi jumlah tumbukan karena partikel bergerak terlalu cepat untuk saling bertabrakan',
      'Menghilangkan partikel produk yang telah terbentuk'
    ],
    correctAnswer: 1,
    explanation: 'Kenaikan suhu meningkatkan energi kinetik rata-rata partikel. Partikel bergerak lebih cepat dan frekuensi tumbukan meningkat, tetapi faktor terpenting adalah fraksi molekul yang memiliki energi kinetik ≥ energi aktivasi (Ea) melonjak secara signifikan.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Hebat, kamu memahami hubungan termodinamika mikroskopik!',
      reason: 'Suhu berbanding lurus dengan energi kinetik partikel. Partikel yang bergerak lebih cepat memiliki energi tumbukan lebih besar sehingga persentase tumbukan yang melampaui Ea meningkat drastis.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Kenaikan suhu tidak menambah jumlah partikel materi, melainkan memengaruhi energi kinetik dan kelajuan gerak partikel.',
      concept: 'Suhu yang lebih tinggi membuat partikel bergerak lebih cepat dan berenergi lebih tinggi, sehingga lebih banyak tumbukan yang mampu melampaui energi aktivasi (menjadi tumbukan efektif).'
    }
  },
  {
    id: 'lab-q3',
    category: 'Tumbukan Efektif',
    relatedExperimentId: 'exp-konsentrasi',
    difficulty: 'Sedang',
    question: 'Mengapa jumlah tumbukan total antara partikel A dan B selalu lebih besar daripada jumlah produk yang terbentuk?',
    options: [
      'Karena partikel produk dapat terurai kembali dengan kecepatan yang sama',
      'Karena sebagian partikel keluar dari wadah tertutup simulasi',
      'Karena tidak setiap tumbukan memiliki energi yang cukup (≥ Ea) dan orientasi yang tepat untuk menghasilkan reaksi',
      'Karena sistem simulasi mengalami keterlambatan pembacaan data'
    ],
    correctAnswer: 2,
    explanation: 'Reaksi kimia mensyaratkan tumbukan efektif. Tumbukan yang memiliki energi di bawah energi aktivasi atau orientasi tumbukan yang tidak tepat hanya akan memantul secara lenting tanpa menghasilkan produk reaksi.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Tepat sekali! Ini adalah inti dari Teori Tumbukan.',
      reason: 'Hanya sebagian kecil dari seluruh tumbukan yang memiliki energi ≥ Ea serta orientasi tumbukan yang sesuai. Tumbukan selebihnya hanyalah tumbukan lenting biasa.'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Tumbukan molekuler tidak serta-merta selalu menghasilkan ikatan kimia baru.',
      concept: 'Reaksi kimia hanya terjadi pada tumbukan efektif, yaitu tumbukan yang energinya mencapai atau melampaui energi aktivasi (Ea). Oleh sebab itu, jumlah tumbukan total pasti lebih banyak daripada jumlah tumbukan efektif.'
    }
  },
  {
    id: 'lab-q4',
    category: 'Laju Reaksi Model',
    relatedExperimentId: 'exp-komparasi',
    difficulty: 'Sedang',
    question: 'Jika dalam durasi 10 detik simulasi terbentuk 15 partikel produk, berapakah laju reaksi model pembentukan produk tersebut?',
    options: [
      '150 produk/detik',
      '1.5 produk/detik',
      '0.67 produk/detik',
      '25 produk/detik'
    ],
    correctAnswer: 1,
    explanation: 'Laju reaksi model didefinisikan sebagai perubahan jumlah produk per satuan waktu: v = Δ[Produk] / Δt = 15 produk / 10 detik = 1.5 produk/detik.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Perhitungan kamu sangat akurat!',
      reason: 'Laju reaksi menyatakan pertambahan jumlah produk per satuan waktu (v = ΔProduk / Δwaktu = 15 / 10 = 1.5 produk/detik).'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Gunakan definisi laju pembentukan produk: laju = (jumlah produk yang terbentuk) dibagi (waktu yang ditempuh).',
      concept: 'Laju reaksi dihitung dengan membagi perubahan kuantitas produk dengan interval waktu: 15 / 10 = 1.5 produk/detik.'
    }
  },
  {
    id: 'lab-q5',
    category: 'Variabel Kontrol',
    relatedExperimentId: 'exp-konsentrasi-b',
    difficulty: 'Mudah',
    question: 'Saat menguji pengaruh konsentrasi reaktan B terhadap frekuensi tumbukan, mengapa suhu dan konsentrasi A harus dijaga tetap?',
    options: [
      'Agar reaksi tidak menghasilkan panas berlebih pada komputer',
      'Agar hasil perubahan laju reaksi murni disebabkan oleh perubahan konsentrasi B, bukan variabel lain',
      'Karena konsentrasi A tidak berpengaruh sama sekali terhadap laju reaksi',
      'Agar partikel B tidak dapat bertumbukan dengan partikel A'
    ],
    correctAnswer: 1,
    explanation: 'Dalam metode ilmiah, variabel kontrol harus dijaga konstan untuk memastikan pengujian yang adil (fair test), sehingga kesimpulan yang ditarik murni merupakan akibat dari manipulasi variabel bebas.',
    correctFeedback: {
      status: 'Benar!',
      appreciation: 'Prinsip metode ilmiah kamu sangat matang!',
      reason: 'Variabel kontrol dipertahankan sama agar kita yakin bahwa perubahan laju reaksi semata-mata diakibatkan oleh perubahan variabel yang sedang diuji (konsentrasi B).'
    },
    incorrectFeedback: {
      status: 'Belum tepat.',
      errorHint: 'Pikirkan kembali tujuan utama penentuan variabel kontrol dalam suatu eksperimen sains.',
      concept: 'Variabel kontrol dijaga konstan agar perbandingan kondisi percobaan bersifat adil, sehingga pengaruh variabel bebas yang sedang diuji dapat diamati secara objektif.'
    }
  }
];

export default LAB_QUIZ_QUESTIONS;
