import { Model, ModelImage } from "@/lib/domains";

const routes = {
  files: {
    get: (fileId: string) => `/files/${fileId}`,
  },
  getFiles: (fileId: string) => `/files/${fileId}`,
  main: "/",
  showcases: {
    main: (page: number) => `/showcases/${page}`,
    profile: (id: string) => `/showcases/profile/${id}`,
  },
  api: {
    users: {
      get: "/api/users",
    },
    models: {
      get: "/api/models",
    },
    bookings: {
      get: "/api/bookings",
    },
    jobs: {
      "[id]": {
        "confirmation-sheet": {
          get: ({ id }: { id: string }) => `/api/jobs/${id}/confirmation-sheet`,
        },
      },
      get: "/api/jobs",
    },
    "model-blocks": { get: "/api/model-blocks" },
  },
  application: {
    form: {
      main: "/application",
      experience: "/application/experience",
      images: "/application/images",
      submit: "/application/submit",
    },
    new: "/application/new",
    success: "/application/success",
  },
  models: {
    main: (
      category: Model["category"] | "all" = "all",
      bookingStatus: Model["bookingStatus"] | "all" = "all",
      page: number = 1
    ) => `/models/${category}/${bookingStatus}/${page}`,
    profile: {
      main: (id: string) => `/models/profile/${id}`,
      imageType: (id: string, type: ModelImage["type"]) =>
        `/models/profile/${id}/${type}`,
    },
  },

  admin: {
    main: "/admin",
    calendar: "/admin/calendar",
    website: {
      main: "/admin/website/web-assets",
      webAssets: {
        main: "/admin/website/web-assets",
      },
      showcases: {
        main: "/admin/website/showcases",

        "[id]": {
          edit: {
            main: ({ id }: { id: string }) => `/admin/showcases/${id}/edit`,
          },
        },
      },
      settings: {
        main: "/admin/website/settings",
      },
    },
    jobs: {
      main: "/admin/jobs",
      bookings: {
        main: (id: string) => `/admin/jobs/${id}/bookings`,
        create: (id: string) => `/admin/jobs/${id}/bookings/create`,
      },
      "[id]": {
        main: ({ id }: { id: string }) => `/admin/jobs/${id}/edit`,
        edit: {
          main: ({ id }: { id: string }) => `/admin/jobs/${id}/edit`,
          client: ({ id }: { id: string }) => `/admin/jobs/${id}/edit/client`,
          production: ({ id }: { id: string }) =>
            `/admin/jobs/${id}/edit/production`,
          contract: ({ id }: { id: string }) =>
            `/admin/jobs/${id}/edit/contract`,
        },
        models: ({ id }: { id: string }) => `/admin/jobs/${id}/models`,
        bookings: ({ id }: { id: string }) => `/admin/jobs/${id}/bookings`,

        settings: {
          main: ({ id }: { id: string }) => `/admin/jobs/${id}/settings`,
          permission: ({ id }: { id: string }) =>
            `/admin/jobs/${id}/settings/permission`,
        },
      },
    },
    applications: {
      main: "/admin/applications",
      "[id]": { main: ({ id }: { id: string }) => `/admin/applications/${id}` },
    },
    users: {
      view: (id: string) => `/admin/users/${id}`,
      main: "/admin/users",
      create: "/admin/users/create",
      "[id]": {
        edit: {
          password: ({ id }: { id: string }) => `/admin/users/${id}/edit`,
          roles: ({ id }: { id: string }) => `/admin/users/${id}/edit/roles`,
          image: ({ id }: { id: string }) => `/admin/users/${id}/edit/image`,
        },
        jobs: {
          main: ({ id }: { id: string }) => `/admin/users/${id}/jobs`,
        },
      },
      edit: {
        main: (id: string) => `/admin/users/${id}/update`,
        roles: (id: string) => `/admin/users/${id}/update/roles`,
      },
      editSelf: "/admin/users/self/update",
    },
    models: {
      "[id]": {
        main: ({ id }: { id: string }) => `/admin/models/${id}/personal`,
        blocks: {
          main: ({ id }: { id: string }) => `/admin/models/${id}/blocks`,
        },
        jobs: {
          main: ({ id }: { id: string }) => `/admin/models/${id}/jobs`,
        },
        personal: {
          main: ({ id }: { id: string }) => `/admin/models/${id}/personal`,
          contact: ({ id }: { id: string }) =>
            `/admin/models/${id}/personal/contact`,
          address: ({ id }: { id: string }) =>
            `/admin/models/${id}/personal/address`,
          identification: ({ id }: { id: string }) =>
            `/admin/models/${id}/personal/identification`,
          background: ({ id }: { id: string }) =>
            `/admin/models/${id}/personal/background`,
          modeling: ({ id }: { id: string }) =>
            `/admin/models/${id}/personal/modeling`,
        },
        measurement: {
          main: ({ id }: { id: string }) => `/admin/models/${id}/measurement`,
          upperBody: ({ id }: { id: string }) =>
            `/admin/models/${id}/measurement/upper-body`,
          arm: ({ id }: { id: string }) =>
            `/admin/models/${id}/measurement/arm`,
          lowerBody: ({ id }: { id: string }) =>
            `/admin/models/${id}/measurement/lower-body`,
          other: ({ id }: { id: string }) =>
            `/admin/models/${id}/measurement/other`,
        },
        images: {
          profile: ({ id }: { id: string }) => `/admin/models/${id}/images`,
          "[type]": ({
            id,
            type,
          }: {
            id: string;
            type?: ModelImage["type"] | "all";
          }) => `/admin/models/${id}/images${type ? `/${type}` : ""}`,
        },
        settings: {
          main: ({ id }: { id: string }) => `/admin/models/${id}/settings`,
          downloads: ({ id }: { id: string }) =>
            `/admin/models/${id}/settings/downloads`,

          metadata: ({ id }: { id: string }) =>
            `/admin/models/${id}/settings/metadata`,
        },
      },
      create: "/admin/models/create",
      edit: {
        main: (id: string) => `/admin/models/${id}/update`,
        profileImage: (id: string) =>
          `/admin/models/${id}/update/profile-image`,
        experiences: (id: string) => `/admin/models/${id}/update/experiences`,
        images: (id: string) => `/admin/models/${id}/update/images`,
        blocks: (id: string) => `/admin/models/${id}/update/blocks`,
      },
      main: "/admin/models",
    },

    contactMessages: {
      main: "/admin/contacts",
    },
  },
} as const;

export default routes;
