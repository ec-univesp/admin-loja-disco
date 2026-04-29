export interface Purchase {
  id: string;
  customerId: string;
  purchaseDate: string;
  supplier: string;
  totalValue: number;
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  recordId: string;
  purchasePrice: number;
}
