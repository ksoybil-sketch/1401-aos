import { create } from 'zustand';
import { Recipe, QuizResult } from '../types';
import { DEMO_RECIPES, DEMO_QUIZ_RESULTS } from '../constants';

interface AppState {
  recipes: Recipe[];
  quizResults: QuizResult[];
  productMappings: Record<string, { name: string; category: string }>;
  setRecipes: (data: Recipe[]) => void;
  setQuizResults: (data: QuizResult[]) => void;
  setProductMappings: (mappings: Record<string, { name: string; category: string }>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  recipes: DEMO_RECIPES,
  quizResults: DEMO_QUIZ_RESULTS,
  productMappings: {},
  setRecipes: (data) => set({ recipes: data }),
  setQuizResults: (data) => set({ quizResults: data }),
  setProductMappings: (mappings) => set({ productMappings: mappings }),
}));
