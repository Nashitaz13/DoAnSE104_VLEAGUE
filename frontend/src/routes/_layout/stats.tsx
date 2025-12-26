import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/stats")({
  component: StatsPage,
  head: () => ({
    meta: [
      {
        title: "Stats - V-League",
      },
    ],
  }),
})

function StatsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground">
          Top scorers, assists, clean sheets and more
        </p>
      </div>
      <div className="rounded-md border p-6">
        Coming soon: season statistics
      </div>
    </div>
  )
}
