<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserAvatar from "./UserAvatar.vue";
import { useAuth } from "../composables/useAuth.js";

const { user, logout } = useAuth();
const router = useRouter();
const showMenu = ref(false);

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function closeMenu() {
  showMenu.value = false;
}

async function handleLogout() {
  closeMenu();
  await logout();
  router.push("/");
}
</script>

<template>
  <div class="user-menu" v-if="user">
    <button
      class="user-menu-trigger"
      @click="toggleMenu"
      :aria-expanded="showMenu"
      aria-haspopup="true"
      aria-label="使用者選單"
    >
      <UserAvatar :src="user.avatar_url" :name="user.name" size="32" />
      <span class="user-name">{{ user.name }}</span>
    </button>

    <Teleport to="body">
      <div v-if="showMenu" class="user-menu-backdrop" @click="closeMenu"></div>
    </Teleport>

    <div v-if="showMenu" class="user-menu-dropdown" role="menu">
      <div class="user-menu-info">
        <span class="user-menu-email">{{ user.email }}</span>
      </div>
      <hr class="user-menu-divider" />
      <button class="user-menu-item" role="menuitem" @click="handleLogout">
        登出
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-menu {
  position: relative;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  cursor: pointer;
  color: var(--color-text);
  transition: all var(--transition-base);
}

.user-menu-trigger:hover {
  background: var(--color-surface);
  border-color: var(--color-border);
}

.user-menu-trigger:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .user-name {
    display: none;
  }
}

.user-menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 19;
}

.user-menu-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + var(--space-2));
  min-width: 200px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 20;
  overflow: hidden;
}

.user-menu-info {
  padding: var(--space-3) var(--space-4);
}

.user-menu-email {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.user-menu-divider {
  border: none;
  border-top: 1px solid var(--color-border);
}

.user-menu-item {
  display: block;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: var(--font-size-sm);
  text-align: left;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.user-menu-item:hover {
  background: var(--color-surface);
}

.user-menu-item:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}
</style>
