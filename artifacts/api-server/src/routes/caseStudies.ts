import { Router, type IRouter } from "express";
import { db, caseStudiesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetCaseStudyParams, ListCaseStudiesQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/case-studies", async (req, res): Promise<void> => {
  const queryParsed = ListCaseStudiesQueryParams.safeParse(req.query);
  const category = queryParsed.success ? queryParsed.data.category : undefined;

  let rows;
  if (category && category !== "all") {
    rows = await db
      .select()
      .from(caseStudiesTable)
      .where(eq(caseStudiesTable.category, category));
  } else {
    rows = await db.select().from(caseStudiesTable);
  }

  res.json(rows);
});

router.get("/case-studies/:id", async (req, res): Promise<void> => {
  const params = GetCaseStudyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [row] = await db
    .select()
    .from(caseStudiesTable)
    .where(eq(caseStudiesTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Case study not found" });
    return;
  }

  res.json(row);
});

export default router;
