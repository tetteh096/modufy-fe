import type { ReactNode } from "react";

type LegalDocProps = {
  title: string;
  lastUpdated: string;
  intro?: ReactNode;
  children: ReactNode;
};

export function LegalDoc({ title, lastUpdated, intro, children }: LegalDocProps) {
  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="text-sm font-medium text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
        {intro ? (
          <div className="text-base leading-relaxed text-muted-foreground">{intro}</div>
        ) : null}
      </header>
      {children}
    </article>
  );
}

type LegalSectionProps = {
  number: number;
  title: string;
  children: ReactNode;
};

export function LegalSection({ number, title, children }: LegalSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">
        {number}. {title}
      </h2>
      <div className="space-y-3 text-[0.9375rem] leading-relaxed text-muted-foreground [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5">
        {children}
      </div>
    </section>
  );
}
