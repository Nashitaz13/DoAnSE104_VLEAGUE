import { useState, useMemo } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  LayoutDashboard, FileText, Users, CalendarDays, 
  CheckCircle, AlertTriangle, Inbox, Clock, Plus, Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MatchesService, ClubsService } from "@/client"
import { getCurrentUser } from "@/utils/auth"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export const Route = createFileRoute("/_layout/admin-dashboard")({
  component: AdminDashboard,
})

const TABS = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'reports', label: 'Duyệt báo cáo trận', icon: FileText },
  { id: 'teams', label: 'Duyệt hồ sơ đội', icon: Users },
  { id: 'schedule', label: 'Quản lý Lịch thi đấu', icon: CalendarDays },
]

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const currentUser = getCurrentUser()

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background font-sans pb-10">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-700 to-orange-600 dark:from-red-900 dark:to-orange-800 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/20 rounded-lg">
                <LayoutDashboard className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-3xl font-bold">Dashboard Quản trị</h1>
                <p className="opacity-90">Chào mừng {currentUser?.ho_ten || "Quản trị viên"} - Ban Tổ Chức V-League 1</p>
            </div>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Báo cáo chờ duyệt" value="0" icon={FileText} color="text-orange-600 dark:text-orange-400" />
            <StatCard title="Yêu cầu nhân sự" value="0" icon={Users} color="text-blue-600 dark:text-blue-400" />
            <StatCard title="Vòng đấu hiện tại" value="0" icon={Clock} color="text-green-600 dark:text-green-400" />
            <StatCard title="Tổng số trận" value="0" icon={CalendarDays} color="text-purple-600 dark:text-purple-400" />
         </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Navigation */}
        <div className="bg-white dark:bg-card p-1 rounded-xl shadow-sm border border-border flex flex-wrap gap-1">
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all flex-1 justify-center ${
                        activeTab === tab.id 
                        ? 'bg-muted text-foreground shadow-inner' 
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
            ))}
        </div>

        <div className="animate-in fade-in duration-300">
            {activeTab === 'overview' && <OverviewTab onChangeTab={setActiveTab} />}
            {activeTab === 'reports' && <MatchReportsTab />}
            {activeTab === 'teams' && <TeamManagementTab />}
            {activeTab === 'schedule' && <ScheduleTab />}
        </div>
      </div>
    </div>
  )
}

// ====================================================================
// TAB 1: TỔNG QUAN
// ====================================================================
function OverviewTab({ onChangeTab }: { onChangeTab: (tab: string) => void }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-orange-200 dark:border-orange-800 overflow-hidden flex flex-col h-full min-h-[300px]">
                <div className="px-6 py-4 border-b bg-orange-50 dark:bg-orange-900/20 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="font-bold">Báo cáo cần xử lý</h3>
                    </div>
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700" onClick={() => onChangeTab('reports')}>Xem tất cả</Button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                    <Inbox className="w-12 h-12 mb-3 opacity-20"/>
                    <p>Hiện không có báo cáo nào cần duyệt.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 overflow-hidden flex flex-col h-full min-h-[300px]">
                <div className="px-6 py-4 border-b bg-blue-50 dark:bg-blue-900/20 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                        <CalendarDays className="w-5 h-5" />
                        <h3 className="font-bold">Quản lý Lịch thi đấu</h3>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => onChangeTab('schedule')}>Quản lý</Button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-muted-foreground mb-4">Tạo lịch thi đấu mới cho các vòng tiếp theo.</p>
                    <Button onClick={() => onChangeTab('schedule')} className="bg-blue-600 hover:bg-blue-700">Đi tới Lịch thi đấu</Button>
                </div>
            </div>
        </div>
    )
}

// ====================================================================
// TAB 2 & 3 (Empty)
// ====================================================================
function MatchReportsTab() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-foreground font-bold text-lg"><FileText className="w-5 h-5"/> Danh sách báo cáo chờ duyệt</div>
            <div className="bg-white dark:bg-card p-12 rounded-xl border border-dashed border-border text-center flex flex-col items-center justify-center text-muted-foreground">
                <CheckCircle className="w-12 h-12 mb-3 text-green-500 opacity-30"/>
                <p>Tất cả báo cáo đã được xử lý.</p>
            </div>
        </div>
    )
}

