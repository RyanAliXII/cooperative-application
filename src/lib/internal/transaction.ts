export enum SharesTransactionTypes {
  Deposit = "Deposit",
}

export enum LoanStatuses {
  Requested = "Requested",
  Approved = "Approved",
  Disbursed = "Disbursed",
  Finished = "Finished",
  Declined = "Declined",
}

export type LoanStatus =
  | "Requested"
  | "Approved"
  | "Disbursed"
  | "Finished"
  | "Declined";
