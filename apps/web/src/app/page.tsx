// export default function Home() {
//   return (
//     <main className="flex min-h-screen items-center justify-center">
//       <h1 className="text-4xl font-bold">
//         AI Placement Platform 🚀
//       </h1>
//     </main>
//   );
// }

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}