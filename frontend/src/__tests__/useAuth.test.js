import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api.js", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "../api.js";

// useAuth uses module-level singleton state, so we use dynamic imports
// with vi.resetModules() to get a fresh instance per test
async function getUseAuth() {
  vi.resetModules();
  const mod = await import("../composables/useAuth.js");
  return mod.useAuth();
}

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchUser sets user on success", async () => {
    const mockUser = { id: "1", email: "cat@meow.com", name: "Meow", avatar_url: null };
    apiFetch.mockResolvedValueOnce(mockUser);

    const { user, isAuthenticated, isLoading, fetchUser } = await getUseAuth();

    await fetchUser();

    expect(apiFetch).toHaveBeenCalledWith("/auth/me");
    expect(user.value).toEqual(mockUser);
    expect(isAuthenticated.value).toBe(true);
    expect(isLoading.value).toBe(false);
  });

  it("fetchUser clears user on 401 without setting error", async () => {
    const err = new Error("API error: 401");
    err.status = 401;
    apiFetch.mockRejectedValueOnce(err);

    const { user, isAuthenticated, isLoading, error, fetchUser } = await getUseAuth();

    await fetchUser();

    expect(user.value).toBeNull();
    expect(isAuthenticated.value).toBe(false);
    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("fetchUser sets error on non-401 failure", async () => {
    const err = new Error("API error: 500");
    err.status = 500;
    apiFetch.mockRejectedValueOnce(err);

    const { user, error, fetchUser } = await getUseAuth();

    await fetchUser();

    expect(user.value).toBeNull();
    expect(error.value).toBe(err);
  });

  it("logout clears user and calls API", async () => {
    const mockUser = { id: "1", email: "cat@meow.com", name: "Meow", avatar_url: null };
    apiFetch.mockResolvedValueOnce(mockUser);
    apiFetch.mockResolvedValueOnce({});

    const { user, isAuthenticated, fetchUser, logout } = await getUseAuth();

    await fetchUser();
    expect(isAuthenticated.value).toBe(true);

    await logout();

    expect(apiFetch).toHaveBeenCalledWith("/auth/logout", { method: "POST" });
    expect(user.value).toBeNull();
    expect(isAuthenticated.value).toBe(false);
  });

  it("logout clears user even if API call fails", async () => {
    const mockUser = { id: "1", email: "cat@meow.com", name: "Meow", avatar_url: null };
    apiFetch.mockResolvedValueOnce(mockUser);
    apiFetch.mockRejectedValueOnce(new Error("network error"));

    const { user, fetchUser, logout } = await getUseAuth();

    await fetchUser();
    await logout();

    expect(user.value).toBeNull();
  });

  it("isLoading starts as true", async () => {
    const { isLoading } = await getUseAuth();
    expect(isLoading.value).toBe(true);
  });
});
