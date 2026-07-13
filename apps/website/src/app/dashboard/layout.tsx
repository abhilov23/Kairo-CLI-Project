import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

// Force dynamic rendering so auth() can read cookies at request time
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Subtle background effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Top accent glow */}
        <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </div>

      <DashboardSidebar />
      <main className="relative z-10 flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
