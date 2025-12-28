import { useQuery } from "@tanstack/react-query"
import { StandingsService } from "@/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShieldCheck, Swords, Scale } from "lucide-react"

export function TeamStatsTab({ muagiai }: { muagiai: string }) {
  const { data: standingsData, isLoading } = useQuery({
    queryKey: ["standings", muagiai],
    queryFn: () => StandingsService.getStandings({ muagiai })
  })

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>

  const teams = (standingsData as any)?.standings || [];
  
  // Logic xử lý dữ liệu
  const bestDefense = [...teams].sort((a, b) => a.goals_against - b.goals_against).slice(0, 3); // Bàn thua tăng dần
  const bestAttack = [...teams].sort((a, b) => b.goals_for - a.goals_for).slice(0, 3); // Bàn thắng giảm dần
  const bestBalance = [...teams].sort((a, b) => b.goal_difference - a.goal_difference).slice(0, 3); // Hiệu số

  const renderTeamList = (list: any[], valueKey: string, label: string, colorClass: string) => (
      <div className="space-y-3">
          {list.length === 0 ? <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p> : null}
          {list.map((t, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-card dark:bg-card/50 border rounded-lg shadow-sm hover:bg-muted/50 transition-colors">
                  <div>
                      <div className="font-bold text-foreground">{t.tenclb || "CLB"}</div>
                      <div className="text-xs text-muted-foreground">{t.matches_played} trận</div>
                  </div>
                  <div className={`text-right ${colorClass}`}>
                      <div className="font-bold text-lg">{t[valueKey]}</div>
                      <div className="text-[10px] uppercase font-semibold text-muted-foreground">{label}</div>
                  </div>
              </div>
          ))}
      </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Hàng thủ */}
      <Card className="bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30 transition-colors duration-300">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4"/> Hàng thủ vững chắc nhất
            </CardTitle>
        </CardHeader>
        <CardContent>
            {renderTeamList(bestDefense, "goals_against", "Bàn thua", "text-green-600 dark:text-green-400")}
        </CardContent>
      </Card>

      {/* Hàng công */}
      <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30 transition-colors duration-300">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Swords className="w-4 h-4"/> Hàng công sắc bén nhất
            </CardTitle>
        </CardHeader>
        <CardContent>
            {renderTeamList(bestAttack, "goals_for", "Bàn thắng", "text-blue-600 dark:text-blue-400")}
        </CardContent>
      </Card>

      {/* Hiệu số */}
      <Card className="bg-purple-50/50 border-purple-100 dark:bg-purple-900/10 dark:border-purple-900/30 transition-colors duration-300">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2">
                <Scale className="w-4 h-4"/> Cân bằng tấn công - thủ
            </CardTitle>
        </CardHeader>
        <CardContent>
             {/* Hiệu số phải tự tính hiển thị vì API có thể không trả về trực tiếp tên trường hieu_so */}
             <div className="space-y-3">
                {bestBalance.map((t, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-card dark:bg-card/50 border rounded-lg shadow-sm hover:bg-muted/50 transition-colors">
                        <div className="font-bold text-sm text-foreground">{t.tenclb}</div>
                        <div className="text-right text-purple-600 dark:text-purple-400">
                            <div className="font-bold text-lg">{t.goal_difference > 0 ? "+" : ""}{t.goal_difference}</div>
                            <div className="text-[10px] uppercase font-semibold text-muted-foreground">Hiệu số</div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
