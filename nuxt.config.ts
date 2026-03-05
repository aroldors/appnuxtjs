// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt', '@nuxt/icon'],
  supabase: {
    redirect: true, // Desabilitar para usar redirecionamento manual
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/esqueci-senha', '/recupera-senha', '/criar-conta']
    }
  }
})