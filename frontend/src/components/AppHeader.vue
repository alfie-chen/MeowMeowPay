<script setup>
import LoginButton from "./LoginButton.vue";
</script>

<template>
  <nav class="nav">
    <div class="nav-brand">
      <router-link to="/" class="nav-logo-link">
        <span class="nav-logo">🐱</span>
        <span class="nav-name">MeowMeowPay</span>
      </router-link>
    </div>

    <div class="nav-actions">
      <LoginButton />
    </div>
  </nav>
</template>

<style scoped>
.nav {
  padding: var(--space-4) var(--space-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 10;
  background: hsla(240, 15%, 9%, 0.7);
}

@media (prefers-color-scheme: light) {
  .nav {
    background: hsla(240, 20%, 98%, 0.7);
  }
}

.nav-brand {
  display: flex;
  align-items: center;
}

.nav-logo-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: var(--color-text);
}

.nav-logo {
  font-size: var(--font-size-2xl);
}

.nav-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
</style>
