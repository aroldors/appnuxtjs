import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async () => {
  const { isAdmin } = useAuth()

  const admin = await isAdmin()

  if (!admin) {
    return navigateTo('/')
  }
})
