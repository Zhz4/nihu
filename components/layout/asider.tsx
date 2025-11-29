"use client";

import { cn } from "@/lib/utils";
import { Home, LayoutDashboard, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    title: "商品图",
    items: [
      { title: "场景参考图", href: "/home", icon: Home },
      { title: "商品替换", href: "/dashboard", icon: LayoutDashboard },
      { title: "图片翻译", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "AI视频",
    items: [{ title: "图转视频", href: "/users", icon: Users }],
  },
];

const AsiderPage = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background h-full flex flex-col">
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6 px-3">
          {menuItems.map((group, groupIndex) => (
            <div key={groupIndex}>
              {groupIndex > 0 && <Separator className="my-4" />}
              <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground text-center">
          © 2025 泥乎系统
        </div>
      </div>
    </aside>
  );
};

export default AsiderPage;
