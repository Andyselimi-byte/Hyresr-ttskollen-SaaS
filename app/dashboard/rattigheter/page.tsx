"use client";
import { useState } from "react";
import {
  BookOpen, Search, Home, Users, Wrench,
  TrendingUp, DoorOpen, Heart, ChevronDown, ChevronUp,
} from "lucide-react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { RIGHTS_TOPICS } from "@/lib/rights-data";

const ICONS: Record<string, React.ElementType> = {
  Home, Users, Wrench, TrendingUp, DoorOpen, Heart,
};

const TAG_COLORS: Record<string, string> = {
  "Grundläggande": "bg-blue-100 text-blue-700",
  "Viktigt":       "bg-green-100 text-green-700",
  "Vanlig tvist":  "bg-orange-100 text-orange-700",
  "Aktuellt 2025": "bg-purple-100 text-purple-700",
  "Allvarligt":    "bg-red-100 text-red-700",
  "Familjerätt":   "bg-pink-100 text-pink-700",
};

export default function RattigheterPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = RIGHTS_TOPICS.filter(
    t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.summary.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-5 w-5 text-[#1a56a0]" />
          <h1 className="text-2xl font-bold text-gray-900">Rättighetsguide</h1>
        </div>
        <p className="text-sm text-gray-500">
          Dina rättigheter som hyresgäst enligt 12 kap. Jordabalken (JB).
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Sök rättigheter..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
        />
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>Inga träffar för &quot;{search}&quot;</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(topic => {
          const Icon = ICONS[topic.icon] ?? Home;
          const isOpen = expanded === topic.id;
          const tagColor = TAG_COLORS[topic.tag] ?? "bg-gray-100 text-gray-600";

          return (
            <div
              key={topic.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpanded(isOpen ? null : topic.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#e6f1fb]">
                  <Icon className="h-4.5 w-4.5 text-[#1a56a0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{topic.title}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagColor}`}>
                      {topic.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{topic.summary}</p>
                </div>
                {isOpen
                  ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
                  : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                }
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{topic.content}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-[#e6f1fb] text-[#1a56a0] px-2.5 py-1 rounded-full font-semibold">
                      {topic.lawRef}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <DisclaimerBanner />
    </div>
  );
}
