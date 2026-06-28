import Link from "next/link";

export function BlogReadMoreArrow({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="22"
      viewBox="0 0 26 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M15.5 2.25L24.25 11M24.25 11L15.5 19.75M24.25 11L1.75 11"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BlogPostLink({
  slug,
  children,
  className,
}: {
  slug: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={`/blog/${slug}`} className={className}>
      {children}
    </Link>
  );
}
