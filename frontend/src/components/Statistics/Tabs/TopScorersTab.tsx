import { useQuery } from "@tanstack/react-query"
import { Activity, Loader2, Target } from "lucide-react"
import { StatisticsService } from "@/client"

// Helper component for error/empty states
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-10 text-gray-400 dark:text-muted-foreground bg-white dark:bg-card rounded-xl border dark:border-border">
      <Activity className="w-10 h-10 mx-auto mb-2 opacity-20" />
      <p>{message}</p>
    </div>
  )
}

export function TopScorersTab({ muagiai }: { muagiai: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["player-awards", muagiai],
    queryFn: () => StatisticsService.getAwards({ muagiai, limit: 10 }),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-red-600" />
      </div>
    )
  }

  const awards = (data as any) || {}
  const topScorers = Array.isArray(awards?.top_scorers)
    ? awards.top_scorers
    : Array.isArray(awards?.data?.top_scorers)
      ? awards.data.top_scorers
      : []
  const topAssists = Array.isArray(awards?.top_assists)
    ? awards.top_assists
    : Array.isArray(awards?.data?.top_assists)
      ? awards.data.top_assists
      : []

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VUA PHÁ LƯỚI (BM7.1) */}
        <div className="bg-white dark:bg-card rounded-xl shadow-sm border dark:border-border overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2 font-bold">
              <Target className="w-5 h-5" />
              Vua Phá Lưới
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">
              Mùa {muagiai}
            </span>
          </div>

          <div className="p-0">
            {topScorers.length === 0 ? (
              <EmptyState message="Chưa có dữ liệu bàn thắng" />
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-muted/50 text-gray-500 dark:text-muted-foreground font-medium">
                  <tr>
                    <th className="px-6 py-3 text-center w-12">#</th>
                    <th className="px-6 py-3 text-left">Cầu thủ</th>
                    <th className="px-6 py-3 text-left">CLB</th>
                    <th className="px-6 py-3 text-center font-bold text-gray-800 dark:text-foreground">
                      Bàn thắng
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-border">
                  {topScorers.map((p: any, idx: number) => (
                    <tr
                      key={(p.macauthu || idx) + idx}
                      className="hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-center font-bold text-gray-400 dark:text-muted-foreground">
                        {idx === 0 ? (
                          <span className="text-yellow-500 text-xl">🥇</span>
                        ) : (
                          idx + 1
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800 dark:text-foreground">
                        {p.tencauthu}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-muted-foreground">
                        {p.tenclb}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-orange-600 dark:text-orange-400 text-lg">
                        {p.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* VUA KIẾN TẠO (BM7.2) */}
        <div className="bg-white dark:bg-card rounded-xl shadow-sm border dark:border-border overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2 font-bold">
              <Activity className="w-5 h-5" />
              Vua Kiến Tạo
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">
              Mùa {muagiai}
            </span>
          </div>

          <div className="p-0">
            {topAssists.length === 0 ? (
              <EmptyState message="Chưa có dữ liệu kiến tạo" />
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-muted/50 text-gray-500 dark:text-muted-foreground font-medium">
                  <tr>
                    <th className="px-6 py-3 text-center w-12">#</th>
                    <th className="px-6 py-3 text-left">Cầu thủ</th>
                    <th className="px-6 py-3 text-left">CLB</th>
                    <th className="px-6 py-3 text-center font-bold text-gray-800 dark:text-foreground">
                      Kiến tạo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-border">
                  {topAssists.map((p: any, idx: number) => (
                    <tr
                      key={(p.macauthu || idx) + idx}
                      className="hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-center font-bold text-gray-400 dark:text-muted-foreground">
                        {idx === 0 ? (
                          <span className="text-blue-500 text-xl">🥇</span>
                        ) : (
                          idx + 1
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800 dark:text-foreground">
                        {p.tencauthu}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-muted-foreground">
                        {p.tenclb}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600 dark:text-blue-400 text-lg">
                        {p.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
