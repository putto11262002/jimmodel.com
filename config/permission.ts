import { Permission } from "@/lib/auth";

export const UserActions = {
  updatePasswordById: "update-password-by-id",
  updateSelfPassword: "update-self-password",
  updateRoleById: "update-role-by-id",
  updateSelfRole: "update-self-role",
  addImageById: "add-image-by-id",
  addSelfImage: "add-self-image",
  getUsers: "get-users",
  getUser: "get-user",
  createUser: "create-user",
  updateImage: "update-image",
} as const;

const userPermissions: { [key in keyof typeof UserActions]: Permission } = {
  updatePasswordById: ["root", "admin"],
  updateSelfPassword: [],
  updateRoleById: ["root", "admin"],
  updateSelfRole: ["root", "admin"],
  addImageById: ["root", "admin"],
  addSelfImage: [],
  getUsers: ["root", "admin"],
  getUser: ["root", "admin", "staff"],
  createUser: ["root", "admin"],
  updateImage: ["root", "admin"],
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
  generateJobConfirmationSheet: "generate-job-confirmation-sheet",
  updateJobPermissions: "update-job-permissions",
} as const;

const jobPermissions: { [key in keyof typeof JobActions]: Permission } = {
  getJobs: ["root", "admin", "staff"],
  getJobById: ["root", "admin", "staff"],
  createJob: ["root", "admin", "staff"],
  updateJobById: ["root", "admin", "staff"],
  confirmJob: ["root", "admin", "staff"],
  cancelJob: ["root", "admin", "staff"],
  archiveJob: ["root", "admin", "staff"],
  getBookings: ["root", "admin", "staff"],
  getBookingsWithJob: ["root", "admin", "staff"],
  getJobBookings: ["root", "admin", "staff"],
  removeBooking: ["root", "admin", "staff"],
  addBooking: ["root", "admin", "staff"],
  getJobModels: ["root", "admin", "staff"],
  addModels: ["root", "admin", "staff"],
  removeModel: ["root", "admin", "staff"],
  getConflictingBookings: ["root", "admin", "staff"],
  generateJobConfirmationSheet: ["root", "admin", "staff"],
  updateJobPermissions: ["root", "admin", "staff"],
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
  [key in keyof typeof ApplicationActions]: Permission;
} = {
  getApplications: ["root", "admin", "staff"],
  getApplicationById: ["root", "admin", "staff"],
  approveApplication: ["root", "admin", "staff"],
  rejectApplication: ["root", "admin", "staff"],
  getApplicationImageById: ["root", "admin", "staff"],
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
  [key in keyof typeof ShowcaseActions]: Permission;
} = {
  createShowcase: ["root", "admin", "staff"],
  updateShowcase: ["root", "admin", "staff"],
  getShowcaseById: ["root", "admin", "staff"],
  updateCoverImage: ["root", "admin", "staff"],
  addImage: ["root", "admin", "staff"],
  getShowcases: ["root", "admin", "staff"],
  getPublishedShowcases: [],
  publishShowcase: ["root", "admin", "staff"],
  unpublishShowcase: ["root", "admin", "staff"],
  addModel: ["root", "admin", "staff"],
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
  generateModelProfileSheet: "generate-model-profile-sheet",
  updateModelSettings: "update-model-settings",
  getJobs: "get-jobs",
};

const modelPermissions: {
  [key in keyof typeof ModelActions]: Permission;
} = {
  createModel: ["root", "admin", "staff"],
  getModels: ["root", "admin", "staff"],
  updateModelById: ["root", "admin", "staff"],
  getModelById: ["root", "admin", "staff"],
  getModelExperiencesById: ["root", "admin", "staff"],
  getModelImagesById: ["root", "admin", "staff"],
  removeModelImageById: ["root", "admin", "staff"],
  addModelImage: ["root", "admin", "staff"],
  setProfileImageById: ["root", "admin", "staff"],
  getModelBlocks: ["root", "admin", "staff"],
  addModelBlock: ["root", "admin", "staff"],
  removeModelBlockById: ["root", "admin", "staff"],
  getBlocks: ["root", "admin", "staff"],
  getBlocksWithModel: ["root", "admin", "staff"],
  getModelExperiences: ["root", "admin", "staff"],
  addModelExperience: ["root", "admin", "staff"],
  removeModelExperience: ["root", "admin", "staff"],
  generateModelProfileSheet: ["root", "admin", "staff"],
  updateModelSettings: ["root", "admin", "staff"],
  getJobs: ["root", "admin", "staff"],
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
  [key in keyof typeof WebAssetActions]: Permission;
} = {
  createWebAsset: ["IT", "root", "admin"],
  getWebAsset: ["IT", "staff", "root", "admin"],
  getWebAssets: ["IT", "staff", "root", "admin"],
  updateWebAssetMetadata: ["IT", "root", "admin"],
  removeWebAsset: ["IT", "root", "admin"],
  getPublishedWebAssets: [],
  publish: ["IT", "root", "admin"],
  unpublish: ["IT", "root", "admin"],
};

const ContactMessageActions = {
  getContactMessages: "get-contact-messages",
  getContactMessage: "get-contact-message",
  markAsRead: "mark-as-read",
};

const contactMessagePermissions: {
  [key in keyof typeof ContactMessageActions]: Permission;
} = {
  getContactMessages: ["root", "admin", "staff", "IT"],
  markAsRead: ["root", "admin", "staff", "IT"],
  getContactMessage: ["root", "admin", "staff", "IT"],
};


const websiteActions = {
    revalidateCache: "revalidate-cache",
}

const websitePermissions: {
	[key in keyof typeof websiteActions]: Permission;
} = {
	revalidateCache: ["root", "admin", "IT"],
}

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
  website: websitePermissions,
} as const;

export default permissions;
