import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import employees from '../pages/Employees-List.vue';
import HelloWorld from '../components/HelloWorld.vue';
import { isLoggedIn } from '../stores/authStore';

const routes = [
  { path: '/', component: HelloWorld },
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (isLoggedIn.value) {
        next('/employees-list'); // redirect if already logged in
      } else {
        next();
      }
    }
  },
  { path: '/employees-list', 
    component: employees,
    meta: { requiresAuth: true }
   },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
