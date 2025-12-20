import { createFileRoute, redirect } from "@tanstack/react-router"
import { isQuanLyDoi } from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/team-manager")({
  component: TeamManagerDashboard,
  beforeLoad: async () => {
    if (!isQuanLyDoi()) {
      throw redirect({ to: "/" })
    }
  },
  head: () => ({
    meta: [
      {
        title: "Team Manager Dashboard - V-League",
      },
    ],
  }),
})

function TeamManagerDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Team Manager Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your team roster, fixtures, and stats
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border p-6">Roster management</div>
        <div className="rounded-md border p-6">Upcoming fixtures</div>
        <div className="rounded-md border p-6">Training & availability</div>
        <div className="rounded-md border p-6">Team statistics</div>
      </div>
    </div>
  )
}
