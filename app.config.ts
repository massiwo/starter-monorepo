export default defineAppConfig({
  myApp: {
    name: "Mon application",
  },
});

declare module "@nuxt/schema" {
  interface AppConfigInput {
    myApp: {
      /** Project name */
      name: string;
    };
  }
}
