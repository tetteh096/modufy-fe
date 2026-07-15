"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Eye, FilePenLine, Globe, Search } from "lucide-react";

const POSTS = [
  {
    title: "How we restock bestsellers",
    tag: "Operations",
    status: "Published",
    meta: "modufy.app/you/blog/restock",
  },
  {
    title: "Spring colour guide",
    tag: "Tips",
    status: "Draft",
    meta: "SEO title ready · cover set",
  },
  {
    title: "Why guests book online",
    tag: "Stories",
    status: "Published",
    meta: "modufy.app/you/blog/guests",
  },
] as const;

export function BlogMockup() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [publishedPulse, setPublishedPulse] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setActive(0);
      setPublishedPulse(true);
      return;
    }
    const id = window.setInterval(() => {
      setActive((i) => {
        const next = (i + 1) % POSTS.length;
        setPublishedPulse(POSTS[next].status === "Published");
        return next;
      });
    }, 2400);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const post = POSTS[active];

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <motion.div
        className="relative overflow-hidden rounded-[1.75rem] border border-[#1a2744]/10 bg-white shadow-[0_28px_70px_rgba(26,39,68,0.12)]"
        animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-[#1a2744]/08 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1a2744]/40">
              Storefront Blog
            </p>
            <p className="font-display text-lg font-bold text-[#1a2744]">Content library</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-leaf-green/15 px-3 py-1 text-xs font-bold text-brand-leaf-green">
            <Globe className="h-3.5 w-3.5" />
            Live on page
          </span>
        </div>

        <div className="space-y-2.5 p-4 sm:p-5">
          {POSTS.map((item, index) => {
            const on = index === active;
            return (
              <motion.div
                key={item.title}
                layout
                className={`rounded-2xl border px-4 py-3 transition ${
                  on
                    ? "border-brand-leaf-green/35 bg-[#eef4e4]"
                    : "border-[#1a2744]/08 bg-[#f7f6f2]"
                }`}
                animate={reduceMotion ? undefined : on ? { scale: 1.01 } : { scale: 1 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#1a2744]/40">
                      {item.tag}
                    </p>
                    <p className="mt-1 font-display text-base font-bold text-[#1a2744]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-[#1a2744]/45">{item.meta}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      item.status === "Published"
                        ? "bg-brand-leaf-green/15 text-brand-leaf-green"
                        : "bg-[#1a2744]/8 text-[#1a2744]/70"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="border-t border-[#1a2744]/08 px-4 py-3.5 sm:px-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={post.title + publishedPulse}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              className="flex items-center gap-2.5 rounded-xl bg-[#f7f6f2] px-3 py-2.5 text-sm font-semibold text-[#1a2744]"
            >
              {post.status === "Published" ? (
                <>
                  <Check className="h-4 w-4 text-brand-leaf-green" />
                  Published · SEO fields live on storefront
                </>
              ) : (
                <>
                  <FilePenLine className="h-4 w-4 text-brand-tangerine" />
                  Draft saved · cover + meta ready to publish
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        className="absolute -right-2 top-16 hidden w-[170px] rounded-2xl border border-white/80 bg-[#1a2744] p-3 text-white shadow-xl sm:block"
        animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-[#e8f0a8]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">SEO</p>
            <p className="text-xs font-semibold">Title + meta set</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute -left-3 bottom-20 hidden w-[160px] rounded-2xl border border-[#1a2744]/10 bg-white p-3 shadow-xl sm:block"
        animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-brand-leaf-green" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#1a2744]/40">
              Preview
            </p>
            <p className="text-xs font-semibold text-[#1a2744]">On your public page</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
