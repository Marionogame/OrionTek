//   const id = Symbol("id")

export interface AddressInterface {
  addressId?: number;
  order?: number;
  city: string;
  zone: string | null;
  title: string;
  sector: string | null;
  street: string;
  latitude: number | null;
  longitude: number | null;
  province: string;
  postalCode: string | null;
  streetNumber: string;
  referenceToArrive: string | null;
  idClient?: number;
}

export interface ClientInterface {
  ClientId?: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  note: string | null;
  createdTime: string;
  idDefaultAddress: number;
  addresses: AddressInterface[];
  defaultAddress: AddressInterface | null;
}
