/** Help & support destinations for in-app help sheet. */
export const supportLinks = {
  email: "hello@modufy.app",
  docs: process.env.NEXT_PUBLIC_DOCS_URL ?? "https://modufy.app/docs",
  demo: process.env.NEXT_PUBLIC_DEMO_URL ?? "https://modufy.app/demo",
  contact: process.env.NEXT_PUBLIC_CONTACT_URL ?? "https://modufy.app/contact",
} as const;
