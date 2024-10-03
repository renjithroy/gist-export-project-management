import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        todos: [],
        projects: [],
        user: {},
        token: null,
    },
    mutations: {
        SET_TODOS(state, todos) {
            state.todos = todos;
        },
        ADD_TODO(state, todo) {
            state.todos.push(todo);
        },
        UPDATE_TODO_STATUS(state, { id, status }) {
            const todo = state.todos.find(t => t.id === id);
            if (todo) {
                todo.status = status;
            }
        },
        SET_PROJECTS(state, projects) {
            state.projects = projects;
        },
        // USER AUTHENTICATION
        SET_USER(state, user) {
            console.log("SET_USER", user);
            state.user.id = user.id;
            state.user.username = user.username;
        },
        SET_TOKEN(state, token) {
            state.token = token;
        },
        CLEAR_AUTH(state) {
            localStorage.removeItem('token');
            state.user = {};
            state.token = null;
            state.projects = [];
            state.todos = [];
        },
    },
    actions: {
        fetchTodos({ commit }) {
            axios.get('http://localhost:3000/api/todos')
                .then((response) => {
                    commit('SET_TODOS', response.data)
                })
                .catch((error) => {
                    console.error('Error fetching todos:', error);
                })
        },
        addTodo({ commit }, todo) {
            axios.post('http://localhost:3000/api/todos', todo)
                .then((response) => {
                    commit('ADD_TODO', response.data);
                })
                .catch((error) => {
                    console.error('Error adding todo:', error);
                })
        },
        updateTodoStatus({ commit }, { id, status }) {
            axios.put(`http://localhost:3000/api/todos/${id}`, { status })
                .then((response) => {
                    commit('UPDATE_TODO_STATUS', { id, status: response.data.status });
                })
                .catch((error) => {
                    console.error('Error updating todo status:', error);
                })
        },
        // PROJECTS
       
        // USER AUTHENTICATION
        async register({ commit }, userData) {
            try {
                const response = await axios.post('http://localhost:3000/api/auth/register', userData);
                console.log("register response",response.data);
                commit('SET_USER', response.data);
                commit('SET_TOKEN', response.data.token);
                localStorage.setItem('token', response.data.token); // Store token in local storage
            } catch (error) {
                console.error('Registration error:', error.response.data.error);
                throw error;
            }
        },
        async login({ commit }, credentials) {
            try {
                const response = await axios.post('http://localhost:3000/api/auth/login', credentials);
                commit('SET_USER', response.data);
                commit('SET_TOKEN', response.data.token);
                localStorage.setItem('token', response.data.token);
                // window.location.reload();
            } catch (error) {
                console.error('Login error:',error.response.data.error);
                throw error;
            }
        },
        logout({ commit }) {
            commit('CLEAR_AUTH');
        },
    },
    getters: {
        pendingTodos: state => {
            return state.todos.filter(todo => todo.status === 'pending');
        },
        completedTodos: state => {
            return state.todos.filter(todo => todo.status === 'complete');
        },
        fetchProjects: state => {
            return state.projects;
        },
        isAuthenticated(state) {
            return !!state.token;
        },
        getUser(state) {
            return state.user;
        },
        getProjects(state) {
            return state.projects;
        }
    }
});

const storedToken = localStorage.getItem('token');
if (storedToken) {
    store.commit('SET_TOKEN', storedToken);
}

export default store;