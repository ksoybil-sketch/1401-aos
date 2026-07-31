import React, { useState } from 'react';
import { QuizQuestion, QuizFeedback } from '../../types';
import { useStore, useAuthStore } from '../../store/useStore';
import { ref, push } from 'firebase/database';
import { db } from '../../api/firebase';

export const TrainingQuiz: React.FC = () => {
  const { recipes } = useStore();
  const [trainingActive, setTrainingActive] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
  const [finished, setFinished] = useState(false);

  const generateQuiz = () => {
    if (!recipes || recipes.length === 0) return;
    const shuffledRecipes = [...recipes].sort(() => 0.5 - Math.random());
    const selected = shuffledRecipes.slice(0, 20);

    const quizQuestions: QuizQuestion[] = selected.map((r, idx) => {
      // Rastgele bir malzeme seç
      const randomIng = r.ingredients[Math.floor(Math.random() * r.ingredients.length)];
      const questionText = `"${r.name}" içeceğinde "${randomIng.name}" malzemesinin doğru ölçüsü nedir?`;
      const correctAnswer = randomIng.amount;

      // Diğer reçetelerden yanlış şıklar topla
      const wrongOptions = new Set<string>();
      recipes.forEach((otherR) => {
        otherR.ingredients.forEach((ing) => {
          if (ing.amount !== correctAnswer && ing.amount.trim() !== '') {
            wrongOptions.add(ing.amount);
          }
        });
      });

      const wrongArr = Array.from(wrongOptions).sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [correctAnswer, ...wrongArr].sort(() => 0.5 - Math.random());

      return {
        id: `q-${idx}`,
        recipeName: r.name,
        questionText,
        correctAnswer,
        options
      };
    });

    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
    setTrainingActive(true);
  };

  const handleAnswer = (selectedOption: string) => {
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    let nextScore = score;
    if (isCorrect) {
      nextScore += 5; // 20 soru * 5 puan = 100 puan
      setScore(nextScore);
    }

    setFeedback({
      isCorrect,
      text: isCorrect ? '✅ Doğru Cevap!' : `❌ Yanlış! Doğru Cevap: ${currentQ.correctAnswer}`
    });

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFinished(true);
        // Save to Firebase
        const { activeBarista, branchId } = useAuthStore.getState();
        if (activeBarista && branchId) {
          const resultRef = ref(db, `branches/${branchId}/training/quizResults`);
          push(resultRef, {
            baristaId: activeBarista.id,
            baristaName: activeBarista.name,
            score: nextScore,
            totalQuestions: questions.length,
            correctAnswers: nextScore / 5,
            date: new Date().toISOString()
          }).catch(err => console.error("Quiz kaydı başarısız:", err));
        }
      }
    }, 1200);
  };

  if (!trainingActive) {
    return (
      <div className="training-welcome" style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-lg)' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ marginBottom: '20px' }}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Barista Eğitim Modülü</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.5' }}>
          İçecek reçetelerini ne kadar iyi biliyorsun? 20 soruluk bu sınavda reçetelerdeki malzemeleri ve ml/gramajları tahmin et. Şubede hatasız üretim için kendini test et!
        </p>
        <button onClick={generateQuiz} className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '16px' }}>
          Sınava Başla
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="training-result" style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Sınav Bitti!</h2>
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: score >= 80 ? 'var(--success)' : 'var(--accent)', margin: '20px 0' }}>
          {score} Puan
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
          {score >= 80 ? "Harika iş çıkardın! Barın arkasına geçmeye hazırsın." : "Biraz daha pratik yapman gerekiyor. Reçeteler sekmesinden formülleri tekrar gözden geçir."}
        </p>
        <button onClick={() => setTrainingActive(false)} className="btn btn-primary">
          Yeniden Başla
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="training-quiz-card" style={{ padding: '20px', backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
        <span>Soru: {currentIndex + 1} / {questions.length}</span>
        <span>Skor: {score}</span>
      </div>

      <h3 style={{ color: 'var(--text-main)', fontSize: '18px', marginBottom: '30px', lineHeight: '1.4' }}>
        {currentQ.questionText}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={feedback !== null}
            onClick={() => handleAnswer(opt)}
            className="btn"
            style={{
              padding: '15px',
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--surface-border)',
              color: 'var(--text-main)',
              textAlign: 'left',
              fontSize: '15px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {feedback && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: feedback.isCorrect ? 'rgba(52, 201, 135, 0.15)' : 'rgba(255, 107, 107, 0.15)',
            color: feedback.isCorrect ? 'var(--success)' : 'var(--danger)',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          {feedback.text}
        </div>
      )}
    </div>
  );
};
