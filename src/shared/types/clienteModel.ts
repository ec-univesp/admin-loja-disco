export interface Cliente {
  id: string;
  nome: string;
  generoSexo: 'M' | 'F' | 'Outro' | '';
  idade: number;
}

export interface Endereco {
  id: string;
  logradouro: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface ClienteEndereco {
  clienteId: string;
  enderecoId: string;
}
