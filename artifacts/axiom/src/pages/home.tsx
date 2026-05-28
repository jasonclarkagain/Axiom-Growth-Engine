import Nav from "@/components/nav";
import Hero from "@/components/hero";
import ServiceMatrix from "@/components/service-matrix";
import GrowthPlanner from "@/components/growth-planner";
import Portfolio from "@/components/portfolio";
import Testimonials from "@/components/testimonials";
import ConsultationForm from "@/components/consultation-form";

export default function Home() {
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground">
      <Nav />
      <main>
        <Hero />
        <ServiceMatrix />
        <GrowthPlanner />
        <Portfolio />
        <Testimonials />
        <ConsultationForm />
      </main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Axiom Digital Core. All rights reserved.</p>
      </footer>
    </div>
  );
}
