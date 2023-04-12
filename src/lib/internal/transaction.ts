export enum SharesTransactionTypes {
  Deposit = "Deposit",
}

export enum LoanStatuses {
  Requested = "Requested",
  Approved = "Approved",
  Disbursed = "Disbursed",
  Finished = "Finished",
}

export type LoanStatus = "Requested" | "Approved" | "Disbursed" | "Finished";
