import type { LoanStatus } from "$lib/internal/transaction";

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
  id?: string;
  givenName: string;
  middleName: string;
  surname: string;
  email: string;
  isOwner: boolean;
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
  shares?: [];
  share: number;
};

export type MemberAccount = {
  id?: string;
  email: string;
  mobileNumber: string;
  password: string;
  member: Member;
};

export type MemberShare = {
  id?: string;
  memberId: number;
  total: number;
  member?: Member;
};
export type Share = {
  id?: number;
  memberId: number;
  remarks: string;
  amount: number;
  member?: Member;
  type: string;
  createdAt: string;
};

export type Loan = {
  id?: string;
  memberId: number;
  principal: number;
  totalDue: number;
  interest: number;
  status: LoanStatus;
  remainingBalance: number;
  member?: Member;
  tenure: number;
  createdAt: string;
};

export type LoanRepayment = {
  id?: string;
  loanId: string;
  amountPaid: number;
  remainingBalance: number;
  balanceBeforeRepayment: number;
  remarks: string;
  loan?: Loan;
  createdAt: string;
};
export type ShareLog = {
  id?: string;
  value: number;
  description: string;
  cooperativeId: string;
  createdAt: string;
};
