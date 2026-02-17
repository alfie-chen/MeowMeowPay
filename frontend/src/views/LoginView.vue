<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import GoogleLoginButton from "../components/GoogleLoginButton.vue";

const route = useRoute();
const errorMessage = computed(() => {
  if (route.query.error === "cancelled") return "登入已取消";
  if (route.query.error === "failed") return "登入失敗，請稍後再試";
  return null;
});
</script>

<template>
  <div class="login-view">
    <div class="login-container">
      <span class="login-logo">🐱</span>
      <h1 class="login-title">歡迎使用 MeowMeowPay</h1>
      <p class="login-subtitle">使用 Google 帳號快速登入或註冊</p>

      <div v-if="errorMessage" class="login-error" role="alert">
        {{ errorMessage }}
      </div>

      <div class="login-action">
        <GoogleLoginButton />
      </div>
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
  max-width: 420px;
  width: 100%;
}

.login-logo {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--space-6);
}

.login-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-3);
  color: var(--color-text);
}

.login-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  margin-bottom: var(--space-8);
}

.login-error {
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-6);
  background: hsla(0, 70%, 50%, 0.1);
  border: 1px solid hsla(0, 70%, 50%, 0.3);
  border-radius: var(--radius-md);
  color: hsl(0, 70%, 65%);
  font-size: var(--font-size-sm);
}

.login-action {
  display: flex;
  justify-content: center;
}
</style>
