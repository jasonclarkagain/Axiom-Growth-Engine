import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import { SubmitLeadBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/leads", async (req, res): Promise<void> => {
  const parsed = SubmitLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, phone, businessType, message, selectedServices, plannerData } = parsed.data;

  const [lead] = await db
    .insert(leadsTable)
    .values({
      name,
      email,
      phone: phone ?? null,
      businessType,
      message,
      selectedServices: selectedServices ?? [],
      plannerData: plannerData ?? null,
    })
    .returning();

  req.log.info({ leadId: lead.id }, "New lead submitted");

  res.status(201).json({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    businessType: lead.businessType,
    message: lead.message,
    selectedServices: lead.selectedServices,
    plannerData: lead.plannerData,
    createdAt: lead.createdAt.toISOString(),
  });
});

export default router;
