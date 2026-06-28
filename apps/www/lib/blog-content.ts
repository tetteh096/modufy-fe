export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
};

export const blogCategories = [
  "SaaS",
  "Marketing",
  "Technology",
  "SaaS Metrics",
  "Development",
] as const;

export const blogTags = [
  "Marketing",
  "Business",
  "SaaS",
  "Development",
  "UI/UX",
  "Brand",
] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "meeting-financial-needs-new-gen",
    title: "Meeting the financial needs of the new gen",
    excerpt: "We've been embracing information technology (IT) in various facets…",
    category: "Business",
    date: "June 18, 2024",
    image: "/images/blog/blog1.png",
  },
  {
    slug: "saas-best-ideas-tailor-needs",
    title: "5 SaaS best ideas you can tailor to your needs easily",
    excerpt: "In the rapidly evolving technology data scientists with an entrepreneur...",
    category: "Technology",
    date: "June 18, 2024",
    image: "/images/blog/blog2.png",
  },
  {
    slug: "develop-simple-saas-banking-platform",
    title: "How to develop a simple SaaS banking platform?",
    excerpt: "The financial sector is going through a substantial shift in today's fast...",
    category: "Finance",
    date: "June 18, 2024",
    image: "/images/blog/blog3.png",
  },
  {
    slug: "smart-content-marketing-strategy-saas",
    title: "Smart content marketing strategy for your SaaS",
    excerpt: "If you have developed a SaaS and you are ready to roll in the market...",
    category: "Marketing",
    date: "June 18, 2024",
    image: "/images/blog/blog.png",
  },
];

export const recentPosts: BlogPost[] = [
  {
    slug: "7-businesses-for-easy-money",
    title: "7 businesses for easy money",
    excerpt: "",
    category: "Business",
    date: "June 18, 2024",
    image: "/images/blog/blog1.png",
  },
  {
    slug: "my-3-tips-business-ideas",
    title: "My 3 tips for business ideas",
    excerpt: "",
    category: "Business",
    date: "June 18, 2024",
    image: "/images/blog/blog2.png",
  },
  {
    slug: "12-halloween-costume-ideas",
    title: "12 Halloween costume ideas",
    excerpt: "",
    category: "Lifestyle",
    date: "June 18, 2024",
    image: "/images/blog/blog3.png",
  },
];

export const latestArticles: BlogPost[] = [
  {
    slug: "good-solution-finance-apps",
    title: "What is a good solution for finance apps?",
    excerpt: "",
    category: "Business",
    date: "June 18, 2024",
    image: "/images/blog/blog1.png",
  },
  {
    slug: "banking-app-development-ideal",
    title: "What makes banking app development ideal?",
    excerpt: "",
    category: "Technology",
    date: "June 18, 2024",
    image: "/images/blog/blog2.png",
  },
  {
    slug: "finance-apps-help-make-money",
    title: "Finance apps that will help you make money!",
    excerpt: "",
    category: "Management",
    date: "June 18, 2024",
    image: "/images/blog/blog3.png",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return [...blogPosts, ...recentPosts, ...latestArticles].find((post) => post.slug === slug);
}
