import { useState, useEffect } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { 
  SeasonManagementService, 
  MatchesService, 
  StandingsService, 
  StatisticsService 
} from "@/client"
import { Loader2, Calendar, Trophy, ChevronRight, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Route = createFileRoute('/_layout/')({
  component: HomePage,
})

function HomePage() {
  const [currentSeason, setCurrentSeason] = useState<string>("")

  // 1. Lấy danh sách mùa giải
  const { data: seasonsData } = useQuery({
    queryKey: ["seasons"],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 100 }),
  })

  // 2. Logic chọn mùa giải "Hiện tại"
  useEffect(() => {
    const list = Array.isArray(seasonsData) ? seasonsData : (seasonsData as any)?.data || [];
    if (list.length > 0) {
      const sorted = [...list].sort((a: any, b: any) => a.muagiai.localeCompare(b.muagiai));
      setCurrentSeason(sorted[sorted.length - 1].muagiai);
    }
  }, [seasonsData]);

  // 3. Gọi các API dữ liệu theo mùa giải đã chọn
  const { data: matchesData } = useQuery({
    queryKey: ["matches", currentSeason],
    queryFn: () => MatchesService.getMatches({ muagiai: currentSeason, limit: 100 }),
    enabled: !!currentSeason
  })

  const { data: standingsData } = useQuery({
    queryKey: ["standings", currentSeason],
    queryFn: () => StandingsService.getStandings({ muagiai: currentSeason }),
    enabled: !!currentSeason
  })

  const { data: awardsData } = useQuery({
    queryKey: ["awards", currentSeason],
    queryFn: () => StatisticsService.getAwards({ muagiai: currentSeason, limit: 5 }),
    enabled: !!currentSeason
  })

  // --- XỬ LÝ DỮ LIỆU HIỂN THỊ ---
  const allMatches = Array.isArray(matchesData) ? matchesData : (matchesData as any)?.data || [];
  
  const recentMatches = allMatches
    .filter((m: any) => {
       const hasScore = m.ketqua && typeof m.ketqua === 'string' && m.ketqua.includes("-");
       const isFinishedStatus = m.trangthai === "DaKetThuc" || m.trangthai === "Finished";
       
       return isFinishedStatus || hasScore;
    })
    .sort((a: any, b: any) => {
      return new Date(b.ngaythi_dau).getTime() - new Date(a.ngaythi_dau).getTime();
    })
    .slice(0, 3);

  const upcomingMatches = allMatches
    .filter((m: any) => {
        const noScore = !m.ketqua || m.ketqua === "";
        const isScheduled = m.trangthai === "SapDienRa" || m.trangthai === "Scheduled";
        return isScheduled || noScore;
    })
    .sort((a: any, b: any) => {
        return new Date(a.ngaythi_dau).getTime() - new Date(b.ngaythi_dau).getTime();
    })
    .slice(0, 3);

  const standings = (standingsData as any)?.standings?.slice(0, 5) || [];
  const topScorers = (awardsData as any)?.top_scorers?.slice(0, 5) || [];

  if (!currentSeason) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- HERO BANNER --- */}
      <div 
        className="relative text-white py-20 px-6 overflow-hidden bg-[url('/bg-stadium.jpg')] bg-cover bg-center bg-no-repeat"
      >
        <div className="absolute inset-0 bg-red-950/80 mix-blend-multiply z-0"></div>
        
        <div className="relative container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <div className="space-y-4 text-center md:text-left">
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
              V-League 1 <br/> <span className="text-red-300">{currentSeason}</span>
            </h1>
            <p className="text-red-100 max-w-lg text-lg drop-shadow-md">
              Giải đấu bóng đá hàng đầu Việt Nam với sự tham gia của các đội bóng mạnh nhất cả nước.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
              {/* NÚT 1: LỊCH THI ĐẤU */}
              <Link to="/fixtures"> 
                <Button 
                  size="lg" 
                  className="bg-white text-red-700 hover:bg-gray-100 font-bold gap-2 shadow-lg min-w-[160px]"
                >
                  <Calendar className="w-5 h-5" /> Xem Lịch thi đấu
                </Button>
              </Link>

              {/* NÚT 2: BẢNG XẾP HẠNG */}
              <Link to="/league-table">
                <Button 
                  size="lg" 
                  className="bg-white text-red-700 hover:bg-gray-100 font-bold gap-2 shadow-lg min-w-[160px]"
                >
                  <Trophy className="w-5 h-5" /> Bảng xếp hạng
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block w-1/2 max-w-md">
             <img 
               src="/vleague.png" 
               alt="V-League Logo" 
               className="w-full drop-shadow-2xl opacity-90"
             />
          </div>
        </div>
      </div>

      {/* --- NỘI DUNG CHÍNH --- */}
      <div className="container mx-auto p-6 max-w-6xl space-y-10 -mt-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột Trái: Kết quả gần nhất */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between bg-white/90 p-2 rounded-lg backdrop-blur-sm shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2">⚡ Kết quả gần nhất</h2>
              <Link to="/fixtures" className="text-sm text-primary hover:underline flex items-center">
                Xem tất cả <ArrowRight className="w-4 h-4 ml-1"/>
            </Link>
          </div>
            
            <div className="grid gap-4">
              {recentMatches.length > 0 ? recentMatches.map((m: any) => (
                <Card key={m.matran} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0 flex flex-col sm:flex-row">
                    <div className="flex-1 flex items-center justify-between p-4 bg-gradient-to-r from-background to-muted/20">
                      <div className="flex items-center gap-3 w-1/3">
                        <div className="font-bold text-base truncate text-right w-full">{m.clbnha}</div>
                      </div>
                      <div className="flex flex-col items-center justify-center w-1/3 px-2">
                         <div className="text-2xl font-black text-primary bg-primary/10 px-4 py-1 rounded-full">
                            {m.ketqua}
                         </div>
                         <span className="text-xs text-muted-foreground mt-1">Đã kết thúc</span>
                      </div>
                      <div className="flex items-center gap-3 w-1/3 justify-end">
                        <div className="font-bold text-base truncate text-left w-full">{m.clbkhach}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="text-center p-8 bg-card rounded-lg border text-muted-foreground">Chưa có kết quả trận đấu nào.</div>
              )}
            </div>
          </div>

          {/* Cột Phải: Lịch sắp tới */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/90 p-2 rounded-lg">
               <h2 className="text-xl font-bold">📅 Sắp diễn ra</h2>
               <Link to="/fixtures" className="text-sm text-primary hover:underline">Chi tiết</Link>
            </div>
            
            <div className="grid gap-3">
              {upcomingMatches.length > 0 ? upcomingMatches.map((m: any) => (
                <Card key={m.matran} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center text-sm font-semibold mb-2">
                       <span>{m.clbnha}</span>
                       <span className="text-muted-foreground text-xs">VS</span>
                       <span>{m.clbkhach}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 border-t pt-2">
                       <Calendar className="w-3 h-3"/> {new Date(m.ngaythi_dau).toLocaleDateString('vi-VN')}
                       <span className="mx-1">•</span>
                       <MapPin className="w-3 h-3"/> {m.sanvandong || "Sân nhà"}
                    </div>
                  </CardContent>
                </Card>
              )) : (
                 <div className="text-center p-8 bg-card rounded-lg border text-muted-foreground">Không có trận sắp tới.</div>
              )}
            </div>
          </div>
        </div>

        {/* --- BXH & VUA PHÁ LƯỚI --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" /> Bảng xếp hạng (Top 5)
                    </CardTitle>
                    <Link to="/league-table">
                        <Button variant="ghost" size="sm" className="gap-1">Xem đầy đủ <ChevronRight className="w-4 h-4"/></Button>
                    </Link>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 w-[60px] text-center">#</th>
                                    <th className="px-4 py-3">Câu lạc bộ</th>
                                    <th className="px-4 py-3 text-center">Trận</th>
                                    <th className="px-4 py-3 text-center">HS</th>
                                    <th className="px-4 py-3 text-center font-bold">Điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standings.length > 0 ? (
                                  standings.map((team: any, idx: number) => {
                                      // 1. Ép kiểu về số và mặc định là 0 nếu dữ liệu lỗi/null
                                      const banThang = Number(team.ban_thang) || 0;
                                      const banThua = Number(team.ban_thua) || 0;
                                      
                                      // 2. Tính hiệu số
                                      const hieuSo = banThang - banThua;
                                      
                                      // 3. Xử lý hiển thị (Tránh NaN tuyệt đối)
                                      // Nếu hieuSo dương thêm dấu +, nếu là NaN thì hiện 0
                                      const isValidNumber = !isNaN(hieuSo);
                                      const hieuSoDisplay = isValidNumber 
                                          ? (hieuSo > 0 ? `+${hieuSo}` : hieuSo) 
                                          : 0;

                                      return (
                                          <tr key={team.maclb} className="border-b last:border-0 hover:bg-muted/20">
                                              <td className="px-4 py-3 text-center font-bold">
                                                  {idx === 0 ? <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center mx-auto">1</span> : idx + 1}
                                              </td>
                                              <td className="px-4 py-3 font-medium">
                                                  <div className="flex items-center gap-2">
                                                      <span>{team.ten_clb || "CLB"}</span>
                                                      {idx < 1 && <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded">ACL</span>}
                                                  </div>
                                              </td>
                                              <td className="px-4 py-3 text-center text-muted-foreground">{team.so_tran || 0}</td>
                                              {/* Hiển thị biến đã xử lý an toàn */}
                                              <td className="px-4 py-3 text-center text-muted-foreground font-medium">{hieuSoDisplay}</td>
                                              <td className="px-4 py-3 text-center font-bold text-primary text-base">{team.diem || 0}</td>
                                          </tr>
                                      )
                                  })
                              ) : (
                                  <tr>
                                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                                          {/* Hiển thị thông báo nhẹ nhàng khi API lỗi */}
                                          Chưa có dữ liệu (Vui lòng kiểm tra kết nối API)
                                      </td>
                                  </tr>
                              )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">⚽ Vua phá lưới</CardTitle>
                    <Link to="/stats">
                         <Button variant="ghost" size="sm" className="gap-1">Chi tiết <ChevronRight className="w-4 h-4"/></Button>
                    </Link>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {topScorers.map((p: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                                    {idx + 1}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{p.tencauthu}</div>
                                    <div className="text-xs text-muted-foreground">{p.clb || "CLB"}</div>
                                </div>
                            </div>
                            <div className="font-bold text-primary">{p.ban_thang}</div>
                        </div>
                    ))}
                    {topScorers.length === 0 && <p className="text-center text-muted-foreground text-sm">Chưa có dữ liệu</p>}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}