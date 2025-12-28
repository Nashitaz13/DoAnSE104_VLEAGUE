import { useState, useMemo, useEffect } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  LayoutDashboard, Users, CalendarDays, 
  CheckCircle, User, Target, MapPin, Plus, X, Loader2, Pencil
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

import { 
    ClubsService, 
    MatchesService, 
    StandingsService, 
    RostersService, 
    StadiumsService,
    SeasonManagementService 
} from "@/client"
import { getCurrentUser } from "@/utils/auth"

export const Route = createFileRoute("/_layout/team-manager")({
  component: ManagerDashboard,
})

const TABS = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'squad', label: 'Đội hình', icon: Users },
  { id: 'matches', label: 'Trận đấu', icon: CalendarDays },
]

function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedSeason, setSelectedSeason] = useState("2025-2026") 
  const currentUser = getCurrentUser()
  
  // 1. Lấy danh sách Mùa giải
  const { data: seasonsData } = useQuery({
    queryKey: ['seasons'],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 10 })
  })

  const seasonList = useMemo(() => {
    const listFromApi = Array.isArray(seasonsData) ? seasonsData : (seasonsData as any)?.data || [];
    const requiredSeasons = ["2025-2026", "2024-2025", "2023-2024"];
    const seasonSet = new Set(listFromApi.map((s: any) => s.muagiai));
    requiredSeasons.forEach(s => seasonSet.add(s));
    return Array.from(seasonSet).map(s => ({ muagiai: s })).sort((a: any, b: any) => b.muagiai.localeCompare(a.muagiai));
  }, [seasonsData]);

  // 2. Lấy danh sách Đội bóng
  const { data: allClubsData, isLoading: loadingClubs } = useQuery({
    queryKey: ['all-clubs', selectedSeason],
    queryFn: () => ClubsService.getClubs({ limit: 100, muagiai: selectedSeason })
  })

  const { data: backupClubsData } = useQuery({
    queryKey: ['all-clubs', '2024-2025'],
    queryFn: () => ClubsService.getClubs({ limit: 100, muagiai: '2024-2025' }),
    enabled: selectedSeason === '2025-2026'
  })

  // 3. Logic tìm đội bóng
  const myClub = useMemo(() => {
    let list = Array.isArray(allClubsData) ? allClubsData : (allClubsData as any)?.data || [];
    const backupList = Array.isArray(backupClubsData) ? backupClubsData : (backupClubsData as any)?.data || [];

    if (list.length === 0 && backupList.length > 0) list = backupList;
    if (!list.length || !currentUser) return null;
    
    const username = (currentUser.tendangnhap || "").toLowerCase();

    return list.find((club: any) => {
        const clubId = String(club.maclb || "").toLowerCase();
        if (clubId === username) return true;
        if (username === 'hanoi' && clubId.includes('hanoi')) return true;
        if (username === 'viettel' && (clubId.includes('viettel') || clubId.includes('thecong'))) return true;
        if (username === 'hcmc' && (clubId.includes('tphcm') || clubId.includes('hcm'))) return true;
        if (username === 'binhdinh' && clubId.includes('binhdinh')) return true;
        if (username === 'slna' && clubId.includes('slna')) return true;
        if (username === 'hagl' && clubId.includes('hagl')) return true;
        if (username === 'namdinh' && clubId.includes('namdinh')) return true;
        if (username === 'haiphong' && clubId.includes('haiphong')) return true;
        if (username === 'thanhhoa' && clubId.includes('thanhhoa')) return true;
        if (username === 'quangninh' && clubId.includes('quangninh')) return true;
        if (username === 'binhduong' && clubId.includes('binhduong')) return true;
        return false;
    });
  }, [allClubsData, backupClubsData, currentUser]);

  // 4. Lấy danh sách Sân
  const { data: stadiumsData } = useQuery({
    queryKey: ['stadiums', selectedSeason],
    queryFn: () => StadiumsService.getStadiums({ limit: 100, muagiai: selectedSeason })
  })
  
  const { data: backupStadiumsData } = useQuery({
    queryKey: ['stadiums', '2024-2025'],
    queryFn: () => StadiumsService.getStadiums({ limit: 100, muagiai: '2024-2025' }),
    enabled: selectedSeason === '2025-2026'
  })

  const resolvedStadiumName = useMemo(() => {
      const stadiumId = myClub?.masanvandong || myClub?.MaSanVanDong;
      if (!stadiumId) return "Chưa cập nhật";
      let list = Array.isArray(stadiumsData) ? stadiumsData : (stadiumsData as any)?.data || [];
      const backupList = Array.isArray(backupStadiumsData) ? backupStadiumsData : (backupStadiumsData as any)?.data || [];
      if (list.length === 0) list = backupList;
      const foundStadium = list.find((s: any) => (s.masanvandong === stadiumId) || (s.MaSanVanDong === stadiumId));
      const fullName = foundStadium?.tensanvandong || foundStadium?.tensan || stadiumId;
      return String(fullName).replace("Sân vận động", "SVĐ");
  }, [myClub, stadiumsData, backupStadiumsData]);

  if (loadingClubs && !myClub) return <div className="p-20 text-center"><Loader2 className="animate-spin inline mr-2"/> Đang tải...</div>;
  if (!currentUser) return <div className="p-20 text-center">Vui lòng đăng nhập.</div>;
  if (!myClub) return <div className="p-20 text-center text-red-500">Chưa liên kết đội bóng!</div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background font-sans pb-10">
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-900 dark:to-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-2xl shadow-md border-4 border-blue-400">
                {myClub.tenclb?.substring(0,2).toUpperCase()}
            </div>
            <div>
                <h1 className="text-3xl font-bold">{myClub.tenclb}</h1>
                <p className="opacity-90 flex items-center gap-2 text-sm">
                    <User className="w-4 h-4"/> Quản lý: {currentUser.tendangnhap}
                </p>
            </div>
          </div>
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
              <label className="text-xs font-bold text-blue-100 uppercase mb-1 block">Mùa giải hoạt động</label>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="w-[180px] bg-white text-blue-900 dark:bg-neutral-800 dark:text-blue-100 border-none font-bold h-9">
                    <SelectValue placeholder="Chọn mùa giải" />
                </SelectTrigger>
                <SelectContent>
                    {seasonList.map((s: any) => (
                        <SelectItem key={s.muagiai} value={s.muagiai}>{s.muagiai}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-white dark:bg-card p-1.5 rounded-xl shadow-sm border border-gray-200 dark:border-border inline-flex">
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm font-bold' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
            ))}
        </div>

        <div className="animate-in fade-in duration-300">
            {activeTab === 'overview' && <OverviewTab myClub={myClub} season={selectedSeason} stadiumName={resolvedStadiumName} />}
            {activeTab === 'squad' && <SquadTab clubId={myClub.maclb} season={selectedSeason} />}
            {activeTab === 'matches' && <MatchesTab clubId={myClub.maclb} season={selectedSeason} />}
        </div>
      </div>
    </div>
  )
}

