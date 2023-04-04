<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(useUserStore, ['signIn']),
    async handleSubmit({ target: form }) {
      if (form.checkValidity()) {
        try {
          await this.signIn({ email: this.email, password: this.password })
          this.$router.push({ path: '/' })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
</script>

<template>
  <header class="bg-gray-700 text-fuchsia-200 h-64 flex items-center justify-center">
    <h1>RANKING</h1>
  </header>
  <main class="bg-red-500 text-gray-100 py-4">
    <h2 class="text-center mb-4">LOGIN</h2>
    <form
      class="mx-auto w-4/5 space-y-10"
      @submit.prevent="handleSubmit"
      role="form"
      autocomplete="off"
    >
      <div class="relative flex flex-col">
        <input
          type="email"
          id="email"
          class="peer h-12 rounded-md bg-transparent px-3 placeholder-transparent outline-none border-2"
          placeholder="Email"
          required
          v-model="email"
        />
        <label
          for="email"
          class="absolute top-0 bottom-0 left-3 m-auto h-max -translate-y-6 bg-red-500 p-1 text-xs text-opacity-60 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-xs"
        >
          Email
        </label>
      </div>
      <div class="relative flex flex-col">
        <input
          type="password"
          id="password"
          class="peer h-12 rounded-md bg-transparent px-3 placeholder-transparent outline-none border-2"
          placeholder="Password"
          required
          minlength="6"
          v-model="password"
        />
        <label
          for="password"
          class="absolute top-0 bottom-0 left-3 m-auto h-max -translate-y-6 bg-red-500 p-1 text-xs text-opacity-60 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-xs"
        >
          Password
        </label>
      </div>
      <input
        className="mt-8 h-12 w-full rounded-md bg-gray-900 text-sm font-medium tracking-wider text-white shadow-md outline-none disabled:opacity-75"
        type="submit"
        value="LOGIN"
      />
    </form>
  </main>
  <footer class="bg-red-500 h-full text-center py-4">
    <router-link to="/register" className="text-sm font-medium tracking-wider text-white">
      REGISTER
    </router-link>
  </footer>
</template>
