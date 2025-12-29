import { useQuery } from "@tanstack/react-query"
import {
  Activity,
  AlertTriangle,
  Calendar,
  Loader2,
  MapPin,
  Ruler,
  User,
  Weight,
} from "lucide-react"
import { PlayersService, StatisticsService } from "@/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PlayerDetailModalProps {
  playerId: string | null
  muagiai: string
  onClose: () => void
}

export function PlayerDetailModal({
  playerId,
  muagiai,
  onClose,
}: PlayerDetailModalProps) {
  const isOpen = !!playerId

  // 1. Fetch Basic Info
  const { data: player, isLoading: loadingInfo } = useQuery({
    queryKey: ["player", playerId],
    queryFn: () => PlayersService.getPlayer({ playerId: playerId! }),
    enabled: !!playerId,
  })

  // 2. Fetch Stats (Filter from all players stats)
  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ["player-stats", muagiai],
    queryFn: () => StatisticsService.getPlayerStats({ muagiai }),
    enabled: !!playerId,
  })

  // Filter stats for this player
  const playerStats = Array.isArray(statsData)
    ? statsData.find((p: any) => p.macauthu === playerId)
    : (statsData as any)?.stats?.find((p: any) => p.macauthu === playerId)

  const isLoading = loadingInfo || loadingStats

  // Map vị trí thi đấu
  const getPositionName = (pos: string | undefined | null) => {
    switch (pos) {
      case "GK":
        return "Thủ môn"
      case "DF":
        return "Hậu vệ"
      case "MF":
        return "Tiền vệ"
      case "FW":
        return "Tiền đạo"
      default:
        return pos || "Chưa cập nhật"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl bg-gray-50 dark:bg-card p-0 overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-500 dark:text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-red-600 dark:text-red-500" />
            Đang tải hồ sơ cầu thủ...
          </div>
        ) : !player ? (
          <div className="p-10 text-center text-gray-500 dark:text-muted-foreground">
            Không tìm thấy thông tin cầu thủ
          </div>
        ) : (
          <>
            {/* HEADER PROFILE */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 dark:from-red-900 dark:to-red-950 text-white p-6">
              <DialogHeader>
                <DialogTitle className="flex flex-col md:flex-row gap-6 items-center md:items-start text-white">
                  <div className="w-24 h-24 bg-white dark:bg-neutral-800 rounded-full border-4 border-red-400 dark:border-red-700 flex items-center justify-center shrink-0 shadow-lg">
                    {/* Avatar Placeholder */}
                    <User className="w-12 h-12 text-gray-300 dark:text-gray-500" />
                  </div>
                  <div className="text-center md:text-left space-y-1">
                    <h2 className="text-2xl font-bold uppercase tracking-wide">
                      {player.tencauthu}
                    </h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm opacity-90">
                      <span className="flex items-center gap-1 bg-red-900/50 px-2 py-0.5 rounded">
                        <MapPin className="w-3 h-3" /> {player.noisinh}
                      </span>
                      <span className="flex items-center gap-1 bg-red-900/50 px-2 py-0.5 rounded">
                        <Calendar className="w-3 h-3" />{" "}
                        {player?.ngaysinh
                          ? new Date(player.ngaysinh).toLocaleDateString(
                              "vi-VN",
                            )
                          : "Chưa cập nhật"}
                      </span>
                    </div>
                    <div className="pt-2 flex gap-4 justify-center md:justify-start">
                      <div className="text-center">
                        <div className="text-xs opacity-70 uppercase">
                          Chiều cao
                        </div>
                        <div className="font-bold text-lg flex items-center gap-1">
                          <Ruler className="w-3 h-3" /> {player.chieucao}cm
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs opacity-70 uppercase">
                          Cân nặng
                        </div>
                        <div className="font-bold text-lg flex items-center gap-1">
                          <Weight className="w-3 h-3" /> {player.cannang}kg
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs opacity-70 uppercase">
                          Vị trí
                        </div>
                        <div className="font-bold text-lg">
                          {getPositionName(player.vitrithidau)}
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>
            </div>

            {/* STATS SECTION */}
            <div className="p-6">
              <h3 className="font-bold text-gray-800 dark:text-foreground flex items-center gap-2 mb-4 uppercase text-sm">
                <Activity className="w-4 h-4 text-red-600 dark:text-red-500" />{" "}
                Thống kê mùa giải {muagiai}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border dark:border-neutral-700 text-center">
                  <div className="text-3xl font-bold text-gray-800 dark:text-foreground">
                    {playerStats?.matches_played || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-muted-foreground font-medium uppercase mt-1">
                    Trận đấu
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border dark:border-neutral-700 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-500">
                    {playerStats?.goals || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-muted-foreground font-medium uppercase mt-1">
                    Bàn thắng
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border dark:border-neutral-700 text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-500">
                    {playerStats?.assists || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-muted-foreground font-medium uppercase mt-1">
                    Kiến tạo
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border dark:border-neutral-700 text-center">
                  <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">
                    {playerStats?.yellow_cards || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-muted-foreground font-medium uppercase mt-1">
                    Thẻ vàng
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border dark:border-neutral-700 text-center">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-500">
                    {playerStats?.red_cards || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-muted-foreground font-medium uppercase mt-1">
                    Thẻ đỏ
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <strong>Lưu ý:</strong> Dữ liệu thống kê được cập nhật tự động
                  sau mỗi trận đấu.
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
