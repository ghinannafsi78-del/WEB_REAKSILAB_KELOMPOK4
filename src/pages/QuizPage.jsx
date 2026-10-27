import { useState } from 'react';
import { addQuizAttempt } from '../services/progressService.js';
import './QuizPage.css';

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    category: 'Teori Tumbukan',
    question: 'Syarat utama terjadinya suatu tumbukan efektif antarpartikel zat pereaksi adalah...',
    options: [
      'Jumlah partikel harus berjumlah genap',
      'Partikel bergerak lambat agar tumbukan terjadi lembut',
      'Memiliki energi kinetik ≥ energi aktivasi (Ea) dan orientasi ruang yang tepat',
      'Reaksi harus berlangsung dalam wadah terbuka',
    ],
    correctAnswer: 2,
    explanation:
      'Tumbukan efektif memerlukan dua prasyarat mutlak: (1) orientasi molekul yang tepat saat bertubrukan dan (2) energi kinetik partikel harus melampaui energi aktivasi (Ea) reaksi.',
  },
  {
    id: 'q2',
    category: 'Faktor Suhu',
    question: 'Mengapa kenaikan suhu dapat meningkatkan laju reaksi secara signifikan?',
    options: [
      'Menurunkan nilai energi aktivasi reaksi',
      'Meningkatkan energi kinetik partikel sehingga persentase tumbukan efektif melonjak',
      'Mengubah wujud zat pereaksi menjadi plasma',
      'Menambah jumlah mol zat pereaksi yang ada di dalam wadah',
    ],
    correctAnswer: 1,
    explanation:
      'Kenaikan suhu tidak mengubah energi aktivasi (Ea), melainkan menaikkan energi kinetik rata-rata partikel. Akibatnya, fraksi molekul yang memiliki energi ≥ Ea meningkat pesat.',
  },
  {
    id: 'q3',
    category: 'Katalis',
    question: 'Bagaimana mekanisme kerja katalis dalam mempercepat laju reaksi kimia?',
    options: [
      'Menyediakan rute atau mekanisme alternatif dengan energi aktivasi yang lebih rendah',
      'Menambah panas ke dalam larutan secara spontan',
      'Menggeser nilai perubahan entalpi reaksi (ΔH) menjadi lebih eksoterm',
      'Ikut bereaksi dan habis menjadi produk sampingan',
    ],
    correctAnswer: 0,
    explanation:
      'Katalis bekerja dengan membuka jalur reaksi baru yang memiliki energi aktivasi (Ea) lebih rendah, sehingga partikel lebih mudah melampaui keadaan transisi tanpa ikut terkonsumsi.',
  },
  {
    id: 'q4',
    category: 'Hukum Laju Reaksi',
    question: 'Jika pada reaksi A + B → C, konsentrasi [A] dinaikkan 3 kali lipat dan laju reaksi menjadi 9 kali lipat semula, maka orde reaksi terhadap A adalah...',
    options: ['0', '1', '2', '3'],
    correctAnswer: 2,
    explanation:
      'v ~ [A]ᵐ => 9 = (3)ᵐ => 3² = 3ᵐ => m = 2. Jadi orde reaksi terhadap A adalah 2 (kuadrat).',
  },
];

export default function QuizPage({ onNavigate, onQuizCompleted }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOpt(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      // Selesai kuis
      setIsFinished(true);
      const finalScorePercent = Math.round((score / QUIZ_QUESTIONS.length) * 100);
      addQuizAttempt({
        category: 'Laju Reaksi XI',
        score: finalScorePercent,
        totalQuestions: QUIZ_QUESTIONS.length,
        correctAnswers: score,
      });
      if (onQuizCompleted) onQuizCompleted();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="quiz-page-container">
      <div className="quiz-page-header">
        <button className="back-btn" onClick={() => onNavigate('beranda')}>
          &larr; Kembali ke Beranda
        </button>
        <span className="page-category-badge">KUIS EVALUASI FORMATIF</span>
        <h1 className="quiz-main-title">Uji Pemahaman Laju Reaksi</h1>
        <p className="quiz-main-subtitle">
          Pertanyaan terstruktur untuk mengevaluasi pemahaman konsep tumbukan, faktor laju, dan perhitungan orde.
        </p>
      </div>

      <div className="quiz-card-wrapper">
        {!isFinished ? (
          <div className="quiz-active-card">
            <div className="quiz-meta-row">
              <span className="badge badge-cyan">{currentQ.category}</span>
              <span className="quiz-counter">
                Soal <strong>{currentIdx + 1}</strong> dari {QUIZ_QUESTIONS.length}
              </span>
            </div>

            <h2 className="quiz-question-text">{currentQ.question}</h2>

            <div className="quiz-options-list">
              {currentQ.options.map((opt, i) => {
                let statusClass = '';
                if (isAnswered) {
                  if (i === currentQ.correctAnswer) statusClass = 'correct';
                  else if (i === selectedOpt) statusClass = 'wrong';
                }

                return (
                  <button
                    key={i}
                    className={`quiz-option-btn ${selectedOpt === i ? 'selected' : ''} ${statusClass}`}
                    onClick={() => handleSelectOption(i)}
                    disabled={isAnswered}
                  >
                    <span className="option-indicator">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="option-text">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback dan Pembahasan */}
            {isAnswered && (
              <div className="quiz-explanation-box">
                <strong>
                  {selectedOpt === currentQ.correctAnswer ? '🎉 Jawaban Benar!' : '⚠️ Kurang Tepat!'}
                </strong>
                <p>{currentQ.explanation}</p>
                <div className="explanation-next-action">
                  <button id="btn-next-question" className="btn btn-primary" onClick={handleNext}>
                    {currentIdx + 1 < QUIZ_QUESTIONS.length ? 'Lanjut ke Soal Berikutnya &rarr;' : 'Lihat Hasil Kuis'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="quiz-result-card">
            <span className="badge badge-emerald">Kuis Selesai</span>
            <h2 className="result-score-heading">
              Skor Kamu: {Math.round((score / QUIZ_QUESTIONS.length) * 100)} / 100
            </h2>
            <p className="result-breakdown">
              Kamu menjawab dengan benar <strong>{score}</strong> dari {QUIZ_QUESTIONS.length} pertanyaan. Hasil kuis telah disimpan ke riwayat progres lokal kamu.
            </p>

            <div className="result-actions-row">
              <button className="btn btn-primary" onClick={handleRestart}>
                Ulangi Kuis
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate('progres')}>
                Lihat Progres Belajar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
