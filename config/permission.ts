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
  addApplicationImageById: "add-application-image-by-id",
};

const applicationPermissions: {
  [key in keyof typeof ApplicationActions]: UserRole[];
} = {
  getApplications: ["admin", "staff"],
  getApplicationById: ["admin", "staff"],
  approveApplication: ["admin", "staff"],
  rejectApplication: ["admin", "staff"],
  getApplicationImageById: ["admin", "staff"],
  addApplicationImageById: [],
};

const ModelActions = {
  createModel: "create-model",
  getModels: "get-models",
  updateModelById: "update-model-by-id",
  getModelById: "get-model-by-id",
  getModelExperiencesById: "get-model-experiences-by-id",
  getModelImagesById: "get-model-images-by-id",
  removeModelImageById: "remove-model-image-by-id",
  setProfileImageById: "set-profile-image-by-id",
  addModelImage: "add-model-image-by-id",
  getModelBlocks: "get-model-blocks",
  getBlocks: "get-blocks",
  removeModelBlockById: "remove-model-block-by-id",
  addModelBlock: "add-model-block",
  getModelExperiences: "get-model-experiences",
  addModelExperience: "add-model-experience",
  removeModelExperience: "remove-model-experience",
};

const modelPermissions: {
  [key in keyof typeof ModelActions]: UserRole[];
} = {
  createModel: ["admin", "staff"],
  getModels: ["admin", "staff"],
  updateModelById: ["admin", "staff"],
  getModelById: ["admin", "staff"],
  getModelExperiencesById: ["admin", "staff"],
  getModelImagesById: ["admin", "staff"],
  removeModelImageById: ["admin", "staff"],
  addModelImage: ["admin", "staff"],
  setProfileImageById: ["admin", "staff"],
  getModelBlocks: ["admin", "staff"],
  addModelBlock: ["admin", "staff"],
  removeModelBlockById: ["admin", "staff"],
  getBlocks: ["admin", "staff"],
  getModelExperiences: ["admin", "staff"],
  addModelExperience: ["admin", "staff"],
  removeModelExperience: ["admin", "staff"],
};

// Emptry array = only authentication is required
// Null = no authentication required
const permissions = {
  users: userPermissions,
  jobs: jobPermissions,
  applications: applicationPermissions,
  models: modelPermissions,
} as const;

export default permissions;
