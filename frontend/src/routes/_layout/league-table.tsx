import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import {
  Award,
  Download,
  Filter,
  Loader2,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react"
import { useMemo, useState } from "react"
import { SeasonManagementService, StandingsService } from "@/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute("/_layout/league-table")({
  component: LeagueTablePage,
})

function LeagueTablePage() {
  // Mặc định chọn 2024-2025
  const [selectedSeason, setSelectedSeason] = useState<string>("2024-2025")

  // 1. Lấy danh sách Mùa giải
  const { data: seasonsData } = useQuery({
    queryKey: ["seasons"],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 100 }),
  })

  const seasonList = useMemo(() => {
    const listFromApi = Array.isArray(seasonsData)
      ? seasonsData
      : (seasonsData as any)?.data || []
    const requiredSeasons = ["2025-2026", "2024-2025", "2023-2024"]
    const seasonSet = new Set([
      ...listFromApi.map((s: any) => s.muagiai),
      ...requiredSeasons,
    ])
    return Array.from(seasonSet)
      .map((s) => ({ muagiai: s }))
      .sort((a: any, b: any) => b.muagiai.localeCompare(a.muagiai))
  }, [seasonsData])

  // 2. Lấy Bảng xếp hạng
  const { data: standingsData, isLoading } = useQuery({
    queryKey: ["standings", selectedSeason],
    queryFn: () => StandingsService.getStandings({ muagiai: selectedSeason }),
  })

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(null)

  // Xử lý dữ liệu BXH (BM6)
  const rankings = useMemo(() => {
    const list = Array.isArray(standingsData)
      ? standingsData
      : (standingsData as any)?.standings || (standingsData as any)?.data || []

    // Normalize and Map API Data (English -> Vietnamese or direct usage)
    const mappedList = [...list].map((item: any) => ({
      ...item,
      sotran: item.matches_played ?? item.sotran ?? 0,
      thang: item.won ?? item.thang ?? 0,
      hoa: item.drawn ?? item.hoa ?? 0,
      thua: item.lost ?? item.thua ?? 0,
      banthang: item.goals_for ?? item.banthang ?? 0,
      banthua: item.goals_against ?? item.banthua ?? 0,
      diem: item.points ?? item.diem ?? 0,
    }))

    // Default Sort (Points -> GD -> Goals)
    // If sorting is active, apply it
    mappedList.sort((a: any, b: any) => {
      if (sortConfig) {
        const { key, direction } = sortConfig
        let valA = a[key] ?? 0
        let valB = b[key] ?? 0

        // Handle special cases if any (e.g. strings)
        if (typeof valA === "string") valA = valA.toLowerCase()
        if (typeof valB === "string") valB = valB.toLowerCase()

        if (valA < valB) return direction === "asc" ? -1 : 1
        if (valA > valB) return direction === "asc" ? 1 : -1
        return 0
      }

      // Default V-League Rules: Points -> Head-to-Head (ignored for now) -> Goal Diff -> Goals
      if (b.diem !== a.diem) return b.diem - a.diem
      const hsA = a.banthang - a.banthua
      const hsB = b.banthang - b.banthua
      if (hsB !== hsA) return hsB - hsA
      return b.banthang - a.banthang
    })

    return mappedList
  }, [standingsData, sortConfig])

  const summaryStats = useMemo(() => {
    if (!rankings || rankings.length === 0) return null
    const byGoalsFor = [...rankings].sort(
      (a: any, b: any) => (b.banthang ?? 0) - (a.banthang ?? 0),
    )
    const byGoalsAgainst = [...rankings].sort(
      (a: any, b: any) => (a.banthua ?? 0) - (b.banthua ?? 0),
    )
    const byGoalDiff = [...rankings].sort(
      (a: any, b: any) =>
        (b.banthang ?? 0) -
        (b.banthua ?? 0) -
        ((a.banthang ?? 0) - (a.banthua ?? 0)),
    )
    const bestAttackTeam = byGoalsFor[0]
    const bestDefenseTeam = byGoalsAgainst[0]
    const bestGoalDiffTeam = byGoalDiff[0]
    return {
      bestAttack: {
        team: bestAttackTeam?.tenclb || bestAttackTeam?.maclb,
        goals_for: bestAttackTeam?.banthang ?? 0,
        matches_played: bestAttackTeam?.sotran ?? 0,
      },
      bestDefense: {
        team: bestDefenseTeam?.tenclb || bestDefenseTeam?.maclb,
        goals_against: bestDefenseTeam?.banthua ?? 0,
        matches_played: bestDefenseTeam?.sotran ?? 0,
      },
      bestGoalDiff: {
        team: bestGoalDiffTeam?.tenclb || bestGoalDiffTeam?.maclb,
        goal_difference:
          (bestGoalDiffTeam?.banthang ?? 0) - (bestGoalDiffTeam?.banthua ?? 0),
        goals_for: bestGoalDiffTeam?.banthang ?? 0,
        goals_against: bestGoalDiffTeam?.banthua ?? 0,
      },
    }
  }, [rankings])

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "desc"
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "desc"
    ) {
      direction = "asc"
    }
    setSortConfig({ key, direction })
  }

  // Handle Export (Placeholder)
  const handleExport = (type: "pdf" | "excel") => {
    alert(`Đang xuất dữ liệu bảng xếp hạng ra file ${type.toUpperCase()}...`)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-background font-sans pb-10">
      {/* HEADER CAM */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-900 dark:to-red-900 text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-4">
          <Trophy className="w-16 h-16 text-yellow-300 drop-shadow-md" />
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wide">
              Bảng Xếp Hạng (BM6)
            </h1>
            <p className="text-orange-100 dark:text-orange-200 mt-2 text-lg">
              V-League 1 • Mùa giải {selectedSeason}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto w-full px-4 -mt-8">
        {/* THANH CÔNG CỤ */}
        <div className="bg-white dark:bg-card rounded-t-xl shadow-sm border-b dark:border-border p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-600 dark:text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-sm" /> AFC Champions
              League
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-sm" /> Xuống hạng
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-muted/50 p-1.5 rounded-lg border dark:border-border">
              <Filter className="w-4 h-4 text-gray-500 dark:text-muted-foreground ml-2" />
              <span className="text-sm font-semibold text-gray-700 dark:text-foreground">
                Mùa giải:
              </span>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="w-[140px] h-8 border-none bg-white dark:bg-neutral-800 shadow-sm font-bold text-red-700 dark:text-red-400">
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("pdf")}
              className="text-red-700 dark:text-red-400 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
          </div>
        </div>

        {/* BẢNG XẾP HẠNG */}
        <div className="bg-white dark:bg-card rounded-b-xl shadow-md overflow-hidden border border-gray-200 dark:border-border">
          {isLoading ? (
            <div className="p-20 text-center flex flex-col items-center text-gray-500 dark:text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-red-600 dark:text-red-400" />
              Đang tính toán bảng xếp hạng...
            </div>
          ) : rankings.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center text-gray-400 dark:text-muted-foreground">
              <Shield className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-lg font-bold text-gray-700 dark:text-foreground">
                Chưa có dữ liệu xếp hạng
              </h3>
              <p>Mùa giải {selectedSeason} chưa có trận đấu nào diễn ra.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 dark:bg-muted/50 text-gray-500 dark:text-muted-foreground text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-4 text-center w-16">Hạng</th>
                    <th
                      className="px-4 py-4 w-1/3 min-w-[200px] cursor-pointer hover:bg-gray-200 dark:hover:bg-muted transition-colors"
                      onClick={() => handleSort("tenclb")}
                    >
                      <div className="flex items-center gap-1">
                        Câu Lạc Bộ
                        {sortConfig?.key === "tenclb" &&
                          (sortConfig.direction === "asc" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-4 text-center cursor-pointer hover:bg-gray-200 transition-colors"
                      title="Số trận đã đấu"
                      onClick={() => handleSort("sotran")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Trận
                        {sortConfig?.key === "sotran" &&
                          (sortConfig.direction === "asc" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-4 text-center cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort("thang")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Thắng
                        {sortConfig?.key === "thang" &&
                          (sortConfig.direction === "asc" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-4 text-center cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort("hoa")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Hòa
                        {sortConfig?.key === "hoa" &&
                          (sortConfig.direction === "asc" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-4 text-center cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort("thua")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Thua
                        {sortConfig?.key === "thua" &&
                          (sortConfig.direction === "asc" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-4 text-center cursor-pointer hover:bg-gray-200 transition-colors"
                      title="Bàn thắng"
                      onClick={() => handleSort("banthang")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        BT
                        {sortConfig?.key === "banthang" &&
                          (sortConfig.direction === "asc" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-4 text-center cursor-pointer hover:bg-gray-200 transition-colors"
                      title="Bàn thua"
                      onClick={() => handleSort("banthua")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        BB
                        {sortConfig?.key === "banthua" &&
                          (sortConfig.direction === "asc" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center" title="Hiệu số">
                      HS
                    </th>
                    <th
                      className="px-4 py-4 text-center w-24 cursor-pointer hover:bg-gray-200 dark:hover:bg-muted transition-colors"
                      onClick={() => handleSort("diem")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Điểm
                        {sortConfig?.key === "diem" &&
                          (sortConfig.direction === "asc" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center">Phong độ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-border">
                  {rankings.map((team: any, index: number) => {
                    const rank = index + 1
                    const isTop = rank <= 3
                    const isBottom =
                      rankings.length > 5 && rank > rankings.length - 2

                    const soTran = team.sotran || team.vong || 0
                    const thang = team.thang ?? 0
                    const hoa = team.hoa ?? 0
                    const thua = team.thua ?? 0
                    const bt = team.banthang ?? 0
                    const bb = team.banthua ?? 0
                    const hs = bt - bb
                    const diem = team.diem ?? 0

                    return (
                      <tr
                        key={team.maclb}
                        className={`hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors ${isTop ? "bg-green-100 dark:bg-green-900/20" : ""} ${isBottom ? "bg-red-100 dark:bg-red-900/20" : ""}`}
                      >
                        <td className="px-4 py-4 text-center relative">
                          {isTop && (
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-500" />
                          )}
                          {isBottom && (
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-500" />
                          )}
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                              rank === 1
                                ? "bg-yellow-400 text-yellow-900 ring-2 ring-yellow-200"
                                : rank === 2
                                  ? "bg-gray-300 text-gray-800"
                                  : rank === 3
                                    ? "bg-orange-300 text-orange-900"
                                    : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {rank}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                isTop
                                  ? "bg-green-200 text-green-700"
                                  : isBottom
                                    ? "bg-red-200 text-red-700"
                                    : "bg-gray-200 text-gray-500"
                              } dark:bg-neutral-700 dark:text-gray-300`}
                            >
                              {team.tenclb
                                ? team.tenclb.substring(0, 2).toUpperCase()
                                : team.maclb.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 dark:text-foreground text-base">
                                {team.tenclb || team.maclb}
                              </div>
                              {rank <= 1 && (
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                                  AFC Champions League
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-center font-medium">
                          {soTran}
                        </td>
                        <td className="px-4 py-4 text-center text-green-600 font-medium">
                          {thang}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-600">
                          {hoa}
                        </td>
                        <td className="px-4 py-4 text-center text-red-600">
                          {thua}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-600">
                          {bt}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-600">
                          {bb}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-gray-800">
                          {hs > 0 ? `+${hs}` : hs}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-lg font-bold text-blue-700">
                            {diem}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {Array.from({ length: 5 }).map((_, idx) => {
                              const formStr = team.form || ""
                              // formStr is like "WDLW" (oldest -> newest)
                              // We want to show 5 slots.
                              // If formStr has 3 chars: "WDL", we want to show: ? ? W D L ?
                              // Actually, standard is usually just showing the available ones.
                              // But if user wants 5 slots fixed:
                              // Let's align to the right (most recent on right).
                              // So pad start with nulls.
                              const paddedForm = formStr
                                .padStart(5, " ")
                                .split("")
                              const char = paddedForm[idx]

                              if (
                                char === "W" ||
                                char === "D" ||
                                char === "L"
                              ) {
                                return <Badge key={idx} type={char as any} />
                              }
                              return (
                                <span
                                  key={idx}
                                  className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 text-[10px] font-bold"
                                >
                                  -
                                </span>
                              )
                            })}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {summaryStats && (
        <div className="max-w-7xl mx-auto w-full px-4 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-500">
                  <Target className="h-5 w-5" />
                  Đội ghi bàn nhiều nhất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                    {summaryStats.bestAttack.team}
                  </div>
                  <div className="text-lg">
                    {summaryStats.bestAttack.goals_for} bàn thắng
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Trung bình{" "}
                    {(summaryStats.bestAttack.matches_played > 0
                      ? summaryStats.bestAttack.goals_for /
                        summaryStats.bestAttack.matches_played
                      : 0
                    ).toFixed(1)}{" "}
                    bàn/trận
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-500">
                  <Award className="h-5 w-5" />
                  Thủ môn xuất sắc nhất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                    {summaryStats.bestDefense.team}
                  </div>
                  <div className="text-lg">
                    {summaryStats.bestDefense.goals_against} bàn thua
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Trung bình{" "}
                    {(summaryStats.bestDefense.matches_played > 0
                      ? summaryStats.bestDefense.goals_against /
                        summaryStats.bestDefense.matches_played
                      : 0
                    ).toFixed(1)}{" "}
                    bàn/trận
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Trophy className="h-5 w-5" />
                  Hiệu số cao nhất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {summaryStats.bestGoalDiff.team}
                  </div>
                  <div className="text-lg">
                    {summaryStats.bestGoalDiff.goal_difference > 0 ? "+" : ""}
                    {summaryStats.bestGoalDiff.goal_difference} hiệu số
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {summaryStats.bestGoalDiff.goals_for} BT /{" "}
                    {summaryStats.bestGoalDiff.goals_against} BB
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

function Badge({ type }: { type: "W" | "D" | "L" }) {
  const color =
    type === "W" ? "bg-green-500" : type === "D" ? "bg-gray-400" : "bg-red-500"
  return (
    <span
      className={`${color} text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full`}
    >
      {type}
    </span>
  )
}
