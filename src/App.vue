<script>
import { mapWritableState } from 'pinia'
import { auth, usersCollection } from '@/includes/firebase'
import useUserStore from '@/stores/user'
import Backdrop from '@/components/Backdrop.vue'

export default {
  name: 'App',
  components: {
    Backdrop
  },
  data() {
    return {
      unsubscribe: null
    }
  },
  computed: {
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
  <Backdrop />
  <RouterView />
</template>
