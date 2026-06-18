"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Search, Mail, MessageSquare, Users, Settings, Shield,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/lead-finder", label: "AI Lead Finder", icon: Search },
  { href: "/dashboard/cold-email", label: "Cold Email", icon: Mail },
  { href: "/dashboard/assistant", label: "Sales Assistant", icon: MessageSquare },
  { href: "/dashboard/crm", label: "CRM", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const items = isAdmin
    ? [...nav, { href: "/dashboard/admin", label: "Admin", icon: Shield }]
    : nav;
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-100 bg-white p-4 md:flex">
      <div className="px-2 py-3">
        <Logo href="/dashboard" />
      </div>
      <nav className="mt-4 space-y-1">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
