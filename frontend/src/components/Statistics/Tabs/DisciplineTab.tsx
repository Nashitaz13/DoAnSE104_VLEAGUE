import { ShieldAlert, AlertTriangle, Ban } from "lucide-react"

const MOCK_DISCIPLINE = [
    { name: "Que Ngoc Hai", club: "SLNA", yellow: 5, red: 1, banned: false },
    { name: "Do Duy Manh", club: "Hanoi FC", yellow: 4, red: 0, banned: false },
    { name: "Bui Hoang Viet Anh", club: "Hanoi FC", yellow: 3, red: 1, banned: true }, // Banned
    { name: "Nguyen Thanh Chung", club: "Hanoi FC", yellow: 6, red: 0, banned: true }, // Banned due to yellow accumulation
]

export function DisciplineTab({ muagiai }: { muagiai: string }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* DANH SÁCH BỊ CẤM THI ĐẤU (BM7.5) */}
             <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden mb-6">
                <div className="bg-red-50 px-6 py-4 flex items-center gap-2 text-red-700 font-bold border-b border-red-100">
                    <Ban className="w-5 h-5" />
                    Danh sách cầu thủ bị cấm thi đấu (Vòng kế tiếp)
                </div>
                <div className="p-0">
                     <table className="w-full text-sm">
                        <thead className="bg-white text-gray-500 font-medium border-b">
                            <tr>
                                <th className="px-6 py-3 text-left">Cầu thủ</th>
                                <th className="px-6 py-3 text-left">CLB</th>
                                <th className="px-6 py-3 text-left">Lý do</th>
                                <th className="px-6 py-3 text-center">Thời hạn</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {MOCK_DISCIPLINE.filter(p => p.banned).map((p, idx) => (
                                <tr key={idx} className="bg-red-50/30">
                                    <td className="px-6 py-4 font-bold text-gray-800">{p.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{p.club}</td>
                                    <td className="px-6 py-4 text-red-600 font-medium">
                                        {p.red > 0 ? "Thẻ đỏ trực tiếp" : "Tích lũy thẻ vàng"}
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-500">1 trận</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* THỐNG KÊ THẺ PHẠT (BM7.3) */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                        <ShieldAlert className="w-5 h-5" />
                        Thống kê thẻ phạt toàn giải
                    </div>
                </div>
                <div className="p-0">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3 text-center w-12">#</th>
                                <th className="px-6 py-3 text-left">Cầu thủ</th>
                                <th className="px-6 py-3 text-left">CLB</th>
                                <th className="px-6 py-3 text-center text-yellow-600 font-bold">Thẻ Vàng</th>
                                <th className="px-6 py-3 text-center text-red-600 font-bold">Thẻ Đỏ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {MOCK_DISCIPLINE.map((p, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-center text-gray-400">{idx + 1}</td>
                                    <td className="px-6 py-4 font-bold text-gray-800">{p.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{p.club}</td>
                                    <td className="px-6 py-4 text-center font-bold text-yellow-600 bg-yellow-50">{p.yellow}</td>
                                    <td className="px-6 py-4 text-center font-bold text-red-600 bg-red-50">{p.red}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}