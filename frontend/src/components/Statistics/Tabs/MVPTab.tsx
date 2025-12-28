import { Star, Trophy, Award } from "lucide-react"

// Mock data for MVP (Cầu thủ xuất sắc nhất - BM7.4)
const MVP_LIST = [
    { name: "Nguyen Hoang Duc", club: "Viettel FC", position: "Tiền vệ", mom: 5, rating: 8.5, image: "https://placehold.co/100x100?text=Duc" },
    { name: "Nguyen Van Quyet", club: "Hanoi FC", position: "Tiền đạo", mom: 4, rating: 8.2, image: "https://placehold.co/100x100?text=Quyet" },
    { name: "Dang Van Lam", club: "Binh Dinh", position: "Thủ môn", mom: 4, rating: 8.0, image: "https://placehold.co/100x100?text=Lam" },
]

export function MVPTab() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* TOP 1 MVP */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-8 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-yellow-400 p-1 bg-white/10">
                        <img src={MVP_LIST[0].image} alt="MVP" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> MVP Giải đấu
                    </div>
                </div>

                <div className="text-center md:text-left flex-1">
                    <h2 className="text-3xl font-bold mb-1">{MVP_LIST[0].name}</h2>
                    <div className="text-indigo-200 text-lg mb-4">{MVP_LIST[0].club} • {MVP_LIST[0].position}</div>
                    
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto md:mx-0">
                        <div className="bg-white/10 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold">{MVP_LIST[0].mom}</div>
                            <div className="text-xs text-indigo-200 uppercase">Man of Match</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-green-300">{MVP_LIST[0].rating}</div>
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
                    {MVP_LIST.slice(1).map((p, idx) => (
                        <div key={idx} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                            <div className="font-bold text-gray-400 text-xl w-8 text-center">{idx + 2}</div>
                            <img src={p.image} alt={p.name} className="w-12 h-12 rounded-full object-cover border" />
                            <div className="flex-1">
                                <div className="font-bold text-gray-900">{p.name}</div>
                                <div className="text-sm text-gray-500">{p.club}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-indigo-600">{p.rating} điểm</div>
                                <div className="text-xs text-gray-400">{p.mom} lần MVP</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}