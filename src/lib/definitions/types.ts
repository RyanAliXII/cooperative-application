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
  id?: number;
  givenName: string;
  cooperativeId?: string;
  middleName: string;
  surname: string;
  birthday: string;
  gender: string;
  educationalAttainment: string;
  TIN: string;
  account: MemberAccount;
  spouseName: string;
  civilStatus: string;
  presentAddress: string;
  provincialAddress: string;
  officeAddress: string;
  officePhoneNumber: string;
  dependents: Dependent[];
  approvedAt: string;
  declinedAt: string;
};

export type MemberAccount = {
  id?: string;
  email: string;
  mobileNumber: string;
  password: string;
  member: Member;
};
