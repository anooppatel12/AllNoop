
import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      {...props}
    >
      <path d="M12 2 L7 7 L17 7 Z" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" />
      <rect x="5" y="9" width="8" height="8" rx="1" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" />
      <circle cx="16" cy="13" r="4" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" />
    </svg>
  );
}
