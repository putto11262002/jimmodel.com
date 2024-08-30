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
  confirmJob: "confirm-job-by-id",
  cancelJob: "cancel-job-by-id",
  archiveJob: "archive-job-by-id",
  getBookings: "get-bookings",
  getBookingsWithJob: "get-bookings-with-job",
  getJobBookings: "get-job-bookings",
  removeBooking: "remove-booking",
  addBooking: "add-booking",
  getJobModels: "get-job-models",
  addModels: "add-model",
  removeModel: "remove-model",
  getConflictingBookings: "get-client-jobs",
} as const;

const jobPermissions: { [key in keyof typeof JobActions]: UserRole[] } = {
  getJobs: ["admin", "staff"],
  getJobById: ["admin", "staff"],
  createJob: ["admin", "staff"],
  updateJobById: ["admin", "staff"],
  confirmJob: ["admin", "staff"],
  cancelJob: ["admin", "staff"],
  archiveJob: ["admin", "staff"],
  getBookings: ["admin", "staff"],
  getBookingsWithJob: ["admin", "staff"],
  getJobBookings: ["admin", "staff"],
  removeBooking: ["admin", "staff"],
  addBooking: ["admin", "staff"],
  getJobModels: ["admin", "staff"],
  addModels: ["admin", "staff"],
  removeModel: ["admin", "staff"],
  getConflictingBookings: ["admin", "staff"],
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

const ShowcaseActions = {
  createShowcase: "create-showcase",
  getShowcaseById: "get-showcase-by-id",
  updateShowcase: "update-showcase",
  updateCoverImage: "update-cover-image",
  addImage: "add-image",
  getShowcases: "get-showcases",
  getPublishedShowcases: "get-published-showcases",
  publishShowcase: "publish-showcase",
  unpublishShowcase: "unpublish-showcas",
  addModel: "add-model",
};

const showcasePermissions: {
  [key in keyof typeof ShowcaseActions]: UserRole[];
} = {
  createShowcase: ["admin", "staff"],
  updateShowcase: ["admin", "staff"],
  getShowcaseById: ["admin", "staff"],
  updateCoverImage: ["admin", "staff"],
  addImage: ["admin", "staff"],
  getShowcases: ["admin", "staff"],
  getPublishedShowcases: [],
  publishShowcase: ["admin", "staff"],
  unpublishShowcase: ["admin", "staff"],
  addModel: ["admin", "staff"],
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
  getBlocksWithModel: "get-blocks-with-model",
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
  getBlocksWithModel: ["admin", "staff"],
  getModelExperiences: ["admin", "staff"],
  addModelExperience: ["admin", "staff"],
  removeModelExperience: ["admin", "staff"],
};

const WebAssetActions = {
  createWebAsset: "create-web-asset",
  getWebAsset: "get-web-asset",
  getWebAssets: "get-web-assets",
  updateWebAssetMetadata: "update-web-asset-metadata",
  removeWebAsset: "remove-web-asset",
  publish: "publish",
  unpublish: "unpublish",
  getPublishedWebAssets: "get-public-web-assets",
} as const;

const webAssetPermissions: {
  [key in keyof typeof WebAssetActions]: UserRole[];
} = {
  createWebAsset: ["IT", "admin"],
  getWebAsset: ["IT", "staff", "admin"],
  getWebAssets: ["IT", "staff", "admin"],
  updateWebAssetMetadata: ["IT", "admin"],
  removeWebAsset: ["IT", "admin"],
  getPublishedWebAssets: [],
  publish: ["IT", "admin"],
  unpublish: ["IT", "admin"],
};

const ContactMessageActions = {
  getContactMessages: "get-contact-messages",
  getContactMessage: "get-contact-message",
  markAsRead: "mark-as-read",
};

const contactMessagePermissions: {
  [key in keyof typeof ContactMessageActions]: UserRole[];
} = {
  getContactMessages: ["admin", "staff", "IT"],
  markAsRead: ["admin", "staff", "IT"],
  getContactMessage: ["admin", "staff", "IT"],
};

// Emptry array = only authentication is required
// Null = no authentication required
const permissions = {
  users: userPermissions,
  jobs: jobPermissions,
  applications: applicationPermissions,
  models: modelPermissions,
  showcases: showcasePermissions,
  weebAssets: webAssetPermissions,
  contactMessages: contactMessagePermissions,
} as const;

export default permissions;
