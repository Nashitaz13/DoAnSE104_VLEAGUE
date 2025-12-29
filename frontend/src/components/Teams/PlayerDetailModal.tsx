import { useQuery } from "@tanstack/react-query"
import { PlayersService, StatisticsService } from "@/client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, User, Trophy, AlertTriangle, Activity, Calendar, MapPin, Ruler, Weight } from "lucide-react"

interface PlayerDetailModalProps {
    playerId: string | null
    muagiai: string
    onClose: () => void
}

export function PlayerDetailModal({ playerId, muagiai, onClose }: PlayerDetailModalProps) {
    const isOpen = !!playerId

    // 1. Fetch Basic Info
    const { data: player, isLoading: loadingInfo } = useQuery({
        queryKey: ["player", playerId],
        queryFn: () => PlayersService.getPlayer({ player_id: playerId! }),
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
        ? statsData.find((p: any) => p.player_id === playerId)
        : (statsData as any)?.stats?.find((p: any) => p.player_id === playerId)

    const isLoading = loadingInfo || loadingStats

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-2xl bg-gray-50 p-0 overflow-hidden">
                {isLoading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                        Đang tải hồ sơ cầu thủ...
                    </div>
                ) : !player ? (
                    <div className="p-10 text-center text-gray-500">Không tìm thấy thông tin cầu thủ</div>
                ) : (
                    <>
                        {/* HEADER PROFILE */}
                        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6">
                            <DialogHeader>
                                <DialogTitle className="flex flex-col md:flex-row gap-6 items-center md:items-start text-white">
                                    <div className="w-24 h-24 bg-white rounded-full border-4 border-red-400 flex items-center justify-center shrink-0 shadow-lg">
                                        {/* Avatar Placeholder */}
                                        <User className="w-12 h-12 text-gray-300" />
                                    </div>
                                    <div className="text-center md:text-left space-y-1">
                                        <h2 className="text-2xl font-bold uppercase tracking-wide">{player.tencauthu}</h2>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm opacity-90">
                                            <span className="flex items-center gap-1 bg-red-900/50 px-2 py-0.5 rounded"><MapPin className="w-3 h-3" /> {player.noisinh}</span>
                                            <span className="flex items-center gap-1 bg-red-900/50 px-2 py-0.5 rounded"><Calendar className="w-3 h-3" /> {new Date(player.ngaysinh).toLocaleDateString("vi-VN")}</span>
                                        </div>
                                        <div className="pt-2 flex gap-4 justify-center md:justify-start">
                                            <div className="text-center">
                                                <div className="text-xs opacity-70 uppercase">Chiều cao</div>
                                                <div className="font-bold text-lg flex items-center gap-1"><Ruler className="w-3 h-3" /> {player.chieucao}cm</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs opacity-70 uppercase">Cân nặng</div>
                                                <div className="font-bold text-lg flex items-center gap-1"><Weight className="w-3 h-3" /> {player.cannang}kg</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs opacity-70 uppercase">Vị trí</div>
                                                <div className="font-bold text-lg">{player.vitri}</div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogTitle>
                            </DialogHeader>
                        </div>

                        {/* STATS SECTION */}
                        <div className="p-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4 uppercase text-sm">
                                <Activity className="w-4 h-4 text-red-600" /> Thống kê mùa giải {muagiai}
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
                                    <div className="text-3xl font-bold text-gray-800">{playerStats?.matches_played || 0}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase mt-1">Trận đấu</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
                                    <div className="text-3xl font-bold text-green-600">{playerStats?.goals || 0}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase mt-1">Bàn thắng</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
                                    <div className="text-3xl font-bold text-yellow-500">{playerStats?.cards_yellow || 0}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase mt-1">Thẻ vàng</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
                                    <div className="text-3xl font-bold text-red-600">{playerStats?.cards_red || 0}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase mt-1">Thẻ đỏ</div>
                                </div>
                            </div>

                            <div className="mt-6 bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-800">
                                <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0" />
                                <div>
                                    <strong>Lưu ý:</strong> Dữ liệu thống kê được cập nhật tự động sau mỗi trận đấu.
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
