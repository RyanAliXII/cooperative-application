import { CooperativeModel } from "./cooperative";
import { CooperativeAccountModel } from "./cooperative_account";
import { SessionModel } from "./session";
import { MemberModel } from "./member";
import { MemberAccountModel } from "./member_account";
import { AccountModel } from "./account";
import { SharesModel } from "./shares";
import { SharesLogModel } from "./shares_log";
import { LoanModel } from "./loan";

export const Member = MemberModel;
export const Cooperative = CooperativeModel;
export const CooperativeAccount = CooperativeAccountModel;
export const Session = SessionModel;
export const MemberAccount = MemberAccountModel;
export const Account = AccountModel;
export const Shares = SharesModel;
export const SharesLog = SharesLogModel;
export const Loan = LoanModel;
CooperativeAccount.belongsTo(Cooperative, { foreignKey: "cooperative_id" });

Cooperative.hasMany(CooperativeAccount, {
  foreignKey: "cooperative_id",
  as: "accounts",
});

MemberAccount.belongsTo(Member, { foreignKey: "member_id" });
Member.hasOne(MemberAccount, { foreignKey: "member_id", as: "account" });

Shares.belongsTo(Member, { foreignKey: "member_id" });
Member.hasOne(Shares, { foreignKey: "member_id", as: "shares" });

SharesLog.belongsTo(Member, { foreignKey: "member_id" });
Member.hasMany(SharesLog, { foreignKey: "member_id", as: "sharesLogs" });