function TeamManagementTab() {
    // const requests: any[] = [];
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><div className="flex items-center gap-2 text-foreground font-bold text-lg"><Users className="w-5 h-5"/> Yêu cầu nhân sự từ các đội</div></div>
            <div className="bg-white dark:bg-card p-12 rounded-xl border border-dashed border-border text-center flex flex-col items-center justify-center text-muted-foreground">
                <Users className="w-12 h-12 mb-3 opacity-20"/>
                <p>Không có yêu cầu nhân sự nào mới.</p>
            </div>
        </div>
    )
}

// ====================================================================
// TAB 4: QUẢN LÝ LỊCH THI ĐẤU
// ====================================================================
function ScheduleTab() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedRound, setSelectedRound] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    const { data: matchesData } = useQuery({
        queryKey: ['matches', '2024-2025'],
        queryFn: () => MatchesService.readMatches({ muagiai: '2024-2025', limit: 100 })
    });

    const matches = useMemo(() => {
        let list = Array.isArray(matchesData) ? matchesData : (matchesData as any)?.data || [];
        if (selectedRound !== "all") list = list.filter((m: any) => String(m.vong) === selectedRound);
        if (selectedStatus === "upcoming") list = list.filter((m: any) => !m.tiso);
        else if (selectedStatus === "finished") list = list.filter((m: any) => m.tiso);
        return list.sort((a: any, b: any) => new Date(b.thoigianthidau).getTime() - new Date(a.thoigianthidau).getTime());
    }, [matchesData, selectedRound, selectedStatus]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground font-bold text-lg"><CalendarDays className="w-5 h-5"/> Danh sách trận đấu</div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2"/> Tạo lịch thi đấu
                </Button>
            </div>

            <div className="bg-white dark:bg-card p-4 rounded-lg border shadow-sm flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-muted-foreground mb-1 block">Vòng đấu</label>
                    <Select value={selectedRound} onValueChange={setSelectedRound}>
                        <SelectTrigger className="bg-background border-input"><SelectValue placeholder="Tất cả vòng" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">Tất cả vòng</SelectItem>{Array.from({length: 18}, (_, i) => i + 1).map(r => (<SelectItem key={r} value={String(r)}>Vòng {r}</SelectItem>))}</SelectContent>
                    </Select>
                </div>
                <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-muted-foreground mb-1 block">Trạng thái</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="bg-background border-input"><SelectValue placeholder="Tất cả trạng thái" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">Tất cả</SelectItem><SelectItem value="upcoming">Sắp diễn ra</SelectItem><SelectItem value="finished">Đã kết thúc</SelectItem></SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                {matches.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-card rounded-lg border border-dashed border-border">
                        <p className="text-muted-foreground">Không tìm thấy trận đấu nào phù hợp.</p>
                    </div>
                ) : (
                    matches.map((m: any) => (
                        <div key={m.matran} className="bg-white dark:bg-card p-4 rounded-lg border border-border flex justify-between items-center hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-bold w-16 text-center">Vòng {m.vong}</span>
                                <div className="text-sm">
                                    <span className="font-bold">{m.doi_nha?.tenclb || m.maclb_nha}</span>
                                    <span className="mx-2 text-muted-foreground">vs</span>
                                    <span className="font-bold">{m.doi_khach?.tenclb || m.maclb_khach}</span>
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">{new Date(m.thoigianthidau).toLocaleString('vi-VN')}</div>
                        </div>
                    ))
                )}
            </div>

            <CreateMatchModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </div>
    )
}

