import { useMemo } from 'react';
import { useAppStore } from '@/shared/store/appStore';

export const useRecordsStore = () => {
  const records = useAppStore((state) => state.records);
  const artists = useAppStore((state) => state.artists);
  const musicGenres = useAppStore((state) => state.musicGenres);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchRecords = useAppStore((state) => state.fetchRecords);
  const createRecord = useAppStore((state) => state.createRecord);
  const updateRecord = useAppStore((state) => state.updateRecord);
  const deleteRecord = useAppStore((state) => state.deleteRecord);

  const recordsWithArtist = useMemo(
    () =>
      records.map((record) => {
        const artist = artists.find((a) => a.id === record.artistId);
        const genre = record.genreId
          ? musicGenres.find((g) => g.id === record.genreId)
          : undefined;
        return {
          ...record,
          artistName: artist?.name || 'Unknown',
          genreName: genre?.name || '',
        };
      }),
    [records, artists, musicGenres]
  );

  return {
    records,
    recordsWithArtist,
    loading,
    error,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
  };
};

export const useSalesStore = () => {
  const sales = useAppStore((state) => state.sales);
  const customers = useAppStore((state) => state.customers);
  const addresses = useAppStore((state) => state.addresses);
  const saleItems = useAppStore((state) => state.saleItems);
  const records = useAppStore((state) => state.records);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchSales = useAppStore((state) => state.fetchSales);
  const createSale = useAppStore((state) => state.createSale);
  const updateSale = useAppStore((state) => state.updateSale);
  const deleteSale = useAppStore((state) => state.deleteSale);

  const salesWithDetails = useMemo(
    () =>
      sales.map((sale) => {
        const customer = customers.find((c) => c.id === sale.customerId);
        const address = addresses.find((e) => e.id === sale.addressId);
        const products = saleItems
          .filter((i) => i.saleId === sale.id)
          .map((i) => records.find((d) => d.id === i.recordId)?.album)
          .filter((album): album is string => !!album);
        const fullAddress = address
          ? `${address.street}, ${address.number} - ${address.city}/${address.state}`
          : 'Endereço não informado';
        return {
          ...sale,
          customerName: customer?.name || 'Desconhecido',
          addressCity: address?.city || 'Cidade desconhecida',
          fullAddress,
          products,
          productsSummary:
            products.length === 0
              ? '—'
              : products.length === 1
                ? products[0]
                : `${products[0]} +${products.length - 1}`,
        };
      }),
    [sales, customers, addresses, saleItems, records]
  );

  return {
    sales,
    salesWithDetails,
    loading,
    error,
    fetchSales,
    createSale,
    updateSale,
    deleteSale,
  };
};

export const useSaleItemsStore = () => {
  const saleItems = useAppStore((state) => state.saleItems);
  const records = useAppStore((state) => state.records);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchSaleItems = useAppStore((state) => state.fetchSaleItems);
  const createSaleItem = useAppStore((state) => state.createSaleItem);
  const deleteSaleItem = useAppStore((state) => state.deleteSaleItem);

  const saleItemsWithDetails = useMemo(
    () =>
      saleItems.map((item) => {
        const record = records.find((d) => d.id === item.recordId);
        return {
          ...item,
          recordAlbum: record?.album || 'Unknown',
          recordMarketValue: record?.marketValue || 0,
        };
      }),
    [saleItems, records]
  );

  return {
    saleItems,
    saleItemsWithDetails,
    loading,
    error,
    fetchSaleItems,
    createSaleItem,
    deleteSaleItem,
  };
};

export const usePurchasesStore = () => {
  const purchases = useAppStore((state) => state.purchases);
  const customers = useAppStore((state) => state.customers);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchPurchases = useAppStore((state) => state.fetchPurchases);
  const createPurchase = useAppStore((state) => state.createPurchase);
  const updatePurchase = useAppStore((state) => state.updatePurchase);
  const deletePurchase = useAppStore((state) => state.deletePurchase);

  const purchasesWithDetails = useMemo(
    () =>
      purchases.map((purchase) => {
        const customer = customers.find((c) => c.id === purchase.customerId);
        return {
          ...purchase,
          customerName: customer?.name || 'Unknown',
        };
      }),
    [purchases, customers]
  );

  return {
    purchases,
    purchasesWithDetails,
    loading,
    error,
    fetchPurchases,
    createPurchase,
    updatePurchase,
    deletePurchase,
  };
};

export const usePurchaseItemsStore = () => {
  const purchaseItems = useAppStore((state) => state.purchaseItems);
  const records = useAppStore((state) => state.records);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchPurchaseItems = useAppStore((state) => state.fetchPurchaseItems);
  const createPurchaseItem = useAppStore((state) => state.createPurchaseItem);
  const deletePurchaseItem = useAppStore((state) => state.deletePurchaseItem);

  const purchaseItemsWithDetails = useMemo(
    () =>
      purchaseItems.map((item) => {
        const record = records.find((d) => d.id === item.recordId);
        return {
          ...item,
          recordAlbum: record?.album || 'Unknown',
          recordCost: record?.recordCost || 0,
        };
      }),
    [purchaseItems, records]
  );

  return {
    purchaseItems,
    purchaseItemsWithDetails,
    loading,
    error,
    fetchPurchaseItems,
    createPurchaseItem,
    deletePurchaseItem,
  };
};

export const useAppStoreState = () => {
  return useAppStore();
};
