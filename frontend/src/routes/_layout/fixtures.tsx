import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/fixtures")({
  component: FixturesPage,
  head: () => ({
    meta: [
      {
        title: "Lịch thi đấu - V-League",
      },
    ],
  }),
})

function FixturesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lịch thi đấu</h1>
        <p className="text-muted-foreground">
          Lịch các vòng đấu và trận đấu sắp tới
        </p>
      </div>
      <div className="rounded-md border p-6">
        Sắp có: danh sách lịch thi đấu V-League
      </div>
    </div>
  )
}
