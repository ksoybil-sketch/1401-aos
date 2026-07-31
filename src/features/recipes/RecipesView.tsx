import React, { useState } from 'react';
import { Recipe, RecipeIngredient } from '../../types';
import { useStore } from '../../store/useStore';
import { useSyncData } from '../../hooks/useSyncData';
import { ROLE_PERMISSIONS } from '../../constants/roles';
import {
  btn, btnDanger, btnLg, btnPrimary, btnSecondary, btnSm, cardInteractive,
  chip, chipActive, chipIdle, emptyState, emptyText, field, iconBtn, input, label,
  modalBody, modalGrabber, modalHeader, modalOverlay, modalPanel, modalTitle, textarea
} from '../../constants/ui';

const sectionTitle = 'text-[11px] uppercase tracking-[0.14em] text-gold font-bold mt-6 mb-2.5';

export const RecipesView: React.FC = () => {
  const { recipes, userRole } = useStore();
  const { saveRecipe, deleteRecipe } = useSyncData();
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
    deleteRecipe(id);
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

    saveRecipe(newRecipe);

    setShowRecipeForm(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Arama Alanı */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted w-4 h-4 pointer-events-none"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className={`${input} pl-11`}
          placeholder="Reçete adı ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Kategori Sekmeleri */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {recipeCategories.map((cat) => (
          <button
            key={cat}
            className={`${chip} ${recipeCategoryFilter === cat ? chipActive : chipIdle}`}
            onClick={() => setRecipeCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Başlık ve Reçete Ekle Butonu */}
      <div className="flex justify-between items-center gap-3">
        <h3 className="text-sm font-semibold text-content-secondary">{filteredRecipes.length} Reçete</h3>
        {canEditRecipes && (
          <button onClick={openRecipeAdd} className={`${btn} ${btnPrimary} ${btnSm} shrink-0`}>
            + Yeni Reçete
          </button>
        )}
      </div>

      {/* Reçete Izgarası */}
      {filteredRecipes.length === 0 ? (
        <div className={emptyState}>
          <div className="text-4xl opacity-40">📖</div>
          <p className={emptyText}>Aradığınız kritere uygun reçete bulunamadı.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className={`${cardInteractive} p-3.5 flex flex-row items-center gap-3.5`}
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-gold/25 to-gold/5 border border-gold/20 flex items-center justify-center text-gold text-sm font-extrabold tracking-wide">
                {recipe.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <div className="text-[15px] font-bold text-content truncate">{recipe.name}</div>
                <div className="text-[11px] text-content-muted font-semibold uppercase tracking-[0.08em] mt-1">
                  {recipe.category}
                </div>
              </div>
              <span className="text-content-muted shrink-0">›</span>
            </div>
          ))}
        </div>
      )}

      {/* Reçete Detay Modalı */}
      {selectedRecipe && (
        <div className={modalOverlay}>
          <div className={modalPanel}>
            <div className={modalGrabber} />
            <div className={modalHeader}>
              <span className="text-[11px] text-gold font-bold uppercase tracking-[0.14em]">
                {selectedRecipe.category}
              </span>
              <button onClick={() => setSelectedRecipe(null)} className={iconBtn} aria-label="Kapat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={modalBody}>
              <h2 className="text-2xl font-extrabold text-content tracking-tight">{selectedRecipe.name}</h2>

              <div className={sectionTitle}>Malzemeler &amp; Ölçüler</div>
              <ul className="list-none p-0 m-0 rounded-2xl border border-hairline overflow-hidden">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center gap-3 px-4 py-3 text-[13px] bg-glass border-b border-hairline last:border-b-0"
                  >
                    <span className="text-content-secondary">{ing.name}</span>
                    <strong className="text-gold shrink-0">{ing.amount}</strong>
                  </li>
                ))}
              </ul>

              <div className={sectionTitle}>Hazırlanışı</div>
              <div className="bg-glass border border-hairline border-l-[3px] border-l-gold rounded-2xl p-4 text-[13px] text-content-secondary leading-relaxed">
                {selectedRecipe.instructions}
              </div>

              {canEditRecipes && (
                <div className="flex gap-3 mt-6">
                  <button onClick={() => openRecipeEdit(selectedRecipe)} className={`${btn} ${btnSecondary} ${btnLg} flex-1`}>
                    Düzenle
                  </button>
                  <button onClick={() => handleDeleteRecipe(selectedRecipe.id)} className={`${btn} ${btnDanger} ${btnLg} flex-1`}>
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
        <div className={modalOverlay}>
          <div className={modalPanel}>
            <div className={modalGrabber} />
            <div className={modalHeader}>
              <h2 className={modalTitle}>
                {recipes.some((r) => r.id === formId) ? 'Reçeteyi Düzenle' : 'Yeni Reçete Ekle'}
              </h2>
              <button onClick={() => setShowRecipeForm(false)} className={iconBtn} aria-label="Kapat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className={`${modalBody} flex flex-col gap-4`}>
              <div className={field}>
                <span className={label}>İçecek Adı</span>
                <input
                  type="text"
                  className={input}
                  placeholder="Örn: White Chocolate Mocha"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div className={field}>
                <span className={label}>Kategori</span>
                <select
                  className={input}
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                >
                  {recipeCategories.filter((c) => c !== 'Hepsi').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className={`${sectionTitle} mt-2`}>Malzemeler</div>
                <div className="flex flex-col gap-2.5">
                  {formIngredients.map((ing, idx) => (
                    <div key={idx} className="flex gap-2.5">
                      <input
                        type="text"
                        className={`${input} flex-1 min-w-0`}
                        placeholder="Malzeme Adı"
                        value={ing.name}
                        onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className={`${input} flex-1 min-w-0`}
                        placeholder="Miktar"
                        value={ing.amount}
                        onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                        required
                      />
                      {formIngredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredientRow(idx)}
                          className="w-13 h-13 shrink-0 rounded-2xl bg-danger-bg text-danger border border-danger-border flex items-center justify-center cursor-pointer transition-all hover:bg-danger/20 active:scale-90"
                          aria-label="Malzemeyi kaldır"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddIngredientRow}
                  className={`${btn} ${btnSecondary} ${btnSm} w-full mt-3`}
                >
                  + Malzeme Ekle
                </button>
              </div>

              <div className={field}>
                <span className={label}>Hazırlanış / Reçete Detayı</span>
                <textarea
                  className={textarea}
                  placeholder="İçeceğin hazırlanış adımlarını yazın..."
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowRecipeForm(false)} className={`${btn} ${btnSecondary} ${btnLg} flex-1`}>
                  İptal
                </button>
                <button type="submit" className={`${btn} ${btnPrimary} ${btnLg} flex-1`}>
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
