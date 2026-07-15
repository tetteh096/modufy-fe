export type ServiceItem = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  heroTitle: string;
  heroDescription: string;
  detailTitle: string;
  detailParagraphs: string[];
  highlights: { title: string; description: string; icon: string }[];
};

export const services: ServiceItem[] = [
  {
    slug: "customer-support",
    title: "Customer support",
    description: "Clients engagement platform that offers tools for ticketing.",
    icon: "/images/v3/icon1.png",
    heroTitle: "Welcome to our customer support",
    heroDescription:
      "Customer support service refers to the assistance and also guidance provided to customers before, after the purchase or use our service.",
    detailTitle: "This service can take many forms",
    detailParagraphs: [
      "Our Customer support service, where exceptional assistance is not just a promise but a commitment to your satisfaction. Effective all our customer support is crucial for building trust.",
      "Our dedicated team is here to provide all comprehensive support, ensuring a seamless experience for every user cordially.",
    ],
    highlights: [
      {
        title: "Multi-Channel Support:",
        description:
          "Reach us through various channels, including live chat email, live chat, and also phone, providing flexibility.",
        icon: "/images/service/icon.png",
      },
      {
        title: "Resourceful Knowledge Base:",
        description:
          "Comprehensive knowledge base is at your fingertips, it offering self-help resources, FAQs, and tutorials.",
        icon: "/images/v1/icon3.png",
      },
      {
        title: "Proactive Problem Solving:",
        description:
          "Our proactive approach ensures that potential issues are identified ensuring a smooth & uninterrupted.",
        icon: "/images/v3/icon10.png",
      },
    ],
  },
  {
    slug: "project-management",
    title: "Project management",
    description: "A project and task management tool that helps plan, organize.",
    icon: "/images/v3/icon2.png",
    heroTitle: "Welcome to our project management",
    heroDescription:
      "Plan, organize, and deliver work with clarity, from daily tasks to cross-team initiatives.",
    detailTitle: "Keep every project on track",
    detailParagraphs: [
      "Modufy project management brings timelines, tasks, and team accountability into one workspace.",
      "Assign owners, track milestones, and see progress without switching between spreadsheets and chat threads.",
    ],
    highlights: [
      {
        title: "Task boards & timelines:",
        description: "Visualize work with kanban boards and Gantt-style timelines for every team.",
        icon: "/images/service/icon.png",
      },
      {
        title: "Team collaboration:",
        description: "Comments, files, and updates stay attached to the work, not lost in email.",
        icon: "/images/v1/icon3.png",
      },
      {
        title: "Progress reporting:",
        description: "Dashboards show what's on track, what's blocked, and what needs attention.",
        icon: "/images/v3/icon10.png",
      },
    ],
  },
  {
    slug: "email-marketing",
    title: "Email marketing",
    description: "A widely used email marketing platform with some features.",
    icon: "/images/v3/icon3.png",
    heroTitle: "Welcome to our email marketing",
    heroDescription:
      "Reach the right customers with campaigns, automations, and measurable results.",
    detailTitle: "Grow relationships through email",
    detailParagraphs: [
      "Design campaigns, segment audiences, and automate follow-ups from the same platform you use for sales.",
      "Track opens, clicks, and conversions so every send gets smarter over time.",
    ],
    highlights: [
      {
        title: "Campaign builder:",
        description: "Drag-and-drop emails with templates tuned for SMB brands.",
        icon: "/images/service/icon.png",
      },
      {
        title: "Audience segments:",
        description: "Target by behavior, purchase history, or custom tags.",
        icon: "/images/v1/icon3.png",
      },
      {
        title: "Automation flows:",
        description: "Welcome series, win-backs, and reminders run on autopilot.",
        icon: "/images/v3/icon10.png",
      },
    ],
  },
  {
    slug: "human-resources",
    title: "Human resources",
    description: "An all-in-one HR, payroll, and benefits platform designed.",
    icon: "/images/v3/icon4.png",
    heroTitle: "Welcome to our human resources",
    heroDescription:
      "Manage people, payroll, and policies without juggling multiple HR tools.",
    detailTitle: "HR that scales with your team",
    detailParagraphs: [
      "From onboarding to time-off requests, Modufy HR keeps employee records organized and accessible.",
      "Give managers the visibility they need while protecting sensitive information.",
    ],
    highlights: [
      {
        title: "Employee profiles:",
        description: "Centralized records for roles, documents, and employment history.",
        icon: "/images/service/icon.png",
      },
      {
        title: "Leave & attendance:",
        description: "Request, approve, and track time off in a few clicks.",
        icon: "/images/v1/icon3.png",
      },
      {
        title: "Payroll-ready exports:",
        description: "Clean data handoff to your payroll provider when you're ready.",
        icon: "/images/v3/icon10.png",
      },
    ],
  },
  {
    slug: "accounting-and-finance",
    title: "Accounting and finance",
    description: "Accounting software that helps with invoicing financial report.",
    icon: "/images/v3/icon5.png",
    heroTitle: "Welcome to our accounting and finance",
    heroDescription:
      "Invoices, expenses, and reports that keep your books accurate and audit-ready.",
    detailTitle: "Financial clarity for growing businesses",
    detailParagraphs: [
      "Issue invoices, record expenses, and see cash position without exporting to another system.",
      "Modufy finance tools are built for owners who need numbers they can trust.",
    ],
    highlights: [
      {
        title: "Invoicing & payments:",
        description: "Send branded invoices and track what's paid or overdue.",
        icon: "/images/service/icon.png",
      },
      {
        title: "Expense tracking:",
        description: "Categorize spend and attach receipts in one place.",
        icon: "/images/v1/icon3.png",
      },
      {
        title: "Reports & tax prep:",
        description: "P&L, cash flow, and exportable summaries for your accountant.",
        icon: "/images/v3/icon10.png",
      },
    ],
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    description: "Security platform that provide protection from cyber threat.",
    icon: "/images/v3/icon6.png",
    heroTitle: "Welcome to our cyber security",
    heroDescription:
      "Protect your business data with enterprise-grade security practices built into Modufy.",
    detailTitle: "Security built in, not bolted on",
    detailParagraphs: [
      "Encryption, access controls, and audit logs help you meet customer and compliance expectations.",
      "We monitor threats and ship updates so your workspace stays protected.",
    ],
    highlights: [
      {
        title: "Encryption at rest & in transit:",
        description: "Your data is protected whether stored or moving between devices.",
        icon: "/images/service/icon.png",
      },
      {
        title: "Role-based access:",
        description: "Grant permissions by role so teams see only what they need.",
        icon: "/images/v1/icon3.png",
      },
      {
        title: "Audit trails:",
        description: "Track who changed what and when for accountability.",
        icon: "/images/v3/icon10.png",
      },
    ],
  },
  {
    slug: "security-features",
    title: "Security features",
    description: "Security is a crucial aspect of our app security measures.",
    icon: "/images/v3/icon7.png",
    heroTitle: "Welcome to our security features",
    heroDescription:
      "Two-factor authentication, session controls, and policies that keep accounts safe.",
    detailTitle: "Account security you can rely on",
    detailParagraphs: [
      "Modufy gives admins the controls to enforce strong passwords, 2FA, and session timeouts.",
      "Security settings are simple to configure but powerful enough for regulated industries.",
    ],
    highlights: [
      {
        title: "Two-factor authentication:",
        description: "Add an extra layer beyond passwords for every user.",
        icon: "/images/service/icon.png",
      },
      {
        title: "Session management:",
        description: "Revoke devices and enforce idle timeouts from admin settings.",
        icon: "/images/v1/icon3.png",
      },
      {
        title: "Security alerts:",
        description: "Get notified of suspicious sign-in attempts in real time.",
        icon: "/images/v3/icon10.png",
      },
    ],
  },
  {
    slug: "integration-support",
    title: "Integration support",
    description: "Ability to connect with other financial tools of accounting.",
    icon: "/images/v3/icon8.png",
    heroTitle: "Welcome to our integration support",
    heroDescription:
      "Connect Modufy to the tools your team already uses: payments, messaging, accounting, and more.",
    detailTitle: "Your stack, connected",
    detailParagraphs: [
      "Pre-built integrations and webhooks let data flow between Modufy and your favorite apps.",
      "Our team helps you map fields and validate syncs during onboarding.",
    ],
    highlights: [
      {
        title: "50+ integrations:",
        description: "Popular CRM, accounting, and messaging tools supported out of the box.",
        icon: "/images/service/icon.png",
      },
      {
        title: "Webhook & API access:",
        description: "Build custom workflows when you need more than native connectors.",
        icon: "/images/v1/icon3.png",
      },
      {
        title: "Onboarding assistance:",
        description: "We help configure integrations so go-live is smooth.",
        icon: "/images/v3/icon10.png",
      },
    ],
  },
  {
    slug: "currency-conversion",
    title: "Currency conversion",
    description: "Our finance app also offers all currency conversion tools.",
    icon: "/images/v3/icon9.png",
    heroTitle: "Welcome to our currency conversion",
    heroDescription:
      "Quote, invoice, and report in multiple currencies with live rates and clean reconciliation.",
    detailTitle: "Multi-currency made simple",
    detailParagraphs: [
      "Sell across borders without spreadsheet hacks: Modufy handles conversion at invoice and report time.",
      "Set your base currency and let the platform keep customer-facing prices accurate.",
    ],
    highlights: [
      {
        title: "Live exchange rates:",
        description: "Up-to-date rates applied automatically on transactions.",
        icon: "/images/service/icon.png",
      },
      {
        title: "Multi-currency invoices:",
        description: "Bill customers in their preferred currency with correct totals.",
        icon: "/images/v1/icon3.png",
      },
      {
        title: "Consolidated reporting:",
        description: "Roll up performance in your base currency for leadership views.",
        icon: "/images/v3/icon10.png",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return services.find((service) => service.slug === slug);
}

export const serviceReviews = [
  {
    title: "Best finance budgeting app ever!",
    quote:
      '"This finance app has been a game-changer for me! It\'s made budgeting and tracking my expenses so much easier. I love how intuitive and user-friendly it is."',
    author: "Jonas Aly",
    role: "Founder @ Company",
    avatar: "/images/v1/t_user1.png",
  },
  {
    title: "Super helpful to watch my spend",
    quote:
      '"I can\'t thank this app enough for helping me stay on top of my bills. The bill payment reminders have saved me from late fees, & more organized with my finances."',
    author: "Mark Bures",
    role: "Businessman",
    avatar: "/images/v1/t_user2.png",
  },
  {
    title: "Great app that saves money",
    quote:
      '"The app\'s integration with my bank accounts is seamless. I can easily check my balances and transactions without having to log in separately."',
    author: "William Kolas",
    role: "Student",
    avatar: "/images/v1/t_user3.png",
  },
  {
    title: "Seriously life changing app!",
    quote:
      '"The financial insights and reports have been eye-opening. I now have a better understanding of my spending habit and can make adjustment to save more."',
    author: "Andrew Chan",
    role: "Manager@ AB Company",
    avatar: "/images/v1/t_user4.png",
  },
] as const;

export const servicesTestimonial = {
  quote:
    "Our team's productivity grow up after implementing this SaaS tool. The intuitive interface & seamless collaboration features made a significant impact on our workflow. Game-changer for our company efficiency!",
  author: "Jonas Aly",
  role: "Founder @ Sitemark",
  logo: "/images/v2/b_v2_5.png",
};
