import { defineStore } from 'pinia'

export default defineStore('modal', {
  state: () => ({
    isSaleModalOpen: false,
    isUpdateProfileModalOpen: false
  })
})
