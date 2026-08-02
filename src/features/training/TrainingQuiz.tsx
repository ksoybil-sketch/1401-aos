import React, { useState } from 'react';
import { QuizQuestion, QuizFeedback, QuizWrongAnswer } from '../../types';
import { useStore, useAuthStore } from '../../store/useStore';
import { ref, push } from 'firebase/database';
import { db } from '../../api/firebase';
import { Icon } from '../../components/Icon';
import { btn, btnLg, btnPrimary, card } from '../../constants/ui';
import { TRAINING_LEVELS, TrainingLevel, QUESTION_BANKS, QUESTIONS_PER_EXAM, MAX_EXAMS_PER_WEEK } from '../../constants/trainingLevels';
import { useTrainingProgress } from '../../hooks/useTrainingProgress';
import { sendExamResultEmail } from '../../utils/sendExamEmail';

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());

export const TrainingQuiz: React.FC = () => {
  const { recipes, quizResults, branches } = useStore();
  const activeBarista = useAuthStore((state) => state.activeBarista);
  const activeBranchId = useAuthStore((state) => state.activeBranchId);
  const progress = useTrainingProgress(activeBarista?.name, quizResults);

  const [trainingActive, setTrainingActive] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<QuizWrongAnswer[]>([]);
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  // Sınav ortasında (özellikle bitiş ekranındayken) progress.currentLevel
  // Firebase'den gelen yeni bir sonuçla anında ilerleyebilir — bitiş ekranı
  // hangi seviyenin sınavı yapıldıysa onu göstermeli, o an "güncel" olanı
  // değil. Bu yüzden sınavın başladığı seviyeyi burada donduruyoruz.
  const [examLevel, setExamLevel] = useState<TrainingLevel>(progress.currentLevel);

  const generateQuiz = () => {
    const level = progress.currentLevel;
    let pool: QuizQuestion[];

    if (level.id === 'recipes') {
      if (!recipes || recipes.length === 0) return;
      const shuffledRecipes = shuffle(recipes).slice(0, QUESTIONS_PER_EXAM);
      pool = shuffledRecipes.map((r, idx) => {
        const randomIng = r.ingredients[Math.floor(Math.random() * r.ingredients.length)];
        const correctAnswer = randomIng.amount;
        const wrongOptions = new Set<string>();
        recipes.forEach((otherR) => {
          otherR.ingredients.forEach((ing) => {
            if (ing.amount !== correctAnswer && ing.amount.trim() !== '') wrongOptions.add(ing.amount);
          });
        });
        const wrongArr = shuffle(Array.from(wrongOptions)).slice(0, 3);
        return {
          id: `q-${idx}`,
          recipeName: r.name,
          questionText: `"${r.name}" içeceğinde "${randomIng.name}" malzemesinin doğru ölçüsü nedir?`,
          correctAnswer,
          options: shuffle([correctAnswer, ...wrongArr])
        };
      });
    } else {
      const bank = QUESTION_BANKS[level.id] || [];
      pool = shuffle(bank)
        .slice(0, QUESTIONS_PER_EXAM)
        .map((q) => ({ ...q, options: shuffle(q.options) }));
    }

    setQuestions(pool);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongAnswers([]);
    setFeedback(null);
    setFinished(false);
    setFinalScore(0);
    setExamLevel(level);
    setTrainingActive(true);
  };

  const handleAnswer = (selectedOption: string) => {
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    let nextCorrectCount = correctCount;
    let nextWrongAnswers = wrongAnswers;

    if (isCorrect) {
      nextCorrectCount += 1;
      setCorrectCount(nextCorrectCount);
    } else {
      nextWrongAnswers = [
        ...wrongAnswers,
        {
          recipeName: currentQ.recipeName,
          questionText: currentQ.questionText,
          correctAnswer: currentQ.correctAnswer,
          userAnswer: selectedOption
        }
      ];
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
        return;
      }

      const level = examLevel;
      const score = Math.round((nextCorrectCount / questions.length) * 100);
      const passed = score >= level.passScore;
      setFinalScore(score);
      setFinished(true);

      if (activeBarista && activeBranchId) {
        const date = new Date().toISOString();
        const resultRef = ref(db, `branches/${activeBranchId}/training/quizResults`);
        push(resultRef, {
          baristaId: activeBarista.id,
          baristaName: activeBarista.name,
          score,
          totalQuestions: questions.length,
          correctAnswers: nextCorrectCount,
          date,
          wrongAnswers: nextWrongAnswers,
          levelId: level.id
        }).catch((err) => console.error('Sınav kaydı başarısız:', err));

        const branch = branches.find((b) => b.id === activeBranchId);
        if (branch?.notifyEmail) {
          sendExamResultEmail({
            toEmail: branch.notifyEmail,
            baristaName: activeBarista.name,
            branchName: branch.name,
            levelName: level.name,
            score,
            passed,
            totalQuestions: questions.length,
            correctAnswers: nextCorrectCount,
            date,
            wrongAnswers: nextWrongAnswers
          });
        }
      }
    }, 1200);
  };

  if (!trainingActive && !finished) {
    const level = progress.currentLevel;

    return (
      <div className="flex flex-col gap-3.5 mt-1">
        {/* Seviye ilerlemesi */}
        <div className={`${card} p-4 flex items-center gap-3`}>
          <div className="flex gap-1.5 shrink-0">
            {TRAINING_LEVELS.map((l) => (
              <span
                key={l.id}
                className={`w-2.5 h-2.5 rounded-full ${
                  l.order < level.order
                    ? 'bg-positive'
                    : l.order === level.order
                      ? 'bg-crema'
                      : 'bg-panel-3'
                }`}
              />
            ))}
          </div>
          <span className="text-[12px] text-fg-3">
            Seviye {level.order}/{TRAINING_LEVELS.length}
          </span>
        </div>

        {progress.isMaxLevel ? (
          <div className={`${card} text-center py-10 px-6`}>
            <div className="w-14 h-14 mx-auto rounded-xl bg-positive-bg flex items-center justify-center mb-5">
              <Icon name="check" size={26} className="text-positive" />
            </div>
            <h2 className="text-[19px] font-semibold text-crema mb-2.5 tracking-tight">Tüm seviyeler tamamlandı</h2>
            <p className="text-fg-2 leading-relaxed text-[14px]">
              Barista eğitiminin tüm seviyelerini başarıyla geçtin. Bilgini tazelemek için istediğin an
              tekrar sınava girebilirsin.
            </p>
          </div>
        ) : (
          <div className={`${card} text-center py-10 px-6`}>
            <div className="w-14 h-14 mx-auto rounded-xl bg-panel-2 border border-line flex items-center justify-center mb-5">
              <Icon name={progress.weeklyLimitReached ? 'lock' : 'cap'} size={26} className="text-fg-2" />
            </div>
            <h2 className="text-[19px] font-semibold text-crema mb-2.5 tracking-tight">{level.name}</h2>
            <p className="text-fg-2 mb-7 leading-relaxed text-[14px]">{level.description}</p>

            {progress.weeklyLimitReached ? (
              <p className="text-[13px] text-caution leading-relaxed">
                Bu hafta {MAX_EXAMS_PER_WEEK} sınav hakkınızı kullandınız.{' '}
                {progress.nextSlotAt &&
                  `${progress.nextSlotAt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} tarihinde tekrar sınava girebilirsiniz.`}
              </p>
            ) : (
              <button onClick={generateQuiz} className={`${btn} ${btnPrimary} ${btnLg} w-full`}>
                Sınava Başla
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (finished) {
    const level = examLevel;
    const passed = finalScore >= level.passScore;
    return (
      <div className={`${card} text-center py-10 px-6 mt-1`}>
        <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-5 ${passed ? 'bg-positive-bg' : 'bg-caution-bg'}`}>
          <Icon name={passed ? 'check' : 'alert'} size={26} className={passed ? 'text-positive' : 'text-caution'} />
        </div>
        <div className={`text-[44px] font-semibold tnum tracking-tight ${passed ? 'text-positive' : 'text-caution'}`}>
          {finalScore}
        </div>
        <p className="text-fg-3 text-[13px] mb-6">100 üzerinden — {level.name}</p>
        <p className="text-fg-2 mb-7 leading-relaxed text-[14px]">
          {passed
            ? level.order < TRAINING_LEVELS.length
              ? `Harika iş çıkardın! "${TRAINING_LEVELS[level.order].name}" seviyesi açıldı.`
              : 'Harika iş çıkardın. Tüm seviyeleri tamamladın!'
            : `Biraz daha pratik gerekiyor. "${level.name}" konusunu tekrar gözden geçir.`}
        </p>
        <button
          onClick={() => {
            setTrainingActive(false);
            setFinished(false);
          }}
          className={`${btn} ${btnPrimary} ${btnLg} w-full`}
        >
          Devam Et
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPct = (currentIndex / questions.length) * 100;

  return (
    <div className={`${card} p-5 mt-1`}>
      {/* İlerleme */}
      <div className="flex justify-between items-center text-[12px] text-fg-3 font-medium mb-2 tnum">
        <span>Soru {currentIndex + 1} / {questions.length}</span>
        <span className="text-crema">{correctCount} doğru</span>
      </div>
      <div className="h-1 bg-panel-2 rounded-full overflow-hidden mb-6">
        <div
          className="h-full rounded-full bg-crema transition-all duration-300"
          style={{ width: `${progressPct}%` }}
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
