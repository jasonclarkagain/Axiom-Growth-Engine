import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useListServices, getListServicesQueryKey } from "@workspace/api-client-react";
import type { Service } from "@workspace/api-client-react";
import { ChevronRight, Layers, Zap, Workflow } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceMatrix() {
  const { data: services, isLoading } = useListServices({
    query: { queryKey: getListServicesQueryKey() }
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const infrastructure = services?.filter(s => s.pillar === "infrastructure") || [];
  const influx = services?.filter(s => s.pillar === "influx") || [];
  const automation = services?.filter(s => s.pillar === "automation") || [];

  return (
    <section id="services" className="py-32 bg-background relative" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">The Methodology</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-foreground max-w-2xl">
              The Triple-Pillar Matrix
            </h3>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="border border-border p-8 h-96">
                <Skeleton className="h-12 w-12 mb-6 rounded-full" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))
          ) : (
            <>
              <PillarCard 
                title="The Infrastructure" 
                subtitle="Web Development"
                services={infrastructure} 
                accentColor="primary"
                icon={<Layers className="w-8 h-8" />}
                delay={0.1}
                inView={isInView}
              />
              <PillarCard 
                title="The Influx" 
                subtitle="Social Media & Marketing"
                services={influx} 
                accentColor="secondary"
                icon={<Zap className="w-8 h-8" />}
                delay={0.2}
                inView={isInView}
              />
              <PillarCard 
                title="The Automation" 
                subtitle="Systems & Workflows"
                services={automation} 
                accentColor="accent"
                icon={<Workflow className="w-8 h-8" />}
                delay={0.3}
                inView={isInView}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ 
  title, 
  subtitle, 
  services, 
  accentColor, 
  icon,
  delay,
  inView
}: { 
  title: string; 
  subtitle: string; 
  services: Service[]; 
  accentColor: "primary" | "secondary" | "accent";
  icon: React.ReactNode;
  delay: number;
  inView: boolean;
}) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const accentClasses = {
    primary: "text-primary border-primary hover:shadow-[0_0_30px_rgba(255,183,0,0.15)]",
    secondary: "text-secondary border-secondary hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]",
    accent: "text-accent border-accent hover:shadow-[0_0_30px_rgba(171,104,255,0.15)]"
  };

  const bgGlowClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-accent"
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouseMove}
      className={`relative group bg-card border border-border p-8 rounded-none transition-all duration-500 overflow-hidden ${accentClasses[accentColor]}`}
    >
      {/* Magnetic Glow Effect */}
      <div 
        className={`absolute w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none ${bgGlowClasses[accentColor]}`}
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className={`w-16 h-16 mb-6 flex items-center justify-center border border-border bg-background ${accentClasses[accentColor].split(' ')[0]}`}>
          {icon}
        </div>
        
        <h4 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-2">{subtitle}</h4>
        <h3 className="text-2xl font-serif font-bold text-foreground mb-6">{title}</h3>
        
        <div className="mt-auto space-y-4 pt-8">
          {services.map(service => (
            <div key={service.id} className="border-t border-border/50 pt-4">
              <button 
                onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                className="w-full flex items-center justify-between text-left group/btn"
              >
                <span className="font-semibold text-foreground group-hover/btn:text-white transition-colors">{service.name}</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${expandedId === service.id ? "rotate-90" : ""}`} />
              </button>
              
              <motion.div 
                initial={false}
                animate={{ height: expandedId === service.id ? "auto" : 0, opacity: expandedId === service.id ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-2">
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <ul className="space-y-2 mb-4">
                    {service.features.slice(0, 3).map((f: string, i: number) => (
                      <li key={i} className="text-xs flex items-start gap-2 text-muted-foreground/80">
                        <span className={`w-1 h-1 mt-1 rounded-full ${bgGlowClasses[accentColor]}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="text-sm font-bold text-foreground">
                    Starts at ${service.startingPrice.toLocaleString()}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
