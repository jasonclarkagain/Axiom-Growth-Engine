import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats/summary", async (_req, res): Promise<void> => {
  const [leadCount] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(leadsTable);

  res.json({
    clientsServed: 147 + (leadCount?.count ?? 0),
    revenueGenerated: "$4.2M+",
    hoursAutomated: 8300,
    avgLeadIncrease: "+187%",
  });
});

export default router;
