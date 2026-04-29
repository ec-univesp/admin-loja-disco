import type { MusicGenre } from './musicGenre.types';
import type { Artist } from './artist.types';
import type { VinylRecord, RecordGenre } from './record.types';
import type { Customer, Address, CustomerAddress } from './customer.types';
import type { Purchase, PurchaseItem } from './purchase.types';
import type { Sale, SaleItem } from './sale.types';
import type { SalesChannel } from './salesChannel.types';

export interface AppState {
  musicGenres: MusicGenre[];
  artists: Artist[];
  records: VinylRecord[];
  recordGenres: RecordGenre[];
  customers: Customer[];
  addresses: Address[];
  customerAddresses: CustomerAddress[];
  purchases: Purchase[];
  purchaseItems: PurchaseItem[];
  sales: Sale[];
  saleItems: SaleItem[];
  salesChannels: SalesChannel[];
  loading: boolean;
  error: string | null;
}
