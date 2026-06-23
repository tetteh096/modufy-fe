import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-border/70 pb-4 boron:border-b-2 boron:border-black boron:pb-6",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl boron:uppercase boron:font-bold">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground leading-normal max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 flex flex-wrap gap-2">{action}</div>}
    </div>
  );
}
