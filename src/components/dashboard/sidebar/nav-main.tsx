"use client";

import { CheckCircleIcon, HomeIcon, Settings2, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const navMain = [
  {
    title: "Home",
    url: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "My Tasks",
    url: "/dashboard",
    icon: CheckCircleIcon,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings2,
  },
  {
    title: "Members",
    url: "/dashboard",
    icon: UsersIcon,
  },
];

export function NavMain() {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  if (!workspaceId) return null;

  const navMain = [
    {
      title: "Home",
      url: `/workspaces/${workspaceId}`,
      icon: HomeIcon,
    },
    {
      title: "My Tasks",
      url: `/workspaces/${workspaceId}/tasks`,
      icon: CheckCircleIcon,
    },
    {
      title: "Settings",
      url: `/workspaces/${workspaceId}/settings`,
      icon: Settings2,
    },
    {
      title: "Members",
      url: `/workspaces/${workspaceId}/members`,
      icon: UsersIcon,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={pathname === item.url}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
