"use client";

import {
  startTransition,
  useActionState,
  useId,
  useState,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitBooking } from "@/lib/actions/booking";
import type { Locale } from "@/lib/i18n/get-dictionary";
import {
  BOOKING_TIME_SLOTS,
  BookingFormValues,
  createBookingSchema,
  initialBookingState,
} from "@/lib/validations/booking";

interface BookingCalendarProps {
  locale: Locale;
  onClose?: () => void;
}

export function BookingCalendar({ locale, onClose }: BookingCalendarProps) {
  const formId = useId();
  const ar = locale === "ar";

  const [state, formAction, isPending] = useActionState(
    submitBooking,
    initialBookingState
  );

  // Calendar navigation state
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState<Date>(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const schema = useMemo(() => createBookingSchema(), []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      date: "",
      timeSlot: "",
    },
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // First day of current month (0=Sun, 1=Mon, ..., 6=Sat)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // We want Monday as index 0: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
  const startOffset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNamesEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const monthNamesAr = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];

  const weekdayNamesEn = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekdayNamesAr = ["إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"];

  const monthLabel = ar ? `${monthNamesAr[month]} ${year}` : `${monthNamesEn[month]} ${year}`;

  const canGoPrev =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth());

  function prevMonth() {
    if (!canGoPrev) return;
    setViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  function handleSelectDate(day: number) {
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    setSelectedDate(dateStr);
    setValue("date", dateStr, { shouldValidate: true });
  }

  function handleSelectSlot(slot: string) {
    setSelectedSlot(slot);
    setValue("timeSlot", slot, { shouldValidate: true });
  }

  async function onSubmit(values: BookingFormValues) {
    const formData = new FormData();
    formData.set("firstName", values.firstName);
    formData.set("lastName", values.lastName);
    formData.set("email", values.email);
    formData.set("phone", values.phone);
    formData.set("date", values.date);
    formData.set("timeSlot", values.timeSlot);

    startTransition(() => {
      formAction(formData);
    });
  }

  const pending = isPending || isSubmitting;

  function fieldError(field: keyof BookingFormValues) {
    return errors[field]?.message ?? state.fieldErrors?.[field]?.[0];
  }

  if (state.status === "success") {
    const details = state.bookingDetails;
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl booking-success-box px-6 py-12 text-center text-foreground animate-in fade-in duration-300">
        <div className="flex size-14 items-center justify-center rounded-full booking-success-icon">
          <CheckCircle2 className="size-8" />
        </div>
        <h3 className="mt-4 text-2xl font-bold">
          {ar ? "تم تأكيد موعد الاستشارة!" : "Consultation Confirmed!"}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {ar
            ? "شكرًا لك! لقد أرسلنا تفاصيل الموعد وتأكيد التقويم إلى بريدك الإلكتروني."
            : "Thank you! We've sent the calendar invite and confirmation details directly to your email."}
        </p>

        {details && (
          <div className="mt-6 w-full max-w-sm rounded-xl border border-border bg-card p-4 text-start text-sm shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 font-semibold text-[var(--tech-green)]">
              <Sparkles className="size-4" />
              <span>{details.firstName} {details.lastName}</span>
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-2 text-foreground font-medium">
                <CalendarIcon className="size-3.5 text-[var(--tech-green)]" />
                <span>{details.date}</span>
              </p>
              <p className="flex items-center gap-2 text-foreground font-medium">
                <Clock className="size-3.5 text-[var(--tech-green)]" />
                <span>{details.timeSlot}</span>
              </p>
              <p className="pt-1 text-[11px] text-muted-foreground border-t border-border/60">
                {details.email} · {details.phone}
              </p>
            </div>
          </div>
        )}

        <Button
          type="button"
          size="lg"
          className="mt-6 min-w-32"
          onClick={onClose}
        >
          {ar ? "تم" : "Done"}
        </Button>
      </div>
    );
  }

  // Days grid calculation
  const calendarCells: {
    day: number;
    isCurrentMonth: boolean;
    isWeekday: boolean;
    isPast: boolean;
    isSelected: boolean;
  }[] = [];

  for (let i = 0; i < startOffset; i++) {
    calendarCells.push({
      day: 0,
      isCurrentMonth: false,
      isWeekday: false,
      isPast: true,
      isSelected: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = (startOffset + d - 1) % 7;
    // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
    const isWeekDay = dayOfWeek < 5;

    const cellDate = new Date(year, month, d, 23, 59, 59);
    const isPast = cellDate.getTime() < today.setHours(0, 0, 0, 0);

    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(d).padStart(2, "0");
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      isWeekday: isWeekDay,
      isPast,
      isSelected: selectedDate === dateStr,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="booking-calendar-card p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between pb-3 booking-header">
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-4 text-[var(--tech-green)]" />
            <span className="font-semibold text-sm">{monthLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={prevMonth}
              disabled={!canGoPrev}
              aria-label={ar ? "الشهر السابق" : "Previous month"}
            >
              <ChevronLeft className="size-4 rtl:rotate-180" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={nextMonth}
              aria-label={ar ? "الشهر التالي" : "Next month"}
            >
              <ChevronRight className="size-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>

        {/* Day-of-week headers */}
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
          {(ar ? weekdayNamesAr : weekdayNamesEn).map((name) => (
            <div key={name} className="py-1">
              {name}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="mt-1 grid grid-cols-7 gap-1">
          {calendarCells.map((cell, idx) => {
            if (!cell.isCurrentMonth) {
              return <div key={`empty-${idx}`} className="h-9" />;
            }

            const disabled = !cell.isWeekday || cell.isPast;

            return (
              <button
                key={`day-${cell.day}`}
                type="button"
                disabled={disabled}
                onClick={() => handleSelectDate(cell.day)}
                className={`booking-day-btn flex h-9 items-center justify-center rounded-lg text-xs font-medium cursor-pointer ${
                  cell.isSelected ? "selected" : ""
                }`}
              >
                {cell.day}
              </button>
            );
          })}
        </div>

        {/* Date helper / error */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-2">
          <span>
            {ar
              ? "مواعيد أيام العمل فقط (الإثنين – الجمعة)"
              : "Weekdays only (Monday – Friday)"}
          </span>
          {selectedDate && (
            <span className="font-semibold text-[var(--tech-green)]">
              {selectedDate}
            </span>
          )}
        </div>
        {fieldError("date") && (
          <p className="mt-1 text-xs text-destructive">{fieldError("date")}</p>
        )}
      </div>

      {/* Time Slots (1 hour between each: 9am to 5pm ET) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 text-xs font-semibold">
            <Clock className="size-3.5 text-[var(--tech-green)]" />
            {ar ? "المواعيد المتاحة (٩ ص – ٥ م بتوقيت ET)" : "Available Time Slots (9 AM – 5 PM ET)"}
          </Label>
          <span className="text-[11px] text-muted-foreground">1-Hour Intervals</span>
        </div>

        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl border border-border bg-card/60">
          {BOOKING_TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => handleSelectSlot(slot)}
                className={`booking-slot-btn py-2.5 px-2 text-center rounded-lg text-xs font-medium cursor-pointer ${
                  isSelected ? "selected" : ""
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
        {fieldError("timeSlot") && (
          <p className="text-xs text-destructive">{fieldError("timeSlot")}</p>
        )}
      </div>

      {/* Personal Details */}
      <div className="space-y-4 pt-1">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={formId + "-first-name"} className="text-xs">
              {ar ? "الاسم الأول" : "First Name"}
            </Label>
            <Input
              id={formId + "-first-name"}
              type="text"
              placeholder={ar ? "أحمد" : "Jane"}
              autoComplete="given-name"
              aria-invalid={Boolean(fieldError("firstName"))}
              {...register("firstName")}
            />
            {fieldError("firstName") && (
              <p className="text-xs text-destructive">
                {fieldError("firstName")}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={formId + "-last-name"} className="text-xs">
              {ar ? "اسم العائلة" : "Last Name"}
            </Label>
            <Input
              id={formId + "-last-name"}
              type="text"
              placeholder={ar ? "محمد" : "Smith"}
              autoComplete="family-name"
              aria-invalid={Boolean(fieldError("lastName"))}
              {...register("lastName")}
            />
            {fieldError("lastName") && (
              <p className="text-xs text-destructive">
                {fieldError("lastName")}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={formId + "-email"} className="text-xs">
              {ar ? "البريد الإلكتروني للعمل" : "Work Email"}
            </Label>
            <Input
              id={formId + "-email"}
              type="email"
              placeholder={ar ? "you@company.com" : "you@company.com"}
              autoComplete="email"
              aria-invalid={Boolean(fieldError("email"))}
              {...register("email")}
            />
            {fieldError("email") && (
              <p className="text-xs text-destructive">{fieldError("email")}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={formId + "-phone"} className="text-xs">
              {ar ? "رقم الهاتف / الواتساب" : "Phone Number"}
            </Label>
            <Input
              id={formId + "-phone"}
              type="tel"
              placeholder={ar ? "+20 100 000 0000" : "+1 (555) 000-0000"}
              autoComplete="tel"
              aria-invalid={Boolean(fieldError("phone"))}
              {...register("phone")}
            />
            {fieldError("phone") && (
              <p className="text-xs text-destructive">{fieldError("phone")}</p>
            )}
          </div>
        </div>
      </div>

      {state.status === "error" && state.error && (
        <Alert variant="destructive">
          <AlertTitle>{ar ? "خطأ في الحجز" : "Unable to book call"}</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Selected Slot Summary Badge */}
      {selectedDate && selectedSlot && (
        <div className="booking-summary-pill flex items-center justify-between rounded-lg px-3.5 py-2.5 text-xs">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="size-3.5" />
            <span>
              {selectedDate} · {selectedSlot}
            </span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">
            {ar ? "الموعد المختار" : "Selected"}
          </span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={pending}
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {ar ? "جارٍ تأكيد الموعد…" : "Confirming Consultation…"}
          </>
        ) : (
          ar ? "تأكيد موعد الاستشارة" : "Confirm Consultation"
        )}
      </Button>

      <p className="text-center text-[11px] text-muted-foreground">
        {ar
          ? "تأكيد فوري عبر البريد الإلكتروني. لا توجد أي التزامات مسبقة."
          : "Instant email confirmation. 30-minute free discovery consultation."}
      </p>
    </form>
  );
}
