import { UserRole } from '../types';

export interface RolePermissions {
  canViewInventory: boolean;
  canEditInventory: boolean;
  canScanBarcode: boolean;
  canViewReports: boolean;
  canViewRecipes: boolean;
  canEditRecipes: boolean;
  canViewTraining: boolean;
  canManageFrozenStock: boolean;
  canManageBranches: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  'Barista': {
    canViewInventory: true,
    canEditInventory: true,
    canScanBarcode: true,
    canViewReports: false,
    canViewRecipes: true,
    canEditRecipes: true,
    canViewTraining: true,
    canManageFrozenStock: false,
    canManageBranches: false
  },
  'Şube Müdürü': {
    canViewInventory: true,
    canEditInventory: true,
    canScanBarcode: true,
    canViewReports: true,
    canViewRecipes: false,
    canEditRecipes: false,
    canViewTraining: false,
    canManageFrozenStock: true,
    canManageBranches: false
  },
  'Bölge Müdürü': {
    canViewInventory: true,
    canEditInventory: false,
    canScanBarcode: false,
    canViewReports: true,
    canViewRecipes: false,
    canEditRecipes: false,
    canViewTraining: false,
    canManageFrozenStock: false,
    canManageBranches: true
  }
};
