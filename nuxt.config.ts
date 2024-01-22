// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: true,
  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxtjs/eslint-module", "@nuxtjs/stylelint-module"],
  app: {
    rootId: "app",
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Template Projet Web",
    },
  },

  css: ["@/assets/scss/main.scss"],
});
