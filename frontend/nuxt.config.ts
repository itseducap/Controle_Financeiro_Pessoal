export default defineNuxtConfig({
  compatibilityDate: '2026-03-01',
  devtools: { enabled: false },
  // Esta demonstração é uma SPA exportável; não contém API ou lógica de servidor.
  ssr: false,
  css: [
    '@fontsource/manrope/400.css',
    '@fontsource/manrope/500.css',
    '@fontsource/manrope/600.css',
    '@fontsource/manrope/700.css',
    '~/assets/css/main.css',
  ],
  app: {
    head: {
      title: 'Orbit — Personal finance overview',
      htmlAttrs: { lang: 'en' },
      meta: [
        {
          name: 'description',
          content:
            'A clearer picture of your money. Orbit finance dashboard, an interactive frontend demo.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  typescript: { strict: true },
})
