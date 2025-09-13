"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IconLayoutDashboard, IconMail, IconUsers, IconFolder, IconMessage2, IconArticle, IconChevronDown, IconMenu2 } from "@tabler/icons-react";
import clsx from "clsx";

type LinkItem = { href: string; label: string; icon: any };
type Group = { label: string; icon?: any; children: LinkItem[] };

const primary: LinkItem[] = [
  { href: "/admin", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/admin/contacts", label: "Contacts", icon: IconMail },
  { href: "/admin/team", label: "Team", icon: IconUsers },
];

const groups: Group[] = [
  {
    label: "Content",
    icon: IconFolder,
    children: [
      { href: "/admin/projects", label: "Projects", icon: IconFolder },
      { href: "/admin/testimonials", label: "Testimonials", icon: IconMessage2 },
      { href: "/admin/blogs", label: "Blogs", icon: IconArticle },
    ],
  },
  {
    label: "CRM",
    icon: IconFolder,
    children: [
      { href: "/admin/clients", label: "Clients", icon: IconUsers },
      { href: "/admin/leads", label: "Leads", icon: IconUsers },
      { href: "/admin/notes", label: "Notes", icon: IconArticle },
      { href: "/admin/todos", label: "Todos", icon: IconLayoutDashboard },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Content: true });

  function toggleGroup(label: string) {
    setOpenGroups((s) => ({ ...s, [label]: !s[label] }));
  }
  return (
    <aside className={clsx("fixed inset-y-0 left-0 border-r border-white/10 bg-white/70 backdrop-blur transition-all dark:bg-slate-900/60", collapsed ? "w-20" : "w-64")}
      aria-label="Admin sidebar"
    >
      <div className="flex items-center justify-between px-3 py-4">
        <div className={clsx("text-xl font-bold", collapsed && "sr-only")}>Admin</div>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
          aria-label="Toggle sidebar"
        >
          <IconMenu2 size={16} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
      <nav className="space-y-1 px-2">
        {primary.map((l) => {
          const Icon = l.icon;
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              title={collapsed ? l.label : undefined}
              className={clsx(
                "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition",
                active ? "bg-indigo-600 text-white shadow" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5",
                collapsed && "justify-center"
              )}
            >
              <Icon size={18} />
              {!collapsed && <span>{l.label}</span>}
            </Link>
          );
        })}

        {groups.map((g) => {
          const open = !!openGroups[g.label];
          const GIcon = g.icon || IconFolder;
          return (
            <div key={g.label} className="mt-2">
              <button
                type="button"
                onClick={() => toggleGroup(g.label)}
                className={clsx(
                  "flex w-full items-center gap-3 rounded px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5",
                  collapsed && "justify-center"
                )}
                aria-expanded={open}
              >
                <GIcon size={18} />
                {!collapsed && <span className="flex-1 text-left">{g.label}</span>}
                {!collapsed && <IconChevronDown size={16} className={clsx("transition", open ? "rotate-0" : "-rotate-90")} />}
              </button>
              {open && !collapsed && (
                <div className="ml-5 space-y-1 border-l border-white/10 pl-3">
                  {g.children.map((l) => {
                    const Icon = l.icon;
                    const active = pathname === l.href;
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={clsx(
                          "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition",
                          active ? "bg-indigo-600 text-white shadow" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                        )}
                      >
                        <Icon size={16} />
                        <span>{l.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
