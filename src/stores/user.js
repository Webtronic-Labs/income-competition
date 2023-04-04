import { defineStore } from 'pinia'
import { auth, usersCollection } from '@/includes/firebase'

export default defineStore('user', {
  state: () => ({
    id: null,
    fullName: null,
    email: null,
    totalSales: 0,
    totalRevenue: 0,
    avatar: null,
    isLoggedIn: false
  }),
  actions: {
    async signUp({ fullName, email, password }) {
      const userCredentials = await auth.createUserWithEmailAndPassword(email, password)

      await usersCollection.doc(userCredentials.user.uid).set({
        fullName,
        email,
        totalSales: 0,
        totalRevenue: 0
      })

      await userCredentials.user.updateProfile({
        displayName: fullName
      })

      this.id = userCredentials.user.uid
      this.fullName = fullName
      this.email = email
      this.totalSales = 0
      this.totalRevenue = 0
      this.isLoggedIn = true
    },
    async signIn({ email, password }) {
      const userCredentials = await auth.signInWithEmailAndPassword(email, password)
      const currentUserRef = usersCollection.doc(auth.currentUser.uid)
      const doc = await currentUserRef.get()
      const { fullName, totalSales, totalRevenue, avatar } = doc.data()
      this.id = userCredentials.user.uid
      this.fullName = fullName
      this.email = email
      this.totalSales = totalSales
      this.totalRevenue = totalRevenue
      this.avatar = avatar
      this.isLoggedIn = true
    },
    async signOut() {
      if (this.isLoggedIn) {
        await auth.signOut()

        this.id = null
        this.fullName = null
        this.email = null
        this.totalSales = 0
        this.totalRevenue = 0
        this.avatar = null
        this.isLoggedIn = false
      }
    }
  }
})
