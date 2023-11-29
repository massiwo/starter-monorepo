// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxtjs/eslint-module", "@nuxtjs/stylelint-module"],
  app: {
    rootId: "app",
  },

  css: ["@/assets/scss/main.scss"],
});
