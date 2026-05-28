import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const caseStudiesTable = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  client: text("client").notNull(),
  category: text("category").notNull(),
  heroMetric: text("hero_metric").notNull(),
  visualBrand: jsonb("visual_brand").notNull(),
  businessVictory: jsonb("business_victory").notNull(),
  tags: text("tags").array().notNull().default([]),
});

export const insertCaseStudySchema = createInsertSchema(caseStudiesTable).omit({ id: true });
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type CaseStudy = typeof caseStudiesTable.$inferSelect;
