import { Router, type IRouter } from "express";
import { GenerateEstimateBody } from "@workspace/api-zod";

const router: IRouter = Router();

const FOUNDATION_PRICES: Record<string, { min: number; max: number; weeks: number; label: string }> = {
  landing_page: { min: 1200, max: 2500, weeks: 2, label: "High-Converting Landing Page" },
  corporate_website: { min: 3500, max: 7500, weeks: 4, label: "Full Corporate Website" },
  fullstack_app: { min: 8000, max: 18000, weeks: 8, label: "Full-Stack App / Client Portal" },
};

const TRAFFIC_PRICES: Record<string, { min: number; max: number; weeks: number; label: string; pillar: string }> = {
  social_media: { min: 800, max: 1800, weeks: 1, label: "Social Media Marketing & Content Engine", pillar: "influx" },
  seo: { min: 600, max: 1400, weeks: 2, label: "Google Local Search Optimization", pillar: "influx" },
  paid_ads: { min: 1000, max: 2500, weeks: 1, label: "Paid Client Acquisition Campaigns", pillar: "influx" },
};

const AUTOMATION_PRICES: Record<string, { min: number; max: number; weeks: number; label: string; pillar: string }> = {
  booking: { min: 800, max: 2000, weeks: 2, label: "Automated Booking System", pillar: "automation" },
  lead_funnels: { min: 1200, max: 2800, weeks: 2, label: "Lead Generation Funnels", pillar: "automation" },
  crm: { min: 1500, max: 3500, weeks: 3, label: "Custom Client CRM/Database", pillar: "automation" },
  ai_receptionist: { min: 600, max: 1500, weeks: 1, label: "24/7 AI Receptionist/Chatbot", pillar: "automation" },
};

router.post("/planner/estimate", async (req, res): Promise<void> => {
  const parsed = GenerateEstimateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { foundation, trafficOptions, automationOptions } = parsed.data;

  const foundationData = FOUNDATION_PRICES[foundation];
  let totalMin = foundationData.min;
  let totalMax = foundationData.max;
  let totalWeeks = foundationData.weeks;

  const deliverables: { title: string; description: string; pillar: string }[] = [
    {
      title: foundationData.label,
      description: getFoundationDescription(foundation),
      pillar: "infrastructure",
    },
  ];

  for (const option of trafficOptions) {
    const data = TRAFFIC_PRICES[option];
    if (data) {
      totalMin += data.min;
      totalMax += data.max;
      totalWeeks = Math.max(totalWeeks, foundationData.weeks + data.weeks);
      deliverables.push({ title: data.label, description: getTrafficDescription(option), pillar: data.pillar });
    }
  }

  for (const option of automationOptions) {
    const data = AUTOMATION_PRICES[option];
    if (data) {
      totalMin += data.min;
      totalMax += data.max;
      totalWeeks = Math.max(totalWeeks, totalWeeks + 1);
      deliverables.push({ title: data.label, description: getAutomationDescription(option), pillar: data.pillar });
    }
  }

  const phases = buildPhases(foundation, trafficOptions, automationOptions, totalWeeks);
  const roiProjection = buildRoiProjection(foundation, trafficOptions, automationOptions);

  res.json({
    totalInvestment: { min: totalMin, max: totalMax },
    timeline: { weeks: totalWeeks, phases },
    deliverables,
    roiProjection,
  });
});

function getFoundationDescription(foundation: string): string {
  const descriptions: Record<string, string> = {
    landing_page: "A precision-engineered, conversion-optimized landing page designed to capture leads from day one. Lightning fast, mobile perfect, and built to rank.",
    corporate_website: "A multi-page authority website that tells your brand story, builds trust, and converts visitors into customers at every touchpoint.",
    fullstack_app: "A custom database-backed application with client portal, real-time data, and automated workflows — your digital operations center.",
  };
  return descriptions[foundation] ?? "";
}

function getTrafficDescription(option: string): string {
  const descriptions: Record<string, string> = {
    social_media: "Professional content creation and publishing across all major platforms — consistent, on-brand, and engineered to build local authority.",
    seo: "Dominate local search results with technical SEO, Google Business Profile optimization, and targeted keyword strategy.",
    paid_ads: "High-ROI ad campaigns across Google and Meta, managed and optimized weekly to deliver qualified leads at the lowest cost.",
  };
  return descriptions[option] ?? "";
}

function getAutomationDescription(option: string): string {
  const descriptions: Record<string, string> = {
    booking: "Automated scheduling system integrated with your calendar — clients book themselves, confirmations send automatically.",
    lead_funnels: "Multi-step automated follow-up sequences that nurture every lead from first contact to paying customer.",
    crm: "Custom client database tracking every contact, project, and communication — your business on autopilot.",
    ai_receptionist: "24/7 AI-powered chat and SMS responses that qualify leads, answer FAQs, and book appointments while you sleep.",
  };
  return descriptions[option] ?? "";
}

function buildPhases(
  foundation: string,
  trafficOptions: string[],
  automationOptions: string[],
  totalWeeks: number
): { name: string; weeks: number; description: string }[] {
  const phases = [];
  const foundationWeeks = FOUNDATION_PRICES[foundation]?.weeks ?? 2;

  phases.push({
    name: "Discovery & Strategy",
    weeks: 1,
    description: "Brand audit, competitor analysis, technical architecture, and campaign strategy documentation.",
  });

  phases.push({
    name: "Build & Launch",
    weeks: foundationWeeks,
    description: "Full development sprint — design, development, testing, and go-live.",
  });

  if (trafficOptions.length > 0) {
    phases.push({
      name: "Traffic Engine Activation",
      weeks: 2,
      description: "Campaign setup, content calendar launch, ad account configuration, and initial optimization.",
    });
  }

  if (automationOptions.length > 0) {
    phases.push({
      name: "Automation Integration",
      weeks: 2,
      description: "Workflow configuration, CRM setup, integration testing, and team onboarding.",
    });
  }

  phases.push({
    name: "Optimization & Handoff",
    weeks: 1,
    description: "Performance review, analytics setup, team training, and 30-day support window.",
  });

  return phases;
}

function buildRoiProjection(
  foundation: string,
  trafficOptions: string[],
  automationOptions: string[]
): { leadsPerMonth: number; revenueImpact: string; timeSavedHours: number } {
  let leadsPerMonth = 8;
  let timeSavedHours = 0;

  if (foundation === "corporate_website") leadsPerMonth += 5;
  if (foundation === "fullstack_app") leadsPerMonth += 12;

  if (trafficOptions.includes("social_media")) leadsPerMonth += 10;
  if (trafficOptions.includes("seo")) leadsPerMonth += 15;
  if (trafficOptions.includes("paid_ads")) leadsPerMonth += 20;

  if (automationOptions.includes("booking")) timeSavedHours += 6;
  if (automationOptions.includes("lead_funnels")) { leadsPerMonth += 8; timeSavedHours += 4; }
  if (automationOptions.includes("crm")) timeSavedHours += 8;
  if (automationOptions.includes("ai_receptionist")) timeSavedHours += 5;

  const revenueImpact = leadsPerMonth >= 30
    ? "$15,000 – $45,000/month"
    : leadsPerMonth >= 20
    ? "$8,000 – $25,000/month"
    : leadsPerMonth >= 10
    ? "$4,000 – $12,000/month"
    : "$2,000 – $6,000/month";

  return { leadsPerMonth, revenueImpact, timeSavedHours };
}

export default router;
