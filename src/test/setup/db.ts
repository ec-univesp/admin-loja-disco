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

type TableName = keyof TestDB;

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

const isTableName = (key: string): key is TableName =>
  key === 'artists' ||
  key === 'genres' ||
  key === 'addresses' ||
  key === 'customers' ||
  key === 'channels' ||
  key === 'records' ||
  key === 'sales' ||
  key === 'purchases';

export function resetDb(seed?: Partial<TestDB>) {
  Object.assign(db, empty());
  if (!seed) return;
  for (const [key, value] of Object.entries(seed)) {
    if (isTableName(key) && Array.isArray(value)) {
      Object.assign(db, { [key]: value });
    }
  }
}

export function nextId(table: TableName, idField: string): number {
  const records: ReadonlyArray<Record<string, unknown>> = db[table];
  const highestId = records.reduce((maxSoFar, item) => {
    const candidate = item[idField];
    return typeof candidate === 'number' && candidate > maxSoFar ? candidate : maxSoFar;
  }, 0);
  return highestId + 1;
}
