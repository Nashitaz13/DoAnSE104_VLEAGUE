import { useQuery } from "@tanstack/react-query"
import { StatisticsService } from "@/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertTriangle, Ban } from "lucide-react"

export function DisciplineTab({ muagiai }: { muagiai: string }) {
  const { data: discipline, isLoading } = useQuery({
    queryKey: ["discipline", muagiai],
    queryFn: () => StatisticsService.getDiscipline({ muagiai, limit: 10 })
  })

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>

  const list = (discipline as any)?.leaderboard || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Cột 1: Thẻ phạt nhiều nhất */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-red-600">
            <AlertTriangle className="w-5 h-5" /> Thẻ phạt nhiều nhất
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
           {list.length === 0 ? <p className="text-muted-foreground text-sm">Chưa có dữ liệu thẻ phạt</p> : null}
           {list.map((p: any, idx: number) => (
             <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50">
                <div className="flex items-center gap-3">
                   <span className="font-mono text-muted-foreground w-4">{idx + 1}</span>
                   <div>
                      <div className="font-bold text-sm">{p.tencauthu}</div>
                      <div className="text-xs text-muted-foreground">{p.tenclb || "CLB"}</div>
                   </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex flex-col items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
                        <span className="font-bold text-yellow-700 dark:text-yellow-400">{p.yellow_cards}</span>
                        <div className="w-3 h-4 bg-yellow-400 dark:bg-yellow-500 rounded-sm"></div>
                    </div>
                    <div className="flex flex-col items-center bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                        <span className="font-bold text-red-700 dark:text-red-400">{p.red_cards}</span>
                        <div className="w-3 h-4 bg-red-500 dark:bg-red-600 rounded-sm"></div>
                    </div>
                </div>
             </div>
           ))}
        </CardContent>
      </Card>

      {/* Cột 2: Cầu thủ bị treo giò (Logic này Backend chưa có, tạm thời Mockup giao diện) */}
      <Card className="md:col-span-2 lg:col-span-1 border-red-200 bg-red-50/20 dark:border-red-900/50 dark:bg-red-900/10 transition-colors duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-red-600 dark:text-red-400">
            <Ban className="w-5 h-5" /> Cầu thủ bị treo giò (Dự kiến)
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-sm text-muted-foreground italic text-center py-10">
                Chức năng đang phát triển... <br/>
                (Sẽ hiển thị danh sách cầu thủ nghỉ thi đấu vòng tới)
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
