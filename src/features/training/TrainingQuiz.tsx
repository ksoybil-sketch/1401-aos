import React, { useState } from 'react';
import { QuizQuestion, QuizFeedback, QuizWrongAnswer } from '../../types';
import { useStore, useAuthStore } from '../../store/useStore';
import { ref, push } from 'firebase/database';
import { db } from '../../api/firebase';

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
      <div className="text-center py-10 px-5 bg-surface-1 rounded-lg">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" className="mb-5 mx-auto">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
        <h2 className="text-content mb-2.5">Barista Eğitim Modülü</h2>
        <p className="text-content-secondary mb-7 leading-relaxed">
          İçecek reçetelerini ne kadar iyi biliyorsun? 20 soruluk bu sınavda reçetelerdeki malzemeleri ve ml/gramajları tahmin et. Şubede hatasız üretim için kendini test et!
        </p>
        <button onClick={generateQuiz} className="py-[15px] px-8 rounded-md text-base font-semibold cursor-pointer inline-flex items-center justify-center gap-2 transition bg-ink text-night active:bg-ink-hover active:scale-[0.98]">
          Sınava Başla
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="text-center py-10 px-5 bg-surface-1 rounded-lg">
        <h2 className="text-content mb-2.5">Sınav Bitti!</h2>
        <div className={`text-5xl font-bold my-5 ${score >= 80 ? 'text-success' : 'text-gold'}`}>
          {score} Puan
        </div>
        <p className="text-content-secondary mb-7">
          {score >= 80 ? "Harika iş çıkardın! Barın arkasına geçmeye hazırsın." : "Biraz daha pratik yapman gerekiyor. Reçeteler sekmesinden formülleri tekrar gözden geçir."}
        </p>
        <button onClick={() => setTrainingActive(false)} className="w-full py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-ink text-night active:bg-ink-hover active:scale-[0.98]">
          Yeniden Başla
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="p-5 bg-surface-1 rounded-lg">
      <div className="flex justify-between mb-5 text-sm text-content-secondary">
        <span>Soru: {currentIndex + 1} / {questions.length}</span>
        <span>Skor: {score}</span>
      </div>

      <h3 className="text-content text-lg mb-7 leading-relaxed">
        {currentQ.questionText}
      </h3>

      <div className="flex flex-col gap-3">
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={feedback !== null}
            onClick={() => handleAnswer(opt)}
            className="w-full py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center gap-2 transition bg-surface-2 border border-surface-border text-content text-left"
          >
            {opt}
          </button>
        ))}
      </div>

      {feedback && (
        <div
          className={`mt-5 p-[15px] rounded-md font-bold text-center ${feedback.isCorrect ? 'bg-[rgba(52,201,135,0.15)] text-success' : 'bg-[rgba(255,107,107,0.15)] text-danger'}`}
        >
          {feedback.text}
        </div>
      )}
    </div>
  );
};
