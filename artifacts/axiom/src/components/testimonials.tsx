import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useListTestimonials, getListTestimonialsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Quote } from "lucide-react";

const PILLAR_ACCENT: Record<string, string> = {
  infrastructure: "border-l-primary",
  influx: "border-l-secondary",
  automation: "border-l-accent",
};

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: testimonials, isLoading } = useListTestimonials({
    query: { queryKey: getListTestimonialsQueryKey() },
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animId: number;
    let pos = 0;
    const speed = 0.5;

    const animate = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    const pause = () => cancelAnimationFrame(animId);
    const resume = () => { animId = requestAnimationFrame(animate); };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, [testimonials]);

  return (
    <section className="py-32 bg-card/20 border-y border-border overflow-hidden" ref={ref}>
      <div className="container mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Client Stories</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-foreground max-w-xl">
            The People Behind the Numbers
          </h3>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="flex gap-6 px-6 overflow-hidden">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="border border-border bg-card p-8 min-w-[360px] shrink-0 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden cursor-grab select-none"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Duplicate list for infinite scroll illusion */}
          {[...(testimonials ?? []), ...(testimonials ?? [])].map((t, i) => (
            <div
              key={`${t.id}-${i}`}
              data-testid={`card-testimonial-${t.id}-${i}`}
              className={`border border-border bg-card p-8 min-w-[360px] max-w-[360px] shrink-0 flex flex-col border-l-4 ${
                PILLAR_ACCENT[t.pillar] ?? "border-l-primary"
              } hover:border-foreground/20 transition-colors duration-300`}
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-foreground/80 text-sm leading-relaxed flex-1 italic">
                "{t.quote}"
              </p>
              <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t.role} — {t.company}
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array(t.rating)
                    .fill(0)
                    .map((_, si) => (
                      <Star key={si} className="w-3.5 h-3.5 fill-primary text-primary" />
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
