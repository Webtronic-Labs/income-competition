<script>
import { mapState, mapWritableState } from 'pinia'
import { auth, usersCollection } from '@/includes/firebase'
import useUserStore from '@/stores/user'
import Backdrop from '@/components/Backdrop.vue'
import Snackbar from '@/components/Snackbar.vue'
import useBackdropStore from '@/stores/backdrop'
import useSnackbarStore from '@/stores/snackbar'

export default {
  name: 'App',
  components: {
    Backdrop,
    Snackbar
  },
  data() {
    return {
      unsubscribe: null
    }
  },
  computed: {
    ...mapState(useBackdropStore, { isBackdropOpen: 'isOpen' }),
    ...mapState(useSnackbarStore, { isSnackbarOpen: 'isOpen' }),
    ...mapWritableState(useUserStore, [
      'id',
      'fullName',
      'email',
      'totalSales',
      'totalRevenue',
      'avatar',
      'isLoggedIn'
    ])
  },
  methods: {
    updateUserData(id, data, isLoggedIn) {
      const { fullName, email, totalSales, totalRevenue, avatar } = data
      this.id = id
      this.fullName = fullName
      this.email = email
      this.totalSales = totalSales
      this.totalRevenue = totalRevenue
      this.avatar = avatar
      this.isLoggedIn = isLoggedIn
    }
  },
  created() {
    if (auth.currentUser) {
      const currentUserRef = usersCollection.doc(auth.currentUser.uid)

      currentUserRef
        .get()
        .then((doc) => {
          this.updateUserData(doc.id, doc.data(), true)
          this.$router.push({ path: '/' })
        })
        .catch((error) => console.log(error))

      this.unsubscribe = currentUserRef.onSnapshot((doc) => {
        this.updateUserData(doc.id, doc.data(), true)
      })
    }
  },
  unmounted() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}
</script>

<template>
  <Backdrop v-if="isBackdropOpen" />
  <Snackbar v-if="isSnackbarOpen" />
  <RouterView />
</template>
