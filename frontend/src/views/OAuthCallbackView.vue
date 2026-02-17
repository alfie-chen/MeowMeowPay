<script setup>
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth.js";

const router = useRouter();
const route = useRoute();
const { fetchUser } = useAuth();

onMounted(async () => {
  if (route.query.error) {
    router.replace({ path: "/login", query: { error: route.query.error } });
    return;
  }

  await fetchUser();
  router.replace("/");
});
</script>

<template>
  <div class="callback-view">
    <p class="callback-text">登入中...</p>
  </div>
</template>

<style scoped>
.callback-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.callback-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}
</style>
