import { createFileRoute, redirect } from "@tanstack/react-router"
import { isBTC } from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/admin-dashboard")({
  component: AdminDashboard,
  beforeLoad: async () => {
    if (!isBTC()) {
      throw redirect({ to: "/" })
    }
  },
  head: () => ({
    meta: [
      {
        title: "Admin Dashboard - V-League",
      },
    ],
  }),
})

function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          BTC Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of users, teams, matches, and regulations
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border p-6">Users management</div>
        <div className="rounded-md border p-6">Regulations</div>
        <div className="rounded-md border p-6">Matches</div>
        <div className="rounded-md border p-6">Seasons</div>
      </div>
    </div>
  )
}
