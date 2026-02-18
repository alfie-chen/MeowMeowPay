<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { apiFetch } from "../api.js";
import { useAuth } from "../composables/useAuth.js";

const emit = defineEmits(["close"]);

const { fetchUser } = useAuth();

const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});
const errors = ref({});
const isLoading = ref(false);
const generalError = ref("");

const nameInput = ref(null);

onMounted(() => {
  nameInput.value?.focus();
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});

function handleKeyDown(e) {
  if (e.key === "Escape") emit("close");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate() {
  const errs = {};

  if (!form.value.name.trim()) {
    errs.name = "姓名為必填";
  }

  if (!form.value.email) {
    errs.email = "Email 為必填";
  } else if (!isValidEmail(form.value.email)) {
    errs.email = "請輸入有效的 Email 格式";
  }

  if (!form.value.password || form.value.password.length < 8) {
    errs.password = "密碼至少需要 8 個字元";
  }

  if (form.value.password && form.value.password.length >= 8) {
    if (form.value.confirmPassword !== form.value.password) {
      errs.confirmPassword = "兩次密碼輸入不一致";
    }
  }

  return errs;
}

async function handleSubmit() {
  errors.value = {};
  generalError.value = "";

  const errs = validate();
  if (Object.keys(errs).length > 0) {
    errors.value = errs;
    return;
  }

  isLoading.value = true;
  try {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: form.value.name.trim(),
        email: form.value.email,
        password: form.value.password,
      }),
    });
    await fetchUser();
    emit("close");
  } catch (err) {
    if (err.status === 409) {
      errors.value = {
        email: "此 Email 已被使用，請直接登入或使用其他 Email",
      };
    } else {
      generalError.value = "發生錯誤，請稍後再試";
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="register-modal-title"
    @click.self="$emit('close')"
  >
    <div class="modal-card">
      <button
        class="modal-close-btn"
        type="button"
        aria-label="關閉"
        @click="$emit('close')"
      >
        &times;
      </button>

      <h2 id="register-modal-title" class="modal-title">建立您的帳號</h2>

      <form class="register-form" novalidate @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="register-name" class="form-label">姓名</label>
          <input
            id="register-name"
            ref="nameInput"
            v-model="form.name"
            type="text"
            class="form-input"
            :class="{ 'form-input--error': errors.name }"
            autocomplete="name"
            :aria-invalid="!!errors.name || undefined"
            :aria-describedby="errors.name ? 'error-name' : undefined"
          />
          <span
            v-if="errors.name"
            id="error-name"
            class="form-error"
            role="alert"
          >
            {{ errors.name }}
          </span>
        </div>

        <div class="form-group">
          <label for="register-email" class="form-label">Email</label>
          <input
            id="register-email"
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ 'form-input--error': errors.email }"
            autocomplete="email"
            :aria-invalid="!!errors.email || undefined"
            :aria-describedby="errors.email ? 'error-email' : undefined"
          />
          <span
            v-if="errors.email"
            id="error-email"
            class="form-error"
            role="alert"
          >
            {{ errors.email }}
          </span>
        </div>

        <div class="form-group">
          <label for="register-password" class="form-label">密碼</label>
          <input
            id="register-password"
            v-model="form.password"
            type="password"
            class="form-input"
            :class="{ 'form-input--error': errors.password }"
            autocomplete="new-password"
            :aria-invalid="!!errors.password || undefined"
            :aria-describedby="errors.password ? 'error-password' : undefined"
          />
          <span
            v-if="errors.password"
            id="error-password"
            class="form-error"
            role="alert"
          >
            {{ errors.password }}
          </span>
        </div>

        <div class="form-group">
          <label for="register-confirm-password" class="form-label"
            >確認密碼</label
          >
          <input
            id="register-confirm-password"
            v-model="form.confirmPassword"
            type="password"
            class="form-input"
            :class="{ 'form-input--error': errors.confirmPassword }"
            autocomplete="new-password"
            :aria-invalid="!!errors.confirmPassword || undefined"
            :aria-describedby="
              errors.confirmPassword ? 'error-confirm-password' : undefined
            "
          />
          <span
            v-if="errors.confirmPassword"
            id="error-confirm-password"
            class="form-error"
            role="alert"
          >
            {{ errors.confirmPassword }}
          </span>
        </div>

        <div v-if="generalError" class="general-error" role="alert">
          {{ generalError }}
        </div>

        <button
          type="submit"
          class="submit-btn"
          :disabled="isLoading"
          :aria-busy="isLoading"
        >
          <span v-if="isLoading" class="spinner" aria-hidden="true"></span>
          <span v-if="isLoading" class="sr-only">處理中...</span>
          <span v-else>立即建立帳號</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* ── Overlay ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: hsla(240, 15%, 5%, 0.7);
  backdrop-filter: blur(4px);
}

@media (prefers-color-scheme: light) {
  .modal-overlay {
    background: hsla(240, 20%, 20%, 0.5);
  }
}

/* ── Card ── */
.modal-card {
  position: relative;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--space-8);
  width: 100%;
  max-width: 440px;
}

.modal-close-btn {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  font-size: var(--font-size-xl);
  line-height: 1;
  cursor: pointer;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background var(--transition-fast);
}

.modal-close-btn:hover {
  color: var(--color-text);
  background: var(--color-surface);
}

.modal-close-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.modal-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-6);
  color: var(--color-text);
}

/* ── Form ── */
.register-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.form-input {
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-base);
  font-family: inherit;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px hsla(260, 65%, 58%, 0.15);
}

.form-input--error {
  border-color: hsl(0, 70%, 55%);
}

.form-input--error:focus {
  box-shadow: 0 0 0 3px hsla(0, 70%, 55%, 0.15);
}

.form-error {
  font-size: var(--font-size-sm);
  color: hsl(0, 70%, 65%);
}

.general-error {
  padding: var(--space-3) var(--space-4);
  background: hsla(0, 70%, 50%, 0.1);
  border: 1px solid hsla(0, 70%, 50%, 0.3);
  border-radius: var(--radius-md);
  color: hsl(0, 70%, 65%);
  font-size: var(--font-size-sm);
}

/* ── Submit Button ── */
.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  margin-top: var(--space-2);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: hsl(0, 0%, 100%);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: opacity var(--transition-base);
  width: 100%;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:focus-visible {
  outline: 2px solid var(--color-primary-light);
  outline-offset: 2px;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Spinner ── */
.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid hsla(0, 0%, 100%, 0.4);
  border-top-color: hsl(0, 0%, 100%);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Screen reader only ── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .modal-card {
    padding: var(--space-6);
    border-radius: var(--radius-lg);
  }

  .modal-title {
    font-size: var(--font-size-xl);
  }
}
</style>
