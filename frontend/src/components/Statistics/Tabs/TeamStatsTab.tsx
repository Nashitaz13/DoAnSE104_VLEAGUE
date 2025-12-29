import { BarChart3, TrendingUp, Shield } from "lucide-react"

const MOCK_TEAMS = [
    { name: "Hanoi FC", goals: 45, conceded: 20, cleanSheets: 8, yellow: 30, red: 2 },
    { name: "Viettel FC", goals: 38, conceded: 15, cleanSheets: 10, yellow: 25, red: 1 },
    { name: "Hai Phong", goals: 40, conceded: 35, cleanSheets: 5, yellow: 40, red: 3 },
    { name: "HAGL", goals: 25, conceded: 28, cleanSheets: 6, yellow: 20, red: 0 },
]

export function TeamStatsTab({ muagiai }: { muagiai: string }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* HÀNG CÔNG MẠNH NHẤT */}
                 <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-green-600"/> Hàng công mạnh nhất
                    </h3>
                    <div className="space-y-4">
                        {[...MOCK_TEAMS].sort((a,b) => b.goals - a.goals).slice(0, 3).map((t, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx===0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {idx + 1}
                                    </span>
                                    <span className="font-medium">{t.name}</span>
                                </div>
                                <span className="font-bold text-green-600">{t.goals} bàn</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* HÀNG THỦ TỐT NHẤT */}
                 <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-blue-600"/> Hàng thủ tốt nhất (Sạch lưới)
                    </h3>
                    <div className="space-y-4">
                        {[...MOCK_TEAMS].sort((a,b) => b.cleanSheets - a.cleanSheets).slice(0, 3).map((t, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx===0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {idx + 1}
                                    </span>
                                    <span className="font-medium">{t.name}</span>
                                </div>
                                <span className="font-bold text-blue-600">{t.cleanSheets} trận</span>
                            </div>
                        ))}
                    </div>
                 </div>

             </div>

             {/* BẢNG CHI TIẾT */}
             <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 font-bold border-b">Thống kê chi tiết các đội</div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3 text-left">Câu lạc bộ</th>
                                <th className="px-6 py-3 text-center">Bàn thắng</th>
                                <th className="px-6 py-3 text-center">Bàn thua</th>
                                <th className="px-6 py-3 text-center">Sạch lưới</th>
                                <th className="px-6 py-3 text-center">Thẻ vàng</th>
                                <th className="px-6 py-3 text-center">Thẻ đỏ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {MOCK_TEAMS.map((t, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-gray-800">{t.name}</td>
                                    <td className="px-6 py-4 text-center text-green-600 font-bold">{t.goals}</td>
                                    <td className="px-6 py-4 text-center text-red-600">{t.conceded}</td>
                                    <td className="px-6 py-4 text-center text-blue-600 font-bold">{t.cleanSheets}</td>
                                    <td className="px-6 py-4 text-center">{t.yellow}</td>
                                    <td className="px-6 py-4 text-center">{t.red}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}