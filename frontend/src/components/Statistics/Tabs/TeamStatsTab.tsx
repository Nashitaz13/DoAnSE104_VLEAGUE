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
  const bestDefense = [...teams].sort((a, b) => a.ban_thua - b.ban_thua).slice(0, 3); // Bàn thua tăng dần
  const bestAttack = [...teams].sort((a, b) => b.ban_thang - a.ban_thang).slice(0, 3); // Bàn thắng giảm dần
  const bestBalance = [...teams].sort((a, b) => (b.ban_thang - b.ban_thua) - (a.ban_thang - a.ban_thua)).slice(0, 3); // Hiệu số

  const renderTeamList = (list: any[], valueKey: string, label: string, colorClass: string) => (
      <div className="space-y-3">
          {list.length === 0 ? <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p> : null}
          {list.map((t, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-card border rounded-lg shadow-sm">
                  <div>
                      <div className="font-bold">{t.ten_clb || "CLB"}</div>
                      <div className="text-xs text-muted-foreground">{t.so_tran} trận</div>
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
      <Card className="bg-green-50/50 border-green-100">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-green-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4"/> Hàng thủ vững chắc nhất
            </CardTitle>
        </CardHeader>
        <CardContent>
            {renderTeamList(bestDefense, "ban_thua", "Bàn thua", "text-green-600")}
        </CardContent>
      </Card>

      {/* Hàng công */}
      <Card className="bg-blue-50/50 border-blue-100">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-blue-700 flex items-center gap-2">
                <Swords className="w-4 h-4"/> Hàng công sắc bén nhất
            </CardTitle>
        </CardHeader>
        <CardContent>
            {renderTeamList(bestAttack, "ban_thang", "Bàn thắng", "text-blue-600")}
        </CardContent>
      </Card>

      {/* Hiệu số */}
      <Card className="bg-purple-50/50 border-purple-100">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-purple-700 flex items-center gap-2">
                <Scale className="w-4 h-4"/> Cân bằng tấn công - thủ
            </CardTitle>
        </CardHeader>
        <CardContent>
             {/* Hiệu số phải tự tính hiển thị vì API có thể không trả về trực tiếp tên trường hieu_so */}
             <div className="space-y-3">
                {bestBalance.map((t, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-card border rounded-lg shadow-sm">
                        <div className="font-bold text-sm">{t.ten_clb}</div>
                        <div className="text-right text-purple-600">
                            <div className="font-bold text-lg">+{t.ban_thang - t.ban_thua}</div>
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
