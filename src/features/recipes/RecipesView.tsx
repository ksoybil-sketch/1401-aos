import React, { useState } from 'react';
import { Recipe, RecipeIngredient } from '../../types';
import { useStore } from '../../store/useStore';
import { useSyncData } from '../../hooks/useSyncData';
import { ROLE_PERMISSIONS } from '../../constants/roles';

const formInputClass = "w-full py-[13px] px-3.5 border border-surface-border rounded-md text-[15px] bg-surface-0 text-content transition focus:outline-none focus:border-gold focus:bg-surface-2";
const formLabelClass = "text-xs font-bold text-content-secondary uppercase tracking-wide";
const modalOverlayClass = "fixed inset-0 bg-black/65 z-[200] flex justify-center items-end animate-[fadeIn_0.2s_ease]";
const modalContentClass = "w-full max-w-[480px] bg-surface-1 rounded-t-xl pt-4 shadow-[0_20px_48px_rgba(0,0,0,0.6)] max-h-[92vh] overflow-y-auto animate-[slideUp_0.35s_cubic-bezier(0.175,0.885,0.32,1.1)]";
const btnCloseClass = "bg-surface-2 border-none cursor-pointer text-content-muted flex items-center justify-center w-[30px] h-[30px] rounded-full transition active:bg-surface-border";

