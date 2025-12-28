import { useQuery } from "@tanstack/react-query"
import { StatisticsService } from "@/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Medal, Zap } from "lucide-react"

export function TopScorersTab({ muagiai }: { muagiai: string }) {
  const { data: awards, isLoading } = useQuery({
    queryKey: ["awards", muagiai],
    queryFn: () => StatisticsService.getAwards({ muagiai, limit: 10 })
  })

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>

  const data = awards as any;
  const scorers = data?.top_scorers || [];
  const assists = data?.top_assists || [];

  const renderList = (list: any[], valueKey: string, unit: string) => (
    <div className="space-y-3">
      {list.length === 0 ? <p className="text-muted-foreground text-sm">Chưa có dữ liệu</p> : null}
      {list.map((player, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`
              w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm transition-colors duration-300
              ${index === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : 
                index === 1 ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" : 
                index === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : "bg-card border dark:bg-muted/20"}
            `}>
              {index + 1}
            </div>
            <div>
              <div className="font-bold text-sm">{player.tencauthu}</div>
              <div className="text-xs text-muted-foreground">{player.tenclb || "CLB"}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-primary text-lg">{player[valueKey]}</div>
            <div className="text-xs text-muted-foreground">{unit}</div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Medal className="w-5 h-5 text-yellow-500" /> Bảng xếp hạng Vua phá lưới
          </CardTitle>
        </CardHeader>
        <CardContent>{renderList(scorers, "value", "Bàn thắng")}</CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="w-5 h-5 text-blue-500" /> Kiến tạo xuất sắc
          </CardTitle>
        </CardHeader>
        <CardContent>{renderList(assists, "value", "kiến tạo")}</CardContent>
      </Card>
    </div>
  )
}
