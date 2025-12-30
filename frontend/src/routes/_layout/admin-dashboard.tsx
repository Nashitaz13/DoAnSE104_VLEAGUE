import { useState, useMemo, useEffect } from "react"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  LayoutDashboard, FileText, Users, CalendarDays, MapPin,
  CheckCircle, XCircle, Search, Filter, AlertTriangle, Inbox, Clock, Plus, Loader2, Edit, ChevronLeft, ChevronRight, Gavel, Save, RefreshCw
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
import { MatchesService, ClubsService, SeasonManagementService, ScheduleService } from "@/client"
import { getCurrentUser } from "@/utils/auth"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const Route = createFileRoute("/_layout/admin-dashboard")({
  component: AdminDashboard,
})

const TABS = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'season-rules', label: 'Quản lý Mùa giải', icon: Gavel },
  { id: 'teams', label: 'Đội bóng tham dự', icon: Users },
  { id: 'stadiums', label: 'Quản lý Sân vận động', icon: MapPin },
  { id: 'schedule', label: 'Lịch thi đấu', icon: CalendarDays },
]

// STADIUM MANAGEMENT TAB
function StadiumManagementTab({ selectedSeasonId }: { selectedSeasonId: string }) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newStadium, setNewStadium] = useState({ masanvandong: "", tensanvandong: "", diachisvd: "", succhua: null as number | null, danhgiafifa: "" })

  const { data: stadiumsData } = useQuery({
    queryKey: ['stadiums', selectedSeasonId],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      const res = await fetch('http://localhost:8000/api/stadiums?muagiai=' + selectedSeasonId, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.json();
    }
  })

  const stadiums = useMemo(() => Array.isArray(stadiumsData) ? stadiumsData : (stadiumsData as any)?.data || [], [stadiumsData])

  const createMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("access_token");
      const response = await fetch('http://localhost:8000/api/stadiums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newStadium, muagiai: selectedSeasonId, succhua: newStadium.succhua || 0 })
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Failed: ' + response.statusText)
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stadiums'] })
      toast({ title: "Tạo sân thành công!" })
      setIsCreateOpen(false)
      setNewStadium({ masanvandong: "", tensanvandong: "", diachisvd: "", succhua: null, danhgiafifa: "" })
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="w-6 h-6" /> Quản lý Sân vận động</h2>
          <p className="text-gray-500">Danh sách sân thi đấu mùa giải {selectedSeasonId}</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600">
          <Plus className="mr-2 h-4 w-4" /> Tạo sân mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stadiums.map((stadium: any) => (
          <Card key={stadium.masanvandong}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{stadium.tensanvandong}</CardTitle>
              <CardDescription>{stadium.masanvandong}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <p>Địa chỉ: {stadium.diachisvd || "N/A"}</p>
                <p>Sức chứa: {stadium.succhua?.toLocaleString() || "N/A"} người</p>
                <p>Đánh giá FIFA: {stadium.danhgiafifa || "Chưa có"}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo sân vận động mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div>
              <label className="text-sm font-medium">Mã sân *</label>
              <Input value={newStadium.masanvandong} onChange={e => setNewStadium({ ...newStadium, masanvandong: e.target.value })} placeholder="VD: SVD_HCM" />
            </div>
            <div>
              <label className="text-sm font-medium">Tên sân *</label>
              <Input value={newStadium.tensanvandong} onChange={e => setNewStadium({ ...newStadium, tensanvandong: e.target.value })} placeholder="VD: Sân vận động Thống Nhất" />
            </div>
            <div>
              <label className="text-sm font-medium">Địa chỉ</label>
              <Input value={newStadium.diachisvd} onChange={e => setNewStadium({ ...newStadium, diachisvd: e.target.value })} placeholder="VD: 138 Đào Duy Từ..." />
            </div>
            <div>
              <label className="text-sm font-medium">Sức chứa</label>
              <Input type="number" value={newStadium.succhua || ""} onChange={e => setNewStadium({ ...newStadium, succhua: parseInt(e.target.value) || null })} placeholder="VD: 15000" />
            </div>
            <div>
              <label className="text-sm font-medium">Đánh giá FIFA</label>
              <Input value={newStadium.danhgiafifa} onChange={e => setNewStadium({ ...newStadium, danhgiafifa: e.target.value })} placeholder="VD: FIFA Standard" />
            </div>
            <Button onClick={() => createMutation.mutate()} className="w-full" disabled={!newStadium.masanvandong || !newStadium.tensanvandong}>
              Tạo sân
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const currentUser = getCurrentUser()
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("")

  // Fetch all seasons to select active one
  const { data: seasonsData, refetch: refetchSeasons } = useQuery({
    queryKey: ['seasons'],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 100 })
  });

  const seasons = useMemo(() => Array.isArray(seasonsData) ? seasonsData : (seasonsData as any)?.data || [], [seasonsData]);

  // Set default season
  useEffect(() => {
    if (seasons.length > 0 && !selectedSeasonId) {
      // Find active season or latest
      const active = seasons.find((s: any) => s.trangthai === 'Active');
      if (active) setSelectedSeasonId(active.muagiai);
      else setSelectedSeasonId(seasons[0].muagiai);
    }
  }, [seasons, selectedSeasonId]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 font-sans pb-10">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-700 to-orange-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/20 rounded-lg">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Quản trị</h1>
              <p className="opacity-90">Ban Tổ Chức V-League 1</p>
            </div>
          </div>

          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
            <Label className="text-white text-xs block mb-1">Mùa giải đang làm việc</Label>
            <Select value={selectedSeasonId} onValueChange={setSelectedSeasonId}>
              <SelectTrigger className="bg-transparent border-white/30 text-white min-w-[180px]">
                <SelectValue placeholder="Chọn mùa giải" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((s: any) => (
                  <SelectItem key={s.muagiai} value={s.muagiai}>{s.muagiai}</SelectItem>
                ))}
                {seasons.length === 0 && <SelectItem value="none" disabled>Chưa có mùa giải</SelectItem>}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Navigation */}
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all flex-1 justify-center ${activeTab === tab.id
                ? 'bg-gray-100 text-gray-900 shadow-inner'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in duration-300">
          {activeTab === 'overview' && <OverviewTab onChangeTab={setActiveTab} />}
          {activeTab === 'season-rules' && <SeasonAndRulesTab selectedSeasonId={selectedSeasonId} onUpdate={refetchSeasons} />}
          {activeTab === 'schedule' && <ScheduleTab selectedSeasonId={selectedSeasonId} />}
          {activeTab === 'teams' && <TeamManagementTab selectedSeasonId={selectedSeasonId} />}
          {activeTab === 'stadiums' && <StadiumManagementTab selectedSeasonId={selectedSeasonId} />}
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="border-orange-200 bg-orange-50/50 cursor-pointer hover:shadow-md transition-all" onClick={() => onChangeTab('season-rules')}>
        <CardHeader>
          <CardTitle className="text-orange-700 flex items-center gap-2">
            <Gavel className="w-5 h-5" /> Quy định Mùa giải
          </CardTitle>
          <CardDescription>Thiết lập luật thi đấu, đăng ký cầu thủ</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Quản lý các thông số như tuổi cầu thủ, số lượng ngoại binh, và thông tin mùa giải mới.</p>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50 cursor-pointer hover:shadow-md transition-all" onClick={() => onChangeTab('teams')}>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Users className="w-5 h-5" /> Hồ sơ Đội bóng
          </CardTitle>
          <CardDescription>Tiếp nhận đăng ký và hồ sơ</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Quản lý các đội bóng tham dự mùa giải và danh sách cầu thủ.</p>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50/50 cursor-pointer hover:shadow-md transition-all" onClick={() => onChangeTab('schedule')}>
        <CardHeader>
          <CardTitle className="text-green-700 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> Lịch thi đấu
          </CardTitle>
          <CardDescription>Xếp lịch tự động</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Tự động xếp lịch thi đấu vòng tròn và quản lý kết quả.</p>
        </CardContent>
      </Card>
    </div>
  )
}

