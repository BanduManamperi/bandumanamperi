import { Sheet } from "@/components/sheet";

// The description of a work, kept behind a button so it never takes room from
// the picture, and opened on a sheet of its own to read: one comfortable
// column of larger type.
export function ReadMore({ title, year, text, className = "" }: { title: string; year?: string | null; text: string; className?: string }) {
    return (
        <Sheet
            label="Read about the work"
            title={title}
            subtitle={year}
            className={`text-left underline decoration-foreground/30 underline-offset-[5px] transition-colors hover:decoration-foreground ${className}`}
        >
            <p className="max-w-[34rem] text-[1rem] leading-[1.8] text-foreground/85 sm:text-[1.0625rem]">{text}</p>
        </Sheet>
    );
}
