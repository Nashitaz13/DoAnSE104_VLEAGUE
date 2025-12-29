import { useQuery } from "@tanstack/react-query"
import { Activity, Ban, Loader2, ShieldAlert } from "lucide-react"
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

export function DisciplineTab({
  muagiai,
  data: initialData,
}: {
  muagiai: string
  data?: any
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["discipline-stats", muagiai],
    queryFn: () => StatisticsService.getDiscipline({ muagiai, limit: 50 }),
    enabled: !initialData, // Only fetch if no initial data provided
    initialData: initialData,
  })

  if (isLoading && !initialData) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-red-600" />
      </div>
    )
  }

  const disciplineData = initialData || data || {}
  const leaderboard = Array.isArray(disciplineData.leaderboard)
    ? disciplineData.leaderboard
    : []

  // In a real app, "Banned" logic would possibly come from a separate endpoint or be computed.
  // Ideally the backend tells us who is currently banned.
  // For now, let's assume we don't have a specific "Current Ban List" API yet,
  // or we can simulate it if the backend returns card accumulation status.
  // The current Mock in DisciplineTab had explicit "Banned" flags.
  // The new API response has `yellow_cards`, `red_cards`...
  // We can infer ban risk: 3 Yellows = Ban?
  // Let's display the leaderboard first.

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* DANH SÁCH BỊ CẤM THI ĐẤU (Placeholder / Logic needed) */}
      <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-red-200 dark:border-red-900 overflow-hidden mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 flex items-center gap-2 text-red-700 dark:text-red-400 font-bold border-b border-red-100 dark:border-red-900">
          <Ban className="w-5 h-5" />
          Danh sách cầu thủ có nguy cơ/bị cấm thi đấu
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-400 text-sm border-b border-yellow-100 dark:border-yellow-900">
          Lưu ý: Danh sách này được tính toán dựa trên số lượng thẻ phạt tích
          lũy (3 Thẻ vàng = 1 Trận treo giò).
        </div>
        <div className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-white dark:bg-card text-gray-500 dark:text-muted-foreground font-medium border-b dark:border-border">
              <tr>
                <th className="px-6 py-3 text-left">Cầu thủ</th>
                <th className="px-6 py-3 text-left">CLB</th>
                <th className="px-6 py-3 text-left">Thẻ đã nhận</th>
                <th className="px-6 py-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-border">
              {leaderboard
                .filter((p: any) => p.red_cards > 0 || p.yellow_cards >= 3)
                .map((p: any, idx: number) => (
                  <tr key={idx} className="bg-red-50/30 dark:bg-red-900/10">
                    <td className="px-6 py-4 font-bold text-gray-800 dark:text-foreground">
                      {p.tencauthu}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-muted-foreground">
                      {p.tenclb}
                    </td>
                    <td className="px-6 py-4 text-red-600 dark:text-red-400 font-medium">
                      {p.red_cards > 0 ? `${p.red_cards} Đỏ` : ""}{" "}
                      {p.yellow_cards > 0 ? `${p.yellow_cards} Vàng` : ""}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500 dark:text-muted-foreground">
                      {p.red_cards > 0
                        ? "Treo giò (Thẻ đỏ)"
                        : p.yellow_cards % 3 === 0
                          ? "Treo giò (3 Vàng)"
                          : "Cảnh báo"}
                    </td>
                  </tr>
                ))}
              {leaderboard.filter(
                (p: any) => p.red_cards > 0 || p.yellow_cards >= 3,
              ).length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-4 text-gray-400 dark:text-muted-foreground"
                  >
                    Chưa có cầu thủ nào bị cấm thi đấu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* THỐNG KÊ THẺ PHẠT (BM7.3) */}
      <div className="bg-white dark:bg-card rounded-xl shadow-sm border dark:border-border overflow-hidden">
        <div className="bg-gray-50 dark:bg-muted/50 px-6 py-4 flex justify-between items-center border-b dark:border-border">
          <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-foreground">
            <ShieldAlert className="w-5 h-5" />
            Thống kê thẻ phạt toàn giải
          </div>
        </div>
        <div className="p-0">
          {leaderboard.length === 0 ? (
            <EmptyState message="Chưa có dữ liệu thẻ phạt" />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-muted/50 text-gray-500 dark:text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-3 text-center w-12">#</th>
                  <th className="px-6 py-3 text-left">Cầu thủ</th>
                  <th className="px-6 py-3 text-left">CLB</th>
                  <th className="px-6 py-3 text-center text-yellow-600 dark:text-yellow-400 font-bold">
                    Thẻ Vàng
                  </th>
                  <th className="px-6 py-3 text-center text-red-600 dark:text-red-400 font-bold">
                    Thẻ Đỏ
                  </th>
                  <th className="px-6 py-3 text-center text-gray-600 dark:text-muted-foreground font-bold">
                    Điểm kỷ luật
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-border">
                {leaderboard.slice(0, 20).map((p: any, idx: number) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-center text-gray-400 dark:text-muted-foreground">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800 dark:text-foreground">
                      {p.tencauthu}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-muted-foreground">
                      {p.tenclb}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10">
                      {p.yellow_cards}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10">
                      {p.red_cards}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-600 dark:text-muted-foreground">
                      {p.discipline_points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
