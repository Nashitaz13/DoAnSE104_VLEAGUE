import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { AlertTriangle, Filter, Loader2, Shield } from "lucide-react"
import { useMemo, useState } from "react"
import {
  ClubsService,
  SeasonManagementService,
  StadiumsService,
} from "@/client"
import { TeamDetail } from "@/components/Teams/TeamDetail"
import { TeamList } from "@/components/Teams/TeamList"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute("/_layout/teams")({
  component: TeamsPage,
})

function TeamsPage() {
  // Mặc định chọn 2025-2026
  const [selectedSeason, setSelectedSeason] = useState<string>("2025-2026")
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [_viewMode, _setViewMode] = useState<"teams" | "stadiums">("teams")

  // 1. Lấy danh sách Mùa giải (Gộp API + Hardcode)
  const { data: seasonsData } = useQuery({
    queryKey: ["seasons"],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 100 }),
  })

  const seasonList = useMemo(() => {
    const listFromApi = Array.isArray(seasonsData)
      ? seasonsData
      : (seasonsData as any)?.data || []
    const requiredSeasons = ["2025-2026", "2024-2025", "2023-2024"]
    const seasonSet = new Set(listFromApi.map((s: any) => s.muagiai))
    requiredSeasons.forEach((s) => {
      seasonSet.add(s)
    })
    const mergedList = Array.from(seasonSet).map((s) => ({ muagiai: s }))
    return mergedList.sort((a: any, b: any) =>
      b.muagiai.localeCompare(a.muagiai),
    )
  }, [seasonsData])

  // --- PHẦN XỬ LÝ ĐỘI BÓNG (CLUBS) ---
  const { data: clubs } = useQuery({
    queryKey: ["clubs", selectedSeason],
    queryFn: () =>
      ClubsService.getClubs({ limit: 100, muagiai: selectedSeason }),
  })

  const { data: clubsBackup } = useQuery({
    queryKey: ["clubs", "2024-2025"],
    queryFn: () => ClubsService.getClubs({ limit: 100, muagiai: "2024-2025" }),
    enabled:
      selectedSeason === "2025-2026" &&
      (!clubs || (clubs as any).data?.length === 0),
  })

  const finalClubsData = useMemo(() => {
    const mainList = Array.isArray(clubs) ? clubs : (clubs as any)?.data || []
    const backupList = Array.isArray(clubsBackup)
      ? clubsBackup
      : (clubsBackup as any)?.data || []
    if (mainList.length > 0) return mainList
    if (selectedSeason === "2025-2026" && backupList.length > 0)
      return backupList
    return []
  }, [clubs, clubsBackup, selectedSeason])

  // --- PHẦN XỬ LÝ SÂN VẬN ĐỘNG (STADIUMS) - THÊM FALLBACK TẠI ĐÂY ---

  // 1. Gọi API lấy sân của mùa giải hiện tại
  const { data: stadiums } = useQuery({
    queryKey: ["stadiums", selectedSeason],
    queryFn: () =>
      StadiumsService.getStadiums({ limit: 100, muagiai: selectedSeason }),
  })

  // 2. Gọi API lấy sân dự phòng (Mùa 2024-2025) nếu mùa 2025-2026 bị rỗng
  const { data: stadiumsBackup } = useQuery({
    queryKey: ["stadiums", "2024-2025"],
    queryFn: () =>
      StadiumsService.getStadiums({ limit: 100, muagiai: "2024-2025" }),
    enabled:
      selectedSeason === "2025-2026" &&
      (!stadiums || (stadiums as any).data?.length === 0),
  })

  // 3. Chọn danh sách sân để dùng
  const finalStadiumsData = useMemo(() => {
    const mainList = Array.isArray(stadiums)
      ? stadiums
      : (stadiums as any)?.data || []
    const backupList = Array.isArray(stadiumsBackup)
      ? stadiumsBackup
      : (stadiumsBackup as any)?.data || []

    // Nếu API chính có dữ liệu -> Dùng ngay
    if (mainList.length > 0) return mainList

    // Nếu API chính rỗng (lỗi mùa 25-26) -> Dùng backup 24-25 để map tên
    if (selectedSeason === "2025-2026" && backupList.length > 0)
      return backupList

    return []
  }, [stadiums, stadiumsBackup, selectedSeason])

  // 4. Tạo Map ánh xạ (Mã -> Tên & Sức chứa)
  const stadiumMap = useMemo(() => {
    const map: Record<string, any> = {}
    finalStadiumsData.forEach((s: any) => {
      const id = s.masanvandong || s.MaSanVanDong
      const name = s.tensanvandong || s.TenSanVanDong || s.tensan
      const capacity = s.succhua || s.SucChua || s.suc_chua // Thêm trường sức chứa
      const address = s.diachisvd || s.DiaChiSVD || s.dia_chi_san // Thêm địa chỉ
      const fifa = s.danhgiafifa || s.DanhGiaFIFA || s.tieu_chuan // Thêm đánh giá FIFA
      if (id) {
        map[id] = { name, capacity, address, fifa }
      }
    })
    return map
  }, [finalStadiumsData])

  // Ghép tên sân vào đội bóng
  const clubsWithStadiumName = useMemo(() => {
    return finalClubsData.map((club: any) => {
      const stadiumInfo =
        stadiumMap[club.masanvandong] || stadiumMap[club.MaSanVanDong]
      return {
        ...club,
        ten_san_hien_thi:
          stadiumInfo?.name || club.masanvandong || "Chưa cập nhật sân",
        suc_chua_san: stadiumInfo?.capacity || club.suc_chua_san, // Ưu tiên lấy từ bảng Sân
        dia_chi_san: stadiumInfo?.address || club.dia_chi_san, // Ưu tiên lấy từ bảng Sân
        danh_gia_fifa: stadiumInfo?.fifa || club.danh_gia_fifa, // Ưu tiên lấy từ bảng Sân
        danhgiafifa: stadiumInfo?.fifa || club.danhgiafifa, // Fallback
      }
    })
  }, [finalClubsData, stadiumMap])

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 gap-6 bg-gray-50 dark:bg-background">
      {/* HEADER & FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-red-800 flex items-center gap-2">
            <Shield className="w-8 h-8" /> Hồ sơ CLB & Cầu thủ (BM3.1 - 3.3)
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tra cứu thông tin chi tiết các đội bóng tham dự
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-card p-2 rounded-lg border shadow-sm">
          <Filter className="w-4 h-4 text-muted-foreground ml-2" />
          <span className="text-sm font-semibold text-foreground">
            Mùa giải:
          </span>
          <Select
            value={selectedSeason}
            onValueChange={(val) => {
              setSelectedSeason(val)
              setSelectedTeamId(null)
            }}
          >
            <SelectTrigger className="w-[160px] h-9 border-none bg-gray-100 dark:bg-muted focus:ring-0 font-bold text-red-700 dark:text-red-400">
              <SelectValue placeholder="Chọn mùa giải" />
            </SelectTrigger>
            <SelectContent>
              {seasonList.map((s: any) => (
                <SelectItem
                  key={s.muagiai}
                  value={s.muagiai}
                  className="font-medium"
                >
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
        <div className="w-1/3 min-w-[320px] max-w-[400px] flex flex-col bg-white dark:bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50 dark:bg-muted font-semibold text-foreground flex justify-between items-center">
            <span>Danh sách ({clubsWithStadiumName.length})</span>
            {/* Chỉ báo fallback data */}
            {selectedSeason === "2025-2026" &&
              finalClubsData === (clubsBackup as any)?.data && (
                <span
                  className="text-[10px] bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 px-2 py-0.5 rounded-full flex items-center gap-1"
                  title="Dữ liệu được lấy từ mùa trước do chưa cập nhật"
                >
                  <AlertTriangle className="w-3 h-3" /> Fallback
                </span>
              )}
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {clubsWithStadiumName.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
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
        <div className="flex-1 bg-white dark:bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col">
          {selectedTeamId ? (
            <TeamDetail
              teamId={selectedTeamId}
              stadiumMap={stadiumMap}
              muagiai={selectedSeason}
            />
          ) : (
            <div className="flex flex-col h-full items-center justify-center text-muted-foreground bg-gray-50/50 dark:bg-muted/50">
              <Shield className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">
                Chọn một đội bóng để xem hồ sơ chi tiết (BM3.1)
              </p>
              <p className="text-sm">Và danh sách cầu thủ (BM3.2 - 3.3)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
