export type Cooperative = {
  id?: string;
  name: string;
  registrationNumber: string;
  initials: string;
  address: string;
  province: string;
  city: string;
  account: CooperativeAccount;
};

export type CooperativeAccount = {
  givenName: string;
  middleName: string;
  surname: string;
  email: string;
};
