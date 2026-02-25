"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  CubeIcon,
  Cog6ToothIcon,
  Bars3Icon
} from "@heroicons/react/24/outline";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <HomeIcon className="w-5 h-5" /> },
    { name: "Users", href: "/dashboard/users", icon: <UsersIcon className="w-5 h-5" /> },
    { name: "Products", href: "/dashboard/products", icon: <CubeIcon className="w-5 h-5" /> },
    { name: "Settings", href: "/dashboard/settings", icon: <Cog6ToothIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white p-4 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
        <div className="flex justify-between items-center mb-6">
          {!collapsed && <h2 className="text-2xl font-bold">Admin</h2>}
          <button onClick={() => setCollapsed(!collapsed)}>
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-2 hover:bg-gray-700 p-2 rounded ${
                  isActive ? "bg-gray-700" : ""
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900 p-4 shadow flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
        </header>
        <main className="flex-1 p-6 bg-gray-900">{children}</main>
      </div>
    </div>
  );
}
