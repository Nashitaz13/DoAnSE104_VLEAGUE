import { useState, useMemo } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  LayoutDashboard, CalendarDays, FileText, 
  CheckCircle, AlertCircle, Clock, Flag, 
  Plus, Trash2, Save, User, MapPin
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { MatchesService, RostersService, SeasonManagementService } from "@/client"
import { getCurrentUser } from "@/utils/auth"

export const Route = createFileRoute("/_layout/official-dashboard")({
  component: OfficialDashboard,
})

const TABS = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'assignments', label: 'Trận được phân công', icon: CalendarDays },
  { id: 'reports', label: 'Báo cáo trận đấu', icon: FileText },
]

function OfficialDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [reportingMatchId, setReportingMatchId] = useState<string | null>(null) // ID trận đang làm báo cáo
  const currentUser = getCurrentUser()
  
  // 1. Lấy danh sách Mùa giải (để lọc)
  const { data: seasonsData } = useQuery({
    queryKey: ['seasons'],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 10 })
  })
  // Lấy mùa mới nhất làm mặc định
  const currentSeason = useMemo(() => {
      const list = Array.isArray(seasonsData) ? seasonsData : (seasonsData as any)?.data || [];
      return list.length > 0 ? list[0].muagiai : "2024-2025";
  }, [seasonsData]);

  // 2. Lấy danh sách trận đấu (Giả lập: Lấy tất cả coi như là được phân công)
  const { data: matchesData, isLoading } = useQuery({
    queryKey: ['matches-official', currentSeason],
    queryFn: () => MatchesService.readMatches({ muagiai: currentSeason, limit: 100 })
  })

  // 3. Tính toán thống kê
  const stats = useMemo(() => {
      const list = Array.isArray(matchesData) ? matchesData : (matchesData as any)?.data || [];
      const totalAssigned = list.length;
      const submitted = list.filter((m: any) => m.tiso).length; // Có tỉ số = Đã nộp
      const pending = totalAssigned - submitted;
      // Tìm trận sắp tới (chưa đá, gần nhất)
      const upcoming = list.find((m: any) => !m.tiso);

      return { totalAssigned, submitted, pending, upcoming, list };
  }, [matchesData]);

  // Hàm chuyển sang tab báo cáo
  const handleStartReport = (matchId: string) => {
      setReportingMatchId(matchId);
      setActiveTab('reports');
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 font-sans pb-10">
      
      {/* 1. HEADER (Màu Tím chủ đạo) */}
      <div className="bg-gradient-to-r from-purple-700 to-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/20 rounded-lg">
                <Flag className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-3xl font-bold">Dashboard Quan chức</h1>
                <p className="opacity-90">Chào mừng {currentUser?.ho_ten || "Trọng tài"} - Quan chức trận đấu</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
                title="Trận được phân công" 
                value={isLoading ? "-" : stats.totalAssigned} 
                icon={CalendarDays} color="text-blue-600" 
            />
            <StatCard 
                title="Báo cáo đã nộp" 
                value={isLoading ? "-" : stats.submitted} 
                icon={CheckCircle} color="text-green-600" 
            />
            <StatCard 
                title="Chờ báo cáo" 
                value={isLoading ? "-" : stats.pending} 
                icon={AlertCircle} color="text-orange-600" 
            />
            <StatCard 
                title="Vòng đấu hiện tại" 
                value={stats.upcoming ? stats.upcoming.vong : "KT"} 
                icon={Clock} color="text-purple-600" 
            />
         </div>
      </div>

      {/* 3. TABS */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id 
                        ? 'bg-purple-50 text-purple-700 shadow-sm font-bold ring-1 ring-purple-200' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
            ))}
        </div>

        {/* 4. CONTENT */}
        <div className="animate-in fade-in duration-300">
            {activeTab === 'overview' && (
                <OverviewTab 
                    upcomingMatch={stats.upcoming} 
                    recentList={stats.list.slice(0, 3)} 
                    onReport={handleStartReport}
                />
            )}
            
            {activeTab === 'assignments' && (
                <AssignmentsTab 
                    matches={stats.list} 
                    onReport={handleStartReport} 
                />
            )}
            
            {activeTab === 'reports' && (
                <ReportFormTab 
                    matchId={reportingMatchId} 
                    matches={stats.list}
                    onCancel={() => {
                        setReportingMatchId(null);
                        setActiveTab('assignments');
                    }}
                />
            )}
        </div>
      </div>
    </div>
  )
}

