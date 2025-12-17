export default defineNuxtPlugin(() => {
  // Plugin simplificado - apenas para debug, o watcher principal está no store
  if (process.client) {
    console.log('Plugin: Store de usuário inicializado')
  }
})