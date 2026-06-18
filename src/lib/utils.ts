import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PLAN_LIMITS: Record<string, number> = {
  free: 20,
  pro: 1000,
  team: 5000,
};

export function planLimit(plan: string | null | undefined) {
  return PLAN_LIMITS[plan ?? "free"] ?? PLAN_LIMITS.free;
}
