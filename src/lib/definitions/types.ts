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

export type Dependent = {
  name: string;
  relationship: string;
  birthday: string;
};

export type Member = {
  givenName: string;
  middleName: string;
  surname: string;
  birthday: string;
  educationalAttainment: string;
  TIN: string;
  spouseName: string;
  civilStatus: string;
  presentAddress: string;
  provincialAddress: string;
  officeAddress: string;
  email: string;
  mobileNumber: string;
  officePhoneNumber: string;
  dependents: Dependent[];
};
