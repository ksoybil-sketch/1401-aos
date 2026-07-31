import React, { useState } from 'react';
import { QuizQuestion, QuizFeedback, QuizWrongAnswer } from '../../types';
import { useStore, useAuthStore } from '../../store/useStore';
import { ref, push } from 'firebase/database';
import { db } from '../../api/firebase';
import { btn, btnLg, btnPrimary, card } from '../../constants/ui';

export const TrainingQuiz: React.FC = () => {
  const { recipes } = useStore();
  const [trainingActive, setTrainingActive] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<QuizWrongAnswer[]>([]);
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
    setWrongAnswers([]);
    setFeedback(null);
    setFinished(false);
    setTrainingActive(true);
  };

  const handleAnswer = (selectedOption: string) => {
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    let nextScore = score;
    let nextWrongAnswers = wrongAnswers;
    if (isCorrect) {
      nextScore += 5; // 20 soru * 5 puan = 100 puan
      setScore(nextScore);
    } else {
      nextWrongAnswers = [...wrongAnswers, {
        recipeName: currentQ.recipeName,
        questionText: currentQ.questionText,
        correctAnswer: currentQ.correctAnswer,
        userAnswer: selectedOption
      }];
      setWrongAnswers(nextWrongAnswers);
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
            date: new Date().toISOString(),
            wrongAnswers: nextWrongAnswers
          }).catch(err => console.error("Quiz kaydı başarısız:", err));
        }
      }
    }, 1200);
  };

  if (!trainingActive) {
    return (
      <div className={`${card} text-center py-12 px-6`}>
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gold/12 border border-gold/25 flex items-center justify-center mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <h2 className="text-xl font-extrabold text-content mb-3 tracking-tight">Barista Eğitim Modülü</h2>
        <p className="text-content-secondary mb-8 leading-relaxed text-sm">
          İçecek reçetelerini ne kadar iyi biliyorsun? 20 soruluk bu sınavda reçetelerdeki malzemeleri ve ml/gramajları tahmin et. Şubede hatasız üretim için kendini test et!
        </p>
        <button onClick={generateQuiz} className={`${btn} ${btnPrimary} ${btnLg} w-full`}>
          Sınava Başla
        </button>
      </div>
    );
  }

  if (finished) {
    const passed = score >= 80;
    return (
      <div className={`${card} text-center py-12 px-6`}>
        <h2 className="text-xl font-extrabold text-content mb-2 tracking-tight">Sınav Bitti!</h2>
        <div className={`text-6xl font-extrabold my-6 tracking-tight ${passed ? 'text-success' : 'text-gold'}`}>
          {score}
          <span className="text-2xl font-bold ml-1">Puan</span>
        </div>
        <p className="text-content-secondary mb-8 leading-relaxed text-sm">
          {passed
            ? 'Harika iş çıkardın! Barın arkasına geçmeye hazırsın.'
            : 'Biraz daha pratik yapman gerekiyor. Reçeteler sekmesinden formülleri tekrar gözden geçir.'}
        </p>
        <button onClick={() => setTrainingActive(false)} className={`${btn} ${btnPrimary} ${btnLg} w-full`}>
          Yeniden Başla
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className={`${card} p-5`}>
      {/* İlerleme */}
      <div className="flex justify-between items-center text-[13px] text-content-muted font-semibold mb-2.5">
        <span>Soru {currentIndex + 1} / {questions.length}</span>
        <span className="text-gold">Skor: {score}</span>
      </div>
      <div className="h-1.5 bg-glass-2 rounded-full overflow-hidden mb-7">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h3 className="text-content text-lg font-bold mb-7 leading-relaxed">
        {currentQ.questionText}
      </h3>

      <div className="flex flex-col gap-3">
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={feedback !== null}
            onClick={() => handleAnswer(opt)}
            className="w-full min-h-14 py-3.5 px-5 rounded-2xl text-[15px] font-semibold cursor-pointer flex items-center gap-3 text-left transition-all duration-200 bg-glass-2 border border-hairline text-content hover:bg-glass-3 hover:border-hairline-strong active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="w-7 h-7 shrink-0 rounded-lg bg-glass-3 flex items-center justify-center text-xs font-bold text-content-muted">
              {String.fromCharCode(65 + idx)}
            </span>
            {opt}
          </button>
        ))}
      </div>

      {feedback && (
        <div
          className={`mt-5 p-4 rounded-2xl font-bold text-center border ${
            feedback.isCorrect
              ? 'bg-success-bg text-success border-success-border'
              : 'bg-danger-bg text-danger border-danger-border'
          }`}
        >
          {feedback.text}
        </div>
      )}
    </div>
  );
};
