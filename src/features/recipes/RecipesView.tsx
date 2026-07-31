import React, { useState } from 'react';
import { Recipe, RecipeIngredient } from '../../types';
import { useStore } from '../../store/useStore';
import { useSyncData } from '../../hooks/useSyncData';
import { ROLE_PERMISSIONS } from '../../constants/roles';

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
      <div className="search-input-wrapper" style={{ marginBottom: '12px' }}>
        <svg className="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Reçete adı ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Kategori Sekmeleri */}
      <div className="filter-tabs" style={{ marginBottom: '16px' }}>
        {recipeCategories.map((cat) => (
          <button
            key={cat}
            className={`filter-tab ${recipeCategoryFilter === cat ? 'active' : ''}`}
            onClick={() => setRecipeCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Başlık ve Reçete Ekle Butonu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{filteredRecipes.length} Reçete</h3>
        {canEditRecipes && (
          <button onClick={openRecipeAdd} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', width: 'auto' }}>
            + Yeni Reçete
          </button>
        )}
      </div>

      {/* Reçete Izgarası */}
      <div className="recipes-grid">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card" onClick={() => setSelectedRecipe(recipe)}>
            <div className="recipe-img-thumb">
              {recipe.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="recipe-info">
              <div className="recipe-name">{recipe.name}</div>
              <div className="recipe-cat">{recipe.category}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Reçete Detay Modalı */}
      {selectedRecipe && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="recipe-detail-cat">{selectedRecipe.category}</span>
              <button onClick={() => setSelectedRecipe(null)} className="btn-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-inner">
              <h2 className="recipe-detail-header">{selectedRecipe.name}</h2>

              <div className="recipe-section-title">MALZEMELER & ÖLÇÜLER</div>
              <ul className="recipe-ing-list">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    <span>{ing.name}</span>
                    <strong style={{ color: 'var(--accent)' }}>{ing.amount}</strong>
                  </li>
                ))}
              </ul>

              <div className="recipe-section-title">HAZIRLANIŞI</div>
              <div className="recipe-tech">{selectedRecipe.instructions}</div>

              {canEditRecipes && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button onClick={() => openRecipeEdit(selectedRecipe)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Düzenle
                  </button>
                  <button onClick={() => handleDeleteRecipe(selectedRecipe.id)} className="btn btn-danger" style={{ flex: 1 }}>
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
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{recipes.some((r) => r.id === formId) ? 'Reçeteyi Düzenle' : 'Yeni Reçete Ekle'}</h2>
              <button onClick={() => setShowRecipeForm(false)} className="btn-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-inner">
              <div className="form-group">
                <span className="form-label">İçecek Adı</span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Örn: White Chocolate Mocha"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <span className="form-label">Kategori</span>
                <select
                  className="form-select"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                >
                  {recipeCategories.filter((c) => c !== 'Hepsi').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="recipe-section-title">Malzemeler</div>
              {formIngredients.map((ing, idx) => (
                <div key={idx} className="recipe-form-row">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Malzeme Adı (Örn: Espresso)"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Miktar (Örn: 40 ml)"
                    value={ing.amount}
                    onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                    required
                  />
                  {formIngredients.length > 1 && (
                    <button type="button" onClick={() => handleRemoveIngredientRow(idx)} className="btn-icon-small">
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddIngredientRow}
                className="btn btn-secondary"
                style={{ marginBottom: '16px', fontSize: '13px', padding: '8px' }}
              >
                + Malzeme Ekle
              </button>

              <div className="form-group">
                <span className="form-label">Hazırlanış / Reçete Detayı</span>
                <textarea
                  className="form-input"
                  style={{ height: '80px', resize: 'vertical' }}
                  placeholder="İçeceğin hazırlanış adımlarını yazın..."
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowRecipeForm(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  İptal
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
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
