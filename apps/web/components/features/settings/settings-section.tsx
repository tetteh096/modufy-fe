import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md/40",
        className,
      )}
    >
      <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-5">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
            </div>
          )}
          <div className="min-w-0 pt-0.5">
            <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1 text-sm leading-relaxed">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-6 px-6 py-6", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
