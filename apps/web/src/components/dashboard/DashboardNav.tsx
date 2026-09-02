// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { clearTokens } from "@/lib/auth";
// import { useEffect, useState } from "react";
// import { getMe } from "@/services/auth.service";

// interface User {
//   role: string;
// }

// export default function DashboardNav() {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const response = await getMe();
//         setUser(response.data);
//       } catch (error) {
//         console.error("Failed to load user:", error);
//       }
//     };

//     loadUser();
//   }, []);

//   const handleLogout = () => {
//     clearTokens();
//     router.replace("/login");
//   };

//   const studentNavItems = [
//     { label: "Dashboard", href: "/dashboard" },
//     { label: "Profile", href: "/profile" },
//     { label: "Resume", href: "/dashboard/resume" },
//     { label: "Jobs", href: "/dashboard/jobs" },
//     { label: "Applications", href: "/dashboard/applications" },
//     {
//       label: "Mock Interview",
//       href: "/dashboard/interview/start",
//     },
//     {
//       label: "Notifications",
//       href: "/dashboard/notifications",
//     },
//   ];

//   const recruiterNavItems = [
//     { label: "Dashboard", href: "/dashboard" },
//     { label: "Profile", href: "/profile" },
//     { label: "My Jobs", href: "/dashboard/jobs" },
//     { label: "Create Job", href: "/dashboard/recruiter/jobs/create" },
//     { label: "Notifications", href: "/dashboard/notifications" },
//   ];

//   const adminNavItems = [
//     {
//       label: "Dashboard",
//       href: "/dashboard/admin",
//     },
//     {
//       label: "Users",
//       href: "/dashboard/admin#users-section",
//     },
//     {
//       label: "Jobs",
//       href: "/dashboard/admin#jobs-section",
//     },
//     {
//       label: "Applications",
//       href: "/dashboard/admin#applications-section",
//     },
//     {
//       label: "Analytics",
//       href: "/dashboard/admin#analytics-section",
//     },
//   ];

//   const navItems =
//     user?.role === "STUDENT"
//       ? studentNavItems
//       : user?.role === "RECRUITER"
//         ? recruiterNavItems
//         : user?.role === "ADMIN"
//           ? adminNavItems
//           : [];

//   const isAdmin = user?.role === "ADMIN";

//   return (
//     <nav className="border-b bg-white">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
//         <Link
//           href={isAdmin ? "/dashboard/admin" : "/dashboard"}
//           className="text-xl font-bold"
//         >
//           AI Placement Platform
//         </Link>

//         <div className="flex items-center gap-4 flex-wrap">
//           {navItems.map((item) => {
//             let active = false;

//             if (isAdmin) {
//               if (item.label === "Dashboard") {
//                 active = pathname === "/dashboard/admin";
//               } else {
//                 active = pathname === "/dashboard/admin";
//               }
//             } else {
//               active =
//                 pathname === item.href ||
//                 (item.href !== "/dashboard" &&
//                   pathname.startsWith(item.href));
//             }

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`px-3 py-2 rounded-md text-sm ${
//                   active
//                     ? "bg-black text-white"
//                     : "text-gray-700 hover:bg-gray-100"
//                 }`}
//               >
//                 {item.label}
//               </Link>
//             );
//           })}

//           <button
//             type="button"
//             onClick={handleLogout}
//             className="px-3 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearTokens } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getMe } from "@/services/auth.service";

interface User {
  role: string;
}

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getMe();
        setUser(response.data);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    clearTokens();
    router.replace("/login");
  };

  const studentNavItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", href: "/profile" },
    { label: "Resume", href: "/dashboard/resume" },
    { label: "Jobs", href: "/dashboard/jobs" },
    { label: "Applications", href: "/dashboard/applications" },
    {
      label: "Mock Interview",
      href: "/dashboard/interview/start",
    },
    {
      label: "Notifications",
      href: "/dashboard/notifications",
    },
  ];

  const recruiterNavItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", href: "/profile" },
    { label: "My Jobs", href: "/dashboard/jobs" },
    { label: "Create Job", href: "/dashboard/recruiter/jobs/create" },
    { label: "Notifications", href: "/dashboard/notifications" },
  ];

  const adminNavItems = [
    {
      label: "Dashboard",
      href: "/dashboard/admin",
    },
    {
      label: "Users",
      href: "/dashboard/admin#users-section",
    },
    {
      label: "Jobs",
      href: "/dashboard/admin#jobs-section",
    },
    {
      label: "Applications",
      href: "/dashboard/admin#applications-section",
    },
    {
      label: "Analytics",
      href: "/dashboard/admin#analytics-section",
    },
  ];

  const navItems =
    user?.role === "STUDENT"
      ? studentNavItems
      : user?.role === "RECRUITER"
        ? recruiterNavItems
        : user?.role === "ADMIN"
          ? adminNavItems
          : [];

  const isAdmin = user?.role === "ADMIN";

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link
          href={isAdmin ? "/dashboard/admin" : "/dashboard"}
          className="text-lg font-bold sm:text-xl"
        >
          AI Placement Platform
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => {
            let active = false;

            if (isAdmin) {
              if (item.label === "Dashboard") {
                active = pathname === "/dashboard/admin";
              }
            } else {
              active =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm ${
                  active
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-200 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-2 pt-3">
            {navItems.map((item) => {
              let active = false;

              if (isAdmin) {
                if (item.label === "Dashboard") {
                  active = pathname === "/dashboard/admin";
                }
              } else {
                active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm ${
                    active
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 w-full rounded-md bg-red-600 px-3 py-2.5 text-sm text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}