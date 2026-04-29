export interface Sale {
  id: string;
  customerId: string;
  addressId: string;
  saleDate: string;
  shipping: number;
  totalValue: number;
  payment: string;
  salesChannelId: string;
  additionalCosts: number;
  orderStatus: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  recordId: string;
  salePrice: number;
}