// ====================================================================
// TAB 1: TỔNG QUAN (OVERVIEW)
// ====================================================================
function OverviewTab({ upcomingMatch, recentList, onReport }: any) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lịch trình sắp tới */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-purple-600"/> Lịch trình sắp tới
                </h3>
                
                {upcomingMatch ? (
                    <div className="border border-purple-100 bg-purple-50/50 rounded-xl p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-sm font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded inline-block mb-2">
                                    Vòng {upcomingMatch.vong}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">
                                    {upcomingMatch.doi_nha?.tenclb} <span className="text-gray-400 mx-2">vs</span> {upcomingMatch.doi_khach?.tenclb}
                                </h4>
                                <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
                                    <Clock className="w-4 h-4"/> 
                                    {new Date(upcomingMatch.thoigianthidau).toLocaleString('vi-VN')}
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
                                    <MapPin className="w-4 h-4"/> 
                                    {upcomingMatch.san_nha?.tensan || upcomingMatch.masanvandong}
                                </div>
                            </div>
                            <span className="bg-white border text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                                Trọng tài chính
                            </span>
                        </div>
                        <Button 
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => onReport(upcomingMatch.matran)}
                        >
                            <FileText className="w-4 h-4 mr-2"/> Nộp báo cáo trận đấu
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">Hiện không có lịch phân công sắp tới.</div>
                )}
            </div>

            {/* Trạng thái báo cáo gần đây */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600"/> Báo cáo đã hoàn thành
                </h3>
                <div className="space-y-3">
                    {recentList.filter((m:any) => m.tiso).length === 0 && (
                        <p className="text-gray-500 italic">Chưa có báo cáo nào được nộp.</p>
                    )}
                    {recentList.filter((m:any) => m.tiso).map((match: any) => (
                        <div key={match.matran} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                            <div>
                                <div className="font-bold text-sm">
                                    {match.doi_nha?.tenclb} {match.tiso} {match.doi_khach?.tenclb}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Vòng {match.vong} • {new Date(match.thoigianthidau).toLocaleDateString()}
                                </div>
                            </div>
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold uppercase">
                                Đã xác nhận
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ====================================================================
// TAB 2: DANH SÁCH PHÂN CÔNG
// ====================================================================
function AssignmentsTab({ matches, onReport }: any) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Các trận đấu được phân công</h3>
            </div>
            
            <div className="divide-y">
                {matches.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">Chưa có dữ liệu phân công.</div>
                ) : (
                    matches.map((m: any) => {
                        const isPending = !m.tiso;
                        return (
                            <div key={m.matran} className="p-5 flex flex-col md:flex-row items-center justify-between hover:bg-gray-50 transition-colors gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                            Vòng {m.vong}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(m.thoigianthidau).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {m.doi_nha?.tenclb || m.maclb_nha} <span className="mx-2 text-gray-400">vs</span> {m.doi_khach?.tenclb || m.maclb_khach}
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                        <MapPin className="w-3 h-3"/> {m.san_nha?.tensan || m.masanvandong}
                                    </div>
                                </div>

                                <div>
                                    {isPending ? (
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                                                Chưa nộp báo cáo
                                            </span>
                                            <Button 
                                                size="sm" 
                                                className="bg-gray-900 text-white hover:bg-black"
                                                onClick={() => onReport(m.matran)}
                                            >
                                                <FileText className="w-3 h-3 mr-2"/> Nộp báo cáo
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                Đã xác nhận ({m.tiso})
                                            </span>
                                            <Button variant="outline" size="sm" disabled>
                                                Đã hoàn thành
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

// ====================================================================
// TAB 3: FORM BÁO CÁO TRẬN ĐẤU (CHI TIẾT)
// ====================================================================
function ReportFormTab({ matchId, matches, onCancel }: any) {
    const queryClient = useQueryClient();
    const match = matches.find((m: any) => m.matran === matchId);

    const [score, setScore] = useState({ home: 0, away: 0 });
    const [events, setEvents] = useState<any[]>([]); // Bàn thắng, thẻ phạt
    const [mvp, setMvp] = useState("");
    const [notes, setNotes] = useState("");

    const mutation = useMutation({
        mutationFn: async () => {
            console.log("Submitting report:", { matchId, score, events, mvp, notes });
            return new Promise(resolve => setTimeout(resolve, 1000));
        },
        onSuccess: () => {
            alert("Nộp báo cáo thành công!");
            onCancel();
        }
    });

    if (!matchId) {
        return (
            <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-dashed">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
                <p className="text-gray-500">Vui lòng chọn một trận đấu từ tab "Trận được phân công" để viết báo cáo.</p>
            </div>
        )
    }

    if (!match) return <div>Không tìm thấy trận đấu.</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b bg-purple-50 flex justify-between items-center">
                <h3 className="font-bold text-lg text-purple-900 flex items-center gap-2">
                    <FileText className="w-5 h-5"/> Báo cáo trận đấu: {match.doi_nha?.tenclb} vs {match.doi_khach?.tenclb}
                </h3>
                <span className="text-sm text-purple-600 font-medium">Vòng {match.vong}</span>
            </div>

            <div className="p-6 space-y-8">
                
                {/* 1. TỈ SỐ TRẬN ĐẤU */}
                <div>
                    <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Tỷ số trận đấu</h4>
                    <div className="flex items-center justify-between gap-8 p-6 bg-gray-50 rounded-xl border">
                        <div className="flex-1 text-center">
                            <label className="block font-bold text-xl mb-2 text-gray-700">{match.doi_nha?.tenclb}</label>
                            <Input 
                                type="number" 
                                min="0" 
                                className="text-center text-3xl font-bold h-16 w-32 mx-auto" 
                                value={score.home}
                                onChange={(e) => setScore({...score, home: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <div className="text-4xl font-bold text-gray-300">-</div>
                        <div className="flex-1 text-center">
                            <label className="block font-bold text-xl mb-2 text-gray-700">{match.doi_khach?.tenclb}</label>
                            <Input 
                                type="number" 
                                min="0" 
                                className="text-center text-3xl font-bold h-16 w-32 mx-auto"
                                value={score.away}
                                onChange={(e) => setScore({...score, away: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. SỰ KIỆN (DEMO UI) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-gray-800 text-sm uppercase">Danh sách ghi bàn</h4>
                            <Button size="sm" variant="outline" className="h-7 text-xs"><Plus className="w-3 h-3 mr-1"/> Thêm bàn thắng</Button>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-dashed text-center text-sm text-gray-400 min-h-[100px] flex items-center justify-center">
                            Chưa có dữ liệu bàn thắng (Demo)
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-gray-800 text-sm uppercase">Thẻ phạt</h4>
                            <Button size="sm" variant="outline" className="h-7 text-xs"><Plus className="w-3 h-3 mr-1"/> Thêm thẻ</Button>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-dashed text-center text-sm text-gray-400 min-h-[100px] flex items-center justify-center">
                            Chưa có dữ liệu thẻ phạt (Demo)
                        </div>
                    </div>
                </div>

                {/* 3. THÔNG TIN KHÁC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="mb-2 block">Cầu thủ xuất sắc nhất trận (MVP)</Label>
                        <Input 
                            placeholder="Nhập tên cầu thủ..." 
                            value={mvp} 
                            onChange={(e) => setMvp(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">Đội</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn đội" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="home">{match.doi_nha?.tenclb}</SelectItem>
                                <SelectItem value="away">{match.doi_khach?.tenclb}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <Label className="mb-2 block">Ghi chú thêm (Sự cố, khán giả...)</Label>
                    <Textarea 
                        placeholder="Mô tả chi tiết các sự kiện đặc biệt..." 
                        className="min-h-[100px]"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={onCancel}>Hủy</Button>
                <Button className="bg-black hover:bg-gray-800 text-white min-w-[150px]" onClick={() => mutation.mutate()}>
                    <Save className="w-4 h-4 mr-2"/> Nộp báo cáo
                </Button>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className={`p-3 rounded-full mb-3 bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
              <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wide">{title}</div>
      </div>
    )
}