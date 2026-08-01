import React, { useState } from 'react';
import { QuizQuestion, QuizFeedback, QuizWrongAnswer } from '../../types';
import { useStore, useAuthStore } from '../../store/useStore';
import { ref, push } from 'firebase/database';
import { db } from '../../api/firebase';
import { Icon } from '../../components/Icon';
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
      text: isCorrect ? 'Doğru cevap' : `Yanlış — doğrusu: ${currentQ.correctAnswer}`
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
      <div className={`${card} text-center py-10 px-6 mt-1`}>
        <div className="w-14 h-14 mx-auto rounded-xl bg-panel-2 border border-line flex items-center justify-center mb-5">
          <Icon name="cap" size={26} className="text-fg-2" />
        </div>
        <h2 className="text-[19px] font-semibold text-crema mb-2.5 tracking-tight">Eğitim Modülü</h2>
        <p className="text-fg-2 mb-7 leading-relaxed text-[14px]">
          İçecek reçetelerini ne kadar iyi biliyorsun? 20 soruluk bu sınavda
          reçetelerdeki malzemeleri ve ölçüleri tahmin et.
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
      <div className={`${card} text-center py-10 px-6 mt-1`}>
        <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-5 ${passed ? 'bg-positive-bg' : 'bg-caution-bg'}`}>
          <Icon name={passed ? 'check' : 'alert'} size={26} className={passed ? 'text-positive' : 'text-caution'} />
        </div>
        <div className={`text-[44px] font-semibold tnum tracking-tight ${passed ? 'text-positive' : 'text-caution'}`}>
          {score}
        </div>
        <p className="text-fg-3 text-[13px] mb-6">100 üzerinden</p>
        <p className="text-fg-2 mb-7 leading-relaxed text-[14px]">
          {passed
            ? 'Harika iş çıkardın. Barın arkasına geçmeye hazırsın.'
            : 'Biraz daha pratik gerekiyor. Reçeteler sekmesinden formülleri tekrar gözden geçir.'}
        </p>
        <button onClick={() => setTrainingActive(false)} className={`${btn} ${btnPrimary} ${btnLg} w-full`}>
          Yeniden Başla
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className={`${card} p-5 mt-1`}>
      {/* İlerleme */}
      <div className="flex justify-between items-center text-[12px] text-fg-3 font-medium mb-2 tnum">
        <span>Soru {currentIndex + 1} / {questions.length}</span>
        <span className="text-crema">{score} puan</span>
      </div>
      <div className="h-1 bg-panel-2 rounded-full overflow-hidden mb-6">
        <div
          className="h-full rounded-full bg-crema transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h3 className="text-crema text-[17px] font-medium mb-6 leading-relaxed">
        {currentQ.questionText}
      </h3>

      <div className="flex flex-col gap-2">
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={feedback !== null}
            onClick={() => handleAnswer(opt)}
            className="w-full min-h-12 py-3 px-3.5 rounded-lg text-[15px] cursor-pointer flex items-center gap-3 text-left transition-colors duration-150 bg-panel border border-line text-crema hover:bg-panel-2 hover:border-line-2 active:opacity-80 disabled:opacity-45 disabled:cursor-not-allowed"
          >
            <span className="w-6 h-6 shrink-0 rounded-md bg-panel-2 flex items-center justify-center text-[11px] font-semibold text-fg-2">
              {String.fromCharCode(65 + idx)}
            </span>
            {opt}
          </button>
        ))}
      </div>

      {feedback && (
        <div
          className={`mt-4 p-3.5 rounded-lg font-medium text-[14px] flex items-center gap-2.5 border ${
            feedback.isCorrect
              ? 'bg-positive-bg text-positive border-positive-line'
              : 'bg-negative-bg text-negative border-negative-line'
          }`}
        >
          <Icon name={feedback.isCorrect ? 'check' : 'close'} size={16} />
          {feedback.text}
        </div>
      )}
    </div>
  );
};
