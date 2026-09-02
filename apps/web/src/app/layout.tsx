// import type { Metadata } from "next";
// import "./globals.css";
// import QueryProvider from "@/providers/query-provider";

// export const metadata: Metadata = {
//   title: "AI Placement Platform",
//   description: "AI Powered Placement & Career Platform",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <QueryProvider>{children}</QueryProvider>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Placement Platform",
  description: "AI Powered Placement & Career Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}