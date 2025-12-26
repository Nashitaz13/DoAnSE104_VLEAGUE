import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import axios from "axios"
import {
  Award,
  Minus,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react"
import { OpenAPI } from "@/client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["standings", "2024-2025"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token") || ""
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      const res = await axios.get(
        `${OpenAPI.BASE}/api/v1/standings?muagiai=2024-2025`,
        { headers },
      )
      return res.data as {
        muagiai: string
        last_updated: string
        standings: Array<{
          position: number
          maclb: string
          tenclb: string
          matches_played: number
          won: number
          drawn: number
          lost: number
          goals_for: number
          goals_against: number
          goal_difference: number
          points: number
          form?: string | null
        }>
      }
    },
  })

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-800">
          AFC Champions League
        </Badge>
      )
    }
    if (rank >= 9) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-800">
          Xuống hạng
        </Badge>
      )
    }
    return null
  }

  const FormDot = ({ r }: { r: string }) => {
    if (r === "W") {
      return (
        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
          W
        </div>
      )
    }
    if (r === "D") {
      return (
        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
          D
        </div>
      )
    }
    if (r === "L") {
      return (
        <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
          L
        </div>
      )
    }
    return null
  }

  const getTrendIcon = (rank: number) => {
    if (rank <= 3) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (rank >= 8) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="flex flex-col gap-6 text-neutral-900 dark:text-neutral-100">
      <div className="text-center py-6 bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 rounded-2xl text-white">
        <Trophy className="h-12 w-12 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Bảng xếp hạng</h1>
        <p className="text-yellow-100">V-League 1 2024-2025</p>
      </div>

      <Card className="border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 dark:bg-green-900 dark:border-green-800 rounded" />
              <span>AFC Champions League (Top 3)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 dark:bg-red-900 dark:border-red-800 rounded" />
              <span>Xuống hạng (2 đội cuối)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="rounded-md border p-6 border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          Đang tải bảng xếp hạng...
        </div>
      )}
      {isError && (
        <div className="rounded-md border p-6 border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          Không thể tải dữ liệu. Hãy đăng nhập và thử lại.
        </div>
      )}

      {data && (
        <div className="rounded-md border overflow-x-auto border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead className="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                  Hạng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                  Câu lạc bộ
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                  Trận
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                  Thắng
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                  Hòa
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                  Thua
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                  BT
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                  BB
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                  HS
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                  Điểm
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">
                  Phong độ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
              {data.standings.map((row) => (
                <tr key={row.maclb}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{row.position}</span>
                      {getTrendIcon(row.position)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.tenclb}</div>
                    <div className="mt-1">{getRankBadge(row.position)}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.matches_played}
                  </td>
                  <td className="px-4 py-3 text-center">{row.won}</td>
                  <td className="px-4 py-3 text-center">{row.drawn}</td>
                  <td className="px-4 py-3 text-center">{row.lost}</td>
                  <td className="px-4 py-3 text-center">{row.goals_for}</td>
                  <td className="px-4 py-3 text-center">{row.goals_against}</td>
                  <td className="px-4 py-3 text-center">
                    {row.goal_difference}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {row.points}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      {(row.form || "")
                        .slice(-5)
                        .split("")
                        .map((r, idx) => (
                          <FormDot r={r} key={`${row.maclb}-${idx}`} />
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.standings && data.standings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(() => {
            const standings = data.standings
            const topAttack = standings.reduce((best, cur) =>
              cur.goals_for > best.goals_for ? cur : best,
            )
            const bestDefense = standings.reduce((best, cur) =>
              cur.goals_against < best.goals_against ? cur : best,
            )
            const bestGD = standings.reduce((best, cur) =>
              cur.goal_difference > best.goal_difference ? cur : best,
            )
            return (
              <>
                <Card className="border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Target className="h-5 w-5" />
                      Đội ghi bàn nhiều nhất
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {topAttack.tenclb}
                      </div>
                      <div className="text-lg">
                        {topAttack.goals_for} bàn thắng
                      </div>
                      <div className="text-sm text-gray-500 dark:text-neutral-400">
                        Trung bình{" "}
                        {(
                          topAttack.goals_for / topAttack.matches_played
                        ).toFixed(1)}{" "}
                        bàn/trận
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Award className="h-5 w-5" />
                      Phòng ngự chắc nhất
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {bestDefense.tenclb}
                      </div>
                      <div className="text-lg">
                        {bestDefense.goals_against} bàn thua
                      </div>
                      <div className="text-sm text-gray-500 dark:text-neutral-400">
                        Trung bình{" "}
                        {(
                          bestDefense.goals_against / bestDefense.matches_played
                        ).toFixed(1)}{" "}
                        bàn/trận
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <Trophy className="h-5 w-5" />
                      Hiệu số tốt nhất
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {bestGD.tenclb}
                      </div>
                      <div className="text-lg">
                        {bestGD.goal_difference} hiệu số
                      </div>
                      <div className="text-sm text-gray-500 dark:text-neutral-400">
                        BT {bestGD.goals_for} / BB {bestGD.goals_against}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
