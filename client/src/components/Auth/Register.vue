<!-- src/components/Register.vue -->
<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="username">Username:</label>
        <input v-model="username" id="username" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'UserRegister',
  data() {
    return {
      username: '',
      password: '',
      error: null,
    };
  },
  methods: {
    ...mapActions(['register']),
    async registerUser() {
      try {
        await this.register({ username: this.username, password: this.password });
        this.$emit('close'); // Close the modal on successful registration
        this.$toast.success('Registration successful!');
      } catch (error) {
        this.error = error.response.data.error; // Display error message
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);/ */
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #333333;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333333;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
  background-color: #42b983;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #369f6b;
}

.error-message {
  margin-top: 1rem;
  color: #ff0000;
  font-weight: 500;
}
</style>