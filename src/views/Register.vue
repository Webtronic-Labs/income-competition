<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import useSnackbarStore from '@/stores/snackbar'
import WelcomeHeader from '@/components/WelcomeHeader.vue'
import AuthFormInput from '../components/AuthFormInput.vue'
import AuthFormButton from '../components/AuthFormButton.vue'

export default {
  name: 'Register',
  components: { WelcomeHeader, AuthFormInput, AuthFormButton },
  data() {
    return {
      fullName: '',
      email: '',
      password: '',
      isLoading: false
    }
  },
  methods: {
    ...mapActions(useUserStore, ['signUp']),
    ...mapActions(useSnackbarStore, ['showMSG']),
    async submitHandler($event) {
      if ($event.target.checkValidity()) {
        try {
          this.isLoading = true
          await this.signUp({ fullName: this.fullName, email: this.email, password: this.password })
          $event.target.reset()
          this.$router.push({ path: '/' })
        } catch (error) {
          console.log(error)
          if (error.code === 'auth/email-already-exists') {
            this.showMSG('error', 'The provided email is already in use!')
          } else if (error.code === 'auth/invalid-email') {
            this.showMSG('error', 'The provided value for the email user property is invalid!')
          } else if (error.code === 'auth/invalid-password') {
            this.showMSG('error', 'The provided value for the password user property is invalid!')
          }
        } finally {
          this.isLoading = false
        }
      }
    }
  }
}
</script>

<template>
  <WelcomeHeader />
  <main class="bg-rose-600 text-gray-300 py-4 grow">
    <div class="mx-auto w-80">
      <h2 class="font-medium mb-4">REGISTER</h2>
      <form class="space-y-10" @submit.prevent="submitHandler" role="form" autocomplete="off">
        <AuthFormInput
          id="full-name"
          placeholder="Full Name"
          :required="true"
          type="text"
          v-model="fullName"
        />
        <AuthFormInput
          id="email"
          placeholder="Email"
          :required="true"
          type="email"
          v-model="email"
        />
        <AuthFormInput
          id="password"
          :minlength="6"
          placeholder="Password"
          :required="true"
          type="password"
          v-model="password"
        />
        <AuthFormButton content="REGISTER" :isLoading="isLoading" />
      </form>
      <router-link to="/login" className="block font-medium tracking-wider text-center mt-6">
        LOGIN
      </router-link>
    </div>
  </main>
</template>
