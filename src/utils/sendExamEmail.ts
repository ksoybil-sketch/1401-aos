import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, isEmailConfigured } from '../constants/emailConfig';
import { QuizWrongAnswer } from '../types';

interface ExamEmailParams {
  toEmail: string;
  baristaName: string;
  branchName: string;
  levelName: string;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  date: string;
  wrongAnswers?: QuizWrongAnswer[];
}

/**
 * Sınav bittiğinde şube müdürüne özet gönderir. EmailJS yapılandırılmamışsa
 * (bkz. constants/emailConfig.ts) ya da şubenin bildirim e-postası
 * tanımlanmamışsa sessizce hiçbir şey yapmaz — sınav akışını bloklamaz.
 *
 * EmailJS şablonunuzda kullanabileceğiniz değişkenler: {{to_email}},
 * {{barista_name}}, {{branch_name}}, {{level_name}}, {{score}}, {{result}},
 * {{correct_answers}}, {{total_questions}}, {{exam_date}}, {{wrong_answers}}.
 */
export const sendExamResultEmail = async (params: ExamEmailParams): Promise<void> => {
  if (!isEmailConfigured() || !params.toEmail) return;

  try {
    const wrongSummary =
      (params.wrongAnswers || [])
        .map((w) => `- ${w.questionText} | Doğrusu: ${w.correctAnswer} | Verdiği cevap: ${w.userAnswer}`)
        .join('\n') || 'Yok — tüm sorular doğru.';

    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        to_email: params.toEmail,
        barista_name: params.baristaName,
        branch_name: params.branchName,
        level_name: params.levelName,
        score: params.score,
        result: params.passed ? 'GEÇTİ' : 'KALDI',
        correct_answers: params.correctAnswers,
        total_questions: params.totalQuestions,
        exam_date: new Date(params.date).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }),
        wrong_answers: wrongSummary
      },
      { publicKey: EMAILJS_CONFIG.publicKey }
    );
  } catch (err) {
    // E-posta gidemese de sonuç zaten Firebase'e kaydedildi ve
    // Barista Performans Raporu'nda görülebilir — sınav akışını bozmuyoruz.
    console.error('Sınav sonucu e-postası gönderilemedi:', err);
  }
};
