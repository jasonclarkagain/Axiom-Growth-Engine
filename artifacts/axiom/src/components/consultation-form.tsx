import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitLead } from "@workspace/api-client-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  businessType: z.string().min(1, "Please select your business type"),
  message: z.string().min(10, "Tell us a bit more about what you need"),
});

type FormValues = z.infer<typeof formSchema>;

const BUSINESS_TYPES = [
  "Home Services / Contractor",
  "Boutique / Retail Shop",
  "Restaurant / Food & Beverage",
  "Professional Services (Legal, Financial, Consulting)",
  "Health & Wellness",
  "Real Estate",
  "Beauty & Personal Care",
  "Automotive",
  "Fitness & Sports",
  "Other / Digital-First Business",
];

export default function ConsultationForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);

  const submitLead = useSubmitLead();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      businessType: "",
      message: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    submitLead.mutate(
      {
        data: {
          name: values.name,
          email: values.email,
          phone: values.phone ?? null,
          businessType: values.businessType,
          message: values.message,
        },
      },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      }
    );
  };

  return (
    <section id="contact" className="py-32 bg-background border-t border-border" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
              Start Today
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight mb-8">
              Ready to Transform Your Business?
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-10">
              Tell us about your business and what you're trying to achieve. We'll review your submission and reach out within one business day to schedule your complimentary strategy call.
            </p>

            <div className="space-y-6">
              {[
                { title: "Free Strategy Session", desc: "A 45-minute discovery call to map your growth opportunities." },
                { title: "Custom Blueprint", desc: "A tailored proposal with timeline, deliverables, and investment." },
                { title: "No Obligation", desc: "Walk away with clarity regardless of whether we work together." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 shrink-0 border border-primary/30 bg-primary/5 flex items-center justify-center text-primary font-bold text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{item.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="border border-primary/30 bg-primary/5 p-12 flex flex-col items-center text-center h-full justify-center min-h-[520px]"
              >
                <CheckCircle className="w-16 h-16 text-primary mb-6" />
                <h4 className="text-3xl font-serif font-bold text-foreground mb-4">
                  We'll Be in Touch.
                </h4>
                <p className="text-muted-foreground max-w-sm leading-relaxed">
                  Your submission has been received. Expect a personal response within one business day. We look forward to hearing about your business.
                </p>
                <div className="mt-8 text-xs text-muted-foreground/60 uppercase tracking-widest font-bold">
                  Axiom Digital Core
                </div>
              </motion.div>
            ) : (
              <div className="border border-border bg-card p-8 md:p-10">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                    data-testid="form-consultation"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Sarah Johnson"
                                className="rounded-none bg-background border-border focus:border-primary"
                                data-testid="input-name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="sarah@mybusiness.com"
                                className="rounded-none bg-background border-border focus:border-primary"
                                data-testid="input-email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                              Phone{" "}
                              <span className="text-muted-foreground/50 normal-case">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(555) 000-0000"
                                className="rounded-none bg-background border-border focus:border-primary"
                                data-testid="input-phone"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                              Business Type
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className="rounded-none bg-background border-border focus:border-primary"
                                  data-testid="select-businessType"
                                >
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-none border-border bg-background">
                                {BUSINESS_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                            What are you trying to achieve?
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your business, your biggest challenge, and what success looks like for you in the next 6 months..."
                              className="rounded-none bg-background border-border focus:border-primary min-h-[120px] resize-none"
                              data-testid="input-message"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={submitLead.isPending}
                      className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-base font-bold group"
                      data-testid="button-submit"
                    >
                      {submitLead.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Request Free Strategy Session
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground/60">
                      No spam. No obligation. One response within 24 hours.
                    </p>
                  </form>
                </Form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
