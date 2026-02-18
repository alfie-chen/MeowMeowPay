import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import RegisterModal from "../components/RegisterModal.vue";

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock("../api.js", () => ({
  apiFetch: vi.fn(),
}));

const mockFetchUser = vi.fn();
vi.mock("../composables/useAuth.js", () => ({
  useAuth: () => ({
    user: { value: null },
    isAuthenticated: { value: false },
    isLoading: { value: false },
    error: { value: null },
    fetchUser: mockFetchUser,
    logout: vi.fn(),
  }),
}));

import { apiFetch } from "../api.js";

// ── Helpers ────────────────────────────────────────────────────────────────

function mountModal() {
  return mount(RegisterModal, {
    attachTo: document.body,
  });
}

async function fillForm(wrapper, overrides = {}) {
  const fields = {
    name: "貓咪用戶",
    email: "meow@example.com",
    password: "Secure123",
    confirmPassword: "Secure123",
    ...overrides,
  };
  await wrapper.find("#register-name").setValue(fields.name);
  await wrapper.find("#register-email").setValue(fields.email);
  await wrapper.find("#register-password").setValue(fields.password);
  await wrapper.find("#register-confirm-password").setValue(
    fields.confirmPassword,
  );
}

async function submitForm(wrapper) {
  await wrapper.find("form").trigger("submit");
}

afterEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = "";
});

// ── Tests ──────────────────────────────────────────────────────────────────

