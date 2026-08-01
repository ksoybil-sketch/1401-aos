import React, { useState } from 'react';
import { Recipe, RecipeIngredient } from '../../types';
import { useStore } from '../../store/useStore';
import { useSyncData } from '../../hooks/useSyncData';
import { ROLE_PERMISSIONS } from '../../constants/roles';
import { Icon } from '../../components/Icon';
import {
  btn, btnDanger, btnLg, btnPrimary, btnSecondary, btnSm, chip, chipOff, chipOn,
  emptyState, emptyText, field, iconBtn, input, label, listGroup, listRow,
  modalBody, modalGrabber, modalHeader, modalOverlay, modalPanel, modalTitle,
  rowChevron, screenTitle, scrollX, sectionLabel, textarea
} from '../../constants/ui';

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
    <div className="flex flex-col gap-3.5">
      {/* Başlık */}
      <div className="flex justify-between items-center gap-3 mt-0.5">
        <h2 className={screenTitle}>Reçeteler</h2>
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[12px] text-fg-3 tnum">{filteredRecipes.length}</span>
          {canEditRecipes && (
            <button onClick={openRecipeAdd} className={`${btn} ${btnPrimary} ${btnSm}`}>
              <Icon name="plus" size={14} />
              Yeni
            </button>
          )}
        </div>
      </div>

      {/* Arama */}
      <div className="relative">
        <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-3 pointer-events-none" />
        <input
          type="text"
          className={`${input} pl-10`}
          placeholder="Reçete ara"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Kategori sekmeleri */}
      <div className={scrollX}>
        {recipeCategories.map((cat) => (
          <button
            key={cat}
            className={`${chip} ${recipeCategoryFilter === cat ? chipOn : chipOff}`}
            onClick={() => setRecipeCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filteredRecipes.length === 0 ? (
        <div className={emptyState}>
          <Icon name="book" size={26} className="text-fg-3" />
          <p className={emptyText}>Aradığınız kritere uygun reçete bulunamadı.</p>
        </div>
      ) : (
        <div className={listGroup}>
          {filteredRecipes.map((recipe) => (
            <button key={recipe.id} className={listRow} onClick={() => setSelectedRecipe(recipe)}>
              <span className="w-9 h-9 shrink-0 rounded-lg bg-panel-2 border border-line flex items-center justify-center text-fg-2 text-[11px] font-semibold tracking-wide">
                {recipe.name.substring(0, 2).toUpperCase()}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[15px] font-medium text-crema truncate">{recipe.name}</span>
                <span className="block text-[12px] text-fg-3 mt-0.5 truncate">{recipe.category}</span>
              </span>
              <Icon name="chevronRight" size={16} className={rowChevron} />
            </button>
          ))}
        </div>
      )}

      {/* Reçete Detay Modalı */}
      {selectedRecipe && (
        <div className={modalOverlay}>
          <div className={modalPanel}>
            <div className={modalGrabber} />
            <div className={modalHeader}>
              <span className="text-[12px] text-fg-3 font-medium">{selectedRecipe.category}</span>
              <button onClick={() => setSelectedRecipe(null)} className={iconBtn} aria-label="Kapat">
                <Icon name="close" size={16} />
              </button>
            </div>
            <div className={modalBody}>
              <h2 className="text-[22px] font-bold text-crema tracking-tight">{selectedRecipe.name}</h2>

              <div className={`${sectionLabel} mt-6 mb-2 px-0`}>Malzemeler</div>
              <ul className="list-none p-0 m-0 rounded-xl border border-line overflow-hidden divide-y divide-line">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between items-center gap-3 px-3.5 py-2.5 text-[14px]">
                    <span className="text-fg-2">{ing.name}</span>
                    <span className="text-crema font-medium shrink-0 tnum">{ing.amount}</span>
                  </li>
                ))}
              </ul>

              <div className={`${sectionLabel} mt-6 mb-2 px-0`}>Hazırlanışı</div>
              <div className="rounded-xl border border-line bg-panel p-3.5 text-[14px] text-fg-2 leading-relaxed">
                {selectedRecipe.instructions}
              </div>

              {canEditRecipes && (
                <div className="flex gap-2.5 mt-6">
                  <button onClick={() => openRecipeEdit(selectedRecipe)} className={`${btn} ${btnSecondary} ${btnLg} flex-1`}>
                    <Icon name="edit" size={16} />
                    Düzenle
                  </button>
                  <button onClick={() => handleDeleteRecipe(selectedRecipe.id)} className={`${btn} ${btnDanger} ${btnLg} flex-1`}>
                    <Icon name="trash" size={16} />
                    Sil
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reçete Ekleme / Düzenleme Modalı */}
      {showRecipeForm && (
        <div className={modalOverlay}>
          <div className={modalPanel}>
            <div className={modalGrabber} />
            <div className={modalHeader}>
              <h2 className={modalTitle}>
                {recipes.some((r) => r.id === formId) ? 'Reçeteyi Düzenle' : 'Yeni Reçete'}
              </h2>
              <button onClick={() => setShowRecipeForm(false)} className={iconBtn} aria-label="Kapat">
                <Icon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className={`${modalBody} flex flex-col gap-3.5`}>
              <div className={field}>
                <span className={label}>İçecek adı</span>
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

              <div className={field}>
                <span className={label}>Malzemeler</span>
                <div className="flex flex-col gap-2">
                  {formIngredients.map((ing, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        className={`${input} flex-1 min-w-0`}
                        placeholder="Malzeme"
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
                          className="w-11 h-11 shrink-0 rounded-lg bg-negative-bg text-negative border border-negative-line flex items-center justify-center cursor-pointer transition-colors hover:bg-negative/20 active:opacity-80"
                          aria-label="Malzemeyi kaldır"
                        >
                          <Icon name="close" size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddIngredientRow}
                  className={`${btn} ${btnSecondary} ${btnSm} w-full mt-1`}
                >
                  <Icon name="plus" size={14} />
                  Malzeme ekle
                </button>
              </div>

              <div className={field}>
                <span className={label}>Hazırlanış</span>
                <textarea
                  className={textarea}
                  placeholder="İçeceğin hazırlanış adımlarını yazın…"
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2.5 mt-1.5">
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
