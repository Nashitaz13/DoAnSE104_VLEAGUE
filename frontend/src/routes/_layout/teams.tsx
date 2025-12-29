import { useState, useMemo, useEffect, useRef } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ClubsService, StadiumsService, SeasonManagementService, RostersService } from "@/client"
import { TeamList } from "@/components/Teams/TeamList"
import { TeamDetail } from "@/components/Teams/TeamDetail"
import { Loader2, Filter, Shield } from "lucide-react"
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
  const queryClient = useQueryClient();
  const prefetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sync với localStorage
  const [selectedSeason, setSelectedSeason] = useState<string>(() => {
    return localStorage.getItem("selectedSeason") || "2025-2026";
  });
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

  // 1. Lấy danh sách Mùa giải
  const { data: seasonsData } = useQuery({
    queryKey: ["seasons"],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 100 }),
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    refetchOnWindowFocus: false,
  })

  const seasonList = useMemo(() => {
    const listFromApi = Array.isArray(seasonsData) ? seasonsData : (seasonsData as any)?.data || [];
    const requiredSeasons = ["2025-2026", "2024-2025", "2023-2024"];
    const seasonSet = new Set(listFromApi.map((s: any) => s.muagiai));
    requiredSeasons.forEach(s => seasonSet.add(s));
    const mergedList = Array.from(seasonSet).map(s => ({ muagiai: s }));
    return mergedList.sort((a: any, b: any) => b.muagiai.localeCompare(a.muagiai));
  }, [seasonsData]);

  // Sync localStorage khi user chọn season
  useEffect(() => {
    if (selectedSeason) {
      localStorage.setItem("selectedSeason", selectedSeason);
    }
  }, [selectedSeason]);

  // 2. Query clubs
  const { data: clubs } = useQuery({
    queryKey: ["clubs", selectedSeason],
    queryFn: () => ClubsService.getClubs({ limit: 100, muagiai: selectedSeason }),
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    gcTime: 30 * 60 * 1000, // GC 30 phút
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  })

  const finalClubsData = useMemo(() => {
      const mainList = Array.isArray(clubs) ? clubs : (clubs as any)?.data || [];
      return mainList;
  }, [clubs]);

  // 3. Query stadiums
  const { data: stadiums } = useQuery({
    queryKey: ["stadiums", selectedSeason],
    queryFn: () => StadiumsService.getStadiums({ limit: 100, muagiai: selectedSeason }),
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    gcTime: 30 * 60 * 1000, // GC 30 phút
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  })

  const finalStadiumsData = useMemo(() => {
      const mainList = Array.isArray(stadiums) ? stadiums : (stadiums as any)?.data || [];
      return mainList;
  }, [stadiums]);

  // 4. Tạo Map ánh xạ (Mã -> Tên) theo backend field
  const stadiumMap = useMemo(() => {
    const map: Record<string, string> = {};
    finalStadiumsData.forEach((s: any) => {
      const id = s.masanvandong; // Backend field chính xác
      const name = s.tensanvandong || s.ten_san || id; // Ưu tiên tensanvandong
      if (id) map[id] = name;
    });
    return map;
  }, [finalStadiumsData]);

  // Ghép tên sân vào đội bóng

  // Prefetch on hover (debounced)
  const handleTeamHover = (teamId: string) => {
    if (prefetchTimeoutRef.current) clearTimeout(prefetchTimeoutRef.current);
    
    prefetchTimeoutRef.current = setTimeout(() => {
      // Prefetch roster
      queryClient.prefetchQuery({
        queryKey: ['roster', teamId, selectedSeason],
        queryFn: () => RostersService.getRoster({ maclb: teamId, muagiai: selectedSeason }),
        staleTime: 5 * 60 * 1000,
      });
      
      // Prefetch club info
      queryClient.prefetchQuery({
        queryKey: ['club', teamId, selectedSeason],
        queryFn: () => ClubsService.getClub({ club_id: teamId, muagiai: selectedSeason }),
        staleTime: 5 * 60 * 1000,
      });
    }, 150); // Debounce 150ms
  };
  const clubsWithStadiumName = useMemo(() => {
      return finalClubsData.map((club: any) => ({
        ...club,
        ten_san_hien_thi: stadiumMap[club.masanvandong] || club.masanvandong || "Chưa cập nhật sân"
      }));
  }, [finalClubsData, stadiumMap]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 gap-6 bg-gray-50">
      
      {/* HEADER & FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold text-red-800 flex items-center gap-2">
                  <Shield className="w-8 h-8"/> Hồ sơ CLB & Cầu thủ (BM3.1 - 3.3)
              </h1>
              <p className="text-gray-500 text-sm mt-1">Tra cứu thông tin chi tiết các đội bóng tham dự</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
            <Filter className="w-4 h-4 text-gray-500 ml-2" />
            <span className="text-sm font-semibold text-gray-700">Mùa giải:</span>
            <Select value={selectedSeason} onValueChange={(val) => {
                setSelectedSeason(val);
                setSelectedTeamId(null); 
            }}>
                <SelectTrigger className="w-[160px] h-9 border-none bg-gray-100 focus:ring-0 font-bold text-red-700">
                <SelectValue placeholder="Chọn mùa giải" />
                </SelectTrigger>
                <SelectContent>
                {seasonList.map((s: any) => (
                    <SelectItem key={s.muagiai} value={s.muagiai} className="font-medium">
                    {s.muagiai}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
          </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* CỘT TRÁI: DANH SÁCH ĐỘI */}
        <div className="w-1/3 min-w-[320px] max-w-[400px] flex flex-col bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700 flex justify-between items-center">
                <span>Danh sách ({clubsWithStadiumName.length})</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {clubsWithStadiumName.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-500">
                       {/* Nếu đang loading cả chính và backup */}
                       <Loader2 className="animate-spin w-6 h-6" /> Đang tải...
                    </div>
                ) : (
                    <TeamList 
                        clubs={clubsWithStadiumName} 
                        selectedId={selectedTeamId} 
                        onSelect={setSelectedTeamId} 
                    />
                )}
            </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT ĐỘI */}
        <div className="flex-1 bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
          {selectedTeamId ? (
            <TeamDetail 
              teamId={selectedTeamId} 
              stadiumMap={stadiumMap}
              muagiai={selectedSeason} 
            />
          ) : (
            <div className="flex flex-col h-full items-center justify-center text-gray-400 bg-gray-50/50">
              <Shield className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Chọn một đội bóng để xem hồ sơ chi tiết (BM3.1)</p>
              <p className="text-sm">Và danh sách cầu thủ (BM3.2 - 3.3)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}