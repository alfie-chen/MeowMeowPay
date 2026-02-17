import { describe, it, expect, vi } from "vitest";
import { ref, computed } from "vue";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import LoginButton from "../components/LoginButton.vue";

const mockUserRef = ref(null);
const mockIsLoading = ref(false);

vi.mock("../composables/useAuth.js", () => ({
  useAuth: () => ({
    user: mockUserRef,
    isAuthenticated: computed(() => !!mockUserRef.value),
    isLoading: mockIsLoading,
    error: ref(null),
    fetchUser: vi.fn(),
    logout: vi.fn(),
  }),
}));

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div>Home</div>" } },
      { path: "/login", component: { template: "<div>Login</div>" } },
    ],
  });
}

describe("LoginButton", () => {
  it("shows login link when not authenticated", async () => {
    mockUserRef.value = null;
    mockIsLoading.value = false;

    const router = createTestRouter();
    await router.push("/");
    await router.isReady();

    const wrapper = mount(LoginButton, {
      global: { plugins: [router] },
    });

    const link = wrapper.find("a");
    expect(link.exists()).toBe(true);
    expect(link.text()).toBe("登入");
    expect(link.attributes("href")).toBe("/login");
  });

  it("shows UserMenu when authenticated", async () => {
    mockUserRef.value = { id: "1", email: "cat@meow.com", name: "Meow", avatar_url: null };
    mockIsLoading.value = false;

    const router = createTestRouter();
    await router.push("/");
    await router.isReady();

    const wrapper = mount(LoginButton, {
      global: { plugins: [router] },
    });

    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.find('[aria-label="使用者選單"]').exists()).toBe(true);
  });

  it("shows nothing while loading", async () => {
    mockUserRef.value = null;
    mockIsLoading.value = true;

    const router = createTestRouter();
    await router.push("/");
    await router.isReady();

    const wrapper = mount(LoginButton, {
      global: { plugins: [router] },
    });

    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.find('[aria-label="使用者選單"]').exists()).toBe(false);
  });
});
