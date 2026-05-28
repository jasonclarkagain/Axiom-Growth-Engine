import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useListCaseStudies, getListCaseStudiesQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Palette, ArrowUpRight } from "lucide-react";

type Category = "all" | "infrastructure" | "influx" | "automation";

const FILTERS: { label: string; value: Category }[] = [
  { label: "All Work", value: "all" },
  { label: "Infrastructure", value: "infrastructure" },
  { label: "Influx", value: "influx" },
  { label: "Automation", value: "automation" },
];

const PILLAR_COLORS: Record<string, string> = {
  infrastructure: "text-primary border-primary/30 bg-primary/5",
  influx: "text-secondary border-secondary/30 bg-secondary/5",
  automation: "text-accent border-accent/30 bg-accent/5",
};

const PILLAR_DOT: Record<string, string> = {
  infrastructure: "bg-primary",
  influx: "bg-secondary",
  automation: "bg-accent",
};

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const params = activeFilter !== "all" ? { category: activeFilter as "infrastructure" | "influx" | "automation" } : undefined;
  const { data: caseStudies, isLoading } = useListCaseStudies(params, {
    query: { queryKey: getListCaseStudiesQueryKey(params) },
  });

  return (
    <section id="work" className="py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Proof of Work</h2>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-foreground max-w-xl">
              Results That Speak Louder Than Portfolios
            </h3>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  data-testid={`button-filter-${f.value}`}
                  className={`px-5 py-2 text-sm font-semibold border transition-all duration-300 ${
                    activeFilter === f.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="border border-border bg-card p-8 space-y-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ))
              : caseStudies?.map((cs, i) => (
                  <motion.div
                    key={cs.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <CaseStudyCard study={cs} />
                  </motion.div>
                ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function CaseStudyCard({ study }: { study: any }) {
  const [view, setView] = useState<"visual" | "victory">("visual");

  const visualBrand =
    typeof study.visualBrand === "string"
      ? JSON.parse(study.visualBrand)
      : study.visualBrand;
  const businessVictory =
    typeof study.businessVictory === "string"
      ? JSON.parse(study.businessVictory)
      : study.businessVictory;

  return (
    <div
      className="group border border-border bg-card flex flex-col h-full overflow-hidden hover:border-foreground/20 transition-all duration-500"
      data-testid={`card-casestudy-${study.id}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold tracking-widest uppercase border mb-4 ${
            PILLAR_COLORS[study.category] ?? ""
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${PILLAR_DOT[study.category] ?? "bg-foreground"}`} />
          {study.category}
        </div>
        <h4 className="text-xl font-serif font-bold text-foreground leading-snug mb-2">
          {study.title}
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{study.client}</span>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Hero Metric */}
      <div className="px-6 py-4 bg-background/50 border-b border-border/50">
        <div className="text-3xl font-serif font-bold text-primary">{study.heroMetric}</div>
      </div>

      {/* Toggle */}
      <div className="flex border-b border-border/50">
        <button
          onClick={() => setView("visual")}
          data-testid={`button-view-visual-${study.id}`}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-wider uppercase transition-colors ${
            view === "visual"
              ? "bg-primary/10 text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Visual Brand
        </button>
        <button
          onClick={() => setView("victory")}
          data-testid={`button-view-victory-${study.id}`}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-wider uppercase transition-colors ${
            view === "victory"
              ? "bg-primary/10 text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Business Victory
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex-1">
        <AnimatePresence mode="wait">
          {view === "visual" ? (
            <motion.div
              key="visual"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {visualBrand?.description}
              </p>
              <ul className="space-y-2 mt-4">
                {visualBrand?.highlights?.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                    <span className="w-1 h-1 mt-2 rounded-full bg-primary shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key="victory"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {businessVictory?.description}
              </p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {businessVictory?.stats?.map((stat: { label: string; value: string }, i: number) => (
                  <div
                    key={i}
                    className="border border-border/70 bg-background p-3"
                    data-testid={`stat-${study.id}-${i}`}
                  >
                    <div className="text-xl font-serif font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tags */}
      <div className="px-6 pb-6 flex flex-wrap gap-2">
        {study.tags?.map((tag: string) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs border border-border text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
