"use client";

import Link from "next/link";
import { BookOpen, Calculator, Home, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

const mobileNavItems = [
  { href: "/", label: "首頁", icon: Home },
  { href: "/formula", label: "計算", icon: Calculator },
  { href: "/brands", label: "品牌", icon: BookOpen },
  { href: "/about", label: "安全", icon: ShieldCheck },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-panel/95 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-10px_30px_rgba(31,35,40,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-xs font-medium ${
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon aria-hidden="true" className="size-4" strokeWidth={2.1} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
