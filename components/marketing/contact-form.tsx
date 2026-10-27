"use client";

import { startTransition, useActionState, useId, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitMarketingLead } from "@/lib/actions/marketing-leads";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import {
  createMarketingLeadSchema,
  initialMarketingLeadState,
  MARKETING_PACKAGE_OPTIONS,
  type MarketingLeadFormValues,
} from "@/lib/validations/marketing-leads";

function inferDefaultPackage(hint?: string): "marketing" | "tech-and-automation" | "virtual-assistance" {
  if (!hint) return "marketing";
  const lower = hint.toLowerCase();
  if (lower.includes("tech") || lower.includes("auto") || lower.includes("platform") || lower.includes("system")) {
    return "tech-and-automation";
  }
  if (lower.includes("assist") || lower.includes("virtual") || lower.includes("مساعد")) {
    return "virtual-assistance";
  }
  return "marketing";
}

export function ContactForm({
  dict,
  initialMessage = "",
}: {
  dict: Dictionary["contact"]["form"];
  initialMessage?: string;
}) {
  const formId = useId();
  const [state, formAction, isPending] = useActionState(
    submitMarketingLead,
    initialMarketingLeadState
  );

  const schema = useMemo(() => createMarketingLeadSchema(dict), [dict]);

  const defaultPackage = useMemo(() => inferDefaultPackage(initialMessage), [initialMessage]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MarketingLeadFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      packageOfInterest: defaultPackage,
    },
  });

  async function onSubmit(values: MarketingLeadFormValues) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("company", values.company);
    formData.set("packageOfInterest", values.packageOfInterest);
    startTransition(() => {
      formAction(formData);
    });
  }

  const pending = isPending || isSubmitting;

  function fieldError(field: keyof MarketingLeadFormValues) {
    return errors[field]?.message ?? state.fieldErrors?.[field]?.[0];
  }

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-16 text-center">
        <CheckCircle2 className="size-10 text-emerald-400" />
        <h3 className="mt-4 text-xl font-semibold text-foreground">
          {dict.successTitle}
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {dict.successBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={formId + "-name"}>{dict.nameLabel}</Label>
          <Input
            id={formId + "-name"}
            type="text"
            placeholder={dict.namePlaceholder}
            autoComplete="name"
            aria-invalid={Boolean(fieldError("name"))}
            {...register("name")}
          />
          {fieldError("name") && (
            <p className="text-sm text-destructive">{fieldError("name")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={formId + "-email"}>{dict.emailLabel}</Label>
          <Input
            id={formId + "-email"}
            type="email"
            placeholder={dict.emailPlaceholder}
            autoComplete="email"
            aria-invalid={Boolean(fieldError("email"))}
            {...register("email")}
          />
          {fieldError("email") && (
            <p className="text-sm text-destructive">{fieldError("email")}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={formId + "-company"}>{dict.companyLabel}</Label>
        <Input
          id={formId + "-company"}
          type="text"
          placeholder={dict.companyPlaceholder}
          autoComplete="organization"
          aria-invalid={Boolean(fieldError("company"))}
          {...register("company")}
        />
        {fieldError("company") && (
          <p className="text-sm text-destructive">{fieldError("company")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label id={formId + "-package-label"}>{dict.packageLabel}</Label>
        <Controller
          name="packageOfInterest"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                aria-labelledby={formId + "-package-label"}
                size="md"
                className="h-10 w-full"
              >
                <SelectValue placeholder={dict.packagePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {MARKETING_PACKAGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {dict.packageOptions?.[option.value] ?? option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {state.status === "error" && state.error && (
        <Alert variant="destructive">
          <AlertTitle>{dict.errorTitle}</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {dict.sending}
          </>
        ) : (
          dict.submit
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        {dict.footnote}
      </p>
    </form>
  );
}
