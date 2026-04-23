export interface Disco {
  id: string;
  artistaId: string;
  generoId?: string;
  album: string;
  nacionalidade: string;
  premsagem: string;
  encarte: string;
  gravadora: string;
  anoLancamento: number;
  anoPremsagem: number;
  condicaoCapa: string;
  condicaoDisco: string;
  valorMercado: number;
  custoDisco: number;
  status: string;
}

export interface GeneroDisco {
  generoId: string;
  discoId: string;
}
