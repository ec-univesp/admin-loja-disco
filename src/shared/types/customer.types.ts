export interface Customer {
  id: string;
  name: string;
  gender: 'M' | 'F' | 'Other' | '';
  age: number;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CustomerAddress {
  customerId: string;
  addressId: string;
}
