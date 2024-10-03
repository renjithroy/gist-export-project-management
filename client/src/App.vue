<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/">HOME</router-link>
      <button v-if="!isAuthenticated" class="auth-button" @click="openModal">LOG IN</button>
      <button v-else class="auth-button" @click="handleLogout">LOG OUT</button>
      <auth-modal @close="closeModal" />
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import AuthModal from '@/components/Auth/AuthModal.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  components: {
    AuthModal
  },
  methods: {
    openModal() {
      this.$modal.show('auth-modal');
    },
    closeModal() {
      this.$modal.hide('auth-modal');
    },
    ...mapActions(['logout']),
    handleLogout() {
      this.logout().then(() => {
        this.$toast.success('Logged out successfully!');
      });
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  watch: {
    isAuthenticated(newVal) {
      console.log('isAuthenticated:', newVal);
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

nav {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  position: relative;
  font-weight: 500;
}

a {
  text-decoration: none;
  color: #42b983;
  margin: 0 1rem;
}

.auth-button {
  background-color: #222222;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s;
  position: absolute;
  right: 50px;
}

.auth-button:hover {
  background-color: #333333; 
}

#app {
  font-family: "Montserrat", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

.navbar {
 margin-bottom: 2rem;
}
</style>