// ====================================================================
// COMPONENT: MODAL ĐĂNG KÝ MỚI
// ====================================================================
function AddPlayerModal({ isOpen, onClose, clubId, season }: { isOpen: boolean, onClose: () => void, clubId: string, season: string }) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        tencauthu: "", soaothidau: "", vitrithidau: "MF", quoctich: "Vietnam", ngaysinh: "", chieucao: "", cannang: ""
    });

    const mutation = useMutation({
        mutationFn: async (newPlayer: any) => {
            // Giả lập API gọi
            console.log("Adding player:", newPlayer);
            return new Promise((resolve) => setTimeout(resolve, 800));
        },
        onSuccess: () => {
            alert("Đăng ký thành công!");
            queryClient.invalidateQueries({ queryKey: ['roster', clubId, season] });
            onClose();
            setFormData({ tencauthu: "", soaothidau: "", vitrithidau: "MF", quoctich: "Vietnam", ngaysinh: "", chieucao: "", cannang: "" });
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white dark:bg-card rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-border">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-muted/50">
                    <h3 className="font-bold text-lg text-foreground">Đăng ký bổ sung</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2"><Label>Họ tên</Label><Input value={formData.tencauthu} onChange={(e)=>setFormData({...formData, tencauthu: e.target.value})} placeholder="Nguyễn Văn A"/></div>
                        <div><Label>Số áo</Label><Input type="number" value={formData.soaothidau} onChange={(e)=>setFormData({...formData, soaothidau: e.target.value})}/></div>
                        <div>
                            <Label>Vị trí</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" value={formData.vitrithidau} onChange={(e)=>setFormData({...formData, vitrithidau: e.target.value})}>
                                <option value="GK">Thủ môn (GK)</option><option value="DF">Hậu vệ (DF)</option><option value="MF">Tiền vệ (MF)</option><option value="FW">Tiền đạo (FW)</option>
                            </select>
                        </div>
                        <div><Label>Ngày sinh</Label><Input type="date" value={formData.ngaysinh} onChange={(e)=>setFormData({...formData, ngaysinh: e.target.value})}/></div>
                        <div><Label>Quốc tịch</Label><Input value={formData.quoctich} onChange={(e)=>setFormData({...formData, quoctich: e.target.value})}/></div>
                        <div><Label>Chiều cao (cm)</Label><Input type="number" value={formData.chieucao} onChange={(e)=>setFormData({...formData, chieucao: e.target.value})}/></div>
                        <div><Label>Cân nặng (kg)</Label><Input type="number" value={formData.cannang} onChange={(e)=>setFormData({...formData, cannang: e.target.value})}/></div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t bg-muted/50 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => mutation.mutate(formData)} disabled={mutation.isPending || !formData.tencauthu}>{mutation.isPending ? "Đang lưu..." : "Lưu hồ sơ"}</Button>
                </div>
            </div>
        </div>
    )
}