// ====================================================================
// TAB: MÙA GIẢI & QUY ĐỊNH
// ====================================================================
function SeasonAndRulesTab({ selectedSeasonId, onUpdate }: { selectedSeasonId: string, onUpdate: () => void }) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)

  // Fetch detail
  const { data: seasonDetail, refetch } = useQuery({
    queryKey: ['season', selectedSeasonId],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 100 }).then((res: any) => { // Using list endpoint then filtering as getSeasonById might be tricky if ID format varies
      const list = Array.isArray(res) ? res : res.data;
      return list.find((s: any) => s.muagiai === selectedSeasonId);
    }),
    enabled: !!selectedSeasonId
  });

  // State for form
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (seasonDetail) {
      setFormData({
        ...seasonDetail,
        // formatted dates
        ngaybatdau: seasonDetail.ngaybatdau ? seasonDetail.ngaybatdau.split('T')[0] : '',
        ngayketthuc: seasonDetail.ngayketthuc ? seasonDetail.ngayketthuc.split('T')[0] : ''
      })
    } else {
      // Reset or set defaults for creating
      setFormData({
        muagiai: "",
        ngaybatdau: "",
        ngayketthuc: "",
        soclbthamdutoida: 14,
        lephithamgia: 0,
        socauthutoithieu: 16,
        socauthutoida: 22,
        sothumontoithieu: 2,
        tuoicauthutoithieu: 16,
        tuoicauthutoida: 40,
        succhuatoithieu: 10000,
        thoidiemghibantoida: 100
      })
    }
  }, [seasonDetail, selectedSeasonId])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (isCreating) {
        return SeasonManagementService.createSeason({ requestBody: data })
      } else {
        return SeasonManagementService.updateSeason({ season_id: selectedSeasonId, requestBody: data })
      }
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Đã lưu thông tin mùa giải" })
      queryClient.invalidateQueries({ queryKey: ['seasons'] })
      queryClient.invalidateQueries({ queryKey: ['season'] })
      onUpdate()
      setIsCreating(false)
    },
    onError: (err) => {
      toast({ title: "Lỗi", description: "Không thể lưu thông tin. Mùa giải có thể đã tồn tại.", variant: "destructive" })
    }
  })

  // Start new season mode
  const handleNewSeason = () => {
    setIsCreating(true)
    setFormData({
      muagiai: "2025-2026",
      ngaybatdau: "2025-08-01",
      ngayketthuc: "2026-05-30",
      soclbthamdutoida: 14,
      lephithamgia: 500000000,
      socauthutoithieu: 16,
      socauthutoida: 30, // Adjusted to realistic
      sothumontoithieu: 3,
      tuoicauthutoithieu: 16,
      tuoicauthutoida: 40,
      succhuatoithieu: 10000,
      thoidiemghibantoida: 100, // 90 + 10 extra
      trangphucquydinh: "Full kit", // Extra
      trangthai: "Active"
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  if (!selectedSeasonId && !isCreating) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-4">Chưa có mùa giải nào</h2>
        <Button onClick={handleNewSeason}><Plus className="mr-2" /> Tạo mùa giải mới</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* HEADER ACTION */}
      <div className="xl:col-span-2 flex justify-between items-center bg-white p-4 rounded-lg border">
        <div>
          <h2 className="text-lg font-bold">
            {isCreating ? "Tạo Mùa giải mới" : `Cấu hình: ${selectedSeasonId}`}
          </h2>
          {isCreating && <p className="text-sm text-gray-500">Nhập ký hiệu mùa giải (VD: 2025-2026) và các quy định kèm theo.</p>}
        </div>
        {!isCreating && <Button onClick={handleNewSeason} variant="outline"><Plus className="mr-2 h-4 w-4" /> Tạo mùa giải khác</Button>}
        {isCreating && <Button onClick={() => setIsCreating(false)} variant="ghost">Hủy bỏ</Button>}
      </div>

      {/* FORM: THIẾT LẬP CƠ BẢN */}
      <form onSubmit={handleSubmit} className="contents">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Clock className="w-5 h-5" /></div>
            <h3 className="font-bold text-lg text-gray-800">Thông tin cơ bản</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mã mùa giải (ID)</Label>
              <Input
                disabled={!isCreating} // ID cannot be changed once created
                value={formData.muagiai || ""}
                onChange={e => setFormData({ ...formData, muagiai: e.target.value })}
                placeholder="VD: 2024-2025"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày bắt đầu</Label>
                <Input type="date" value={formData.ngaybatdau || ""} onChange={e => setFormData({ ...formData, ngaybatdau: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Ngày kết thúc</Label>
                <Input type="date" value={formData.ngayketthuc || ""} onChange={e => setFormData({ ...formData, ngayketthuc: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={formData.trangthai || "Active"} onValueChange={v => setFormData({ ...formData, trangthai: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Đang diễn ra (Active)</SelectItem>
                  <SelectItem value="Planned">Dự kiến (Planned)</SelectItem>
                  <SelectItem value="Finished">Đã kết thúc (Finished)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* FORM: QUY ĐỊNH */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><Gavel className="w-5 h-5" /></div>
            <h3 className="font-bold text-lg text-gray-800">Quy định Điều lệ</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tuổi TT</Label>
                <Input type="number" value={formData.tuoicauthutoithieu || 0} onChange={e => setFormData({ ...formData, tuoicauthutoithieu: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Tuổi TĐ</Label>
                <Input type="number" value={formData.tuoicauthutoida || 0} onChange={e => setFormData({ ...formData, tuoicauthutoida: parseInt(e.target.value) })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Số CT tối thiểu</Label>
                <Input type="number" value={formData.socauthutoithieu || 0} onChange={e => setFormData({ ...formData, socauthutoithieu: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Số CT tối đa</Label>
                <Input type="number" value={formData.socauthutoida || 0} onChange={e => setFormData({ ...formData, socauthutoida: parseInt(e.target.value) })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Số thủ môn tối thiểu</Label>
              <Input type="number" value={formData.sothumontoithieu || 0} onChange={e => setFormData({ ...formData, sothumontoithieu: parseInt(e.target.value) })} />
            </div>

            <div className="space-y-2">
              <Label>Thời điểm ghi bàn tối đa (phút)</Label>
              <Input type="number" value={formData.thoidiemghibantoida || 0} onChange={e => setFormData({ ...formData, thoidiemghibantoida: parseInt(e.target.value) })} />
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={mutation.isPending} className="w-full bg-blue-600 hover:bg-blue-700">
                {mutation.isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                {isCreating ? "Tạo Mùa Giải & Quy Định" : "Lưu Thay Đổi"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

// ====================================================================
// TAB 3: ĐỘI BÓNG (REGISTER TEAMS)
// ====================================================================
function TeamManagementTab({ selectedSeasonId }: { selectedSeasonId: string }) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isCreateNewOpen, setIsCreateNewOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");

  // New team form state
  const [newTeam, setNewTeam] = useState({
    maclb: "",
    tenclb: "",
    diachitruso: "",
    donvichuquan: "",
    trangphucchunha: "",
    trangphuckhach: "",
    trangphucduphong: "",
    masanvandong: null as string | null
  });

  // Get teams for CURRENT season
  const { data: currentClubsData } = useQuery({
    queryKey: ['clubs', selectedSeasonId],
    queryFn: () => ClubsService.getClubs({ muagiai: selectedSeasonId, limit: 100 }),
    enabled: !!selectedSeasonId
  });

  // Get ALL clubs (history) for suggestions
  const { data: allClubsData } = useQuery({
    queryKey: ['all-clubs-history'],
    queryFn: () => ClubsService.getClubs({ limit: 1000 }) // Get mostly everything
  });

  // Fetch stadiums for dropdown
  const { data: stadiumsData } = useQuery({
    queryKey: ['stadiums', selectedSeasonId],
    queryFn: () => fetch('http://localhost:8000/api/stadiums?limit=100').then(res => res.json()),
    enabled: !!selectedSeasonId
  });

  const stadiums = useMemo(() => Array.isArray(stadiumsData) ? stadiumsData : (stadiumsData as any)?.data || [], [stadiumsData]);
  const currentClubs = useMemo(() => Array.isArray(currentClubsData) ? currentClubsData : (currentClubsData as any)?.data || [], [currentClubsData]);
  const historyClubs = useMemo(() => Array.isArray(allClubsData) ? allClubsData : (allClubsData as any)?.data || [], [allClubsData]);

  // Unique clubs from history (deduped by name) not currently registered
  const availableClubs = useMemo(() => {
    const registeredNames = new Set(currentClubs.map((c: any) => c.tenclb));
    const unique = new Map();
    historyClubs.forEach((c: any) => {
      if (!registeredNames.has(c.tenclb) && !unique.has(c.tenclb)) {
        unique.set(c.tenclb, c);
      }
    });
    return Array.from(unique.values()).filter(c => c.tenclb.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [currentClubs, historyClubs, searchTerm]);

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (club: any) => {
      // Create a new club entry for this season based on the old one
      const newClubData = {
        maclb: club.maclb, // Reuse club ID
        muagiai: selectedSeasonId, // New season
        tenclb: club.tenclb,
        // IMPORTANT: Set masanvandong to null because:
        // 1. Stadium has composite FK (masanvandong, muagiai)
        // 2. Stadium from old season doesn't exist in new season
        // 3. Admin needs to register stadium separately or update later
        masanvandong: null,
        diachitruso: club.diachitruso,
        donvichuquan: club.donvichuquan,
        trangphucchunha: club.trangphucchunha,
        trangphuckhach: club.trangphuckhach,
        trangphucduphong: club.trangphucduphong
      };
      return ClubsService.createClub({ requestBody: newClubData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs', selectedSeasonId] });
      toast({ title: "Đã thêm đội bóng", description: "Đội bóng đã được đăng ký cho mùa giải này." });
    },
    onError: () => {
      toast({ title: "Lỗi đăng ký đội", variant: "destructive" });
    }
  });

  // Create New Team Mutation
  const createNewTeamMutation = useMutation({
    mutationFn: async () => {
      if (!newTeam.maclb || !newTeam.tenclb) {
        throw new Error("Mã đội và tên đội là bắt buộc");
      }
      return await ClubsService.createClub({
        requestBody: {
          ...newTeam,
          muagiai: selectedSeasonId,
          masanvandong: newTeam.masanvandong || undefined
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs', selectedSeasonId] });
      toast({ title: "Tạo đội thành công!" });
      setIsCreateNewOpen(false);
      setNewTeam({
        maclb: "",
        tenclb: "",
        diachitruso: "",
        donvichuquan: "",
        trangphucchunha: "",
        trangphuckhach: "",
        trangphucduphong: "",
        masanvandong: null
      });
    },
    onError: (err: any) => {
      toast({
        title: "Lỗi tạo đội",
        description: err.body?.detail || err.message,
        variant: "destructive"
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-6 h-6" /> Các đội tham dự ({selectedSeasonId})</h2>
          <p className="text-gray-500">Quản lý danh sách CLB chính thức</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsRegisterOpen(true)} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
            <Plus className="mr-2 h-4 w-4" /> Đăng ký Đội từ DS cũ
          </Button>
          <Button onClick={() => setIsCreateNewOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Tạo Đội Mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentClubs.map((club: any) => (
          <Card key={club.maclb}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{club.tenclb}</CardTitle>
              <CardDescription>{club.maclb}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <p>Sân: {club.masanvandong || "Chưa đăng ký"}</p>
                <p>Trụ sở: {club.diachitruso || "N/A"}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {currentClubs.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white border border-dashed rounded-xl">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">Chưa có đội bóng nào đăng ký cho mùa giải này.</p>
            <Button variant="link" onClick={() => setIsRegisterOpen(true)}>Đăng ký ngay</Button>
          </div>
        )}
      </div>

      {/* REGISTER MODAL */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chọn đội bóng từ dữ liệu cũ</DialogTitle>
            <DialogDescription>Chọn các đội từ các mùa giải trước để đăng ký cho {selectedSeasonId}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm tên đội..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2 border p-2 rounded-md">
              {availableClubs.map((club: any) => (
                <div key={club.maclb + club.muagiai} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded border">
                  <div>
                    <p className="font-bold">{club.tenclb}</p>
                    <p className="text-xs text-gray-500">{club.donvichuquan}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => registerMutation.mutate(club)}>
                    <Plus className="w-4 h-4 mr-1" /> Thêm
                  </Button>
                </div>
              ))}
              {availableClubs.length === 0 && <p className="text-center text-gray-500 py-4">Không tìm thấy đội phù hợp hoặc tất cả đã được đăng ký.</p>}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CREATE NEW TEAM DIALOG */}
      <Dialog open={isCreateNewOpen} onOpenChange={setIsCreateNewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo đội bóng mới</DialogTitle>
            <DialogDescription>Nhập thông tin để tạo đội bóng hoàn toàn mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div>
              <label className="text-sm font-medium">Mã CLB *</label>
              <Input value={newTeam.maclb} onChange={e => setNewTeam({ ...newTeam, maclb: e.target.value })} placeholder="VD: HPG" />
            </div>
            <div>
              <label className="text-sm font-medium">Tên CLB *</label>
              <Input value={newTeam.tenclb} onChange={e => setNewTeam({ ...newTeam, tenclb: e.target.value })} placeholder="VD: Hải Phòng FC" />
            </div>
            <div>
              <label className="text-sm font-medium">Đơn vị chủ quản</label>
              <Input value={newTeam.donvichuquan} onChange={e => setNewTeam({ ...newTeam, donvichuquan: e.target.value })} placeholder="VD: Công ty CP..." />
            </div>
            <div>
              <label className="text-sm font-medium">Địa chỉ trụ sở</label>
              <Input value={newTeam.diachitruso} onChange={e => setNewTeam({ ...newTeam, diachitruso: e.target.value })} placeholder="VD: 12 Đinh Tiên Hoàng" />
            </div>
            <div>
              <label className="text-sm font-medium">Sân vận động</label>
              <select
                className="w-full border rounded p-2 text-sm"
                value={newTeam.masanvandong || ""}
                onChange={e => setNewTeam({ ...newTeam, masanvandong: e.target.value || null })}
              >
                <option value="">-- Chọn sân --</option>
                {stadiums.map((stadium: any) => (
                  <option key={stadium.masanvandong} value={stadium.masanvandong}>
                    {stadium.tensanvandong}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-sm font-medium">Màu áo nhà</label>
                <Input value={newTeam.trangphucchunha} onChange={e => setNewTeam({ ...newTeam, trangphucchunha: e.target.value })} placeholder="Đỏ" />
              </div>
              <div>
                <label className="text-sm font-medium">Màu áo khách</label>
                <Input value={newTeam.trangphuckhach} onChange={e => setNewTeam({ ...newTeam, trangphuckhach: e.target.value })} placeholder="Trắng" />
              </div>
              <div>
                <label className="text-sm font-medium">Màu dự phòng</label>
                <Input value={newTeam.trangphucduphong} onChange={e => setNewTeam({ ...newTeam, trangphucduphong: e.target.value })} placeholder="Xanh" />
              </div>
            </div>
            <Button onClick={() => createNewTeamMutation.mutate()} className="w-full" disabled={!newTeam.maclb || !newTeam.tenclb}>
              Tạo đội
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ====================================================================
// TAB 4: QUẢN LÝ LỊCH THI ĐẤU
// ====================================================================
function ScheduleTab({ selectedSeasonId }: { selectedSeasonId: string }) {
  const queryClient = useQueryClient();
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  // Data
  const { data: matchesData } = useQuery({
    queryKey: ['matches', selectedSeasonId],
    queryFn: () => MatchesService.readMatches({ muagiai: selectedSeasonId, limit: 100 }),
    enabled: !!selectedSeasonId
  });

  const matches = useMemo(() => {
    let list = Array.isArray(matchesData) ? matchesData : (matchesData as any)?.data || [];
    // Sort by round first, then by datetime within each round
    return list.sort((a: any, b: any) => {
      if (a.vong !== b.vong) return a.vong - b.vong;
      return new Date(a.thoigianthidau).getTime() - new Date(b.thoigianthidau).getTime();
    });
  }, [matchesData]);

  const { data: seasonDetail } = useQuery({
    queryKey: ['season', selectedSeasonId],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 100 }).then((res: any) => (Array.isArray(res) ? res : res.data).find((s: any) => s.muagiai === selectedSeasonId)),
    enabled: !!selectedSeasonId
  });

  const [genConfig, setGenConfig] = useState({
    ngaybatdau_lutdi: "",
    ngaybatdau_lutve: "",
    interval: 7
  })

  // Init dates from season
  useEffect(() => {
    if (seasonDetail) {
      setGenConfig(prev => ({
        ...prev,
        ngaybatdau_lutdi: seasonDetail.ngaybatdau ? seasonDetail.ngaybatdau.split('T')[0] : "",
        ngaybatdau_lutve: seasonDetail.ngayketthuc ? new Date(new Date(seasonDetail.ngayketthuc).getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : "" // approx 3 months before end
      }))
    }
  }, [seasonDetail])

  const generateMutation = useMutation({
    mutationFn: async () => {
      return ScheduleService.generateSchedule({
        requestBody: {
          muagiai: selectedSeasonId,
          ngaybatdau_lutdi: new Date(genConfig.ngaybatdau_lutdi).toISOString(),
          ngaybatdau_lutve: new Date(genConfig.ngaybatdau_lutve).toISOString(),
          interval_days: genConfig.interval
        }
      })
    },
    onSuccess: (res) => {
      alert(`Thành công! Đã tạo ${res.matches_created} trận đấu qua ${res.rounds_generated} vòng.`);
      setIsGenerateOpen(false);
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
    onError: (err: any) => {
      const errorMsg = err.body?.detail || err.message || "Lỗi không xác định";
      alert("Lỗi tạo lịch: " + errorMsg);
      console.error("Schedule generation error:", err);
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><CalendarDays className="w-6 h-6" /> Lịch thi đấu mùa {selectedSeasonId}</h2>
          <p className="text-gray-500">Xếp lịch và quản lý trận đấu</p>
        </div>
        <Button className="bg-gray-900 text-white hover:bg-black" onClick={() => setIsGenerateOpen(true)}>
          <RefreshCw className="w-4 h-4 mr-2" /> Xếp lịch tự động
        </Button>
      </div>

      <div className="space-y-2">
        {matches.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <CalendarDays className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Chưa có lịch thi đấu.</p>
            <Button variant="link" onClick={() => setIsGenerateOpen(true)}>Tạo lịch ngay</Button>
          </div>
        ) : (
          <div className="grid gap-2">
            {matches.map((m: any) => (
              <div key={m.matran} className="bg-white p-4 rounded-lg border flex justify-between items-center hover:bg-gray-50 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold w-20 text-center">Vòng {m.vong}</span>
                  <div className="text-sm">
                    <span className="font-bold">{m.doi_nha?.tenclb || m.maclb_nha || m.ten_clb_nha}</span>
                    <span className="mx-2 text-gray-400 font-bold">vs</span>
                    <span className="font-bold">{m.doi_khach?.tenclb || m.maclb_khach || m.ten_clb_khach}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {new Date(m.thoigianthidau).toLocaleString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GENERATE MODAL */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xếp lịch thi đấu tự động</DialogTitle>
            <DialogDescription>Thuật toán Round-Robin sẽ tạo lịch thi đấu cho tất cả các đội đã đăng ký.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày bắt đầu Lượt đi</Label>
                <Input type="date" value={genConfig.ngaybatdau_lutdi} onChange={e => setGenConfig({ ...genConfig, ngaybatdau_lutdi: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Ngày bắt đầu Lượt về</Label>
                <Input type="date" value={genConfig.ngaybatdau_lutve} onChange={e => setGenConfig({ ...genConfig, ngaybatdau_lutve: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Khoảng cách giữa các vòng (Ngày)</Label>
              <Input type="number" value={genConfig.interval} onChange={e => setGenConfig({ ...genConfig, interval: parseInt(e.target.value) })} />
            </div>
            <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-800 border border-yellow-200">
              Lưu ý: Hệ thống sẽ xóa lịch thi đấu cũ của mùa giải này nếu có.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>Hủy</Button>
            <Button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="bg-blue-600">
              {generateMutation.isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Tạo Lịch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}