import { describe, it, expect, vi, afterEach } from "vitest";
import { ref, computed } from "vue";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import UserMenu from "../components/UserMenu.vue";

const mockUser = {
  id: "1",
  email: "cat@meow.com",
  name: "Meow Cat",
  avatar_url: "https://example.com/avatar.jpg",
};

const mockUserRef = ref(mockUser);
const mockLogout = vi.fn();

vi.mock("../composables/useAuth.js", () => ({
  useAuth: () => ({
    user: mockUserRef,
    isAuthenticated: computed(() => !!mockUserRef.value),
    isLoading: ref(false),
    error: ref(null),
    fetchUser: vi.fn(),
    logout: mockLogout,
  }),
}));

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div>Home</div>" } },
    ],
  });
}

async function mountUserMenu() {
  const router = createTestRouter();
  await router.push("/");
  await router.isReady();

  return mount(UserMenu, {
    global: { plugins: [router] },
  });
}

afterEach(() => {
  // Clean up teleported elements
  document.body.innerHTML = "";
  vi.clearAllMocks();
});

describe("UserMenu", () => {
  it("displays user name and avatar", async () => {
    const wrapper = await mountUserMenu();

    expect(wrapper.text()).toContain("Meow Cat");
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("https://example.com/avatar.jpg");
  });

  it("opens dropdown on click", async () => {
    const wrapper = await mountUserMenu();

    expect(wrapper.find('[role="menu"]').exists()).toBe(false);

    await wrapper.find('[aria-label="使用者選單"]').trigger("click");

    expect(wrapper.find('[role="menu"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("cat@meow.com");
    expect(wrapper.text()).toContain("登出");
  });

  it("closes dropdown on backdrop click", async () => {
    const wrapper = await mountUserMenu();

    await wrapper.find('[aria-label="使用者選單"]').trigger("click");
    expect(wrapper.find('[role="menu"]').exists()).toBe(true);

    // Click the trigger again to toggle off
    await wrapper.find('[aria-label="使用者選單"]').trigger("click");

    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
  });

  it("calls logout on logout click", async () => {
    const wrapper = await mountUserMenu();

    await wrapper.find('[aria-label="使用者選單"]').trigger("click");
    await wrapper.find('[role="menuitem"]').trigger("click");

    expect(mockLogout).toHaveBeenCalled();
  });

  it("has correct aria-expanded attribute", async () => {
    const wrapper = await mountUserMenu();
    const trigger = wrapper.find('[aria-label="使用者選單"]');

    expect(trigger.attributes("aria-expanded")).toBe("false");

    await trigger.trigger("click");
    expect(trigger.attributes("aria-expanded")).toBe("true");
  });
});
