"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home, BarChart2, BookOpen, FileText, Mail,
  LogOut, Menu, X, Crown, Shield,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Hem", icon: Home },
  { href: "/dashboard/hyresanalys", label: "Hyresanalys", icon: BarChart2 },
  { href: "/dashboard/rattigheter", label: "Rättigheter", icon: BookOpen },
  { href: "/dashboard/avtal", label: "Avtalsgranskning", icon: FileText },
  { href: "/dashboard/brev", label: "Brevgenerator", icon: Mail },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-[#1a56a0]" />
          <span className="font-bold text-[#1a56a0] text-lg leading-tight">
            Hyresrätts<br />kollen
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#e6f1fb] text-[#1a56a0]"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 space-y-2 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#1a56a0] to-[#0c447c] text-white text-xs">
          <Crown className="h-3.5 w-3.5 shrink-0" />
          <span className="font-medium">Uppgradera till Premium — 79 kr/mån</span>
        </div>
        <a
          href="/api/auth/logout"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <LogOut className="h-4 w-4" />
          Logga ut
        </a>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <Shield className="h-5 w-5 text-[#1a56a0]" />
            <span className="font-bold text-[#1a56a0] text-base">Hyresrättskollen</span>
          </div>
        </div>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
