import { useQuery } from "@tanstack/react-query"
import { ClubsService } from "@/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "./Tabs/OverviewTab"
import { PlayersTab } from "./Tabs/PlayersTab"
import { StatsTab } from "./Tabs/StatsTab"
import { Loader2 } from "lucide-react"

interface TeamDetailProps {
  teamId: string;
  stadiumMap: Record<string, string>;
  muagiai: string;
}

export function TeamDetail({ teamId, stadiumMap, muagiai }: TeamDetailProps) {
  
  // Lấy chi tiết đội bóng
  const { data: team, isLoading } = useQuery({
    queryKey: ["club", teamId, muagiai],
    queryFn: () => ClubsService.getClub({ 
      clubId: teamId, 
      muagiai: muagiai
    }),
  })

  if (isLoading) return <div className="flex justify-center mt-10"><Loader2 className="animate-spin" /></div>
  
  if (!team) return <div>Không tìm thấy dữ liệu đội bóng.</div>

  // --- XỬ LÝ DỮ LIỆU AN TOÀN ---
  const teamData = team as any; 
  
  const tenClb = teamData.tenclb || teamData.ten_clb || "Tên Đội Bóng";
  const maSan = teamData.masanvandong || teamData.san_van_dong;
  const tenSan = stadiumMap[maSan] || maSan || "Chưa cập nhật sân";

  // Gộp tên sân hiển thị vào dữ liệu
  const enrichedTeamData = { ...teamData, ten_san_hien_thi: tenSan };
  // -----------------------------

  return (
    <div className="space-y-6">
      {/* Header: Tên và Logo */}
      <div className="flex items-center gap-4 border-b pb-4">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary shrink-0">
          {tenClb.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{tenClb}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            🏟 Sân nhà: <span className="font-medium text-foreground">{tenSan}</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-3">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="players">Cầu thủ</TabsTrigger>
          <TabsTrigger value="stats">Thống kê</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview">
            <OverviewTab team={enrichedTeamData} />
          </TabsContent>
          <TabsContent value="players">
            {/* Truyền muagiai xuống tab Cầu thủ */}
            <PlayersTab teamId={teamId} muagiai={muagiai} />
          </TabsContent>
          <TabsContent value="stats">
            <StatsTab teamId={teamId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
