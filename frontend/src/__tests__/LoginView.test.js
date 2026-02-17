import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";

vi.mock("../composables/useAuth.js", () => ({
  useAuth: () => ({
    user: { value: null },
    isAuthenticated: { value: false },
    isLoading: { value: false },
    error: { value: null },
    fetchUser: vi.fn(),
    logout: vi.fn(),
  }),
}));

function createTestRouter(initialRoute = "/login") {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/login", component: LoginView },
      { path: "/", component: { template: "<div>Home</div>" } },
    ],
  });
}

async function mountLoginView(query = {}) {
  const router = createTestRouter();
  router.push({ path: "/login", query });
  await router.isReady();

  return mount(LoginView, {
    global: {
      plugins: [router],
    },
  });
}

describe("LoginView", () => {
  it("renders the login page with branding", async () => {
    const wrapper = await mountLoginView();

    expect(wrapper.text()).toContain("歡迎使用 MeowMeowPay");
    expect(wrapper.text()).toContain("使用 Google 帳號快速登入或註冊");
  });

  it("renders the Google login button", async () => {
    const wrapper = await mountLoginView();

    expect(wrapper.text()).toContain("使用 Google 帳號登入");
  });

  it("shows cancelled error message", async () => {
    const wrapper = await mountLoginView({ error: "cancelled" });

    const alert = wrapper.find('[role="alert"]');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toBe("登入已取消");
  });

  it("shows failed error message", async () => {
    const wrapper = await mountLoginView({ error: "failed" });

    const alert = wrapper.find('[role="alert"]');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toBe("登入失敗，請稍後再試");
  });

  it("does not show error message when no error query", async () => {
    const wrapper = await mountLoginView();

    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });
});
