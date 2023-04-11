import { CooperativeModel } from "./cooperative";
import { CooperativeAccountModel } from "./cooperative_account";
import { SessionModel } from "./session";
import { MemberModel } from "./member";
import { MemberAccountModel } from "./member_account";
import { AccountModel } from "./account";
import { SharesModel } from "./shares";
import { SharesLogModel } from "./shares_log";

export const Member = MemberModel;
export const Cooperative = CooperativeModel;
export const CooperativeAccount = CooperativeAccountModel;
export const Session = SessionModel;
export const MemberAccount = MemberAccountModel;
export const Account = AccountModel;
export const Shares = SharesModel;
export const SharesLog = SharesLogModel;
CooperativeAccount.belongsTo(Cooperative, { foreignKey: "cooperative_id" });

Cooperative.hasMany(CooperativeAccount, {
  foreignKey: "cooperative_id",
  as: "accounts",
});
MemberAccount.belongsTo(Member, { foreignKey: "member_id" });
Member.hasOne(MemberAccount, { foreignKey: "member_id", as: "account" });
