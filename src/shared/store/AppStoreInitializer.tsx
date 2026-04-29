'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/shared/store/appStore';
import { initializeStorage } from '@/shared/services/apiMock';

/**
 * Initializes the store and loads all data.
 * Place in the root layout.
 */
export function AppStoreInitializer() {
  const fetchMusicGenres = useAppStore((state) => state.fetchMusicGenres);
  const fetchArtists = useAppStore((state) => state.fetchArtists);
  const fetchRecords = useAppStore((state) => state.fetchRecords);
  const fetchCustomers = useAppStore((state) => state.fetchCustomers);
  const fetchAddresses = useAppStore((state) => state.fetchAddresses);
  const fetchPurchases = useAppStore((state) => state.fetchPurchases);
  const fetchSales = useAppStore((state) => state.fetchSales);
  const fetchPurchaseItems = useAppStore((state) => state.fetchPurchaseItems);
  const fetchSaleItems = useAppStore((state) => state.fetchSaleItems);

  useEffect(() => {
    // Initialize localStorage with sample data
    initializeStorage();

    // Load all data
    const loadData = async () => {
      await Promise.all([
        fetchMusicGenres(),
        fetchArtists(),
        fetchRecords(),
        fetchCustomers(),
        fetchAddresses(),
        fetchPurchases(),
        fetchSales(),
        fetchPurchaseItems(),
        fetchSaleItems(),
      ]);
    };

    loadData();
  }, [
    fetchMusicGenres,
    fetchArtists,
    fetchRecords,
    fetchCustomers,
    fetchAddresses,
    fetchPurchases,
    fetchSales,
    fetchPurchaseItems,
    fetchSaleItems,
  ]);

  return null;
}
