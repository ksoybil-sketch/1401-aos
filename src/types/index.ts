export type UserRole = 'Barista' | 'Şube Müdürü' | 'Bölge Müdürü';

export type ActiveTab = 'dashboard' | 'inventory' | 'recipes' | 'teshirStock' | 'training' | 'reports' | 'scanner';

export interface BaristaProfile {
  id: string;
  name: string;
  pin: string;
  branchId: string;
}

export interface QuizWrongAnswer {
  recipeName: string;
  questionText: string;
  correctAnswer: string;
  userAnswer: string;
}

export interface QuizResult {
  id: string;
  baristaName: string;
  score: number;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers?: QuizWrongAnswer[];
  /** Hangi eğitim seviyesinin sınavı olduğu. Eski kayıtlarda yok — 'recipes' varsayılır. */
  levelId?: string;
}

export interface InventoryItem {
  id: string;
  barcode: string;
  name: string;
  category: string;
  quantity: number;
  expirationDate: string;
  dateAdded: string;
  isFrozen?: boolean;
}

export interface FrozenItem {
  id: string;
  barcode?: string;
  name: string;
  category?: string;
  quantity: number;
  expirationDate: string;
  dateAdded: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  image: string | null;
}

export interface TransactionLogItem {
  id: string;
  date: string;
  productName: string;
  quantity: number;
  type: 'ADDED' | 'CONSUMED' | 'EXPIRED' | 'CORRECTION';
  reason: string;
  performedBy?: string;
}

export interface QuizQuestion {
  id: string;
  /** Reçete sorularında içecek adı; diğer seviyelerde konu başlığı (örn. "Şikayet Yönetimi"). */
  recipeName: string;
  questionText: string;
  correctAnswer: string;
  options: string[];
}

export interface QuizFeedback {
  isCorrect: boolean;
  text: string;
}

export interface StatusDetails {
  statusClass: string;
  statusBorderClass: string;
  label: string;
}

export interface BranchInfo {
  id: string;
  name: string;
  city: string;
  regionId?: string;
  /** Sınav sonucu gibi bildirimlerin gönderileceği şube müdürü e-postası. */
  notifyEmail?: string;
}

export interface BroadcastMessage {
  id: string;
  message: string;
  sentByEmail: string;
  sentAt: number;
}

export interface ReorderRecommendation {
  productName: string;
  category: string;
  currentStock: number;
  /** Önerilen sipariş, adet cinsinden. */
  recommendedOrder: number;
  /**
   * Ürünün kutu içi adedi (biliniyorsa). Doluysa sipariş "kutu" olarak
   * gösterilir; tedarikçiye kutu ile sipariş verildiği için okunması kolaydır.
   */
  boxSize?: number;
  reason: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
}
