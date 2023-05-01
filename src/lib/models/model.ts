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
import { CooperativeStatModel } from "./cooperative_stats";
import { LiquidityLogModel } from "./liquidity_log";
import { MemberStatModel } from "./member_stats";
import { RewardModel } from "./reward";
import { SelectedCooperativeModel } from "./selected_cooperative";
import { RecognitionModel } from "./recognition";
import { CooperativeCategoryModel } from "./cooperative_category";
import { CooperativeCriteriaModel } from "./cooperative_criteria";
import { CooperativeRankingModel } from "./ranking_view";
import { CriteriaFieldModel } from "./criteria_field";
import { DefaultCriteriaPointModel } from "./default_criteria_points";
import { CriteriaFieldPointModel } from "./criteria_field_points";

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
export const CooperativeStat = CooperativeStatModel;
export const LiquidityLog = LiquidityLogModel;
export const MemberStat = MemberStatModel;
export const Reward = RewardModel;
export const SelectedCooperative = SelectedCooperativeModel;
export const Recognition = RecognitionModel;
export const CooperativeCategory = CooperativeCategoryModel;
export const CooperativeCriteria = CooperativeCriteriaModel;
export const CooperativeRanking = CooperativeRankingModel;
export const CriteriaField = CriteriaFieldModel;

export const CriteriaFieldPoint = CriteriaFieldPointModel;
export const DefaultCriteriaPoint = DefaultCriteriaPointModel;

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

CooperativeStat.belongsTo(Cooperative, { foreignKey: "cooperative_id" });
SelectedCooperative.belongsTo(Cooperative, { foreignKey: "cooperative_id" });
Cooperative.hasOne(CooperativeStat, {
  foreignKey: "cooperative_id",
  as: "stats",
});

Recognition.belongsTo(Reward, { foreignKey: "reward_id" });
Recognition.belongsTo(Cooperative, { foreignKey: "cooperative_id" });

Reward.hasMany(Recognition, { foreignKey: "reward_id", as: "recognitions" });
Cooperative.hasMany(Recognition, {
  foreignKey: "cooperative_id",
  as: "recognitions",
});

Cooperative.belongsTo(CooperativeCategory, { foreignKey: "category_id" });
CooperativeCategory.hasMany(Cooperative, {
  foreignKey: "category_id",
  as: "cooperatives",
});

CooperativeCategory.belongsTo(CooperativeCriteria, {
  foreignKey: "criteria_id",
  as: "criteria",
});

CooperativeCriteria.hasMany(CooperativeCategory, {
  foreignKey: "criteria_id",
  as: "categories",
});
CooperativeRanking.belongsTo(Cooperative, { foreignKey: "cooperative_id" });
Cooperative.hasOne(CooperativeRanking, {
  foreignKey: "cooperative_id",
  as: "rank",
});

CriteriaField.belongsTo(CooperativeCriteria, { foreignKey: "criteria_id" });
CooperativeCriteria.hasMany(CriteriaField, {
  foreignKey: "criteria_id",
  as: "criteriaFields",
});

CriteriaFieldPoint.belongsTo(CriteriaField, {
  foreignKey: "criteria_field_id",
});
CriteriaFieldPoint.belongsTo(CooperativeCategory, {
  foreignKey: "category_id",
});
CooperativeCategory.hasMany(CriteriaFieldPoint, {
  foreignKey: "category_id",
  as: "criteriaFieldPoints",
});
CriteriaField.hasMany(CriteriaFieldPoint, {
  foreignKey: "criteria_field_id",
  as: "fieldPoints",
});
