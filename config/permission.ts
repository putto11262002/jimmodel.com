import { UserRole, userRoles } from "@/db/schemas";

export const UserActions = {
  updatePasswordById: "update-password-by-id",
  updateSelfPassword: "update-self-password",
  updateRoleById: "update-role-by-id",
  updateSelfRole: "update-self-role",
  addImageById: "add-image-by-id",
  addSelfImage: "add-self-image",
  getUsers: "get-users",
  createUser: "create-user",
} as const;

const userPermissions: { [key in keyof typeof UserActions]: UserRole[] } = {
  updatePasswordById: ["admin"],
  updateSelfPassword: [],
  updateRoleById: ["admin"],
  updateSelfRole: ["admin"],
  addImageById: ["admin"],
  addSelfImage: [],
  getUsers: ["admin"],
  createUser: ["admin"],
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
