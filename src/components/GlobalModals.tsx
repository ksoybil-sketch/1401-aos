import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { useSyncStore } from '../store/useSyncStore';
import { useInventoryManager } from '../hooks/useInventoryManager';
import { useSyncData } from '../hooks/useSyncData';
import { CATEGORIES } from '../constants';
import { lookupProductByBarcode } from '../utils/barcodeLookup';

import { BranchModal } from './modals/BranchModal';
import { DeleteModal } from './modals/DeleteModal';
import { AddProductModal } from './modals/AddProductModal';
import { CsvModal } from './modals/CsvModal';
import { SmartReorderModal } from '../features/reorder/SmartReorderModal';
import { FrozenModal } from './modals/FrozenModal';

// Dummy Filesystem / Share for CSV export if needed
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export const GlobalModals: React.FC = () => {
  const { activeBranchId, setBranch, inventory, frozenStock, transactionLog, productMappings, setProductMappings } = useStore();
  
  const {
    showBranchModal, showAddModal, showDeleteModal, showCsvModal, showSmartReorderModal, showFrozenModal,
    scannedBarcode, itemToDelete, setModalState
  } = useUIStore();

  const { addInventoryItem, addFrozenItem, deleteItem } = useInventoryManager();
  const { updateInventory } = useSyncData();
  const isOnline = useSyncStore((state) => state.isOnline);

  // Local state for Add Product Modal (since it's a form)
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState(CATEGORIES[0]);
  const [expirationDate, setExpirationDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState(1);
  const [isLookingUpProduct, setIsLookingUpProduct] = useState(false);
  const isNewProduct = !productMappings[scannedBarcode];

  // Auto-fill form when barcode changes
  React.useEffect(() => {
    if (scannedBarcode && productMappings[scannedBarcode]) {
      setProductName(productMappings[scannedBarcode].name);
      setProductCategory(productMappings[scannedBarcode].category);
    } else {
      setProductName('');
      const isTeshir = scannedBarcode?.startsWith('VITRIN-');
      if (isTeshir) {
        setProductCategory('Teşhir Dolabı');
        // Teşhir Dolabı ürünleri kısa raf ömürlü: varsayılan SKT bugünden 3 gün sonrası
        const exp = new Date();
        exp.setDate(exp.getDate() + 3);
        setExpirationDate(exp.toISOString().split('T')[0]);
      } else {
        setProductCategory(CATEGORIES[0]);
        setExpirationDate(new Date().toISOString().split('T')[0]);
      }

      // Yeni ve bilinmeyen bir barkod ise (Teşhir Dolabı hariç), internetten ürün adı ara
      if (scannedBarcode && !isTeshir && isOnline) {
        let cancelled = false;
        setIsLookingUpProduct(true);
        lookupProductByBarcode(scannedBarcode).then((result) => {
          if (cancelled || useUIStore.getState().scannedBarcode !== scannedBarcode) return;
          if (result) setProductName(result.name);
        }).finally(() => {
          if (!cancelled) setIsLookingUpProduct(false);
        });
        return () => { cancelled = true; };
      }
      setQuantity(1);
      return;
    }
    setExpirationDate(new Date().toISOString().split('T')[0]);
    setQuantity(1);
  }, [scannedBarcode, productMappings, isOnline]);

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !expirationDate) return;
    
    const { feedbackMsg } = addInventoryItem(scannedBarcode, productName, productCategory, quantity, expirationDate);
    if (feedbackMsg) {
      useUIStore.getState().setFrozenFeedback(feedbackMsg);
    }
    setModalState('showAddModal', false);
  };

  const handleSelectBranch = (branchId: string) => {
    setBranch(branchId);
    localStorage.setItem('skt_branch_id', branchId);
    setModalState('showBranchModal', false);
  };

  const handleExportCSV = async () => {
    // CSV logic
    let csv = "\uFEFFBarkod,Urun Adi,Kategori,Miktar,SKT,Eklenme Tarihi\n";
    inventory.forEach(item => {
      csv += `"${item.barcode}","${item.name}","${item.category}",${item.quantity},"${item.expirationDate}","${item.dateAdded}"\n`;
    });
    const fileName = `skt_envanter_${activeBranchId}_${new Date().toISOString().split('T')[0]}.csv`;
    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: csv,
        directory: Directory.Cache,
        encoding: Encoding.UTF8
      });
      await Share.share({
        title: 'SKT Envanter Raporu',
        text: 'Ekteki SKT envanter CSV dosyasını bulabilirsiniz.',
        url: result.uri,
        dialogTitle: 'CSV Dosyasını Paylaş'
      });
    } catch (e) {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    }
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;
      
      const lines = text.split('\n');
      const newItems = [];
      
      // Skip header (line 0)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Match standard CSV format respecting quotes
        // "Barkod","Urun Adi","Kategori",Miktar,"SKT","Eklenme Tarihi"
        const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (cols && cols.length >= 6) {
          const barcode = cols[0].replace(/^"|"$/g, '').trim();
          const name = cols[1].replace(/^"|"$/g, '').trim();
          const category = cols[2].replace(/^"|"$/g, '').trim();
          const qty = parseInt(cols[3], 10);
          const expDate = cols[4].replace(/^"|"$/g, '').trim();
          const dateAdded = cols[5].replace(/^"|"$/g, '').trim();
          
          if (barcode && name) {
            newItems.push({
              id: `${Date.now()}-${Math.random()}`,
              barcode,
              name,
              category,
              quantity: isNaN(qty) ? 1 : qty,
              expirationDate: expDate || new Date().toISOString().split('T')[0],
              dateAdded: dateAdded || new Date().toISOString().split('T')[0]
            });
          }
        }
      }

      if (newItems.length > 0) {
        updateInventory([...inventory, ...newItems]);
        setModalState('showCsvModal', false);
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  return (
    <>
      {showBranchModal && (
        <BranchModal
          currentBranchId={activeBranchId}
          onClose={() => setModalState('showBranchModal', false)}
          onSelectBranch={handleSelectBranch}
        />
      )}
      {showDeleteModal && itemToDelete && (
        <DeleteModal
          item={itemToDelete as any}
          onClose={() => setModalState('showDeleteModal', false)}
          onConfirm={(deleteAll, qty, reason) => {
            deleteItem(itemToDelete, deleteAll, qty, reason);
            setModalState('showDeleteModal', false);
          }}
        />
      )}
      {showAddModal && (
        <AddProductModal
          scannedBarcode={scannedBarcode}
          productName={productName}
          productCategory={productCategory}
          expirationDate={expirationDate}
          quantity={quantity}
          isNewProduct={isNewProduct}
          isLookingUpProduct={isLookingUpProduct}
          onClose={() => setModalState('showAddModal', false)}
          onSetProductName={setProductName}
          onSetProductCategory={setProductCategory}
          onSetExpirationDate={setExpirationDate}
          onSetQuantity={setQuantity}
          onSubmit={handleAddItemSubmit}
        />
      )}
      {showCsvModal && (
        <CsvModal
          onClose={() => setModalState('showCsvModal', false)}
          onExportCSV={handleExportCSV}
          onImportCSV={handleImportCSV}
        />
      )}
      {showSmartReorderModal && (
        <SmartReorderModal
          inventory={inventory}
          frozenStock={frozenStock}
          transactionLog={transactionLog}
          onClose={() => setModalState('showSmartReorderModal', false)}
        />
      )}
      {showFrozenModal && (
        <FrozenModal
          onClose={() => setModalState('showFrozenModal', false)}
          onAdd={(name, qty) => {
            addFrozenItem(name, qty);
            setModalState('showFrozenModal', false);
          }}
        />
      )}
    </>
  );
};
