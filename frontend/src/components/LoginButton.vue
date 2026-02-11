<script setup>
import { ref } from "vue";

// Mock authentication state
// In the future, this will be replaced by a real auth hook or store
const isAuthenticated = ref(false);
</script>

<template>
  <router-link v-if="!isAuthenticated" to="/login" class="login-btn">
    登入
  </router-link>
</template>

<style scoped>
.login-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
  background-color: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
  cursor: pointer;
}

.login-btn:hover {
  background-color: var(--color-surface);
  border-color: var(--color-text-secondary);
}

.login-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