// ====================================================================
// COMPONENT: MODAL CHỈNH SỬA CẦU THỦ (MỚI)
// ====================================================================
function EditPlayerModal({ isOpen, onClose, player, clubId, season }: { isOpen: boolean, onClose: () => void, player: any, clubId: string, season: string }) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        tencauthu: "", soaothidau: "", vitrithidau: "", quoctich: "", ngaysinh: "", chieucao: "", cannang: ""
    });

    useEffect(() => {
        if (player) {
            setFormData({
                tencauthu: player.tencauthu || "",
                soaothidau: player.soaothidau || "",
                vitrithidau: player.vitrithidau || "MF",
                quoctich: player.quoctich || "",
                ngaysinh: player.ngaysinh ? new Date(player.ngaysinh).toISOString().split('T')[0] : "",
                chieucao: player.chieucao || "",
                cannang: player.cannang || ""
            });
        }
    }, [player]);

    const mutation = useMutation({
        mutationFn: async (updatedData: any) => {
            // --- GIAI ĐOẠN 1: NẾU CHƯA CÓ BACKEND API ---
            // Giả lập độ trễ mạng
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ ...player, ...updatedData });
                }, 500);
            });

            // --- GIAI ĐOẠN 2: KHI ĐÃ CÓ BACKEND API (Bỏ comment dòng dưới) ---
        },
        onSuccess: (/* savedPlayer: any */) => {
            queryClient.setQueryData(['roster', clubId, season], (oldData: any) => {
                const currentList = Array.isArray(oldData) ? oldData : (oldData?.data || []);
                
                const newList = currentList.map((p: any) => 
                    p.macauthu === player.macauthu ? { ...p, ...formData } : p
                );

                return Array.isArray(oldData) ? newList : { ...oldData, data: newList };
            });

            alert(`Đã cập nhật thông tin cầu thủ: ${formData.tencauthu}`);
            onClose();
        },
        onError: (err) => {
            alert("Có lỗi xảy ra: " + err);
        }
    });

    if (!isOpen || !player) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white dark:bg-card rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-orange-200 dark:border-orange-800">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-orange-50 dark:bg-orange-900/20">
                    <h3 className="font-bold text-lg text-orange-800 dark:text-orange-300 flex items-center gap-2">
                        <Pencil className="w-4 h-4"/> Chỉnh sửa thông tin
                    </h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"/></button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label>Họ và tên</Label>
                            <Input 
                                value={formData.tencauthu}
                                onChange={(e) => setFormData({...formData, tencauthu: e.target.value})}
                            />
                        </div>
                        <div>
                            <Label>Số áo</Label>
                            <Input type="number" value={formData.soaothidau} onChange={(e) => setFormData({...formData, soaothidau: e.target.value})}/>
                        </div>
                        <div>
                            <Label>Vị trí</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" value={formData.vitrithidau} onChange={(e) => setFormData({...formData, vitrithidau: e.target.value})}>
                                <option value="GK">Thủ môn (GK)</option><option value="DF">Hậu vệ (DF)</option><option value="MF">Tiền vệ (MF)</option><option value="FW">Tiền đạo (FW)</option>
                            </select>
                        </div>
                        <div><Label>Ngày sinh</Label><Input type="date" value={formData.ngaysinh} onChange={(e) => setFormData({...formData, ngaysinh: e.target.value})}/></div>
                        <div><Label>Quốc tịch</Label><Input value={formData.quoctich} onChange={(e) => setFormData({...formData, quoctich: e.target.value})}/></div>
                        <div><Label>Chiều cao (cm)</Label><Input type="number" value={formData.chieucao} onChange={(e) => setFormData({...formData, chieucao: e.target.value})}/></div>
                        <div><Label>Cân nặng (kg)</Label><Input type="number" value={formData.cannang} onChange={(e) => setFormData({...formData, cannang: e.target.value})}/></div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t bg-muted/50 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Hủy bỏ</Button>
                    <Button 
                        className="bg-orange-600 hover:bg-orange-700 text-white" 
                        onClick={() => mutation.mutate(formData)}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Đang lưu..." : "Cập nhật"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