export const RecipesView: React.FC = () => {
  const { recipes, userRole } = useStore();
  const { updateRecipes } = useSyncData();
  const canEditRecipes = ROLE_PERMISSIONS[userRole].canEditRecipes;
  const [recipeCategoryFilter, setRecipeCategoryFilter] = useState('Hepsi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeForm, setShowRecipeForm] = useState(false);

  // Form State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Soğuk Kahveler');
  const [formIngredients, setFormIngredients] = useState<RecipeIngredient[]>([{ name: '', amount: '' }]);
  const [formInstructions, setFormInstructions] = useState('');

  const recipeCategories = ["Hepsi", "Soğuk Kahveler", "Sıcak Kahveler", "Soğuk İçecekler", "Sıcak İçecekler", "Yöresel Kahveler", "Demlenmiş Kahveler", "Bitki Çayları"];

  const filteredRecipes = recipes.filter((r) => {
    const matchesCategory = recipeCategoryFilter === 'Hepsi' || r.category === recipeCategoryFilter;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openRecipeAdd = () => {
    setFormId(`r-${Date.now()}`);
    setFormName('');
    setFormCategory('Soğuk Kahveler');
    setFormIngredients([{ name: '', amount: '' }]);
    setFormInstructions('');
    setShowRecipeForm(true);
  };

  const openRecipeEdit = (recipe: Recipe) => {
    setFormId(recipe.id);
    setFormName(recipe.name);
    setFormCategory(recipe.category);
    setFormIngredients(recipe.ingredients.length > 0 ? recipe.ingredients.map((i) => ({ ...i })) : [{ name: '', amount: '' }]);
    setFormInstructions(recipe.instructions);
    setSelectedRecipe(null);
    setShowRecipeForm(true);
  };

  const handleDeleteRecipe = (id: string) => {
    if (!window.confirm('Bu reçeteyi silmek istediğinize emin misiniz?')) return;
    const updatedRecipes = recipes.filter((r) => r.id !== id);
    updateRecipes(updatedRecipes);
    localStorage.setItem('skt_recipes', JSON.stringify(updatedRecipes));
    setSelectedRecipe(null);
  };

  const handleAddIngredientRow = () => {
    setFormIngredients([...formIngredients, { name: '', amount: '' }]);
  };

  const handleRemoveIngredientRow = (idx: number) => {
    setFormIngredients(formIngredients.filter((_, i) => i !== idx));
  };

  const handleIngredientChange = (idx: number, field: 'name' | 'amount', val: string) => {
    const next = [...formIngredients];
    next[idx][field] = val;
    setFormIngredients(next);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    const newRecipe: Recipe = {
      id: formId || `r-${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      ingredients: formIngredients.filter((i) => i.name.trim() !== ''),
      instructions: formInstructions.trim(),
      image: null
    };

    const updatedRecipes = [newRecipe, ...recipes.filter(r => r.id !== newRecipe.id)];
    updateRecipes(updatedRecipes);
    localStorage.setItem('skt_recipes', JSON.stringify(updatedRecipes));

    setShowRecipeForm(false);
  };

  return (
    <div>
      {/* Arama Alanı */}
      <div className="relative w-full mb-3">
        <svg className="absolute left-[13px] top-1/2 -translate-y-1/2 text-content-muted w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="w-full py-[11px] pr-3.5 pl-10 border border-surface-border rounded-md text-sm bg-surface-0 text-content transition placeholder:text-content-placeholder focus:outline-none focus:border-gold focus:bg-surface-2"
          placeholder="Reçete adı ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Kategori Sekmeleri */}
      <div className="flex gap-[7px] overflow-x-auto pb-0.5 mb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {recipeCategories.map((cat) => (
          <button
            key={cat}
            className={`py-[7px] px-3.5 border rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition ${recipeCategoryFilter === cat ? 'bg-ink text-surface-0 border-ink' : 'bg-surface-0 text-content-muted border-surface-border'}`}
            onClick={() => setRecipeCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Başlık ve Reçete Ekle Butonu */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm text-content-secondary">{filteredRecipes.length} Reçete</h3>
        {canEditRecipes && (
          <button onClick={openRecipeAdd} className="py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer bg-ink text-night w-auto active:bg-ink-hover active:scale-[0.98]">
            + Yeni Reçete
          </button>
        )}
      </div>

      {/* Reçete Izgarası */}
      <div className="flex flex-col gap-3">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="bg-surface-1 border border-surface-border rounded-lg overflow-hidden flex flex-row gap-3 p-3 cursor-pointer transition active:opacity-80" onClick={() => setSelectedRecipe(recipe)}>
            <div className="w-[60px] h-[60px] rounded-md bg-surface-2 flex-shrink-0 flex items-center justify-center text-content-muted text-[10px] text-center border border-surface-border-2">
              {recipe.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col justify-center flex-1">
              <div className="text-[15px] font-bold text-content mb-1">{recipe.name}</div>
              <div className="text-[11px] text-content-secondary font-semibold uppercase tracking-wide">{recipe.category}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Reçete Detay Modalı */}
      {selectedRecipe && (
        <div className={modalOverlayClass}>
          <div className={modalContentClass}>
            <div className="flex justify-between items-center px-5 pb-4 border-b border-surface-border-2 mb-5">
              <span className="text-xs text-content-muted font-semibold uppercase">{selectedRecipe.category}</span>
              <button onClick={() => setSelectedRecipe(null)} className={btnCloseClass}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="px-5 pb-10">
              <h2 className="text-xl font-extrabold text-ink mb-1">{selectedRecipe.name}</h2>

              <div className="text-[11px] uppercase tracking-[1.2px] text-gold mb-2 font-bold mt-5">MALZEMELER & ÖLÇÜLER</div>
              <ul className="list-none text-[13px] text-content-secondary p-0 m-0">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="py-2 border-b border-surface-border last:border-b-0 flex justify-between">
                    <span>{ing.name}</span>
                    <strong className="text-gold">{ing.amount}</strong>
                  </li>
                ))}
              </ul>

              <div className="text-[11px] uppercase tracking-[1.2px] text-gold mb-2 font-bold mt-5">HAZIRLANIŞI</div>
              <div className="bg-surface-1 p-3.5 rounded-md border-l-[3px] border-gold text-[13px] text-content-secondary leading-relaxed">{selectedRecipe.instructions}</div>

              {canEditRecipes && (
                <div className="flex gap-2.5 mt-5">
                  <button onClick={() => openRecipeEdit(selectedRecipe)} className="flex-1 py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-surface-2 text-content-secondary border border-surface-border active:bg-surface-border active:scale-[0.98]">
                    Düzenle
                  </button>
                  <button onClick={() => handleDeleteRecipe(selectedRecipe.id)} className="flex-1 py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-danger-bg text-danger border border-danger-border active:bg-[rgba(255,107,107,0.2)] active:scale-[0.98]">
                    Sil
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reçete Ekleme Modalı */}
      {showRecipeForm && (
        <div className={modalOverlayClass}>
          <div className={modalContentClass}>
            <div className="flex justify-between items-center px-5 pb-4 border-b border-surface-border-2 mb-5">
              <h2 className="text-[17px] font-bold text-ink tracking-tight">{recipes.some((r) => r.id === formId) ? 'Reçeteyi Düzenle' : 'Yeni Reçete Ekle'}</h2>
              <button onClick={() => setShowRecipeForm(false)} className={btnCloseClass}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="px-5 pb-10">
              <div className="flex flex-col gap-[7px] mb-3.5">
                <span className={formLabelClass}>İçecek Adı</span>
                <input
                  type="text"
                  className={formInputClass}
                  placeholder="Örn: White Chocolate Mocha"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-[7px] mb-3.5">
                <span className={formLabelClass}>Kategori</span>
                <select
                  className={formInputClass}
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                >
                  {recipeCategories.filter((c) => c !== 'Hepsi').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="text-[11px] uppercase tracking-[1.2px] text-gold mb-2 font-bold mt-5">Malzemeler</div>
              {formIngredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2 mb-2.5">
                  <input
                    type="text"
                    className={`${formInputClass} flex-1`}
                    placeholder="Malzeme Adı (Örn: Espresso)"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className={`${formInputClass} flex-1`}
                    placeholder="Miktar (Örn: 40 ml)"
                    value={ing.amount}
                    onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                    required
                  />
                  {formIngredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredientRow(idx)}
                      className="w-11 h-11 rounded-md bg-[rgba(255,59,48,0.1)] text-danger border border-[rgba(255,59,48,0.2)] flex items-center justify-center cursor-pointer transition-opacity active:opacity-70 flex-shrink-0"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddIngredientRow}
                className="w-full py-2 mb-4 rounded-md text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-surface-2 text-content-secondary border border-surface-border active:bg-surface-border active:scale-[0.98]"
              >
                + Malzeme Ekle
              </button>

              <div className="flex flex-col gap-[7px] mb-3.5">
                <span className={formLabelClass}>Hazırlanış / Reçete Detayı</span>
                <textarea
                  className={`${formInputClass} h-20 resize-y`}
                  placeholder="İçeceğin hazırlanış adımlarını yazın..."
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2.5 mt-5">
                <button type="button" onClick={() => setShowRecipeForm(false)} className="flex-1 py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-surface-2 text-content-secondary border border-surface-border active:bg-surface-border active:scale-[0.98]">
                  İptal
                </button>
                <button type="submit" className="flex-1 py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-ink text-night active:bg-ink-hover active:scale-[0.98]">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
