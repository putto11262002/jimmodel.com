let envLoaded = false;

export const loadEnv = async () => {
  if (!envLoaded) {
    await import("dotenv").then((dotenv) =>
      dotenv.config({
        path: [
          ...(process.env.NODE_ENV === "production"
            ? [".env.production"]
            : [".env.development"]),
         // HACK 
	  ...(process.env.NODE_ENV === "script" ? [".env.script"] : [".env"])
        ],
      })
    );
    envLoaded = true; // Mark as loaded
  }
};
