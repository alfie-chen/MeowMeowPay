import { ref, computed, readonly } from "vue";
import { apiFetch } from "../api.js";

const user = ref(null);
const isLoading = ref(true);
const error = ref(null);

const isAuthenticated = computed(() => !!user.value);

async function fetchUser() {
  isLoading.value = true;
  error.value = null;
  try {
    user.value = await apiFetch("/auth/me");
  } catch (err) {
    user.value = null;
    if (err.status !== 401) {
      error.value = err;
    }
  } finally {
    isLoading.value = false;
  }
}

async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    // Clear local state even if API call fails
  }
  user.value = null;
}

export function useAuth() {
  return {
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchUser,
    logout,
  };
}
