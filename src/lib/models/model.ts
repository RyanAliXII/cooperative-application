import { CooperativeModel } from "./cooperative";
import { CooperativeAccountModel } from "./cooperative_account";
import { SessionModel } from "./session";
import { MemberModel } from "./member";
import { MemberAccountModel } from "./member_account";
import { AccountModel } from "./account";
import { MemberShareModel } from "./member_share";
import { ShareModel } from "./share";
import { LoanModel } from "./loan";

export const Member = MemberModel;
export const Cooperative = CooperativeModel;
export const CooperativeAccount = CooperativeAccountModel;
export const Session = SessionModel;
export const MemberAccount = MemberAccountModel;
export const Account = AccountModel;
export const MemberShare = MemberShareModel;
export const Share = ShareModel;
export const Loan = LoanModel;
CooperativeAccount.belongsTo(Cooperative, { foreignKey: "cooperative_id" });

Cooperative.hasMany(CooperativeAccount, {
  foreignKey: "cooperative_id",
  as: "accounts",
});

MemberAccount.belongsTo(Member, { foreignKey: "member_id" });
Member.hasOne(MemberAccount, { foreignKey: "member_id", as: "account" });

MemberShare.belongsTo(Member, { foreignKey: "member_id" });
Member.hasOne(MemberShare, { foreignKey: "member_id", as: "share" });

Share.belongsTo(Member, { foreignKey: "member_id" });
Member.hasMany(Share, { foreignKey: "member_id", as: "shares" });

Loan.belongsTo(Member, { foreignKey: "member_id" });
Member.hasMany(Loan, { foreignKey: "member_id", as: "loans" });
