<script setup></script>

<template>
  <div class="login-view">
    <div class="login-container">
      <h1 class="login-title">Login Page</h1>
      <p class="login-subtitle">Coming Soon</p>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
}

.login-container {
  text-align: center;
  background: var(--color-bg-card);
  padding: var(--space-12);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
}

.login-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
  color: var(--color-text);
}

.login-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}
</style>
