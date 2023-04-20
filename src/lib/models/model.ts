import { CooperativeModel } from "./cooperative";
import { CooperativeAccountModel } from "./cooperative_account";
import { SessionModel } from "./session";
import { MemberModel } from "./member";
import { MemberAccountModel } from "./member_account";
import { AccountModel } from "./account";

import { ShareModel } from "./share";
import { LoanModel } from "./loan";
import { LoanRepaymentModel } from "./loan_repayment";
import { ShareLogModel } from "./share_log";
import { LoanLogModel } from "./loan_log";
import { SavingModel } from "./saving";
import { SavingLogModel } from "./saving_log";

export const Member = MemberModel;
export const Cooperative = CooperativeModel;
export const CooperativeAccount = CooperativeAccountModel;
export const Session = SessionModel;
export const MemberAccount = MemberAccountModel;
export const Account = AccountModel;

export const Share = ShareModel;
export const Loan = LoanModel;
export const LoanRepayment = LoanRepaymentModel;
export const ShareLog = ShareLogModel;
export const LoanLog = LoanLogModel;
export const Saving = SavingModel;
export const SavingLog = SavingLogModel;
CooperativeAccount.belongsTo(Cooperative, {
  foreignKey: "cooperative_id",
});

Cooperative.hasMany(CooperativeAccount, {
  foreignKey: "cooperative_id",
  as: "accounts",
});

MemberAccount.belongsTo(Member, { foreignKey: "member_id" });
Member.hasOne(MemberAccount, { foreignKey: "member_id", as: "account" });

Share.belongsTo(Member, { foreignKey: "member_id" });
Member.hasMany(Share, { foreignKey: "member_id", as: "shares" });

Loan.belongsTo(Member, { foreignKey: "member_id" });
Member.hasMany(Loan, { foreignKey: "member_id", as: "loans" });

LoanRepayment.belongsTo(Loan, { foreignKey: "loan_id" });
Loan.hasMany(LoanRepayment, { foreignKey: "loan_id", as: "repayments" });

Saving.belongsTo(Member, { foreignKey: "member_id" });
Member.hasMany(Saving, { foreignKey: "member_id", as: "savings" });
