import { CooperativeModel } from "./cooperative";
import { CooperativeAccountModel } from "./cooperative_account";
import { SessionModel } from "./session";
import { MemberModel } from "./member";
import { MemberAccountModel } from "./member_account";
import { AccountModel } from "./account";

export const Member = MemberModel;
export const Cooperative = CooperativeModel;
export const CooperativeAccount = CooperativeAccountModel;
export const Session = SessionModel;
export const MemberAccount = MemberAccountModel;
export const Account = AccountModel;

CooperativeAccount.belongsTo(Cooperative, { foreignKey: "cooperative_id" });

Cooperative.hasMany(CooperativeAccount, {
  foreignKey: "cooperative_id",
  as: "accounts",
});
MemberAccount.belongsTo(Member, { foreignKey: "member_id" });
Member.hasOne(MemberAccount, { foreignKey: "member_id", as: "account" });
