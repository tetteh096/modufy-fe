import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { pricingComparison } from "@/lib/pricing-content";
import { appPath } from "@/lib/site-config";

function ComparisonValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return (
      <Image
        src={value ? "/images/icon/check.svg" : "/images/icon/minus.svg"}
        alt={value ? "Included" : "Not included"}
        width={20}
        height={20}
        className="mx-auto"
      />
    );
  }
  return <span>{value}</span>;
}

export function PricingComparisonTable() {
  return (
    <section className="section-padding border-t border-border">
      <div className="container-site">
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-4 font-semibold">Feature Name:</th>
                {pricingComparison.columns.map((column) => (
                  <th key={column} className="px-5 py-4 text-center font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricingComparison.rows.map((row) => (
                <tr key={row.feature} className="border-b border-border last:border-0">
                  <td className="px-5 py-4 font-medium">{row.feature}</td>
                  {row.values.map((value, index) => (
                    <td key={`${row.feature}-${index}`} className="px-5 py-4 text-center text-muted-foreground">
                      <ComparisonValue value={value} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-muted/20">
                <td className="px-5 py-5" />
                {pricingComparison.columns.map((column) => (
                  <td key={column} className="px-5 py-5 text-center">
                    <Button href={appPath("/register")} external size="sm">
                      Get Started Now
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function SolutionsIntro() {
  return (
    <FadeIn className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <h2 className="text-3xl font-bold sm:text-4xl">Wide range of SaaS solutions</h2>
      </div>
      <div className="flex items-center lg:col-span-5">
        <p className="text-base leading-relaxed text-muted-foreground">
          Discovered our all customized services and you can double, triple, or quadruple your
          income & beat your competition with professional services!
        </p>
      </div>
    </FadeIn>
  );
}
