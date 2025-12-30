import { useState, useMemo, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { format, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import {
  CalendarDays,
  Clock,
  MapPin,
  ChevronRight,
  Trophy,
  Filter,
  Shield,
  Activity,
  Users,
  Flag
} from "lucide-react"

import { MatchesService, SeasonManagementService, ClubsService, RostersService, MatchEventsService, MatchRefereesService, MatchLineupService } from "@/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export const Route = createFileRoute("/_layout/fixtures")({
  component: MatchCenterPage,
})

// --- COMPONENTS ---

// 1. Match Card Component
function MatchCard({ match, onClick }: { match: any; onClick: () => void }) {
  const isFinished = !!match.tiso
  const matchDate = new Date(match.thoigianthidau)
  const isUpcoming = !isFinished && matchDate > new Date()

  // Helper to fallback logo/name
  const getLogo = (id: string) => `/images/clubs/${id}.png`

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden
      ${isFinished ? 'hover:border-gray-300' : 'hover:border-blue-300'}`}
    >
      {/* Status Strip */}
      <div className={`h-1 w-full ${isFinished ? 'bg-gray-200' : 'bg-blue-500'}`} />

      <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Home Team */}
        <div className="flex-1 flex items-center justify-end gap-3 md:gap-4 w-full">
          <span className="font-bold text-lg md:text-xl text-right truncate">
            {match.ten_clb_nha || match.maclb_nha}
          </span>
          <img
            src={getLogo(match.maclb_nha)}
            alt="Home"
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
            onError={(e) => (e.currentTarget.src = "https://placehold.co/64x64?text=Club")}
          />
        </div>

        {/* Score / Time Center */}
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          {isFinished ? (
            <div className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wider">
              {match.tiso?.replace('-', ' - ')}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-blue-600">
                {format(matchDate, 'HH:mm')}
              </span>
              <span className="text-xs text-gray-500 uppercase font-medium mt-1">
                {format(matchDate, 'dd/MM')}
              </span>
            </div>
          )}

          <div className="mt-2 text-center">
            {isFinished && <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">Kết thúc</Badge>}
            {isUpcoming && <Badge className="bg-blue-600 hover:bg-blue-700 text-[10px] uppercase tracking-wide">Sắp diễn ra</Badge>}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex-1 flex items-center justify-start gap-3 md:gap-4 w-full">
          <img
            src={getLogo(match.maclb_khach)}
            alt="Away"
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
            onError={(e) => (e.currentTarget.src = "https://placehold.co/64x64?text=Club")}
          />
          <span className="font-bold text-lg md:text-xl text-left truncate">
            {match.ten_clb_khach || match.maclb_khach}
          </span>
        </div>

      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 flex justify-center gap-4 border-t border-gray-100 group-hover:bg-gray-100 transition-colors">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {match.ten_san || match.masanvandong}</span>
        <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Vòng {match.vong}</span>
      </div>
    </div>
  )
}

// 2. Match Details Modal
// Add helper for random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

function MatchDetailModal({ match, isOpen, onClose }: { match: any; isOpen: boolean; onClose: () => void }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [scoreHome, setScoreHome] = useState("");
  const [scoreAway, setScoreAway] = useState("");
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});

  const queryClient = useQueryClient()

  // 1. Fetch Events
  const { data: events, refetch: refetchEvents } = useQuery({
    queryKey: ['match-events', match?.matran],
    queryFn: () => MatchEventsService.getEvents({ matran: match?.matran }),
    enabled: !!match?.matran,
    initialData: []
  });

  // Init score from match prop
  useEffect(() => {
    if (match?.tiso) {
      const parts = match.tiso.split('-');
      if (parts.length === 2) {
        setScoreHome(parts[0].trim());
        setScoreAway(parts[1].trim());
      }
    } else {
      setScoreHome("");
      setScoreAway("");
    }
  }, [match]);

  // Fetch player names for event display
  useEffect(() => {
    async function fetchPlayerNames() {
      if (!match) return;
      try {
        const [homeRes, awayRes] = await Promise.all([
          RostersService.getRoster({ maclb: match.maclb_nha, muagiai: match.muagiai, limit: 100 }),
          RostersService.getRoster({ maclb: match.maclb_khach, muagiai: match.muagiai, limit: 100 })
        ]);

        const homePlayers = Array.isArray(homeRes) ? homeRes : homeRes.data || [];
        const awayPlayers = Array.isArray(awayRes) ? awayRes : awayRes.data || [];

        const nameMap: Record<string, string> = {};
        [...homePlayers, ...awayPlayers].forEach((p: any) => {
          nameMap[p.macauthu] = p.cauthu?.hoten || p.tencauthu || p.macauthu;
        });

        setPlayerNames(nameMap);
      } catch (e) {
        console.error("Failed to fetch player names", e);
      }
    }
    fetchPlayerNames();
  }, [match]);

  // Update Score Handler
  const handleUpdateScore = async () => {
    if (!scoreHome || !scoreAway) return;
    try {
      await MatchesService.updateMatch({
        matran: match.matran,
        requestBody: { tiso: `${scoreHome}-${scoreAway}` }
      });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      alert("Đã cập nhật tỉ số!");
    } catch (e) {
      alert("Lỗi cập nhật tỉ số");
      console.error(e);
    }
  }

  // Add Event Handler
  const handleAddEvent = async (type: string, minute: number, playerId: string, clubId: string) => {
    try {
      await MatchEventsService.createEvent({
        matran: match.matran,
        requestBody: {
          masukien: `EVT_${generateId()}`,
          loaisukien: type,
          phutthidau: minute,
          macauthu: playerId,
          maclb: clubId
        }
      });
      refetchEvents();
      alert("Đã thêm sự kiện!");
    } catch (e) {
      alert("Lỗi thêm sự kiện");
      console.error(e);
    }
  }

  // Delete Event Handler
  const handleDeleteEvent = async (masukien: string) => {
    try {
      await MatchEventsService.deleteEvent({ matran: match.matran, masukien });
      refetchEvents();
    } catch (e) {
      alert("Lỗi xóa sự kiện");
    }
  }

  if (!match) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0 bg-gray-50 overflow-hidden">

        {/* Header */}
        <div className="bg-white p-6 border-b shadow-sm flex-shrink-0 z-10 relative">
          <div className="absolute top-4 right-12 z-20">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="admin-mode"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="admin-mode" className="text-sm font-medium text-gray-700 cursor-pointer">Admin Mode</label>
            </div>
          </div>

          <DialogHeader >
            <DialogTitle className="flex justify-center flex-col items-center gap-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vòng {match.vong} • {match.muagiai}</div>

              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <img src={`/images/clubs/${match.maclb_nha}.png`} className="w-16 h-16 object-contain" onError={(e) => e.currentTarget.src = "https://placehold.co/64?text=H"} />
                  <span className="font-bold text-lg">{match.ten_clb_nha || match.maclb_nha}</span>
                </div>
                <div className="text-5xl font-bold text-gray-800 flex items-center gap-4">
                  {isAdmin ? (
                    <>
                      <input
                        className="w-16 text-center border rounded p-1"
                        value={scoreHome}
                        onChange={e => setScoreHome(e.target.value)}
                        placeholder="0"
                      />
                      <span>-</span>
                      <input
                        className="w-16 text-center border rounded p-1"
                        value={scoreAway}
                        onChange={e => setScoreAway(e.target.value)}
                        placeholder="0"
                      />
                      <Button size="sm" onClick={handleUpdateScore}>Lưu</Button>
                    </>
                  ) : (
                    match.tiso || "vs"
                  )}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img src={`/images/clubs/${match.maclb_khach}.png`} className="w-16 h-16 object-contain" onError={(e) => e.currentTarget.src = "https://placehold.co/64?text=A"} />
                  <span className="font-bold text-lg">{match.ten_clb_khach || match.maclb_khach}</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {format(new Date(match.thoigianthidau), "HH:mm dd/MM/yyyy")}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {match.ten_san || match.masanvandong}</span>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 p-6">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="events">Diễn biến</TabsTrigger>
              <TabsTrigger value="stats">Thống kê</TabsTrigger>
              <TabsTrigger value="lineups">Đội hình</TabsTrigger>
              <TabsTrigger value="info">Thông tin</TabsTrigger>
            </TabsList>

            {/* TAB: EVENTS */}
            {/* TAB: EVENTS */}
            <TabsContent value="events" className="space-y-4">
              {/* Event List */}
              <div className="space-y-2">
                {events?.length === 0 && (
                  <div className="text-center text-gray-400 py-8">Chưa có sự kiện nào.</div>
                )}
                {events?.map((evt: any) => (
                  <div key={evt.masukien} className="flex items-center justify-between bg-white p-3 rounded shadow-sm border">
                    <div className="flex items-center gap-4">
                      <div className="font-bold text-blue-600 w-10">{evt.phutthidau}'</div>
                      <Badge variant="outline">{evt.loaisukien}</Badge>
                      <span className="font-medium">Cầu thủ: {playerNames[evt.macauthu] || evt.macauthu}</span>
                      <span className="text-gray-500 text-sm">({evt.maclb})</span>
                    </div>
                    {isAdmin && (
                      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteEvent(evt.masukien)}>
                        &times;
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Event Form (Admin Only) */}
              {/* Add Event Form (Admin Only) */}
              {isAdmin && (
                <AdminEventForm match={match} onAdd={handleAddEvent} />
              )}
            </TabsContent>

            {/* TAB: STATS */}
            <TabsContent value="stats">
              <div className="bg-white rounded-xl border p-6 space-y-6">
                <StatRow
                  label="Bàn thắng"
                  home={events?.filter((e: any) => e.loaisukien === 'BanThang' && (e.maclb === match.maclb_nha || e.maclb === match.maclbnha)).length.toString()}
                  away={events?.filter((e: any) => e.loaisukien === 'BanThang' && (e.maclb === match.maclb_khach || e.maclb === match.maclbkhach)).length.toString()}
                />
                <StatRow
                  label="Sút trúng đích"
                  home={events?.filter((e: any) => e.loaisukien === 'SutTrungDich' && (e.maclb === match.maclb_nha || e.maclb === match.maclbnha)).length.toString()}
                  away={events?.filter((e: any) => e.loaisukien === 'SutTrungDich' && (e.maclb === match.maclb_khach || e.maclb === match.maclbkhach)).length.toString()}
                />
                <StatRow
                  label="Sút ra ngoài"
                  home={events?.filter((e: any) => e.loaisukien === 'SutRaNgoai' && (e.maclb === match.maclb_nha || e.maclb === match.maclbnha)).length.toString()}
                  away={events?.filter((e: any) => e.loaisukien === 'SutRaNgoai' && (e.maclb === match.maclb_khach || e.maclb === match.maclbkhach)).length.toString()}
                />
                <StatRow
                  label="Phạt góc"
                  home={events?.filter((e: any) => e.loaisukien === 'PhatGoc' && (e.maclb === match.maclb_nha || e.maclb === match.maclbnha)).length.toString()}
                  away={events?.filter((e: any) => e.loaisukien === 'PhatGoc' && (e.maclb === match.maclb_khach || e.maclb === match.maclbkhach)).length.toString()}
                />
                <StatRow
                  label="Thẻ vàng"
                  home={events?.filter((e: any) => e.loaisukien === 'TheVang' && (e.maclb === match.maclb_nha || e.maclb === match.maclbnha)).length.toString()}
                  away={events?.filter((e: any) => e.loaisukien === 'TheVang' && (e.maclb === match.maclb_khach || e.maclb === match.maclbkhach)).length.toString()}
                />
                <StatRow
                  label="Thẻ đỏ"
                  home={events?.filter((e: any) => e.loaisukien === 'TheDo' && (e.maclb === match.maclb_nha || e.maclb === match.maclbnha)).length.toString()}
                  away={events?.filter((e: any) => e.loaisukien === 'TheDo' && (e.maclb === match.maclb_khach || e.maclb === match.maclbkhach)).length.toString()}
                />
                <StatRow
                  label="Phạm lỗi"
                  home={events?.filter((e: any) => e.loaisukien === 'PhamLoi' && (e.maclb === match.maclb_nha || e.maclb === match.maclbnha)).length.toString()}
                  away={events?.filter((e: any) => e.loaisukien === 'PhamLoi' && (e.maclb === match.maclb_khach || e.maclb === match.maclbkhach)).length.toString()}
                />
                <StatRow
                  label="Việt vị"
                  home={events?.filter((e: any) => e.loaisukien === 'VietVi' && (e.maclb === match.maclb_nha || e.maclb === match.maclbnha)).length.toString()}
                  away={events?.filter((e: any) => e.loaisukien === 'VietVi' && (e.maclb === match.maclb_khach || e.maclb === match.maclbkhach)).length.toString()}
                />
                <StatRow
                  label="Cứu thua"
                  home={events?.filter((e: any) => e.loaisukien === 'CuuThua' && (e.maclb === match.maclb_nha || e.maclb === match.maclbnha)).length.toString()}
                  away={events?.filter((e: any) => e.loaisukien === 'CuuThua' && (e.maclb === match.maclb_khach || e.maclb === match.maclbkhach)).length.toString()}
                />
              </div>
            </TabsContent>

            {/* TAB: LINEUPS */}
            <TabsContent value="lineups">
              <MatchLineupTab match={match} isAdmin={isAdmin} />
            </TabsContent>

            {/* TAB: INFO */}
            <TabsContent value="info">
              <MatchInfoTab match={match} isAdmin={isAdmin} />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function MatchInfoTab({ match, isAdmin }: { match: any, isAdmin: boolean }) {
  const [sokhangia, setSokhangia] = useState(match.sokhangia || 0);
  const [nhietdo, setNhietdo] = useState(match.nhietdo || 30);
  const queryClient = useQueryClient();

  // Fetch Referees
  const { data: referees, refetch: refetchRefs } = useQuery({
    queryKey: ['match-referees', match.matran],
    queryFn: () => MatchRefereesService.getReferees({ matran: match.matran }),
    enabled: !!match.matran
  });

  const handleSaveInfo = async () => {
    try {
      await MatchesService.updateMatch({
        matran: match.matran,
        requestBody: { sokhangia: Number(sokhangia), nhietdo: Number(nhietdo) }
      });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      alert("Đã cập nhật thông tin!");
    } catch (e) {
      alert("Lỗi cập nhật");
    }
  };

  const [newRefName, setNewRefName] = useState("");
  const [newRefRole, setNewRefRole] = useState("Trong Tai Chinh");

  const handleAddReferee = async () => {
    if (!newRefName) return;
    try {
      await MatchRefereesService.assignReferee({
        matran: match.matran,
        requestBody: { tentrongtai: newRefName, vitri: newRefRole }
      });
      setNewRefName("");
      refetchRefs();
    } catch (e) {
      alert("Lỗi thêm trọng tài");
    }
  };

  const handleRemoveReferee = async (name: string) => {
    if (!confirm("Xóa trọng tài này?")) return;
    try {
      await MatchRefereesService.removeReferee({
        matran: match.matran,
        tentrongtai: name
      });
      refetchRefs();
    } catch (e) {
      alert("Lỗi xóa trọng tài");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h4 className="font-bold border-b pb-2">Thông tin trận đấu</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Khán giả</label>
            {isAdmin ? (
              <input
                type="number"
                className="border rounded p-2 w-full"
                value={sokhangia}
                onChange={e => setSokhangia(e.target.value)}
              />
            ) : (
              <span className="font-medium">{match.sokhangia ? match.sokhangia.toLocaleString() : '---'}</span>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Nhiệt độ (°C)</label>
            {isAdmin ? (
              <input
                type="number"
                className="border rounded p-2 w-full"
                value={nhietdo}
                onChange={e => setNhietdo(e.target.value)}
              />
            ) : (
              <span className="font-medium">{match.nhietdo ? `${match.nhietdo}°C` : '---'}</span>
            )}
          </div>
        </div>
        {isAdmin && (
          <Button size="sm" onClick={handleSaveInfo} className="w-full mt-2">Lưu Thông Tin</Button>
        )}
      </div>

      {/* Referees */}
      <div className="space-y-4">
        <h4 className="font-bold border-b pb-2">Tổ Trọng Tài</h4>
        <div className="space-y-2">
          {referees?.length === 0 && <div className="text-gray-400 text-sm">Chưa có trọng tài.</div>}
          {referees?.map((ref: any) => (
            <div key={ref.tentrongtai} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <div>
                <span className="font-bold">{ref.tentrongtai}</span>
                <span className="text-xs text-gray-500 ml-2">({ref.vitri})</span>
              </div>
              {isAdmin && (
                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => handleRemoveReferee(ref.tentrongtai)}>&times;</Button>
              )}
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="flex gap-2 mt-2">
            <input
              className="border rounded p-2 flex-1 text-sm"
              placeholder="Tên trọng tài"
              value={newRefName}
              onChange={e => setNewRefName(e.target.value)}
            />
            <select
              className="border rounded p-2 text-sm"
              value={newRefRole}
              onChange={e => setNewRefRole(e.target.value)}
            >
              <option value="Trong Tai Chinh">Trọng Tài Chính</option>
              <option value="Trong Tai Phu">Trọng Tài Phụ</option>
              <option value="Trong Tai Thu Tu">Trọng Tài Thứ 4</option>
              <option value="VAR">VAR</option>
            </select>
            <Button size="sm" onClick={handleAddReferee}>Thêm</Button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatRow({ label, home, away }: { label: string, home: string, away: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-bold w-12 text-center">{home}</span>
      <span className="text-gray-500 font-medium flex-1 text-center uppercase text-xs tracking-wider">{label}</span>
      <span className="font-bold w-12 text-center">{away}</span>
    </div>
  )
}


function MatchLineupTab({ match, isAdmin }: { match: any, isAdmin: boolean }) {
  const { data: lineup, refetch } = useQuery({
    queryKey: ['match-lineup', match.matran],
    queryFn: () => MatchLineupService.getLineup({ matran: match.matran }),
    enabled: !!match.matran
  });

  const [addingTeam, setAddingTeam] = useState<'home' | 'away' | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [isStarter, setIsStarter] = useState(true);
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);

  // Fetch available players when adding
  useEffect(() => {
    if (!addingTeam) return;
    const fetchRoster = async () => {
      try {
        const clubId = addingTeam === 'home' ? match.maclb_nha : match.maclb_khach;
        const res = await RostersService.getRoster({ maclb: clubId, muagiai: match.muagiai, limit: 100 });
        const list = Array.isArray(res) ? res : res.data || [];
        setAvailablePlayers(list);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRoster();
  }, [addingTeam, match]);

  const handleAddPlayer = async () => {
    if (!selectedPlayer) return;
    try {
      await MatchLineupService.addPlayer({
        matran: match.matran,
        requestBody: {
          macauthu: selectedPlayer,
          maclb: addingTeam === 'home' ? match.maclb_nha : match.maclb_khach,
          duocxuatphat: isStarter,
          ladoitruong: false,
          vitri: "CT"
        }
      });
      setAddingTeam(null);
      setSelectedPlayer("");
      refetch();
    } catch (e: any) {
      alert("Lỗi thêm cầu thủ: " + (e.body?.detail || e.message));
    }
  };

  const handleRemovePlayer = async (macauthu: string) => {
    if (!confirm("Xóa cầu thủ khỏi đội hình?")) return;
    try {
      await MatchLineupService.removePlayer({ matran: match.matran, macauthu });
      refetch();
    } catch (e) {
      alert("Lỗi xóa cầu thủ");
    }
  };

  const renderTeamColumn = (teamKey: 'home' | 'away', teamName: string, clubId: string, players: any[]) => {
    const starters = players.filter((p: any) => p.duocxuatphat);
    const subs = players.filter((p: any) => !p.duocxuatphat);

    return (
      <div className="bg-white p-4 rounded-xl border flex-1">
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h4 className={`font-bold ${teamKey === 'home' ? 'text-blue-800' : 'text-red-800'}`}>{teamName}</h4>
          {isAdmin && (
            <Button size="sm" variant="outline" onClick={() => setAddingTeam(teamKey)}>+ Thêm</Button>
          )}
        </div>

        {/* Starters */}
        <div className="mb-4">
          <h5 className="text-xs font-bold uppercase text-gray-500 mb-2">Đội hình chính ({starters.length})</h5>
          <div className="space-y-1">
            {starters.map((p: any) => (
              <div key={p.macauthu} className="flex justify-between items-center text-sm p-1.5 hover:bg-gray-50 rounded border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold w-6 text-center bg-gray-100 rounded text-xs py-0.5">{p.soaothidau || '-'}</span>
                  <span>{p.tencauthu || p.macauthu}</span>
                  {p.ladoitruong && <span className="bg-yellow-400 text-[10px] px-1 rounded font-bold">C</span>}
                </div>
                {isAdmin && <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-700" onClick={() => handleRemovePlayer(p.macauthu)}>&times;</Button>}
              </div>
            ))}
          </div>
        </div>

        {/* Subs */}
        <div>
          <h5 className="text-xs font-bold uppercase text-gray-500 mb-2">Dự bị ({subs.length})</h5>
          <div className="space-y-1">
            {subs.map((p: any) => (
              <div key={p.macauthu} className="flex justify-between items-center text-sm p-1.5 hover:bg-gray-50 rounded border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold w-6 text-center bg-gray-100 rounded text-xs py-0.5">{p.soaothidau || '-'}</span>
                  <span className="text-gray-600">{p.tencauthu || p.macauthu}</span>
                </div>
                {isAdmin && <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-700" onClick={() => handleRemovePlayer(p.macauthu)}>&times;</Button>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Combine starting XI and substitutes into one array
  const allPlayers = [...(lineup?.starting_xi || []), ...(lineup?.substitutes || [])];

  const getPlayersByClub = (clubId: string) => {
    // Filter players belonging to this club
    return allPlayers.filter((p: any) => p.maclb === clubId);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {renderTeamColumn('home', match.ten_clb_nha || 'Home', match.maclb_nha, getPlayersByClub(match.maclb_nha))}
        {renderTeamColumn('away', match.ten_clb_khach || 'Away', match.maclb_khach, getPlayersByClub(match.maclb_khach))}
      </div>

      {/* Add Player Dialog */}
      {addingTeam && (
        <Dialog open={!!addingTeam} onOpenChange={() => setAddingTeam(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm cầu thủ - {addingTeam === 'home' ? match.ten_clb_nha : match.ten_clb_khach}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Chọn cầu thủ</label>
                <select
                  className="w-full border rounded p-2"
                  value={selectedPlayer}
                  onChange={e => setSelectedPlayer(e.target.value)}
                >
                  <option value="">-- Chọn --</option>
                  {availablePlayers.map((p: any) => (
                    <option key={p.macauthu} value={p.macauthu}>
                      {p.soaothidau} - {p.tencauthu || p.macauthu}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="starter"
                  checked={isStarter}
                  onChange={e => setIsStarter(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="starter">Đá chính (Starting XI)</label>
              </div>
              <Button onClick={handleAddPlayer} className="w-full">Thêm vào đội hình</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// --- Admin Event Form Component ---
function AdminEventForm({ match, onAdd }: { match: any, onAdd: (type: string, minute: number, playerId: string, clubId: string) => void }) {
  const [minute, setMinute] = useState("");
  const [type, setType] = useState("BanThang");
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [players, setPlayers] = useState<any[]>([]);

  // Fetch Rosters
  useEffect(() => {
    async function fetchPlayers() {
      try {
        // Fetch Home Roster
        const homeRes = await RostersService.getRoster({ maclb: match.maclb_nha, muagiai: match.muagiai, limit: 100 });
        const homePlayers = (Array.isArray(homeRes) ? homeRes : homeRes.data || []).map((p: any) => ({ ...p, team: 'home', teamName: match.ten_clb_nha }));

        // Fetch Away Roster
        const awayRes = await RostersService.getRoster({ maclb: match.maclb_khach, muagiai: match.muagiai, limit: 100 });
        const awayPlayers = (Array.isArray(awayRes) ? awayRes : awayRes.data || []).map((p: any) => ({ ...p, team: 'away', teamName: match.ten_clb_khach }));

        setPlayers([...homePlayers, ...awayPlayers]);
      } catch (e) {
        console.error("Failed to fetch rosters", e);
      }
    }
    if (match) fetchPlayers();
  }, [match]);

  const handleAdd = () => {
    if (!minute || !selectedPlayer) {
      alert("Vui lòng nhập phút và chọn cầu thủ");
      return;
    }

    const player = players.find(p => p.macauthu === selectedPlayer);
    if (!player) return;

    // Determine club ID based on player team
    const clubId = player.team === 'home' ? match.maclb_nha : match.maclb_khach;

    onAdd(type, parseInt(minute), selectedPlayer, clubId);

    // Reset form
    setMinute("");
  };

  return (
    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
      <h4 className="font-bold text-blue-800 mb-3">Thêm sự kiện mới</h4>
      <div className="grid grid-cols-4 gap-3 items-end">
        <div className="col-span-1">
          <label className="text-xs font-semibold block mb-1">Phút</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            placeholder="VD: 45"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
          />
        </div>
        <div className="col-span-1">
          <label className="text-xs font-semibold block mb-1">Loại</label>
          <select
            className="w-full border rounded p-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="BanThang">Bàn thắng</option>
            <option value="TheVang">Thẻ vàng</option>
            <option value="TheDo">Thẻ đỏ</option>
            <option value="PhatGoc">Phạt góc</option>
            <option value="SutTrungDich">Sút trúng đích</option>
            <option value="SutRaNgoai">Sút ra ngoài</option>
            <option value="PhamLoi">Phạm lỗi</option>
            <option value="VietVi">Việt vị</option>
            <option value="CuuThua">Cứu thua</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold block mb-1">Cầu thủ</label>
          <select
            className="w-full border rounded p-2"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
          >
            <option value="">-- Chọn cầu thủ --</option>
            {players.map(p => (
              <option key={p.macauthu} value={p.macauthu}>
                {p.tencauthu || p.macauthu} ({p.soaothidau}) - {p.teamName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-4 mt-2">
          <Button className="w-full" onClick={handleAdd}>
            Thêm Sự Kiện
          </Button>
        </div>
      </div>
    </div>
  )
}



// --- MAIN PAGE ---

function MatchCenterPage() {
  // Đọc season từ localStorage để sync với trang khác
  const getInitialSeason = () => {
    const saved = localStorage.getItem("selectedSeason");
    return saved || "2024-2025";
  };
  
  const [selectedSeason, setSelectedSeason] = useState<string>(getInitialSeason())
  const [selectedRound, setSelectedRound] = useState<string>("all")

  // Lưu season vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("selectedSeason", selectedSeason);
  }, [selectedSeason]);

  // Modal State
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 1. Fetch Seasons
  const { data: seasonsData } = useQuery({
    queryKey: ['seasons'],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 10 })
  })

  const seasonOptions = useMemo(() => {
    const list = Array.isArray(seasonsData) ? seasonsData : (seasonsData as any)?.data || [];
    return list.map((s: any) => s.muagiai).sort().reverse();
  }, [seasonsData]);

  // 2. Fetch Matches
  const { data: matchesData, isLoading } = useQuery({
    queryKey: ['matches', selectedSeason],
    queryFn: () => MatchesService.readMatches({ muagiai: selectedSeason, limit: 100 })
  })

  // 3. Process Logic
  const processedMatches = useMemo(() => {
    let list = Array.isArray(matchesData) ? matchesData : (matchesData as any)?.data || [];

    // Fix Mapping (Backend -> Frontend)
    list = list.map((m: any) => ({
      ...m,
      maclb_nha: m.maclb_nha || m.maclbnha,
      maclb_khach: m.maclb_khach || m.maclbkhach,
    }));

    // Filter by Round
    if (selectedRound !== "all") {
      list = list.filter((m: any) => String(m.vong) === selectedRound);
    }

    // Sort: Latest round first? Or earliest?
    // User probably wants to see upcoming. 
    // Let's sort by Date.
    return list.sort((a: any, b: any) => new Date(a.thoigianthidau).getTime() - new Date(b.thoigianthidau).getTime());

  }, [matchesData, selectedRound]);

  // Group by Round for "All" view
  const matchesByRound = useMemo(() => {
    const groups: Record<string, any[]> = {};
    processedMatches.forEach((m: any) => {
      const r = `Vòng ${m.vong}`;
      if (!groups[r]) groups[r] = [];
      groups[r].push(m);
    });
    return groups;
  }, [processedMatches]);

  const handleMatchClick = (match: any) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">

      {/* 1. HERO HEADER */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 text-white shadow-lg pb-12 pt-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 opacity-90 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-bold tracking-widest uppercase">Vietnam Professional Football</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">Match Center</h1>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10 inline-flex">
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-[180px] bg-white text-red-900 font-bold border-none h-10">
                <SelectValue placeholder="Chọn mùa giải" />
              </SelectTrigger>
              <SelectContent>
                {seasonOptions.length > 0 ? seasonOptions.map((s: string) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                )) : <SelectItem value="2024-2025">2024-2025</SelectItem>}
              </SelectContent>
            </Select>

            <Select value={selectedRound} onValueChange={setSelectedRound}>
              <SelectTrigger className="w-[180px] bg-black/20 text-white border-none h-10 hover:bg-black/30 transition-colors font-medium">
                <SelectValue placeholder="Chọn vòng đấu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vòng đấu</SelectItem>
                {Array.from({ length: 26 }, (_, i) => i + 1).map(r => (
                  <SelectItem key={String(r)} value={String(r)}>Vòng {r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">

        {isLoading ? (
          <div className="bg-white p-20 rounded-xl shadow-sm text-center">
            <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải dữ liệu trận đấu...</p>
          </div>
        ) : processedMatches.length === 0 ? (
          <div className="bg-white p-20 rounded-xl shadow-sm text-center border-dashed border-2">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <h3 className="text-xl font-bold text-gray-800">Không tìm thấy trận đấu</h3>
            <p className="text-gray-500 mt-2">Không có dữ liệu cho Mùa {selectedSeason} - Vòng {selectedRound === 'all' ? 'bất kỳ' : selectedRound}.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(matchesByRound).sort((a, b) => parseInt(a.replace('Vòng ', '')) - parseInt(b.replace('Vòng ', ''))).map((roundKey) => (
              <div key={roundKey} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 bg-white px-4 py-1 rounded shadow-sm border border-gray-100 inline-block">
                    {roundKey}
                  </h2>
                  <div className="h-px bg-gray-300 flex-1 opacity-50"></div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {matchesByRound[roundKey].map((match: any) => (
                    <MatchCard
                      key={match.matran}
                      match={match}
                      onClick={() => handleMatchClick(match)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. DETAIL MODAL */}
      <MatchDetailModal
        match={selectedMatch}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  )
}
