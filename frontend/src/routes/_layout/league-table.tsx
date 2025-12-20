import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/league-table")({
  component: LeagueTablePage,
  head: () => ({
    meta: [
      {
        title: "League Table - V-League",
      },
    ],
  }),
})

function LeagueTablePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">League Table</h1>
        <p className="text-muted-foreground">
          Standings, points, wins, draws and losses
        </p>
      </div>
      <div className="rounded-md border p-6">
        Coming soon: league standings table
      </div>
    </div>
  )
}
