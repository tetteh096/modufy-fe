import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";

export function NotFoundContent() {
  return (
    <section className="section-padding">
      <div className="container-site max-w-lg text-center">
        <FadeIn>
          <Image
            src="/images/about/404.png"
            alt=""
            width={400}
            height={320}
            className="mx-auto w-full max-w-sm"
          />
          <h1 className="mt-8 text-3xl font-bold sm:text-4xl">
            Oops! Looks like you took a wrong turn
          </h1>
          <div className="mt-8">
            <Button href="/">Back To Home</Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
