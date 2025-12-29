import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import {
  AlertTriangle,
  BarChart3,
  Filter,
  Goal,
  Loader2,
  Trophy,
  Users,
} from "lucide-react"
import { useMemo, useState } from "react"
import {
  MatchesService,
  SeasonManagementService,
  StandingsService,
  StatisticsService,
} from "@/client"
import { DisciplineTab } from "@/components/Statistics/Tabs/DisciplineTab"
import { MVPTab } from "@/components/Statistics/Tabs/MVPTab"
import { TeamStatsTab } from "@/components/Statistics/Tabs/TeamStatsTab"
// Import các Tab con
import { TopScorersTab } from "@/components/Statistics/Tabs/TopScorersTab"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const Route = createFileRoute("/_layout/stats")({
  component: StatisticsPage,
})

function StatisticsPage() {
  const [selectedSeason, setSelectedSeason] = useState<string>("2024-2025")

  // 1. Lấy danh sách Mùa giải
  const { data: seasonsData, isLoading: loadingSeasons } = useQuery({
    queryKey: ["seasons"],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 100 }),
  })

  // 2. Sắp xếp mùa giải
  const seasonList = useMemo(() => {
    const list = Array.isArray(seasonsData)
      ? seasonsData
      : (seasonsData as any)?.data || []
    // Ensure 2024-2025 is in the list if not present
    const has2024 = list.find((s: any) => s.muagiai === "2024-2025")
    const finalList = has2024 ? list : [...list, { muagiai: "2024-2025" }]

    return [...finalList].sort((a: any, b: any) =>
      b.muagiai.localeCompare(a.muagiai),
    )
  }, [seasonsData])

  // 4. Lấy dữ liệu tổng hợp (Bàn thắng, Thẻ phạt)
  const { data: standingsData } = useQuery({
    queryKey: ["standings", selectedSeason],
    queryFn: () => StandingsService.getStandings({ muagiai: selectedSeason }),
    enabled: !!selectedSeason,
  })

  const { data: disciplineData } = useQuery({
    queryKey: ["discipline", selectedSeason],
    queryFn: () =>
      StatisticsService.getDiscipline({ muagiai: selectedSeason, limit: 200 }),
    enabled: !!selectedSeason,
  })

  const { data: matchesData } = useQuery({
    queryKey: ["matches-all", selectedSeason],
    queryFn: () =>
      MatchesService.readMatches({ muagiai: selectedSeason, limit: 200 }),
    enabled: !!selectedSeason,
  })

  const totalGoals = useMemo(() => {
    const list = (standingsData as any)?.standings || []
    return list.reduce(
      (acc: number, team: any) => acc + (team.goals_for || 0),
      0,
    )
  }, [standingsData])

  const { totalYellow, totalRed } = useMemo(() => {
    const list = (disciplineData as any)?.leaderboard || []
    return list.reduce(
      (acc: any, player: any) => ({
        totalYellow: acc.totalYellow + (player.yellow_cards || 0),
        totalRed: acc.totalRed + (player.red_cards || 0),
      }),
      { totalYellow: 0, totalRed: 0 },
    )
  }, [disciplineData])

  if (loadingSeasons && !selectedSeason) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 p-6 rounded-xl border transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Thống kê giải đấu (BM7.1 - 7.5)
          </h1>
          <p className="text-muted-foreground mt-1">
            Các chỉ số chi tiết về cầu thủ và đội bóng mùa giải {selectedSeason}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-background p-2 rounded-lg border shadow-sm transition-colors duration-300">
          <Filter className="w-4 h-4 text-muted-foreground ml-2" />
          <span className="text-sm font-medium hidden sm:inline">
            Mùa giải:
          </span>
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-[140px] border-0 shadow-none focus:ring-0 font-bold bg-transparent">
              <SelectValue placeholder="Chọn mùa" />
            </SelectTrigger>
            <SelectContent>
              {seasonList.map((s: any) => (
                <SelectItem key={s.muagiai} value={s.muagiai}>
                  {s.muagiai}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card dark:bg-card/50 p-4 rounded-xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
            <Goal className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng số bàn thắng
            </p>
            <h3 className="text-2xl font-bold">{totalGoals}</h3>
          </div>
        </div>

        <div className="bg-card dark:bg-card/50 p-4 rounded-xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
            <div className="w-6 h-6 flex items-center justify-center font-bold border-2 border-current rounded-sm text-xs">
              Y
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng thẻ vàng
            </p>
            <h3 className="text-2xl font-bold">{totalYellow}</h3>
          </div>
        </div>

        <div className="bg-card dark:bg-card/50 p-4 rounded-xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
            <div className="w-6 h-6 flex items-center justify-center font-bold bg-current rounded-sm" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng thẻ đỏ
            </p>
            <h3 className="text-2xl font-bold">{totalRed}</h3>
          </div>
        </div>
      </div>

      {/* Tabs Nội dung */}
      <Tabs defaultValue="scorers" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger
            value="scorers"
            className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg gap-2"
          >
            <Trophy className="w-4 h-4 text-yellow-500" /> Vua phá lưới
          </TabsTrigger>
          <TabsTrigger
            value="mvp"
            className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg gap-2"
          >
            <Users className="w-4 h-4 text-blue-500" /> Cầu thủ xuất sắc
          </TabsTrigger>
          <TabsTrigger
            value="discipline"
            className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-red-500" /> Kỷ luật & Thẻ
            phạt
          </TabsTrigger>
          <TabsTrigger
            value="teams"
            className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg gap-2"
          >
            <BarChart3 className="w-4 h-4 text-green-500" /> Thống kê đội
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[400px]">
          {/* BM7.1 - Vua phá lưới & BM7.2 - Vua kiến tạo (Merged here or separate) */}
          <TabsContent value="scorers" className="m-0">
            <TopScorersTab muagiai={selectedSeason} />
          </TabsContent>

          {/* BM7.4 - Cầu thủ xuất sắc nhất */}
          <TabsContent value="mvp" className="m-0">
            <MVPTab />
          </TabsContent>

          {/* BM7.3 - Thống kê thẻ phạt & BM7.5 - Cấm thi đấu */}
          <TabsContent value="discipline" className="m-0">
            <DisciplineTab muagiai={selectedSeason} data={disciplineData} />
          </TabsContent>

          <TabsContent value="teams" className="m-0">
            <TeamStatsTab
              standings={standingsData}
              discipline={disciplineData}
              matches={matchesData}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
