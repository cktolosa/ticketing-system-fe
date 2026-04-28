<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useAuthStore } from './stores/auth';

const auth = useAuthStore();
const router = useRouter();

if (auth.isAuthenticated) {
  try {
    await auth.fetchMe();
  } catch (error) {
    auth.logout();
    router.push('/');
  }
}
</script>

<template>
  <RouterView />
</template>
