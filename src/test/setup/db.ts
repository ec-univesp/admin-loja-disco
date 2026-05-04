import type {
  ArtistDTO,
  AddressDTO,
  CustomerDTO,
  MusicGenreDTO,
  RecordDTO,
  PurchaseDTO,
  SaleDTO,
  SalesChannelDTO,
} from '@/shared/services/api/types';

export interface TestDB {
  artists: ArtistDTO[];
  genres: MusicGenreDTO[];
  addresses: AddressDTO[];
  customers: CustomerDTO[];
  channels: SalesChannelDTO[];
  records: RecordDTO[];
  sales: SaleDTO[];
  purchases: PurchaseDTO[];
}

const empty = (): TestDB => ({
  artists: [],
  genres: [],
  addresses: [],
  customers: [],
  channels: [],
  records: [],
  sales: [],
  purchases: [],
});

export const db: TestDB = empty();

export function resetDb(seed?: Partial<TestDB>) {
  const fresh = empty();
  Object.assign(db, fresh);
  if (seed) {
    for (const [key, value] of Object.entries(seed)) {
      (db as unknown as Record<string, unknown>)[key] = value;
    }
  }
}

export function nextId(table: keyof TestDB, idField: string): number {
  const items = db[table] as unknown as Array<Record<string, unknown>>;
  const max = items.reduce((acc, item) => {
    const v = item[idField];
    return typeof v === 'number' && v > acc ? v : acc;
  }, 0);
  return max + 1;
}
