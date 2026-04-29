export interface VinylRecord {
  id: string;
  artistId: string;
  genreId?: string;
  album: string;
  nationality: string;
  pressing: string;
  insert: string;
  label: string;
  releaseYear: number;
  pressingYear: number;
  coverCondition: string;
  recordCondition: string;
  marketValue: number;
  recordCost: number;
  status: string;
}

export interface RecordGenre {
  genreId: string;
  recordId: string;
}
