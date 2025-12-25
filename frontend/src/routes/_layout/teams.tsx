import { useState, useMemo, useEffect } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { ClubsService, StadiumsService, SeasonManagementService } from "@/client"
import { TeamList } from "@/components/Teams/TeamList"
import { TeamDetail } from "@/components/Teams/TeamDetail"
import { Loader2, Filter } from "lucide-react"
// Import các component của Select (Shadcn UI)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute('/_layout/teams')({
  component: TeamsPage,
})

function TeamsPage() {
  // State: Mùa giải đang chọn (Mặc định là mùa hiện tại)
  const [selectedSeason, setSelectedSeason] = useState<string>("2024-2025")
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

  // 1. Lấy danh sách Mùa giải có trong hệ thống
  const { data: seasonsData } = useQuery({
    queryKey: ["seasons"],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 100 }),
  })

  const seasonList = useMemo(() => {
  // 1. Lấy dữ liệu thô
  const list = Array.isArray(seasonsData) 
    ? seasonsData 
    : (seasonsData as any)?.data || [];
  
  // 2. Sắp xếp tăng dần (Ascending) dựa trên chuỗi tên mùa giải
  // Dùng [...list] để tạo bản sao, tránh sửa đổi trực tiếp dữ liệu gốc
  return [...list].sort((a: any, b: any) => a.muagiai.localeCompare(b.muagiai));
}, [seasonsData]);

  // Tự động chọn mùa giải mới nhất nếu có dữ liệu và chưa chọn gì
  useEffect(() => {
    if (seasonList.length > 0 && !selectedSeason) {
        // Giả sử mùa mới nhất nằm đầu hoặc cuối, ở đây lấy phần tử đầu tiên
        setSelectedSeason(seasonList[0].muagiai); 
    }
  }, [seasonList, selectedSeason]);

  // 2. Lấy danh sách Đội bóng (Theo mùa giải đang chọn)
  const { data: clubs, isLoading: loadingClubs } = useQuery({
    queryKey: ["clubs", selectedSeason], // Thêm selectedSeason vào key để tự reload khi đổi mùa
    queryFn: () => ClubsService.getClubs({ limit: 100, muagiai: selectedSeason }),
    enabled: !!selectedSeason, // Chỉ chạy khi đã có mùa giải
  })

  // 3. Lấy danh sách Sân vận động (Theo mùa giải đang chọn)
  const { data: stadiums } = useQuery({
    queryKey: ["stadiums", selectedSeason],
    queryFn: () => StadiumsService.getStadiums({ limit: 100, muagiai: selectedSeason }),
    enabled: !!selectedSeason,
  })

  // Xử lý dữ liệu
  const clubsList = Array.isArray(clubs) ? clubs : (clubs as any)?.data || [];
  const stadiumsList = Array.isArray(stadiums) ? stadiums : (stadiums as any)?.data || [];

  // Map tên sân
  const stadiumMap = useMemo(() => {
    const map: Record<string, string> = {};
    stadiumsList.forEach((s: any) => {
      const id = s.masanvandong || s.MaSanVanDong; 
      const name = s.tensanvandong || s.TenSanVanDong;
      if (id) map[id] = name;
    });
    return map;
  }, [stadiumsList]);

  // Ghép tên sân vào đội
  const clubsWithStadiumName = clubsList.map((club: any) => ({
    ...club,
    ten_san_hien_thi: stadiumMap[club.masanvandong] || stadiumMap[club.MaSanVanDong] || club.masanvandong || "Chưa cập nhật sân"
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 gap-4">
      
      {/* --- PHẦN FILTER MÙA GIẢI --- */}
      <div className="flex items-center gap-2 bg-card p-3 rounded-lg border w-fit shadow-sm">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Mùa giải:</span>
        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue placeholder="Chọn mùa giải" />
          </SelectTrigger>
          <SelectContent>
            {seasonList.length > 0 ? (
              seasonList.map((s: any) => (
                <SelectItem key={s.muagiai} value={s.muagiai}>
                  {s.muagiai}
                </SelectItem>
              ))
            ) : (
              // Fallback nếu chưa có dữ liệu mùa giải từ API
              <SelectItem value="2024-2025">2024-2025</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Cột trái: Danh sách đội */}
        <div className="w-1/3 min-w-[300px] overflow-y-auto rounded-lg border bg-card">
          {loadingClubs ? (
             <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
          ) : (
            <TeamList 
              clubs={clubsWithStadiumName} 
              selectedId={selectedTeamId} 
              onSelect={setSelectedTeamId} 
            />
          )}
        </div>

        {/* Cột phải: Chi tiết đội */}
        <div className="flex-1 rounded-lg border bg-card p-6 overflow-y-auto">
          {selectedTeamId ? (
            <TeamDetail 
              teamId={selectedTeamId} 
              stadiumMap={stadiumMap}
              muagiai={selectedSeason} // Truyền mùa giải xuống component con
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Chọn một đội bóng để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
