import { useState, useMemo } from 'react';
import { getQuestionsByExperiment } from '../../data/labQuizQuestions.js';
import { addQuizAttempt } from '../../services/progressService.js';
import { enqueueResult } from '../../services/syncService.js';
import { getCurrentSession } from '../../services/authService.js';
import './LaboratoryQuiz.css';

/**
 * LaboratoryQuiz.jsx
 * Kuis Interaktif Pemahaman Konsep Laboratorium dengan Umpan Balik Ilmiah
 * Sesuai spesifikasi PRD Bab 8.12, Bab 10 & AGENT.md Bab 7
 */
export default function LaboratoryQuiz({
  experiment,
  onQuizCompleted,
}) {
  const questions = useMemo(
    () => getQuestionsByExperiment(experiment?.id),
    [experiment?.id]
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [answersHistory, setAnswersHistory] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (idx) => {
    if (hasChecked) return;
    setSelectedOpt(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOpt === null || hasChecked) return;
    setHasChecked(true);

    const isCorrect = selectedOpt === currentQ.correctAnswer;
    setAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedOption: selectedOpt,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setHasChecked(false);
    } else {
      // Selesai seluruh kuis eksperimen aktif
      setIsCompleted(true);
      const totalCorrect =
        answersHistory.filter((a) => a.isCorrect).length +
        (selectedOpt === currentQ.correctAnswer ? 1 : 0);
      const score = Math.round((totalCorrect / questions.length) * 100);

      // Simpan riwayat kuis ke LocalStorage
      addQuizAttempt({
        category: `Lab Virtual: ${experiment?.factor || experiment?.title || 'Model A + B'}`,
        score,
        totalQuestions: questions.length,
        correctAnswers: totalCorrect,
      });

      // Sinkronkan ke cloud jika dalam Mode Akun aktif
      const session = getCurrentSession();
      if (session.active && session.user?.uid) {
        const answersMap = {};
        answersHistory.forEach((a) => {
          if (a.questionId) answersMap[a.questionId] = a.selectedIndex;
        });
        answersMap[currentQ.id] = selectedOpt;

        enqueueResult({
          moduleId: 'modul-01',
          activityId: `quiz-${experiment?.id || 'lab'}`,
          questionVersion: 'qb-2026-11-03',
          kind: 'quiz',
          answers: answersMap,
          score,
          totalQuestions: questions.length,
          correctAnswers: totalCorrect,
          incorrectAnswers: questions.length - totalCorrect,
          completedAt: new Date().toISOString(),
        }).catch((err) => {
          console.warn('[LaboratoryQuiz] Gagal enqueue kuis lab:', err);
        });
      }

      if (onQuizCompleted) {
        onQuizCompleted({
          score,
          totalCorrect,
          totalQuestions: questions.length,
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setHasChecked(false);
    setAnswersHistory([]);
    setIsCompleted(false);
  };

  // Tampilan Hasil Akhir Kuis
  if (isCompleted) {
    const totalCorrect = answersHistory.filter((a) => a.isCorrect).length;
    const finalScore = Math.round((totalCorrect / questions.length) * 100);

    return (
      <div className="lab-quiz-card quiz-results-view" aria-label="Hasil Akhir Kuis Laboratorium">
        <div className="results-top-banner">
          <span className="results-badge-tag">HASIL EVALUASI LABORATORIUM: {experiment?.code || 'LAB'}</span>
          <h3 className="results-title">Skor Penguasaan Konsep Eksperimen</h3>
          <div className="score-circle-wrapper">
            <div className="score-circle">
              <span className="score-num">{finalScore}</span>
              <span className="score-max">/ 100</span>
            </div>
          </div>
          <p className="score-message">
            {finalScore >= 80
              ? '🎉 Istimewa! Kamu sangat memahami keterkaitan antara kerapatan partikel, suhu, dan teori tumbukan.'
              : finalScore >= 60
              ? '👍 Bagus! Sebagian besar konsep sudah kamu kuasai. Tinjau kembali faktor-faktor penentu tumbukan efektif.'
              : '💡 Jangan berkecil hati. Pelajari kembali ringkasan materi dan ulangi eksperimen simulasi mikroskopik.'}
          </p>
        </div>

        <div className="results-breakdown-row">
          <div className="res-stat-box stat-correct">
            <span className="stat-val">{totalCorrect}</span>
            <span className="stat-label">Jawaban Benar</span>
          </div>
          <div className="res-stat-box stat-wrong">
            <span className="stat-val">{questions.length - totalCorrect}</span>
            <span className="stat-label">Belum Tepat</span>
          </div>
          <div className="res-stat-box stat-total">
            <span className="stat-val">{questions.length}</span>
            <span className="stat-label">Total Pertanyaan</span>
          </div>
        </div>

        <div className="results-actions-row">
          <button className="btn btn-secondary" onClick={handleRestartQuiz}>
            🔄 Ulangi Kuis Laboratorium
          </button>
        </div>
      </div>
    );
  }

  // Tampilan Pertanyaan Berjalan
  const isCorrect = selectedOpt === currentQ?.correctAnswer;

  return (
    <section className="lab-quiz-card" aria-labelledby="lab-quiz-heading">
      <div className="quiz-card-header">
        <div className="quiz-meta-info">
          <span className="badge badge-cyan">KUIS LAB: {experiment?.factor || 'Reaksi A + B'}</span>
          <span className="difficulty-pill">{currentQ?.difficulty || 'Sedang'}</span>
        </div>
        <div className="question-counter">
          Soal <strong>{currentIdx + 1}</strong> dari <strong>{questions.length}</strong>
        </div>
      </div>

      <div className="question-body">
        <h3 id="lab-quiz-heading" className="question-text">
          {currentQ?.question}
        </h3>

        <div className="quiz-options-list" role="radiogroup" aria-label="Pilihan Jawaban">
          {currentQ?.options?.map((opt, i) => {
            const isSelected = selectedOpt === i;
            let optStatusClass = '';

            if (hasChecked) {
              if (i === currentQ.correctAnswer) {
                optStatusClass = 'is-correct';
              } else if (isSelected) {
                optStatusClass = 'is-incorrect';
              }
            } else if (isSelected) {
              optStatusClass = 'is-selected';
            }

            return (
              <button
                key={i}
                type="button"
                className={`quiz-option-btn ${optStatusClass}`}
                onClick={() => handleSelectOption(i)}
                disabled={hasChecked}
                role="radio"
                aria-checked={isSelected}
              >
                <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                <span className="opt-text">{opt}</span>
                {hasChecked && i === currentQ.correctAnswer && (
                  <span className="opt-check-icon">✓</span>
                )}
                {hasChecked && isSelected && i !== currentQ.correctAnswer && (
                  <span className="opt-wrong-icon">✕</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Umpan Balik Edukatif Langsung (PRD 8.12) */}
      {hasChecked && (
        <div
          className={`quiz-feedback-banner ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}
          role="alert"
        >
          <div className="feedback-banner-header">
            <span className="feedback-icon">{isCorrect ? '✓' : '✕'}</span>
            <strong className="feedback-status-title">
              {isCorrect ? currentQ.correctFeedback?.status : currentQ.incorrectFeedback?.status}
            </strong>
          </div>

          {isCorrect ? (
            <div className="feedback-body">
              <p className="feedback-appreciation">{currentQ.correctFeedback?.appreciation}</p>
              <p className="feedback-reason">
                <strong>Alasan Ilmiah:</strong> {currentQ.correctFeedback?.reason}
              </p>
            </div>
          ) : (
            <div className="feedback-body">
              <p className="feedback-error-hint">
                <strong>Letak Kekeliruan:</strong> {currentQ.incorrectFeedback?.errorHint}
              </p>
              <p className="feedback-concept">
                <strong>Konsep yang Benar:</strong> {currentQ.incorrectFeedback?.concept}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="quiz-footer-actions">
        {!hasChecked ? (
          <button
            type="button"
            className="btn btn-primary btn-check-answer"
            onClick={handleCheckAnswer}
            disabled={selectedOpt === null}
          >
            Periksa Jawaban
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-next-question"
            onClick={handleNextQuestion}
          >
            {currentIdx + 1 < questions.length ? 'Soal Berikutnya →' : 'Lihat Hasil Akhir Kuis →'}
          </button>
        )}
      </div>
    </section>
  );
}
