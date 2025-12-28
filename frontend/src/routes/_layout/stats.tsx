import { useState, useMemo, useEffect } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { SeasonManagementService } from "@/client"
import { Filter, Loader2, Trophy, BarChart3, AlertTriangle, Users } from "lucide-react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import các Tab con
import { TopScorersTab } from "@/components/Statistics/Tabs/TopScorersTab"
import { DisciplineTab } from "@/components/Statistics/Tabs/DisciplineTab"
import { TeamStatsTab } from "@/components/Statistics/Tabs/TeamStatsTab"
import { MVPTab } from "@/components/Statistics/Tabs/MVPTab"

export const Route = createFileRoute('/_layout/stats')({
  component: StatisticsPage,
})

function StatisticsPage() {
  const [selectedSeason, setSelectedSeason] = useState<string>("2024-2025")

  // 1. Lấy danh sách Mùa giải
  const { data: seasonsData, isLoading: loadingSeasons } = useQuery({
    queryKey: ["seasons"],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 100 }),
  })

  // 2. Sắp xếp mùa giải
  const seasonList = useMemo(() => {
    const list = Array.isArray(seasonsData) ? seasonsData : (seasonsData as any)?.data || [];
    // Ensure 2024-2025 is in the list if not present
    const has2024 = list.find((s: any) => s.muagiai === "2024-2025");
    const finalList = has2024 ? list : [...list, { muagiai: "2024-2025" }];
    
    return [...finalList].sort((a: any, b: any) => b.muagiai.localeCompare(a.muagiai));
  }, [seasonsData]);


  if (loadingSeasons && !selectedSeason) {
      return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-xl border">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Thống kê giải đấu (BM7.1 - 7.5)</h1>
            <p className="text-muted-foreground mt-1">Các chỉ số chi tiết về cầu thủ và đội bóng mùa giải {selectedSeason}</p>
        </div>

        <div className="flex items-center gap-2 bg-background p-2 rounded-lg border shadow-sm">
            <Filter className="w-4 h-4 text-muted-foreground ml-2" />
            <span className="text-sm font-medium hidden sm:inline">Mùa giải:</span>
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-[140px] border-0 shadow-none focus:ring-0 font-bold">
                <SelectValue placeholder="Chọn mùa" />
            </SelectTrigger>
            <SelectContent>
                {seasonList.map((s: any) => (
                    <SelectItem key={s.muagiai} value={s.muagiai}>{s.muagiai}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
      </div>

      {/* Tabs Nội dung */}
      <Tabs defaultValue="scorers" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="scorers" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg gap-2">
             <Trophy className="w-4 h-4 text-yellow-500" /> Vua phá lưới
          </TabsTrigger>
          <TabsTrigger value="mvp" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg gap-2">
             <Users className="w-4 h-4 text-blue-500" /> Cầu thủ xuất sắc
          </TabsTrigger>
          <TabsTrigger value="discipline" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg gap-2">
             <AlertTriangle className="w-4 h-4 text-red-500" /> Kỷ luật & Thẻ phạt
          </TabsTrigger>
          <TabsTrigger value="teams" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg gap-2">
             <BarChart3 className="w-4 h-4 text-green-500" /> Thống kê đội
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[400px]">
             {/* BM7.1 - Vua phá lưới & BM7.2 - Vua kiến tạo (Merged here or separate) */}
             <TabsContent value="scorers" className="m-0">
                <TopScorersTab muagiai={selectedSeason} />
             </TabsContent>

             {/* BM7.4 - Cầu thủ xuất sắc nhất */}
             <TabsContent value="mvp" className="m-0">
                <MVPTab />
             </TabsContent>

             {/* BM7.3 - Thống kê thẻ phạt & BM7.5 - Cấm thi đấu */}
             <TabsContent value="discipline" className="m-0">
                <DisciplineTab muagiai={selectedSeason} />
             </TabsContent>

             <TabsContent value="teams" className="m-0">
                <TeamStatsTab muagiai={selectedSeason} />
             </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
