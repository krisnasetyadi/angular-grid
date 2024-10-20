export enum FormStatus {
  Published = 1,
  Draft,
  PendingReview,
  ReviewRejected,
  AwaitingPublishing,
  PendingApproval,
  ApprovalRejected,
}

export const FormStatusModel = {
  1: "Published",
  2: "Draft",
  3: "Pending Review",
  4: "Review Rejected",
  5: "Awaiting Publishing",
  6: "Pending Approval",
  7: "Approval Rejected",
}
