export const demoHighlights = [
  "30 minutes, live on video",
  "Tailored to your industry",
  "No obligation to buy",
] as const;

export const demoSteps = [
  {
    step: "01",
    title: "Tell us about your business",
    description: "Share your team size, what you sell, and which modules you're curious about.",
  },
  {
    step: "02",
    title: "We pick the right walkthrough",
    description: "Retail, services, or multi-location — we focus on workflows that match how you operate.",
  },
  {
    step: "03",
    title: "Live demo + your questions",
    description: "See Core and the modules you care about. Ask anything about pricing, setup, or migrations.",
  },
] as const;

export const demoModuleInterests = [
  "Core (customers & sales)",
  "Invoices & payments",
  "Inventory & stock",
  "Point of sale (POS)",
  "Appointments & booking",
  "Marketing & campaigns",
  "Accounts & bookkeeping",
  "Not sure yet",
] as const;

export const demoBusinessTypes = [
  "Retail / shop",
  "Restaurant / café",
  "Professional services",
  "Wholesale / distribution",
  "Other",
] as const;

export const demoTeamSizes = [
  { value: "1-5", label: "1–5 people" },
  { value: "6-20", label: "6–20 people" },
  { value: "21-50", label: "21–50 people" },
  { value: "50+", label: "50+ people" },
] as const;

export const demoQuote = {
  text: "The demo showed us exactly how invoicing and inventory connect — we signed up the same week.",
  author: "Retail operator, early access",
};

export const demoFaqs = [
  {
    question: "How long is the demo?",
    answer:
      "Most sessions run 30 minutes. If you have a larger team or complex setup, we can book 45 minutes — just mention it in the form.",
  },
  {
    question: "Do I need to prepare anything?",
    answer:
      "No slides or homework. It helps if you know your rough team size and whether you care most about sales, stock, billing, or appointments — we'll handle the rest.",
  },
  {
    question: "Can I invite my co-founder or ops lead?",
    answer:
      "Absolutely. Reply to our scheduling email with their names and we'll add them to the calendar invite.",
  },
  {
    question: "Is there a free trial if I'm not ready for a call?",
    answer:
      "Yes. Core is free to start — you can explore on your own and book a demo anytime from the app or this page.",
  },
  {
    question: "What happens after the demo?",
    answer:
      "We'll send a summary of what we covered, recommended modules, and a link to start your trial. No pressure — many teams try Modufy on their own first.",
  },
] as const;
