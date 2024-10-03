import Vue from 'vue';
import Router from 'vue-router';
import ListProjects from '@/components/ListProjects.vue';
import ManageTodo from './components/ManageTodo.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'ListProjects',
      component: ListProjects
    },
    {
      path: '/manage-todo', 
      name: 'ManageTodo',
      component: ManageTodo
    }
  ]
});
