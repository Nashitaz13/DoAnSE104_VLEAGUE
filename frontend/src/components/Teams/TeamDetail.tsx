import { useQuery } from "@tanstack/react-query"
import { Building2, Flag, MapPin, User, Users } from "lucide-react"
import { useState } from "react"
import { ClubsService, RostersService, StadiumsService } from "@/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayerDetailModal } from "./PlayerDetailModal"
import { StadiumDetail } from "./StadiumDetail"

// Dữ liệu giả lập HLV Trưởng (vì backend chưa có trường này)
const COACH_MAPPING: Record<string, string> = {
  "Hải Phòng": "Chu Đình Nghiêm",
  "Hà Nội": "Daiki Iwamasa",
  "Công An Hà Nội": "Kiatisuk Senamuang",
  "Nam Định": "Vũ Hồng Việt",
  "Thanh Hóa": "Velizar Popov",
  "Bình Dương": "Lê Huỳnh Đức",
  "Bình Định": "Bùi Đoàn Quang Huy",
  "Hồ Chí Minh": "Phùng Thanh Phương",
  "Hoàng Anh Gia Lai": "Vũ Tiến Thành",
  "Hà Tĩnh": "Nguyễn Thành Công",
  "Sông Lam Nghệ An": "Phan Như Thuật",
  "Quảng Nam": "Văn Sỹ Sơn",
  Viettel: "Nguyễn Đức Thắng",
  "Thể Công": "Nguyễn Đức Thắng",
  "Khánh Hòa": "Trần Trọng Bình",
  "Đà Nẵng": "Trương Việt Hoàng",
}

const getCoachName = (clubName: string | undefined) => {
  if (!clubName) return "Đang cập nhật"
  // Tìm HLV có tên CLB chứa trong tên CLB hiện tại (match tương đối)
  const found = Object.entries(COACH_MAPPING).find(([key]) =>
    clubName.includes(key),
  )
  return found ? found[1] : "Đang cập nhật"
}

