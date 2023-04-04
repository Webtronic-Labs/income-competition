import { defineStore } from 'pinia'

export default defineStore('backdrop', {
  state: () => ({
    isOpen: false,
    closeHandler: null
  }),
  getters: {
    hiddenClass(state) {
      return !state.isOpen ? 'hidden' : ''
    }
  }
})
