import Link from "next/link";
import { Rocket } from "lucide-react";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-bold text-slate-900">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
        <Rocket className="h-5 w-5" />
      </span>
      <span className="text-lg tracking-tight">GrowthOS</span>
    </Link>
  );
}
