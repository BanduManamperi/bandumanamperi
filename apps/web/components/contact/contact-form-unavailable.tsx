import { Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const EMAIL = "bandumanamperi@yahoo.com";
const PHONE_DISPLAY = "+94773672789";
const PHONE_HREF = "tel:+94773672789";

type Variant = "default" | "gallery";

export function ContactFormUnavailable({
  variant = "default",
  title = "Send a Message",
  className,
}: {
  variant?: Variant;
  title?: string;
  className?: string;
}) {
  const gallery = variant === "gallery";

  return (
    <div
      className={cn(
        "rounded-lg border p-6 md:p-8",
        gallery
          ? "border-white/10 bg-white/[0.03]"
          : "border-border bg-muted/30",
        className
      )}
    >
      <h2
        className={cn(
          "text-2xl font-light mb-4",
          gallery ? "font-serif text-white" : ""
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "text-sm leading-relaxed",
          gallery ? "text-gallery-gray" : "text-muted-foreground"
        )}
      >
        The online message form is not available yet. Please reach out by email or phone.
      </p>
      <div className={cn("mt-6 space-y-4", gallery ? "text-white" : "")}>
        <a
          href={`mailto:${EMAIL}`}
          className={cn(
            "flex items-start gap-3 text-sm transition-colors",
            gallery
              ? "text-white hover:text-gallery-gray"
              : "text-foreground hover:text-muted-foreground"
          )}
        >
          <Mail className="w-5 h-5 shrink-0 mt-0.5 opacity-70" />
          <span>{EMAIL}</span>
        </a>
        <a
          href={PHONE_HREF}
          className={cn(
            "flex items-start gap-3 text-sm transition-colors",
            gallery
              ? "text-white hover:text-gallery-gray"
              : "text-foreground hover:text-muted-foreground"
          )}
        >
          <Phone className="w-5 h-5 shrink-0 mt-0.5 opacity-70" />
          <span>{PHONE_DISPLAY}</span>
        </a>
      </div>
    </div>
  );
}
