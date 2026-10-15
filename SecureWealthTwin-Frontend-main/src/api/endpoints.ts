export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },

  DASHBOARD: "/dashboard",

  ACCOUNTS: "/accounts",

  TRANSACTIONS: "/transactions",

  GOALS: "/goals",

  NOTIFICATIONS: "/notifications",

  NOTIFICATION_DEVICES: "/notifications/devices",

  AI: {
    CHAT: "/ai/chat",
  },

  FRAUD: {
    CHECK: "/fraud/check",
  },

  PROFILE: "/profile",

  SETTINGS: "/settings",
} as const;
