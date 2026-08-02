import { create } from 'zustand';
import { Recipe, QuizResult } from '../types';

interface AppState {
  recipes: Recipe[];
  quizResults: QuizResult[];
  productMappings: Record<string, { name: string; category: string }>;
  setRecipes: (data: Recipe[]) => void;
  setQuizResults: (data: QuizResult[]) => void;
  setProductMappings: (mappings: Record<string, { name: string; category: string }>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Gerçek veri Firebase'den gelir. Örnek reçete/sonuç tohumlamıyoruz:
  // çevrimdışı bir cihazda 3 reçete göstermek "76 reçete var" gerçeğini gizler.
  recipes: [],
  quizResults: [],
  productMappings: {},
  setRecipes: (data) => set({ recipes: data }),
  setQuizResults: (data) => set({ quizResults: data }),
  setProductMappings: (mappings) => set({ productMappings: mappings }),
}));
