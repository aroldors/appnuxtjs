import { useState } from '#app'

export function useSidebar() {
  const collapsed = useState<boolean>('sidebar-collapsed', () => false)

  function toggle() {
    collapsed.value = !collapsed.value
  }

  return { collapsed, toggle }
}
