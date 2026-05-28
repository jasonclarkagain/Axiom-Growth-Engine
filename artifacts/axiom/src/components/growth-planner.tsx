import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGenerateEstimate } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function GrowthPlanner() {
  const [step, setStep] = useState(1);
  type Foundation = "landing_page" | "corporate_website" | "fullstack_app";
  type TrafficOption = "social_media" | "seo" | "paid_ads";
  type AutomationOption = "booking" | "lead_funnels" | "crm" | "ai_receptionist";

  const [foundation, setFoundation] = useState<Foundation | null>(null);
  const [trafficOptions, setTrafficOptions] = useState<TrafficOption[]>([]);
  const [automationOptions, setAutomationOptions] = useState<AutomationOption[]>([]);

  const estimateMutation = useGenerateEstimate();
  const [estimate, setEstimate] = useState<any>(null);

  const handleNext = () => {
    if (step === 3) {
      if (!foundation) return;
      estimateMutation.mutate(
        { data: { foundation, trafficOptions, automationOptions } },
        { onSuccess: (data) => {
            setEstimate(data);
            setStep(4);
          }
        }
      );
    } else {
      setStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const toggleTraffic = (item: TrafficOption) => {
    setTrafficOptions(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleAutomation = (item: AutomationOption) => {
    setAutomationOptions(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <section id="planner" className="py-32 bg-card/30 border-y border-border relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">The Crown Jewel</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Business Growth Planner
          </h3>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Design your custom infrastructure and get an instant projection of deliverables, timeline, and ROI.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-border -z-10" />
          {[1, 2, 3, 4].map((num) => (
            <div 
              key={num} 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                ${step >= num ? 'bg-primary text-primary-foreground' : 'bg-background border border-border text-muted-foreground'}`}
            >
              {step > num && num !== 4 ? <Check className="w-5 h-5" /> : num}
            </div>
          ))}
        </div>

        <div className="bg-background border border-border p-8 md:p-12 min-h-[500px] relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h4 className="text-2xl font-serif font-bold mb-6">Phase 1: Digital Foundation</h4>
                <div className="grid gap-4">
                  <RadioCard 
                    selected={foundation === "landing_page"} 
                    onClick={() => setFoundation("landing_page")}
                    title="High-Converting Landing Page" 
                    desc="Fast, focused, built to capture leads immediately." 
                  />
                  <RadioCard 
                    selected={foundation === "corporate_website"} 
                    onClick={() => setFoundation("corporate_website")}
                    title="Full Corporate Website" 
                    desc="Multi-page authority site with deep brand storytelling." 
                  />
                  <RadioCard 
                    selected={foundation === "fullstack_app"} 
                    onClick={() => setFoundation("fullstack_app")}
                    title="Advanced App / Client Portal" 
                    desc="Custom database-backed application for your clients." 
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h4 className="text-2xl font-serif font-bold mb-6">Phase 2: Traffic & Customer Influx</h4>
                <p className="text-sm text-muted-foreground mb-6">Select all that apply.</p>
                <div className="grid gap-4">
                  <CheckboxCard 
                    selected={trafficOptions.includes("social_media")} 
                    onClick={() => toggleTraffic("social_media")}
                    title="Social Media & Content Engine" 
                  />
                  <CheckboxCard 
                    selected={trafficOptions.includes("seo")} 
                    onClick={() => toggleTraffic("seo")}
                    title="Google Local Search (SEO)" 
                  />
                  <CheckboxCard 
                    selected={trafficOptions.includes("paid_ads")} 
                    onClick={() => toggleTraffic("paid_ads")}
                    title="Paid Client Acquisition Campaigns" 
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h4 className="text-2xl font-serif font-bold mb-6">Phase 3: Automation & Operations</h4>
                <p className="text-sm text-muted-foreground mb-6">Select all that apply.</p>
                <div className="grid gap-4">
                  <CheckboxCard 
                    selected={automationOptions.includes("booking")} 
                    onClick={() => toggleAutomation("booking")}
                    title="Automated Booking Systems" 
                  />
                  <CheckboxCard 
                    selected={automationOptions.includes("lead_funnels")} 
                    onClick={() => toggleAutomation("lead_funnels")}
                    title="Lead Generation Funnels" 
                  />
                  <CheckboxCard 
                    selected={automationOptions.includes("crm")} 
                    onClick={() => toggleAutomation("crm")}
                    title="Custom Client CRM/Database" 
                  />
                  <CheckboxCard 
                    selected={automationOptions.includes("ai_receptionist")} 
                    onClick={() => toggleAutomation("ai_receptionist")}
                    title="24/7 AI Receptionist/Chatbot" 
                  />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {estimateMutation.isPending || !estimate ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                    <h4 className="text-xl font-serif">Compiling your growth architecture...</h4>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-3xl font-serif font-bold text-center mb-10 text-primary">Your Architectural Blueprint</h4>
                    
                    <div className="grid md:grid-cols-2 gap-12 mb-12">
                      <div>
                        <h5 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-4">Projected Investment</h5>
                        <div className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                          ${(estimate.totalInvestment.min / 1000).toFixed(1)}k - ${(estimate.totalInvestment.max / 1000).toFixed(1)}k
                        </div>
                        
                        <div className="mt-8">
                          <h5 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-4">Timeline</h5>
                          <div className="flex items-center gap-4 border-l-2 border-primary/30 pl-4 py-2">
                            <span className="text-3xl font-bold text-primary">{estimate.timeline.weeks}</span>
                            <span className="text-muted-foreground uppercase tracking-wider text-sm">Weeks to<br/>Launch</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-card border border-border p-6">
                        <h5 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-6">ROI Projection</h5>
                        <div className="space-y-6">
                          <div className="flex justify-between items-center border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">New Leads / Mo</span>
                            <span className="font-bold text-xl text-foreground">+{estimate.roiProjection.leadsPerMonth}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Hours Saved / Wk</span>
                            <span className="font-bold text-xl text-foreground">+{estimate.roiProjection.timeSavedHours}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Revenue Impact</span>
                            <span className="font-bold text-xl text-primary">{estimate.roiProjection.revenueImpact}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Button asChild size="lg" className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-12 text-lg font-bold w-full md:w-auto">
                        <a href="#contact">Schedule Consultation</a>
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex justify-between items-center bg-background/80 backdrop-blur-sm border-t border-border">
              <Button 
                variant="ghost" 
                onClick={handlePrev} 
                disabled={step === 1}
                className="text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button 
                onClick={handleNext}
                disabled={step === 1 && !foundation}
                className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {step === 3 ? "Generate Blueprint" : "Next Phase"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RadioCard({ selected, onClick, title, desc }: { selected: boolean, onClick: () => void, title: string, desc: string }) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 border cursor-pointer transition-all duration-300 flex items-start gap-4
        ${selected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-border/80'}`}
    >
      <div className={`w-6 h-6 mt-1 rounded-full border flex items-center justify-center shrink-0
        ${selected ? 'border-primary' : 'border-muted-foreground'}`}>
        {selected && <div className="w-3 h-3 bg-primary rounded-full" />}
      </div>
      <div>
        <h5 className={`text-lg font-bold mb-1 ${selected ? 'text-primary' : 'text-foreground'}`}>{title}</h5>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function CheckboxCard({ selected, onClick, title }: { selected: boolean, onClick: () => void, title: string }) {
  return (
    <div 
      onClick={onClick}
      className={`p-5 border cursor-pointer transition-all duration-300 flex items-center gap-4
        ${selected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-border/80'}`}
    >
      <div className={`w-6 h-6 rounded-sm border flex items-center justify-center shrink-0
        ${selected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
        {selected && <Check className="w-4 h-4" />}
      </div>
      <h5 className={`text-lg font-bold ${selected ? 'text-primary' : 'text-foreground'}`}>{title}</h5>
    </div>
  );
}
