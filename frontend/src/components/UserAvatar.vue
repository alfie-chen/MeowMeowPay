<script setup>
const props = defineProps({
  src: { type: String, default: null },
  name: { type: String, default: "" },
  size: { type: String, default: "32" },
});

const initials = props.name
  ? props.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  : "?";
</script>

<template>
  <img
    v-if="src"
    :src="src"
    :alt="name"
    class="avatar"
    :style="{ width: size + 'px', height: size + 'px' }"
    referrerpolicy="no-referrer"
  />
  <span
    v-else
    class="avatar avatar-fallback"
    :style="{ width: size + 'px', height: size + 'px', fontSize: size / 2.2 + 'px' }"
    role="img"
    :aria-label="name"
  >
    {{ initials }}
  </span>
</template>

<style scoped>
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  object-fit: cover;
  flex-shrink: 0;
}

.avatar-fallback {
  background: var(--color-primary);
  color: white;
  font-weight: 600;
}
</style>
