import { useStore } from '../store/useStore';
import { useSyncData } from './useSyncData';
import { InventoryItem, FrozenItem, TransactionLogItem } from '../types';
import { areProductsMatching } from '../utils/matching';

export const useInventoryManager = () => {
  const {
    inventory,
    frozenStock,
    transactionLog,
    activeBarista,
    userRole,
    productMappings
  } = useStore();

  const { updateInventory, updateFrozenStock, updateTransactionLog, updateProductMappings } = useSyncData();

  const getPerformerName = () => {
    return activeBarista ? activeBarista.name : userRole;
  };

  const addInventoryItem = (
    barcode: string,
    name: string,
    category: string,
    quantity: number,
    expirationDate: string
  ): { feedbackMsg?: string } => {
    // 1. Update Product Mappings (Memory & LocalStorage)
    const updatedMappings = {
      ...productMappings,
      [barcode]: { name, category }
    };
    updateProductMappings(updatedMappings);
    localStorage.setItem('skt_product_mappings', JSON.stringify(updatedMappings));

    // 2. Add to Inventory
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      barcode,
      name,
      category,
      quantity,
      expirationDate,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    const updatedInventory = [...inventory, newItem];
    // updateInventory zaten native SKT-bildirim köprüsünü tetikliyor
    // (bkz. useSyncData.ts) — burada ayrıca çağırmaya gerek yok.
    updateInventory(updatedInventory);

    // 3. Handle Frozen to Display "Smart Deduction"
    let feedbackMsg = '';
    if (category === 'Teşhir Dolabı') {
      const addedQty = quantity;
      const matchedFrozen = frozenStock.find(f => areProductsMatching(f.name, name));
      
      if (matchedFrozen) {
        let updatedFrozen: FrozenItem[];
        const actualConsumed = Math.min(matchedFrozen.quantity, addedQty);

        const newLog: TransactionLogItem = {
          id: `${Date.now()}-frozen-consumed`,
          date: new Date().toISOString(),
          productName: matchedFrozen.name,
          quantity: actualConsumed,
          type: 'CONSUMED',
          reason: 'Teşhir Dolabına Eklendi',
          performedBy: getPerformerName()
        };

        updateTransactionLog([newLog, ...transactionLog]);

        if (matchedFrozen.quantity <= addedQty) {
          updatedFrozen = frozenStock.filter(f => f.id !== matchedFrozen.id);
          feedbackMsg = `Donuk stoktan "${matchedFrozen.name}" tamamen tüketildi (${matchedFrozen.quantity} adet).`;
        } else {
          updatedFrozen = frozenStock.map(f =>
            f.id === matchedFrozen.id ? { ...f, quantity: f.quantity - addedQty } : f
          );
          feedbackMsg = `Donuk stoktan "${matchedFrozen.name}" için ${addedQty} adet düşüldü. Kalan: ${matchedFrozen.quantity - addedQty} adet.`;
        }
        updateFrozenStock(updatedFrozen);
      }
    }

    return { feedbackMsg };
  };

  const addFrozenItem = (name: string, quantity: number, customExpirationDate?: string) => {
    let expirationDate = customExpirationDate;
    if (!expirationDate) {
      const exp = new Date();
      exp.setMonth(exp.getMonth() + 6); // Default 6 months for frozen
      expirationDate = exp.toISOString().split('T')[0];
    }
    const newItem: FrozenItem = {
      id: `${Date.now()}-frozen`,
      name,
      quantity,
      expirationDate,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    const updated = [...frozenStock, newItem];
    const newLog: TransactionLogItem = {
      id: `${Date.now()}-frozen-added`,
      date: new Date().toISOString(),
      productName: name,
      quantity,
      type: 'ADDED',
      reason: 'Stok Girişi',
      performedBy: getPerformerName()
    };
    
    updateTransactionLog([newLog, ...transactionLog]);
    updateFrozenStock(updated);
  };

  const deleteItem = (itemToDelete: InventoryItem & { isFrozen?: boolean }, deleteAll: boolean, quantityToRemove: number, reason: string) => {
    const isFrozen = itemToDelete.isFrozen === true;
    const qtyRemoved = deleteAll ? itemToDelete.quantity : quantityToRemove;

    const targetList = isFrozen ? [...frozenStock] : [...inventory];
    let updatedList: any[];

    if (deleteAll || quantityToRemove >= itemToDelete.quantity) {
      updatedList = targetList.filter(i => i.id !== itemToDelete.id);
    } else {
      updatedList = targetList.map(i => {
        if (i.id === itemToDelete.id) {
          return { ...i, quantity: i.quantity - quantityToRemove };
        }
        return i;
      });
    }

    let logType: 'CONSUMED' | 'EXPIRED' | 'CORRECTION' = 'CONSUMED';
    if (reason === 'Hatalı Giriş / Düzeltme') logType = 'CORRECTION';
    else if (reason.includes('Zayi') || reason.includes('Geçti') || reason.includes('Hasarlı')) logType = 'EXPIRED';

    const newLog: TransactionLogItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      productName: itemToDelete.name,
      quantity: qtyRemoved,
      type: logType,
      reason,
      performedBy: getPerformerName()
    };

    updateTransactionLog([newLog, ...transactionLog]);

    if (isFrozen) {
      updateFrozenStock(updatedList as FrozenItem[]);
    } else {
      updateInventory(updatedList as InventoryItem[]);
    }
  };

  return {
    addInventoryItem,
    addFrozenItem,
    deleteItem
  };
};
