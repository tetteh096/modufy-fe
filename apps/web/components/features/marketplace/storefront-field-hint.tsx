export function StorefrontFieldHint({ where }: { where: string }) {
  return (
    <p className="text-[11px] leading-snug text-muted-foreground">
      <span className="font-semibold text-primary">Shows on:</span> {where}
    </p>
  );
}
