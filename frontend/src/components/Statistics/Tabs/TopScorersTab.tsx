import { useQuery } from "@tanstack/react-query"
import { Users, Target, Activity } from "lucide-react"

// Mock data (Assuming API endpoint isn't fully ready for aggregated stats)
// In a real app, this would come from an endpoint like /api/stats/scorers
const MOCK_SCORERS = [
    { rank: 1, name: "Nguyen Van Quyet", club: "Hanoi FC", goals: 12, assists: 5, matches: 18 },
    { rank: 2, name: "Rafaelson", club: "Binh Dinh", goals: 10, assists: 2, matches: 17 },
    { rank: 3, name: "Hoang Vu Samson", club: "TP.HCM", goals: 9, assists: 1, matches: 16 },
    { rank: 4, name: "Rimario Gordon", club: "Thanh Hoa", goals: 8, assists: 3, matches: 15 },
    { rank: 5, name: "Nguyen Tien Linh", club: "B.Binh Duong", goals: 8, assists: 4, matches: 18 },
]

export function TopScorersTab({ muagiai }: { muagiai: string }) {
    // In real implementation:
    // const { data } = useQuery({ queryKey: ['scorers', muagiai], queryFn: ... })

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
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
                                {MOCK_SCORERS.map((p, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-center font-bold text-gray-400">
                                            {idx === 0 ? <span className="text-yellow-500 text-xl">🥇</span> : idx + 1}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">{p.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{p.club}</td>
                                        <td className="px-6 py-4 text-center font-bold text-orange-600 text-lg">{p.goals}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* VUA KIẾN TẠO (BM7.2) */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2 font-bold">
                            <Activity className="w-5 h-5" />
                            Vua Kiến Tạo
                        </div>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">Mùa {muagiai}</span>
                    </div>
                    
                    <div className="p-0">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3 text-center w-12">#</th>
                                    <th className="px-6 py-3 text-left">Cầu thủ</th>
                                    <th className="px-6 py-3 text-left">CLB</th>
                                    <th className="px-6 py-3 text-center font-bold text-gray-800">Kiến tạo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {[...MOCK_SCORERS].sort((a,b) => b.assists - a.assists).map((p, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-center font-bold text-gray-400">
                                             {idx === 0 ? <span className="text-blue-500 text-xl">🥇</span> : idx + 1}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">{p.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{p.club}</td>
                                        <td className="px-6 py-4 text-center font-bold text-blue-600 text-lg">{p.assists}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}