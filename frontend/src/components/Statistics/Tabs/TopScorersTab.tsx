import { useQuery } from "@tanstack/react-query"
import { Target, Activity, Loader2 } from "lucide-react"
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

export function TopScorersTab({ muagiai }: { muagiai: string }) {

    const { data, isLoading } = useQuery({
        queryKey: ['player-awards', muagiai],
        queryFn: () => StatisticsService.getAwards({ muagiai, limit: 10 }),
    })

    if (isLoading) {
        return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-red-600" /></div>
    }

    const awards = data || {};
    const topScorers = Array.isArray(awards.top_scorers) ? awards.top_scorers : [];


    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-6">

                {/* VUA PHÁ LƯỚI (BM7.1) */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2 font-bold">
                            <Target className="w-5 h-5" />
                            Vua Phá Lưới
                        </div>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">Mùa {muagiai}</span>
                    </div>

                    <div className="p-0">
                        {topScorers.length === 0 ? <EmptyState message="Chưa có dữ liệu bàn thắng" /> : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-3 text-center w-12">#</th>
                                        <th className="px-6 py-3 text-left">Cầu thủ</th>
                                        <th className="px-6 py-3 text-left">CLB</th>
                                        <th className="px-6 py-3 text-center font-bold text-gray-800">Bàn thắng</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {topScorers.map((p: any, idx: number) => (
                                        <tr key={p.macauthu + idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-center font-bold text-gray-400">
                                                {idx === 0 ? <span className="text-yellow-500 text-xl">🥇</span> : idx + 1}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-800">{p.tencauthu}</td>
                                            <td className="px-6 py-4 text-gray-600">{p.tenclb}</td>
                                            <td className="px-6 py-4 text-center font-bold text-orange-600 text-lg">{p.value}</td>
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