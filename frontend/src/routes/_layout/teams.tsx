import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/teams")({
  component: TeamsPage,
  head: () => ({
    meta: [
      {
        title: "Teams - V-League",
      },
    ],
  }),
})

function TeamsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
        <p className="text-muted-foreground">
          Team information, squad, and manager details
        </p>
      </div>
      <div className="rounded-md border p-6">Coming soon: teams directory</div>
    </div>
  )
}
