<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import useSnackbarStore from '@/stores/snackbar'
import WelcomeHeader from '../components/WelcomeHeader.vue'
import AuthFormInput from '../components/AuthFormInput.vue'
import AuthFormButton from '../components/AuthFormButton.vue'

export default {
  name: 'Login',
  components: {
    WelcomeHeader,
    AuthFormInput,
    AuthFormButton
  },
  data() {
    return {
      email: '',
      password: '',
      isLoading: false
    }
  },
  methods: {
    ...mapActions(useUserStore, ['signIn']),
    ...mapActions(useSnackbarStore, ['showMSG']),
    async submitHandler($event) {
      if ($event.target.checkValidity()) {
        try {
          this.isLoading = true
          await this.signIn({ email: this.email, password: this.password })
          $event.target.reset()
          this.$router.push({ path: '/' })
        } catch (error) {
          console.log(error)
          if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            this.showMSG('error', 'Invalid email or password!')
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
      <h2 class="font-medium mb-4">LOGIN</h2>
      <form class="space-y-10" role="form" autocomplete="off" @submit.prevent="submitHandler">
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
        <AuthFormButton content="LOGIN" :isLoading="isLoading" />
      </form>
      <router-link to="/register" class="block font-medium tracking-wider text-center mt-6">
        REGISTER
      </router-link>
    </div>
  </main>
</template>
