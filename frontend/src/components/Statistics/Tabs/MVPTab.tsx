import { useQuery } from "@tanstack/react-query"
import { Star, Trophy, Award, Loader2, Activity } from "lucide-react"
import { StatisticsService } from "@/client"

// Helper component for error/empty states
function EmptyState({ message }: { message: string }) {
    return (
        <div className="text-center py-10 text-gray-400 bg-white rounded-xl border">
            <Activity className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>{message}</p>
        </div>
    )
}

export function MVPTab({ muagiai }: { muagiai: string }) {

    const { data, isLoading } = useQuery({
        queryKey: ['mvp-stats', muagiai],
        queryFn: () => StatisticsService.getMVP({ muagiai, limit: 3 }),
    })

    if (isLoading) {
        return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-red-600" /></div>
    }

    const mvpData = data || {};
    const candidates = Array.isArray(mvpData.mvp_candidates) ? mvpData.mvp_candidates : [];
    const topMVP = candidates[0];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {!topMVP ? <EmptyState message="Chưa có dữ liệu MVP" /> : (
                <>
                    {/* TOP 1 MVP */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-8 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="relative">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-yellow-400 p-1 bg-white/10 flex items-center justify-center">
                                <Star className="w-20 h-20 text-yellow-400" />
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                                <Trophy className="w-3 h-3" /> MVP Giải đấu
                            </div>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-3xl font-bold mb-1">{topMVP.tencauthu}</h2>
                            <div className="text-indigo-200 text-lg mb-4">{topMVP.tenclb} • {topMVP.vitrithidau || "N/A"}</div>

                            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto md:mx-0">
                                <div className="bg-white/10 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold">{topMVP.goals}</div>
                                    <div className="text-xs text-indigo-200 uppercase">Bàn thắng</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold">{topMVP.assists}</div>
                                    <div className="text-xs text-indigo-200 uppercase">Kiến tạo</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-green-300">{topMVP.average_rating}</div>
                                    <div className="text-xs text-indigo-200 uppercase">Điểm TB</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DANH SÁCH ỨNG VIÊN */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 font-bold border-b flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-600" />
                            Top ứng viên Quả Bóng Vàng
                        </div>
                        <div className="divide-y">
                            {candidates.slice(1).map((p: any, idx: number) => (
                                <div key={p.macauthu || idx} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="font-bold text-gray-400 text-xl w-8 text-center">{idx + 2}</div>
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                        {p.tencauthu?.charAt(0) || "?"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-900">{p.tencauthu}</div>
                                        <div className="text-sm text-gray-500">{p.tenclb}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-indigo-600">{p.average_rating} điểm</div>
                                        <div className="text-xs text-gray-400">{p.goals}G {p.assists}A</div>
                                    </div>
                                </div>
                            ))}
                            {candidates.length <= 1 && (
                                <div className="p-4 text-center text-gray-400">
                                    Chưa có đủ dữ liệu  để xếp hạng thêm ứng viên.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}