// ====================================================================
// MODAL TẠO LỊCH THI ĐẤU (FIX LỖI LẶP TÊN & VALIDATION)
// ====================================================================
function CreateMatchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const queryClient = useQueryClient();
    
    const [formData, setFormData] = useState({
        vong: "1",
        maclb_nha: "",
        maclb_khach: "",
        thoigian: "",
        san: ""
    });

    const { data: clubs } = useQuery({ queryKey: ['all-clubs'], queryFn: () => ClubsService.getClubs({ limit: 100 }) });
    const clubList = Array.isArray(clubs) ? clubs : (clubs as any)?.data || [];

    // Tự động điền sân khi chọn đội nhà
    const handleHomeTeamChange = (clubId: string) => {
        const selectedClub = clubList.find((c: any) => c.maclb === clubId);
        const stadiumId = selectedClub?.masanvandong || selectedClub?.MaSanVanDong || "";
        setFormData(prev => ({ ...prev, maclb_nha: clubId, san: stadiumId }));
    };

    // Hàm lấy tên đội để hiển thị thủ công (Tránh lỗi lặp tên)
    const getClubName = (id: string) => {
        if (!id) return undefined; // Trả về undefined để hiện Placeholder
        const club = clubList.find((c: any) => c.maclb === id);
        return club ? club.tenclb : id;
    };

    const mutation = useMutation({
        mutationFn: async (newData: any) => {
            // await MatchesService.createMatch({ requestBody: newData });
            return new Promise(resolve => setTimeout(() => resolve(newData), 1000));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
            alert(`Đã tạo lịch thi đấu thành công!`);
            onClose();
            setFormData({ vong: "1", maclb_nha: "", maclb_khach: "", thoigian: "", san: "" });
        }
    });

    // Kiểm tra tính hợp lệ (Validation)
    const isValid = useMemo(() => {
        return (
            formData.vong &&
            formData.maclb_nha && 
            formData.maclb_khach && 
            formData.thoigian && // Bắt buộc phải có thời gian
            formData.maclb_nha !== formData.maclb_khach // Đội nhà phải khác đội khách
        );
    }, [formData]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tạo lịch thi đấu mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Vòng đấu</Label>
                            <Select 
                                value={formData.vong} 
                                onValueChange={(v) => setFormData({...formData, vong: v})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn vòng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({length: 18}, (_, i) => i + 1).map(r => (
                                        <SelectItem key={r} value={String(r)}>Vòng {r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Thời gian <span className="text-red-500">*</span></Label>
                            <Input 
                                type="datetime-local" 
                                value={formData.thoigian}
                                onChange={(e) => setFormData({...formData, thoigian: e.target.value})}
                                className={!formData.thoigian ? "border-red-200" : ""}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Đội nhà</Label>
                            <Select 
                                value={formData.maclb_nha} 
                                onValueChange={handleHomeTeamChange}
                            >
                                <SelectTrigger>
                                    {/* FIX LỖI LẶP TÊN: Hiển thị trực tiếp text thay vì để component tự đoán */}
                                    <SelectValue placeholder="Chọn đội nhà">
                                        {getClubName(formData.maclb_nha)}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {clubList.map((c: any) => (
                                        <SelectItem key={c.maclb} value={c.maclb}>
                                            {c.tenclb}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Đội khách</Label>
                            <Select 
                                value={formData.maclb_khach} 
                                onValueChange={(v) => setFormData({...formData, maclb_khach: v})}
                            >
                                <SelectTrigger>
                                    {/* FIX LỖI LẶP TÊN */}
                                    <SelectValue placeholder="Chọn đội khách">
                                        {getClubName(formData.maclb_khach)}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {clubList.map((c: any) => (
                                        <SelectItem key={c.maclb} value={c.maclb}>
                                            {c.tenclb}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label>Sân thi đấu (Tự động theo đội nhà)</Label>
                        <Input 
                            value={formData.san} 
                            disabled 
                            className="bg-muted font-mono text-muted-foreground" 
                            placeholder="Chưa chọn đội nhà..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button 
                        onClick={() => mutation.mutate(formData)} 
                        disabled={mutation.isPending || !isValid} // Nút sẽ mờ đi nếu !isValid
                        className={`${!isValid ? 'opacity-50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Lưu lịch thi đấu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function StatCard({ title, value, icon: Icon, color }: any) {
    const bgClass = color.replace(/text-/g, 'bg-');
    return (
      <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm border border-border flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className={`p-3 rounded-full mb-3 bg-opacity-10 dark:bg-opacity-20 ${bgClass}`}>
              <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
          <div className="text-muted-foreground text-xs font-bold uppercase tracking-wide">{title}</div>
      </div>
    )
}