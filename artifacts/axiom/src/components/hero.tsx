import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetStatsSummary, getGetStatsSummaryQueryKey } from "@workspace/api-client-react";

export default function Hero() {
  const { data: stats, isLoading } = useGetStatsSummary({
    query: { queryKey: getGetStatsSummaryQueryKey() }
  });

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 mb-6 border border-primary/30 bg-primary/5 text-primary text-xs font-semibold tracking-widest uppercase rounded-full">
            Premium Digital Agency
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground leading-[1.1] mb-8">
            We Build the Systems That <span className="text-primary italic">Build Your Business</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            For Main Street leaders who demand dominance. Stop thinking about technology. Start scaling with precision infrastructure, automated influx, and flawless operations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base font-semibold w-full sm:w-auto group">
              <a href="#planner">
                Start Your Growth Plan
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none border-muted-foreground/30 hover:bg-white/5 h-14 px-8 text-base font-semibold w-full sm:w-auto">
              <a href="#work">See Our Work</a>
            </Button>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 border-y border-border/50 py-10"
        >
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center space-y-2">
                <div className="h-10 w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-32 bg-muted/50 animate-pulse rounded"></div>
              </div>
            ))
          ) : stats ? (
            <>
              <StatItem value={stats.clientsServed.toString() + "+"} label="Partners Scaled" />
              <StatItem value={stats.revenueGenerated} label="Revenue Generated" />
              <StatItem value={stats.avgLeadIncrease} label="Avg. Lead Increase" />
              <StatItem value={stats.hoursAutomated.toString() + "+"} label="Hours Automated" />
            </>
          ) : null}
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/50">
        <a href="#services" aria-label="Scroll down">
          <ChevronDown size={32} strokeWidth={1} />
        </a>
      </div>
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="text-4xl md:text-5xl font-serif font-bold text-foreground">{value}</div>
      <div className="text-xs md:text-sm font-medium tracking-wider text-muted-foreground uppercase">{label}</div>
    </div>
  );
}