// ====================================================================
// SUB-COMPONENTS
// ====================================================================

function OverviewTab({ myClub, season, stadiumName }: { myClub: any, season: string, stadiumName: string }) {
    const { data: standings } = useQuery({
        queryKey: ['standings', season],
        queryFn: () => StandingsService.getStandings({ muagiai: season })
    })
    
    const listStandings = Array.isArray(standings) ? standings : (standings as any)?.standings || [];
    const myRank = listStandings.find((s: any) => s.maclb === myClub.maclb);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Vị trí BXH" value={(myRank && myRank.hang) ? `#${myRank.hang}` : "Chưa xếp"} icon={Target} color="text-orange-600" />
                <StatCard title="Điểm số" value={myRank?.diem || 0} icon={CheckCircle} color="text-green-600" />
                <StatCard title="Sân nhà" value={stadiumName} icon={MapPin} color="text-blue-600" />
            </div>
             <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/50 flex justify-between items-center">
                    <h3 className="font-bold text-foreground flex items-center gap-2"><User className="w-5 h-5 text-muted-foreground"/> Hồ sơ đăng ký</h3>
                    <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-1 rounded">Mùa: {season}</span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div><label className="text-xs text-muted-foreground font-bold uppercase tracking-wider block mb-1">Tên Câu Lạc Bộ</label><div className="text-lg font-bold text-foreground">{myClub.tenclb}</div></div>
                    <div><label className="text-xs text-muted-foreground font-bold uppercase tracking-wider block mb-1">Mã Hệ Thống</label><div className="font-mono text-muted-foreground bg-muted inline-block px-2 py-0.5 rounded">{myClub.maclb}</div></div>
                    <div><label className="text-xs text-muted-foreground font-bold uppercase tracking-wider block mb-1">Sân Vận Động</label><div className="font-medium text-foreground">{stadiumName}</div></div>
                    <div><label className="text-xs text-muted-foreground font-bold uppercase tracking-wider block mb-1">Địa chỉ</label><div className="text-foreground/80">{myClub.san_nha?.diachi || "Chưa cập nhật"}</div></div>
                </div>
            </div>
        </div>
    )
}

