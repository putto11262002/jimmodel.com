import { UserRole, userRoles } from "@/db/schemas";

export const UserActions = {
  updatePasswordById: "update-password-by-id",
  updateRoleById: "update-role-by-id",
  addImageById: "add-image-by-id",
  getUsers: "get-users",
} as const;

const userPermissions: { [key in keyof typeof UserActions]: UserRole[] } = {
  updatePasswordById: ["admin"],
  updateRoleById: ["admin"],
  addImageById: ["admin"],
  getUsers: ["admin"],
} as const;

export const JobActions = {
  getJobs: "get-jobs",
  getJobById: "get-job-by-id",
  createJob: "create-job",
  updateJobById: "update-job-by-id",
  confirmJobById: "confirm-job-by-id",
  cancelJobById: "cancel-job-by-id",
  archiveJobById: "archive-job-by-id",
} as const;

const jobPermissions: { [key in keyof typeof JobActions]: UserRole[] } = {
  getJobs: ["admin", "staff"],
  getJobById: ["admin", "staff"],
  createJob: ["admin", "staff"],
  updateJobById: ["admin", "staff"],
  confirmJobById: ["admin", "staff"],
  cancelJobById: ["admin", "staff"],
  archiveJobById: ["admin", "staff"],
} as const;

const ApplicationActions = {
  getApplications: "get-applications",
  getApplicationById: "get-application-by-id",
  approveApplication: "approve-application",
  rejectApplication: "reject-application",
  getApplicationImageById: "get-application-by-id",
};

const applicationPermissions: {
  [key in keyof typeof ApplicationActions]: UserRole[];
} = {
  getApplications: ["admin", "staff"],
  getApplicationById: ["admin", "staff"],
  approveApplication: ["admin", "staff"],
  rejectApplication: ["admin", "staff"],
  getApplicationImageById: ["admin", "staff"],
};

// Emptry array = only authentication is required
// Null = no authentication required
const permissions = {
  users: userPermissions,
  jobs: jobPermissions,
  applications: applicationPermissions,
} as const;

export default permissions;
