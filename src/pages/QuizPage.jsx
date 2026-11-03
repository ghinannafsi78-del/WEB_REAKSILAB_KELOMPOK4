/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react';
import { addQuizAttempt } from '../services/progressService.js';
import { enqueueResult } from '../services/syncService.js';
import { getCurrentSession, subscribeAuthState } from '../services/authService.js';
import './QuizPage.css';

export const QUESTION_BANK_VERSION = 'qb-2026-11-03';

export const QUIZ_QUESTIONS = [
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
  const [hasChecked, setHasChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswersMap, setUserAnswersMap] = useState({});
  const [authSession, setAuthSession] = useState(getCurrentSession());
  const [cloudSyncStatus, setCloudSyncStatus] = useState(null);

  useEffect(() => {
    const unsub = subscribeAuthState((session) => {
      setAuthSession(session);
    });
    return unsub;
  }, []);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  // Tahap 1: Memilih Opsi (bebas diganti sebelum periksa jawaban)
  const handleSelectOption = (index) => {
    if (hasChecked) return;
    setSelectedOpt(index);
  };

  // Tahap 2: Mengirim / Periksa Jawaban
  const handleCheckAnswer = () => {
    if (selectedOpt === null || hasChecked) return;
    setHasChecked(true);

    const isCorrect = selectedOpt === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Rekam jawaban siswa per ID soal
    setUserAnswersMap((prev) => ({
      ...prev,
      [currentQ.id]: selectedOpt,
    }));
  };

  // Tahap 3: Melanjutkan ke soal berikutnya / lihat hasil
  const handleNext = async () => {
    if (!hasChecked) return;

    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setHasChecked(false);
    } else {
      // Kuis selesai seluruhnya
      setIsFinished(true);
      const totalCorrect = score;
      const finalScorePercent = Math.round((totalCorrect / QUIZ_QUESTIONS.length) * 100);

      // 1. Simpan ke LocalStorage (selalu tersimpan, mode tamu maupun akun)
      addQuizAttempt({
        category: 'Kuis Evaluasi Formatif',
        score: finalScorePercent,
        totalQuestions: QUIZ_QUESTIONS.length,
        correctAnswers: totalCorrect,
      });

      // 2. Jika dalam Mode Akun (siswa terdaftar dan aktif), enqueue ke antrean Firestore
      if (authSession.active && authSession.user?.uid) {
        try {
          const finalAnswers = {
            ...userAnswersMap,
            [currentQ.id]: selectedOpt,
          };

          const enqueueRes = await enqueueResult({
            moduleId: 'modul-01',
            activityId: 'quiz-formatif-laju',
            questionVersion: QUESTION_BANK_VERSION,
            kind: 'quiz',
            answers: finalAnswers,
            score: finalScorePercent,
            totalQuestions: QUIZ_QUESTIONS.length,
            correctAnswers: totalCorrect,
            incorrectAnswers: QUIZ_QUESTIONS.length - totalCorrect,
            completedAt: new Date().toISOString(),
          });

          if (enqueueRes.success) {
            setCloudSyncStatus('cloud');
          }
        } catch (err) {
          console.warn('[QuizPage] Gagal mengantrekan hasil kuis ke cloud:', err);
          setCloudSyncStatus('local-only');
        }
      } else {
        setCloudSyncStatus('guest');
      }

      if (onQuizCompleted) onQuizCompleted();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setHasChecked(false);
    setScore(0);
    setIsFinished(false);
    setUserAnswersMap({});
    setCloudSyncStatus(null);
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

            {/* Daftar Opsi Jawaban */}
            <div className="quiz-options-list" role="radiogroup" aria-label="Pilihan jawaban">
              {currentQ.options.map((opt, i) => {
                let statusClass = '';
                if (hasChecked) {
                  if (i === currentQ.correctAnswer) statusClass = 'correct';
                  else if (i === selectedOpt) statusClass = 'wrong';
                }

                const isSelected = selectedOpt === i;

                return (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`quiz-option-btn ${isSelected ? 'selected' : ''} ${statusClass}`}
                    onClick={() => handleSelectOption(i)}
                    disabled={hasChecked}
                  >
                    <span className="option-indicator">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="option-text">{opt}</span>
                    {isSelected && !hasChecked && (
                      <span className="selected-indicator-pill" aria-hidden="true">Dipilih</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tombol Periksa Jawaban (Alur 3 Tahap) */}
            {!hasChecked && (
              <div className="quiz-action-bar">
                {selectedOpt === null && (
                  <span className="quiz-hint-text">
                    💡 Pilih salah satu opsi di atas untuk mengaktifkan tombol periksa.
                  </span>
                )}
                <button
                  id="btn-check-answer"
                  className="btn btn-primary"
                  onClick={handleCheckAnswer}
                  disabled={selectedOpt === null}
                >
                  Periksa Jawaban
                </button>
              </div>
            )}

            {/* Feedback dan Pembahasan setelah Periksa Jawaban */}
            {hasChecked && (
              <div className="quiz-explanation-box">
                <strong>
                  {selectedOpt === currentQ.correctAnswer ? '🎉 Jawaban Benar!' : '⚠️ Kurang Tepat!'}
                </strong>
                <p>{currentQ.explanation}</p>
                <div className="explanation-next-action">
                  <button id="btn-next-question" className="btn btn-primary" onClick={handleNext}>
                    {currentIdx + 1 < QUIZ_QUESTIONS.length
                      ? 'Lanjut ke Soal Berikutnya \u2192'
                      : 'Lihat Hasil Kuis'}
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
              Kamu menjawab dengan benar <strong>{score}</strong> dari {QUIZ_QUESTIONS.length} pertanyaan.
            </p>

            {/* Status Penyimpanan Cloud / Lokal */}
            <div className="quiz-storage-status-box">
              {cloudSyncStatus === 'cloud' && (
                <div className="sync-alert success">
                  <span className="sync-icon">☁️</span>
                  <span>Hasil berhasil disimpan ke akun <strong>{authSession.alias}</strong> dan diantrekan ke Cloud Firestore.</span>
                </div>
              )}
              {cloudSyncStatus === 'guest' && (
                <div className="sync-alert guest">
                  <span className="sync-icon">💾</span>
                  <span>Mode Tamu: Hasil kuis tersimpan di penyimpanan lokal browser. Masuk akun untuk menyinkronkan hasil ke cloud.</span>
                </div>
              )}
              {cloudSyncStatus === 'local-only' && (
                <div className="sync-alert warning">
                  <span className="sync-icon">⚠️</span>
                  <span>Hasil tersimpan di lokal dan akan disinkronkan ke cloud saat koneksi terhubung.</span>
                </div>
              )}
            </div>

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
