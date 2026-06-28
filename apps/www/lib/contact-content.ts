export const contactInfo = {
  headline: "Tell us what you're building",
  description:
    "Whether you're exploring Modufy for the first time or need help with an existing account, our team is ready. Most messages get a reply within one business day.",
  office: {
    label: "Head office",
    address: "4132 Thornridge City, New York",
    lines: ["4132 Thornridge City", "New York, USA"],
  },
  phones: ["+1 (888) 234-6532", "+1 (888) 456-3217"],
  emails: ["hello@modufy.app", "support@modufy.app"],
  responseTime: "Average reply time: under 24 hours",
} as const;

export const contactTopics = ["Sales & demos", "Technical support", "Billing & plans", "Partnerships"] as const;

export const contactSocialLinks = [
  { label: "X", hrefKey: "twitter" as const },
  { label: "Facebook", hrefKey: "facebook" as const },
  { label: "LinkedIn", hrefKey: "linkedin" as const },
  { label: "GitHub", hrefKey: "github" as const },
] as const;