const calculateAge = (dateString: string) => {
  if (!dateString) return "-"
  const birthDate = new Date(dateString)
  const ageDifMs = Date.now() - birthDate.getTime()
  const ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

interface TeamDetailProps {
  teamId: string
  stadiumMap: Record<string, string>
  muagiai: string
}

export function TeamDetail({ teamId, stadiumMap, muagiai }: TeamDetailProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)

  // 1. Gọi API lấy thông tin CLB
  const { data: clubInfo } = useQuery({
    queryKey: ["club", teamId, muagiai],
    queryFn: () => ClubsService.getClub({ clubId: teamId, muagiai }),
  })

  // 1.5 Gọi API lấy danh sách sân vận động để tìm thông tin sân
  const { data: stadiums } = useQuery({
    queryKey: ["stadiums", muagiai],
    queryFn: () => StadiumsService.getStadiums({ muagiai }),
    enabled: !!clubInfo?.masanvandong,
  })

  const stadiumInfo = Array.isArray(stadiums)
    ? stadiums.find((s: any) => s.masanvandong === clubInfo?.masanvandong)
    : (stadiums as any)?.data?.find(
        (s: any) => s.masanvandong === clubInfo?.masanvandong,
      )

  const fullClubInfo = clubInfo ? { ...clubInfo, ...stadiumInfo } : null

  // 2. Gọi API lấy danh sách cầu thủ cho mùa giải ĐANG CHỌN (BM3.2 - 3.3)
  const { data: roster, isLoading } = useQuery({
    queryKey: ["roster", teamId, muagiai],
    queryFn: () =>
      RostersService.getRoster({ maclb: teamId, muagiai: muagiai }),
    staleTime: 5 * 60 * 1000,
  })

  // 3. Gọi API lấy danh sách cầu thủ mùa 2025-2026 (DATA GỐC) để dự phòng
  const { data: rosterBackup } = useQuery({
    queryKey: ["roster", teamId, "2025-2026"],
    queryFn: () =>
      RostersService.getRoster({ maclb: teamId, muagiai: "2025-2026" }),
    enabled: muagiai !== "2025-2026", // Chỉ gọi khi không phải mùa này
  })

  // LOGIC FALLBACK: Nếu mùa hiện tại ít hơn 5 cầu thủ, dùng data backup (mùa 25-26)
  let players = Array.isArray(roster) ? roster : (roster as any)?.data || []
  const backupPlayers = Array.isArray(rosterBackup)
    ? rosterBackup
    : (rosterBackup as any)?.data || []

  if (players.length < 5 && backupPlayers.length > 0) {
    players = backupPlayers // Trám dữ liệu thật vào
  }

  // Nhóm theo vị trí
  const groupedPlayers = {
    GK: players.filter((p: any) => p.vitrithidau === "GK"),
    DF: players.filter((p: any) => p.vitrithidau === "DF"),
    MF: players.filter((p: any) => p.vitrithidau === "MF"),
    FW: players.filter((p: any) => p.vitrithidau === "FW"),
  }

  const renderPlayerRow = (p: any) => (
    <tr
      key={p.macauthu}
      className="border-b dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
      onClick={() => setSelectedPlayerId(p.macauthu)}
    >
      <td className="py-3 px-4 text-center">
        <span className="inline-block w-7 h-7 leading-7 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold text-xs shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors">
          {p.soaothidau}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-700 dark:group-hover:text-red-400">
          {p.tencauthu}
        </div>
        {p.noisinh && (
          <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" /> {p.noisinh}
          </div>
        )}
      </td>
      <td className="py-3 px-4 text-center hidden md:table-cell font-medium text-gray-700 dark:text-gray-300">
        {p.quoctich !== "Vietnam" ? (
          <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center gap-1">
            <Flag className="w-3 h-3" /> {p.quoctich}
          </span>
        ) : (
          <span className="text-gray-500 dark:text-gray-500">Việt Nam</span>
        )}
      </td>
      <td className="py-3 px-4 text-center hidden md:table-cell text-gray-600 dark:text-gray-400">
        {p.ngaysinh ? new Date(p.ngaysinh).toLocaleDateString("vi-VN") : "-"}
        <span className="block text-xs text-gray-400 dark:text-gray-600">
          ({calculateAge(p.ngaysinh)} tuổi)
        </span>
      </td>
      <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400 hidden lg:table-cell font-mono">
        {p.chieucao ? `${p.chieucao}` : "-"}
      </td>
      <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400 hidden lg:table-cell font-mono">
        {p.cannang ? `${p.cannang}` : "-"}
      </td>
    </tr>
  )

  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-500 dark:text-muted-foreground">
        Đang tải thông tin...
      </div>
    )

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-white dark:bg-card">
      <PlayerDetailModal
        playerId={selectedPlayerId}
        muagiai={muagiai}
        onClose={() => setSelectedPlayerId(null)}
      />

      {/* HEADER CLB (Mới thêm) */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-neutral-900 dark:to-neutral-800 text-white p-6 shrink-0 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Building2 className="w-64 h-64" />
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center text-2xl font-bold text-gray-800 dark:text-foreground shadow-xl border-4 border-gray-700 dark:border-neutral-700">
            {clubInfo?.tenclb
              ? clubInfo.tenclb.substring(0, 2).toUpperCase()
              : teamId.substring(0, 2)}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold uppercase tracking-wider">
              {clubInfo?.tenclb || teamId}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-300 dark:text-gray-400">
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <Building2 className="w-4 h-4" /> Sân vận động:{" "}
                <strong className="text-white ml-1">
                  {fullClubInfo?.tensanvandong ||
                    fullClubInfo?.tensan ||
                    stadiumMap?.[fullClubInfo?.masanvandong] ||
                    "Đang cập nhật"}
                </strong>
              </span>
              {/* Coach info placeholder if available or can be added */}
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <User className="w-4 h-4" /> HLV Trưởng:{" "}
                <strong className="text-white ml-1">
                  {(fullClubInfo as any)?.hlv ||
                    getCoachName(fullClubInfo?.tenclb)}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="squad"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-6 bg-white dark:bg-card border-b dark:border-border">
          <TabsList className="w-full justify-start h-12 p-0 bg-transparent border-b-0 rounded-none gap-8">
            <TabsTrigger
              value="squad"
              className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-600 dark:data-[state=active]:border-red-500 data-[state=active]:text-red-700 dark:data-[state=active]:text-red-400 rounded-none px-0 font-bold text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground"
            >
              Đội hình
            </TabsTrigger>
            <TabsTrigger
              value="stadium"
              className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-600 dark:data-[state=active]:border-red-500 data-[state=active]:text-red-700 dark:data-[state=active]:text-red-400 rounded-none px-0 font-bold text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground"
            >
              Sân vận động
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="squad"
          className="flex-1 flex flex-col overflow-hidden m-0 data-[state=inactive]:hidden"
        >
          <div className="bg-red-50 dark:bg-red-900/10 p-4 border-b border-red-100 dark:border-red-900/30 shrink-0 flex justify-between items-center">
            <h2 className="text-sm font-bold text-red-800 dark:text-red-400 flex items-center gap-2">
              <Users className="w-4 h-4" /> Danh sách cầu thủ đăng ký
            </h2>
            <p className="text-xs text-gray-600 dark:text-muted-foreground flex items-center gap-2">
              Mùa giải: <span className="font-bold">{muagiai}</span> •
              <span className="font-bold bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/30">
                {players.length} cầu thủ
              </span>
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-card">
            {players.length === 0 ? (
              <div className="text-center p-10 bg-gray-50 dark:bg-muted/20 rounded-lg border border-dashed dark:border-border text-gray-500 dark:text-muted-foreground">
                Chưa có dữ liệu cầu thủ cho mùa giải {muagiai}.
              </div>
            ) : (
              // Render từng nhóm vị trí
              Object.entries(groupedPlayers).map(
                ([pos, list]: [string, any[]]) =>
                  list.length > 0 && (
                    <div
                      key={pos}
                      className="bg-white dark:bg-card rounded-lg shadow-sm border dark:border-border overflow-hidden"
                    >
                      <div className="bg-gray-100 dark:bg-muted/50 px-4 py-2 font-bold text-gray-700 dark:text-foreground flex items-center gap-2 border-b dark:border-border">
                        {pos === "GK" && "Thủ Môn (Goalkeepers)"}
                        {pos === "DF" && "Hậu Vệ (Defenders)"}
                        {pos === "MF" && "Tiền Vệ (Midfielders)"}
                        {pos === "FW" && "Tiền Đạo (Forwards)"}
                        <span className="bg-white dark:bg-card text-xs px-2 py-0.5 rounded-full ml-auto border dark:border-border font-normal">
                          {list.length}
                        </span>
                      </div>
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 dark:bg-muted/30 text-gray-500 dark:text-muted-foreground text-xs uppercase border-b dark:border-border">
                          <tr>
                            <th className="py-2 px-4 text-center w-14">Số</th>
                            <th className="py-2 px-4">Họ tên / Nơi sinh</th>
                            <th className="py-2 px-4 text-center hidden md:table-cell">
                              Quốc tịch
                            </th>
                            <th className="py-2 px-4 text-center hidden md:table-cell">
                              Ngày sinh (Tuổi)
                            </th>
                            <th
                              className="py-2 px-4 text-center hidden lg:table-cell"
                              title="Chiều cao"
                            >
                              Cao (cm)
                            </th>
                            <th
                              className="py-2 px-4 text-center hidden lg:table-cell"
                              title="Cân nặng"
                            >
                              Nặng (kg)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                          {list.map(renderPlayerRow)}
                        </tbody>
                      </table>
                    </div>
                  ),
              )
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="stadium"
          className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-muted/20"
        >
          <StadiumDetail club={fullClubInfo} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