function SquadTab({ clubId, season }: { clubId: string, season: string }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // --- STATE CHO CHỈNH SỬA ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<any>(null); // Lưu cầu thủ đang được sửa

    const { data: roster, isLoading } = useQuery({
        queryKey: ['roster', clubId, season],
        queryFn: () => RostersService.getRoster({ maclb: clubId, muagiai: season }),
        staleTime: 5 * 60 * 1000,
    })

    const list = Array.isArray(roster) ? roster : (roster as any)?.data || [];

    const stats = useMemo(() => {
        const foreign = list.filter((p:any) => p.quoctich !== 'Vietnam').length;
        const avgAge = list.length ? (list.reduce((acc: number, p: any) => {
             const age = p.ngaysinh ? new Date().getFullYear() - new Date(p.ngaysinh).getFullYear() : 0;
             return acc + age;
        }, 0) / list.length).toFixed(1) : 0;
        return { foreign, avgAge };
    }, [list]);

    const handleEditClick = (player: any) => {
        setEditingPlayer(player); // Lưu thông tin cầu thủ vào state
        setIsEditModalOpen(true); // Mở modal
    };

    return (
        <div className="bg-white dark:bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                        <Users className="w-5 h-5"/> Danh sách cầu thủ ({list.length})
                    </h3>
                    <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                        <span>Ngoại binh: <b>{stats.foreign}</b></span>
                        <span>•</span>
                        <span>Tuổi TB: <b>{stats.avgAge}</b></span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2" onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="w-4 h-4"/> Đăng ký bổ sung
                    </Button>
                </div>
            </div>
            
            <AddPlayerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} clubId={clubId} season={season} />
            
            <EditPlayerModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                player={editingPlayer} // Truyền cầu thủ cần sửa vào
                clubId={clubId} 
                season={season} 
            />

            {isLoading ? (
                <div className="text-center py-10">Đang tải danh sách...</div>
            ) : list.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded border border-dashed border-border">
                    <p className="text-muted-foreground font-medium">Chưa có cầu thủ nào được đăng ký cho mùa giải {season}.</p>
                    {season !== '2025-2026' && (<p className="text-xs text-blue-500 mt-2">*Mẹo: Dữ liệu mẫu trong hệ thống chủ yếu nằm ở mùa giải <b>2025-2026</b>.</p>)}
                </div>
            ) : (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground text-xs uppercase font-bold">
                            <tr>
                                <th className="px-4 py-3 text-center w-14">Số áo</th>
                                <th className="px-4 py-3">Họ và tên</th>
                                <th className="px-4 py-3 w-24">Vị trí</th>
                                <th className="px-4 py-3">Quốc tịch</th>
                                <th className="px-4 py-3 text-center">Năm sinh</th>
                                <th className="px-4 py-3 text-center" title="Chiều cao (cm)">Cao</th>
                                <th className="px-4 py-3 text-center" title="Cân nặng (kg)">Nặng</th>
                                <th className="px-4 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {list.map((p: any) => {
                                const birthYear = p.ngaysinh ? new Date(p.ngaysinh).getFullYear() : "-";
                                const isForeign = p.quoctich !== 'Vietnam';
                                return (
                                    <tr key={p.macauthu} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                                        <td className="px-4 py-3 text-center font-bold text-blue-800 dark:text-blue-300">{p.soaothidau}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-foreground">{p.tencauthu}</div>
                                            {p.noisinh && <div className="text-xs text-muted-foreground">{p.noisinh}</div>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold w-10 text-center
                                                ${p.vitrithidau === 'GK' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : ''}
                                                ${p.vitrithidau === 'DF' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : ''}
                                                ${p.vitrithidau === 'MF' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : ''}
                                                ${p.vitrithidau === 'FW' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : ''}
                                            `}>{p.vitrithidau}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {isForeign ? (<span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">{p.quoctich}</span>) : (<span className="text-muted-foreground">Việt Nam</span>)}
                                        </td>
                                        <td className="px-4 py-3 text-center text-muted-foreground">{birthYear}</td>
                                        <td className="px-4 py-3 text-center text-muted-foreground">{p.chieucao ? `${p.chieucao}` : "-"}</td>
                                        <td className="px-4 py-3 text-center text-muted-foreground">{p.cannang ? `${p.cannang}` : "-"}</td>
                                        
                                        <td className="px-4 py-3 text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                onClick={() => handleEditClick(p)} // Gọi hàm mở modal
                                                title="Chỉnh sửa thông tin"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

function MatchesTab({ clubId, season }: { clubId: string, season: string }) {
    const { data: matches, isLoading } = useQuery({
        queryKey: ['matches', clubId, season],
        queryFn: () => MatchesService.readMatches({ maclb: clubId, muagiai: season, limit: 100 })
    })

    const list = Array.isArray(matches) ? matches : (matches as any)?.data || [];
    const sortedList = [...list].sort((a: any, b: any) => a.vong - b.vong);

    return (
        <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/50 flex justify-between items-center">
                <h3 className="font-bold text-foreground">Lịch thi đấu & Kết quả</h3>
                <div className="text-xs text-muted-foreground italic">Mùa giải {season}</div>
            </div>

            {isLoading ? (
                <div className="p-10 text-center text-muted-foreground">Đang tải lịch thi đấu...</div>
            ) : list.length === 0 ? (
                <div className="p-16 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground"><CalendarDays className="w-8 h-8"/></div>
                    <h4 className="text-lg font-bold text-foreground">Chưa có lịch thi đấu</h4>
                    <p className="text-muted-foreground max-w-xs mx-auto mt-2">Không tìm thấy trận đấu nào cho mùa giải {season}. Hãy thử chuyển sang mùa giải <b>2024-2025</b>.</p>
                </div>
            ) : (
                <div className="divide-y divide-border">
                    {sortedList.map((m: any) => {
                        const isHome = m.maclb_nha === clubId;
                        const matchDate = m.thoigianthidau ? new Date(m.thoigianthidau).toLocaleDateString("vi-VN") : "Chưa xếp lịch";
                        return (
                            <div key={m.matran} className="flex flex-col md:flex-row items-center justify-between p-4 hover:bg-muted/50 transition-colors gap-4">
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded text-xs font-bold uppercase min-w-[80px] text-center">Vòng {m.vong}</div>
                                    <span className="text-sm text-muted-foreground">{matchDate}</span>
                                </div>
                                <div className="flex-1 flex items-center justify-center gap-4 w-full">
                                    <span className={`text-right flex-1 font-bold ${isHome ? "text-blue-700 dark:text-blue-400" : "text-foreground"}`}>{m.doi_nha?.tenclb || m.maclb_nha}</span>
                                    <div className="bg-gray-900 dark:bg-gray-800 text-white px-4 py-1.5 rounded-lg font-mono font-bold text-lg shadow-sm min-w-[80px] text-center">{m.tiso || "vs"}</div>
                                    <span className={`text-left flex-1 font-bold ${!isHome ? "text-blue-700 dark:text-blue-400" : "text-foreground"}`}>{m.doi_khach?.tenclb || m.maclb_khach}</span>
                                </div>
                                <div className="w-full md:w-auto text-center md:text-right">
                                    <span className={`text-xs px-2 py-1 rounded border ${isHome ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300'}`}>{isHome ? 'Sân nhà' : 'Sân khách'}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
      <div className="bg-white dark:bg-card p-5 rounded-xl shadow-sm border border-border flex items-center justify-between hover:shadow-md transition-shadow">
          <div><div className={`text-2xl font-bold ${color} truncate max-w-[180px]`} title={value}>{value}</div><div className="text-xs font-bold uppercase text-muted-foreground mt-1 tracking-wider">{title}</div></div>
          <div className={`p-3 rounded-full ${color.replace('text-', 'bg-')} bg-opacity-10 dark:bg-opacity-20`}><Icon className={`w-6 h-6 ${color}`} /></div>
      </div>
    )
}