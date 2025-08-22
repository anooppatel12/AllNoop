
import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(206, 100%, 60%)', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(217, 100%, 50%)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M18,6H16A4,4,0,0,0,8,6H6A2,2,0,0,0,4,8V18a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8A2,2,0,0,0,18,6ZM10,6a2,2,0,0,1,4,0Z" fill="url(#logoGradient)" />
      <path d="M11,12H9v2h2v2h2V14h2V12H13V10H11Z" fill="hsl(var(--card-foreground))" />
      <rect x="15" y="11" width="1" height="1" fill="hsl(var(--card-foreground))" />
       <rect x="16" y="10" width="1" height="1" fill="hsl(var(--card-foreground))" />
    </svg>
  );
}
