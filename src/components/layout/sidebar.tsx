"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  AppSwitcher,
  GO_APPS,
  UserMenu,
} from "@takaki/go-design-system";
import {
  LayoutDashboard,
  ListTodo,
  Target,
  Layers,
  Info,
  Sun,
  Moon,
} from "lucide-react";

const mainNavItems = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/tasks", label: "タスク", icon: ListTodo },
  { href: "/focus", label: "フォーカス管理", icon: Target },
  { href: "/layers", label: "設計レイヤー", icon: Layers },
];

function isItemActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function TaskGoSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setDisplayName(
        user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
      );
      setEmail(user.email || "");
      setAvatarUrl(user.user_metadata?.avatar_url || "");
    });
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  function toggleTheme() {
    const next = isDark ? "light" : "dark";
    localStorage.setItem("taskgo-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Sidebar>
      {/* ヘッダー：アプリ切り替え */}
      <SidebarHeader>
        <AppSwitcher
          currentApp="TaskGo"
          apps={GO_APPS}
          placement="bottom"
        />
      </SidebarHeader>

      {/* メインナビ */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isItemActive(href, pathname)}
                  >
                    <Link href={href}>
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* フッター */}
      <SidebarFooter>
        <UserMenu
          displayName={displayName || "—"}
          email={email}
          avatarUrl={avatarUrl}
          items={[
            {
              title: "コンセプト・使い方",
              icon: Info,
              onSelect: () => router.push("/about"),
              isActive: isItemActive("/about", pathname),
            },
            {
              title: isDark ? "ダーク" : "ライト",
              icon: isDark ? Moon : Sun,
              onSelect: toggleTheme,
            },
          ]}
          signOut={{ onSelect: handleSignOut }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