describe("RegisterModal", () => {
  // ── Rendering ────────────────────────────────────────────────────────────

  it("renders all four form fields and the submit button", () => {
    const wrapper = mountModal();

    expect(wrapper.find("#register-name").exists()).toBe(true);
    expect(wrapper.find("#register-email").exists()).toBe(true);
    expect(wrapper.find("#register-password").exists()).toBe(true);
    expect(wrapper.find("#register-confirm-password").exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toContain(
      "立即建立帳號",
    );
  });

  it("emits close when the × button is clicked", async () => {
    const wrapper = mountModal();
    await wrapper.find('button[aria-label="關閉"]').trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("emits close when the overlay backdrop is clicked", async () => {
    const wrapper = mountModal();
    await wrapper.find(".modal-overlay").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("emits close when ESC key is pressed", async () => {
    const wrapper = mountModal();
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("removes keydown listener after unmount", async () => {
    const wrapper = mountModal();
    wrapper.unmount();
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(event);
    // No error thrown — listener was cleanly removed
  });

  // ── Validation: empty fields ──────────────────────────────────────────────

  it("shows 姓名為必填 when name is empty", async () => {
    const wrapper = mountModal();
    await fillForm(wrapper, { name: "" });
    await submitForm(wrapper);

    expect(wrapper.find("#error-name").text()).toBe("姓名為必填");
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("shows 姓名為必填 when name is only whitespace", async () => {
    const wrapper = mountModal();
    await fillForm(wrapper, { name: "   " });
    await submitForm(wrapper);

    expect(wrapper.find("#error-name").text()).toBe("姓名為必填");
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("shows Email 為必填 when email is empty", async () => {
    const wrapper = mountModal();
    await fillForm(wrapper, { email: "" });
    await submitForm(wrapper);

    expect(wrapper.find("#error-email").text()).toBe("Email 為必填");
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("shows invalid email format error for non-email strings", async () => {
    const wrapper = mountModal();
    await fillForm(wrapper, { email: "invalid-email" });
    await submitForm(wrapper);

    expect(wrapper.find("#error-email").text()).toBe(
      "請輸入有效的 Email 格式",
    );
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("shows invalid email format error for abc123", async () => {
    const wrapper = mountModal();
    await fillForm(wrapper, { email: "abc123" });
    await submitForm(wrapper);

    expect(wrapper.find("#error-email").text()).toBe(
      "請輸入有效的 Email 格式",
    );
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("shows password too short error when password has fewer than 8 chars", async () => {
    const wrapper = mountModal();
    await fillForm(wrapper, { password: "Short7C", confirmPassword: "Short7C" });
    await submitForm(wrapper);

    expect(wrapper.find("#error-password").text()).toBe(
      "密碼至少需要 8 個字元",
    );
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("does not show password error for password of exactly 8 chars", async () => {
    apiFetch.mockResolvedValueOnce({ id: "1", email: "meow@example.com", name: "貓咪用戶", avatar_url: null });

    const wrapper = mountModal();
    await fillForm(wrapper, {
      password: "Exact8Ch",
      confirmPassword: "Exact8Ch",
    });
    await submitForm(wrapper);
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#error-password").exists()).toBe(false);
  });

  it("shows 兩次密碼輸入不一致 when passwords do not match", async () => {
    const wrapper = mountModal();
    await fillForm(wrapper, { confirmPassword: "Differ!!" });
    await submitForm(wrapper);

    expect(wrapper.find("#error-confirm-password").text()).toBe(
      "兩次密碼輸入不一致",
    );
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("shows 兩次密碼輸入不一致 when confirmPassword is empty and password is valid", async () => {
    const wrapper = mountModal();
    await fillForm(wrapper, { confirmPassword: "" });
    await submitForm(wrapper);

    expect(wrapper.find("#error-confirm-password").text()).toBe(
      "兩次密碼輸入不一致",
    );
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("does not fire API request when any validation fails", async () => {
    const wrapper = mountModal();
    // All fields empty
    await submitForm(wrapper);
    expect(apiFetch).not.toHaveBeenCalled();
  });

  // ── API call: success ─────────────────────────────────────────────────────

  it("calls POST /auth/register with correct payload on valid submit", async () => {
    apiFetch.mockResolvedValueOnce({
      id: "1",
      email: "meow@example.com",
      name: "貓咪用戶",
      avatar_url: null,
    });

    const wrapper = mountModal();
    await fillForm(wrapper);
    await submitForm(wrapper);
    await wrapper.vm.$nextTick();

    expect(apiFetch).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "貓咪用戶",
        email: "meow@example.com",
        password: "Secure123",
      }),
    });
  });

  it("trims leading/trailing whitespace from name before sending", async () => {
    apiFetch.mockResolvedValueOnce({
      id: "1",
      email: "meow@example.com",
      name: "貓咪用戶",
      avatar_url: null,
    });

    const wrapper = mountModal();
    await fillForm(wrapper, { name: "  貓咪用戶  " });
    await submitForm(wrapper);
    await wrapper.vm.$nextTick();

    const body = JSON.parse(apiFetch.mock.calls[0][1].body);
    expect(body.name).toBe("貓咪用戶");
  });

  it("calls fetchUser and emits close after successful registration", async () => {
    apiFetch.mockResolvedValueOnce({
      id: "1",
      email: "meow@example.com",
      name: "貓咪用戶",
      avatar_url: null,
    });
    mockFetchUser.mockResolvedValueOnce();

    const wrapper = mountModal();
    await fillForm(wrapper);
    await submitForm(wrapper);
    await wrapper.vm.$nextTick();

    expect(mockFetchUser).toHaveBeenCalled();
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  // ── API call: 409 conflict ────────────────────────────────────────────────

  it("shows email field error on 409 response", async () => {
    const err = new Error("API error: 409");
    err.status = 409;
    err.body = { detail: "Email already registered" };
    apiFetch.mockRejectedValueOnce(err);

    const wrapper = mountModal();
    await fillForm(wrapper);
    await submitForm(wrapper);
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#error-email").text()).toBe(
      "此 Email 已被使用，請直接登入或使用其他 Email",
    );
    expect(wrapper.find(".general-error").exists()).toBe(false);
    expect(wrapper.emitted("close")).toBeFalsy();
  });

  it("does not call fetchUser on 409", async () => {
    const err = new Error("API error: 409");
    err.status = 409;
    apiFetch.mockRejectedValueOnce(err);

    const wrapper = mountModal();
    await fillForm(wrapper);
    await submitForm(wrapper);
    await wrapper.vm.$nextTick();

    expect(mockFetchUser).not.toHaveBeenCalled();
  });

  // ── API call: other errors ────────────────────────────────────────────────

  it("shows general error message for non-409 API errors", async () => {
    const err = new Error("API error: 500");
    err.status = 500;
    apiFetch.mockRejectedValueOnce(err);

    const wrapper = mountModal();
    await fillForm(wrapper);
    await submitForm(wrapper);
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".general-error").text()).toBe("發生錯誤，請稍後再試");
    expect(wrapper.find("#error-email").exists()).toBe(false);
    expect(wrapper.emitted("close")).toBeFalsy();
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  it("disables the submit button while the API call is in-flight", async () => {
    let resolveApi;
    apiFetch.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveApi = resolve;
      }),
    );

    const wrapper = mountModal();
    await fillForm(wrapper);
    await submitForm(wrapper);

    // While pending, button should be disabled
    expect(wrapper.find('button[type="submit"]').attributes("disabled")).toBeDefined();

    // Resolve the API call
    resolveApi({ id: "1", email: "meow@example.com", name: "貓咪用戶", avatar_url: null });
    await wrapper.vm.$nextTick();
  });

  it("re-enables the submit button after an API error", async () => {
    const err = new Error("API error: 500");
    err.status = 500;
    apiFetch.mockRejectedValueOnce(err);

    const wrapper = mountModal();
    await fillForm(wrapper);
    await submitForm(wrapper);
    await wrapper.vm.$nextTick();

    expect(
      wrapper.find('button[type="submit"]').attributes("disabled"),
    ).toBeUndefined();
  });
});
