import { Shield, TrendingUp } from "lucide-react"
import { useMemo } from "react"

export function TeamStatsTab({
  standings,
  discipline,
  matches,
}: {
  standings?: any
  discipline?: any
  matches?: any
}) {
  const teamStats = useMemo(() => {
    if (!standings?.standings) return []

    // 1. Map basic stats from standings
    const statsMap = new Map()

    standings.standings.forEach((team: any) => {
      statsMap.set(team.maclb, {
        id: team.maclb,
        name: team.tenclb,
        goals: team.goals_for,
        conceded: team.goals_against,
        cleanSheets: 0,
        yellow: 0,
        red: 0,
      })
    })

    // 2. Aggregate cards from discipline (if available)
    if (discipline?.leaderboard) {
      discipline.leaderboard.forEach((player: any) => {
        if (player.maclb && statsMap.has(player.maclb)) {
          const team = statsMap.get(player.maclb)
          team.yellow += player.yellow_cards || 0
          team.red += player.red_cards || 0
        }
      })
    }

    // 3. Calculate Clean Sheets from matches (if available)
    const matchList = Array.isArray(matches)
      ? matches
      : (matches as any)?.data || []
    matchList.forEach((m: any) => {
      // Check if match has result
      if (m.ketqua && typeof m.ketqua === "string" && m.ketqua.includes("-")) {
        try {
          const parts = m.ketqua.split("-")
          if (parts.length === 2) {
            const homeScore = parseInt(parts[0].trim(), 10)
            const awayScore = parseInt(parts[1].trim(), 10)

            if (!Number.isNaN(homeScore) && !Number.isNaN(awayScore)) {
              // Home Clean Sheet (Away team scored 0)
              if (statsMap.has(m.maclb_nha || m.maclbnha) && awayScore === 0) {
                statsMap.get(m.maclb_nha || m.maclbnha).cleanSheets += 1
              }
              // Away Clean Sheet (Home team scored 0)
              if (
                statsMap.has(m.maclb_khach || m.maclbkhach) &&
                homeScore === 0
              ) {
                statsMap.get(m.maclb_khach || m.maclbkhach).cleanSheets += 1
              }
            }
          }
        } catch (_e) {
          // ignore parse error
        }
      }
    })

    return Array.from(statsMap.values())
  }, [standings, discipline, matches])

  if (!teamStats.length) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-muted-foreground">
        Đang tải dữ liệu thống kê đội...
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HÀNG CÔNG MẠNH NHẤT */}
        <div className="bg-white dark:bg-card rounded-xl shadow-sm border dark:border-border p-6">
          <h3 className="font-bold text-gray-800 dark:text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-500" />{" "}
            Hàng công mạnh nhất
          </h3>
          <div className="space-y-4">
            {[...teamStats]
              .sort((a, b) => b.goals - a.goals)
              .slice(0, 3)
              .map((t, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-gray-100 text-gray-600 dark:bg-muted dark:text-muted-foreground"}`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-medium dark:text-foreground">
                      {t.name}
                    </span>
                  </div>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {t.goals} bàn
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* HÀNG THỦ TỐT NHẤT */}
        <div className="bg-white dark:bg-card rounded-xl shadow-sm border dark:border-border p-6">
          <h3 className="font-bold text-gray-800 dark:text-foreground flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-500" /> Hàng
            thủ tốt nhất (Sạch lưới)
          </h3>
          <div className="space-y-4">
            {[...teamStats]
              .sort((a, b) => b.cleanSheets - a.cleanSheets) // Higher is better
              .slice(0, 3)
              .map((t, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-gray-100 text-gray-600 dark:bg-muted dark:text-muted-foreground"}`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-medium dark:text-foreground">
                      {t.name}
                    </span>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {t.cleanSheets} trận
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* BẢNG CHI TIẾT */}
      <div className="bg-white dark:bg-card rounded-xl shadow-sm border dark:border-border overflow-hidden">
        <div className="bg-gray-50 dark:bg-muted/50 px-6 py-4 font-bold border-b dark:border-border dark:text-foreground">
          Thống kê chi tiết các đội
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-muted/50 text-gray-500 dark:text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-3 text-left">Câu lạc bộ</th>
                <th className="px-6 py-3 text-center">Bàn thắng</th>
                <th className="px-6 py-3 text-center">Bàn thua</th>
                <th className="px-6 py-3 text-center">Sạch lưới</th>
                <th className="px-6 py-3 text-center">Thẻ vàng</th>
                <th className="px-6 py-3 text-center">Thẻ đỏ</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-border">
              {teamStats.map((t, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-gray-800 dark:text-foreground">
                    {t.name}
                  </td>
                  <td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">
                    {t.goals}
                  </td>
                  <td className="px-6 py-4 text-center text-red-600 dark:text-red-400">
                    {t.conceded}
                  </td>
                  <td className="px-6 py-4 text-center text-blue-600 dark:text-blue-400 font-bold">
                    {t.cleanSheets}
                  </td>
                  <td className="px-6 py-4 text-center dark:text-foreground">
                    {t.yellow}
                  </td>
                  <td className="px-6 py-4 text-center dark:text-foreground">
                    {t.red}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
