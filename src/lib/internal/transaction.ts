export enum SharesTransactionTypes {
  Deposit = "Deposit",
  Withdraw = "Withdraw",
}

export enum SavingsTransactionTypes {
  Deposit = "Deposit",
  Withdraw = "Withdraw",
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

export enum ShareLogDescription {
  New = "Share has been added.",
  Edit = "Share has been updated.",
  Delete = "Share has been removed.",
  Withdraw = "Share has been withdrawn.",
}
export enum SavingLogDescription {
  New = "Saving has been added.",
  Edit = "Saving has been updated.",
  Delete = "Saving has been removed.",
  Withdraw = "Saving has been withdrawn.",
}
