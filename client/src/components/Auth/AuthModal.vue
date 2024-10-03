<!-- src/components/AuthModal.vue -->
<template>
  <modal name="auth-modal" height="auto" width="400">
    <div class="modal-content">
      <button class="close" @click="closeModal">&times;</button>
      <div class="auth-container">
        <div v-if="isLogin">
          <Login @close="closeModal" />
        </div>
        <div v-else>
          <Register @close="closeModal" />
        </div>
      </div>
      <div class="tab">
        <a v-if="!isLogin"
          :class="['auth-link', { active: isLogin }]" 
          @click.prevent="showLogin"
          href="#"
        >
          Login
        </a>
        <a v-else
          :class="['auth-link', { active: !isLogin }]" 
          @click.prevent="showRegister"
          href="#"
        >
          New User? Register here.
        </a>
      </div>
    </div>
  </modal>
</template>

<script>
import Login from './Login.vue';
import Register from './Register.vue';

export default {
  components: {
    Login,
    Register,
  },
  data() {
    return {
      isLogin: true,
    };
  },
  methods: {
    showLogin() {
      this.isLogin = true;
    },
    showRegister() {
      this.isLogin = false;
    },
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal-content {
  padding: 2rem;
  text-align: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.auth-container {
  margin-bottom: 1.5rem;
}

.tab {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.auth-link {
  margin: 0 0.5rem;
  padding: 0.65rem 1.3rem;
  /* background-color: #f0f0f0; */
  color: #333333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  text-decoration: none;
}
.modal-content{
  border-top: 2px solid #42b983;
  border-radius: 0;
  /* border-bottom: 2px solid #42b983; */
}
.auth-link:hover {
  background-color: #e0e0e0d7;
}

.auth-link.active {
  background-color: #42b983;
  color: white;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close:hover {
  color: #333333;
}
</style>