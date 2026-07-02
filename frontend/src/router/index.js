import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'), 
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { 
      requiresAuth: true,
      roles: ['Admin', 'TU'] 
    }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('@/views/Transactions.vue'), 
    meta: { 
      requiresAuth: true,
      roles: ['Admin', 'TU']
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/Reports.vue'),
    meta: { 
      requiresAuth: true,
      roles: ['Admin', 'TU']
    }
  },
  {
    path: '/classes',
    name: 'ClassManagement',
    component: () => import('@/views/ClassManagement.vue'),
    meta: { 
      requiresAuth: true,
      roles: ['Admin']
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.role;

  if (to.meta.requiresAuth) {
    
    if (!isAuthenticated) {
      return next({ name: 'Login' });
    }

    if (to.meta.roles && !to.meta.roles.includes(userRole)) {
      return next({ name: 'Dashboard' }); 
    }
    
    return next();
  } 
  
  else if (to.name === 'Login' && isAuthenticated) {
    return next({ name: 'Dashboard' });
  }

  next();
});

export default router;