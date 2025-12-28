import { useState, useMemo } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { 
  Trophy, Filter, 
  Shield, Loader2, Target, Award
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { StandingsService, SeasonManagementService } from "@/client"

export const Route = createFileRoute('/_layout/league-table')({
  component: LeagueTablePage,
})

function LeagueTablePage() {
  // Mặc định chọn 2024-2025
  const [selectedSeason, setSelectedSeason] = useState<string>("2024-2025")

  // 1. Lấy danh sách Mùa giải
  const { data: seasonsData } = useQuery({
    queryKey: ["seasons"],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 100 }),
  })

  const seasonList = useMemo(() => {
    const listFromApi = Array.isArray(seasonsData) ? seasonsData : (seasonsData as any)?.data || [];
    const requiredSeasons = ["2025-2026", "2024-2025", "2023-2024"];
    const seasonSet = new Set(listFromApi.map((s: any) => s.muagiai));
    requiredSeasons.forEach(s => seasonSet.add(s));
    return Array.from(seasonSet)
        .map(s => ({ muagiai: s }))
        .sort((a: any, b: any) => b.muagiai.localeCompare(a.muagiai));
  }, [seasonsData]);

  // 2. Lấy Bảng xếp hạng
  const { data: standingsData, isLoading } = useQuery({
    queryKey: ['standings', selectedSeason],
    queryFn: () => StandingsService.getStandings({ muagiai: selectedSeason })
  })

  // Xử lý dữ liệu BXH
  const rankings = useMemo(() => {
      let list = Array.isArray(standingsData) 
        ? standingsData 
        : (standingsData as any)?.standings || (standingsData as any)?.data || [];
      
      return [...list].sort((a: any, b: any) => {
          const diemA = a.points ?? a.diem ?? 0;
          const diemB = b.points ?? b.diem ?? 0;
          
          const btA = a.goals_for ?? a.banthang ?? 0;
          const bbA = a.goals_against ?? a.banthua ?? 0;
          const hsA = (a.goal_difference ?? a.goal_diff) ?? (btA - bbA);

          const btB = b.goals_for ?? b.banthang ?? 0;
          const bbB = b.goals_against ?? b.banthua ?? 0;
          const hsB = (b.goal_difference ?? b.goal_diff) ?? (btB - bbB);

          if (diemB !== diemA) return diemB - diemA; // Điểm cao xếp trước
          if (hsB !== hsA) return hsB - hsA;         // Hiệu số cao xếp trước
          return btB - btA;                          // Bàn thắng nhiều xếp trước
      });
  }, [standingsData]);

  // Thống kê Summary
  const stats = useMemo(() => {
    if (!rankings || rankings.length === 0) return null;

    const normalized = rankings.map((team: any) => ({
        team: team.tenclb || team.maclb,
        matches_played: team.matches_played ?? team.matches ?? team.sotran ?? team.vong ?? 0,
        won: team.won ?? team.wins ?? team.thang ?? 0,
        goals_for: team.goals_for ?? team.banthang ?? 0,
        goals_against: team.goals_against ?? team.banthua ?? 0,
        goal_difference: (team.goal_difference ?? team.goal_diff) ?? ((team.goals_for ?? team.banthang ?? 0) - (team.goals_against ?? team.banthua ?? 0)),
    }));

    // Chỉ tính các đội đã đá ít nhất 1 trận để tránh 0/0
    const playedTeams = normalized.filter((t: any) => t.matches_played > 0);
    const pool = playedTeams.length > 0 ? playedTeams : normalized;

    const bestAttack = [...pool].sort((a: any, b: any) => b.goals_for - a.goals_for)[0];
    const bestDefense = [...pool].sort((a: any, b: any) => a.goals_against - b.goals_against)[0];
    const bestGoalDiff = [...pool].sort((a: any, b: any) => b.goal_difference - a.goal_difference)[0];

    return { bestAttack, bestDefense, bestGoalDiff };
  }, [rankings]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-background font-sans pb-10 transition-colors duration-300">
      
      {/* HEADER CAM */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-900 dark:to-red-900 text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-4">
            <Trophy className="w-16 h-16 text-yellow-300 drop-shadow-md" />
            <div>
                <h1 className="text-4xl font-bold uppercase tracking-wide">Bảng Xếp Hạng</h1>
                <p className="text-orange-100 dark:text-orange-200/80 mt-2 text-lg">V-League 1 • Mùa giải {selectedSeason}</p>
            </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto w-full px-4 -mt-8">
        
        {/* THANH CÔNG CỤ */}
        <div className="bg-card rounded-t-xl shadow-sm border-b p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-sm"></span> AFC Champions League
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-sm"></span> Xuống hạng
                </div>
            </div>

            <div className="flex items-center gap-3 bg-muted p-1.5 rounded-lg border">
                <Filter className="w-4 h-4 text-muted-foreground ml-2" />
                <span className="text-sm font-semibold text-foreground">Mùa giải:</span>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                    <SelectTrigger className="w-[140px] h-8 border-none bg-background shadow-sm font-bold text-red-700 dark:text-red-400">
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

        {/* BẢNG XẾP HẠNG */}
        <div className="bg-card rounded-b-xl shadow-md overflow-hidden border border-border">
            {isLoading ? (
                <div className="p-20 text-center flex flex-col items-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mb-2 text-red-600"/>
                    Đang tính toán bảng xếp hạng...
                </div>
            ) : rankings.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center text-muted-foreground">
                    <Shield className="w-16 h-16 mb-4 opacity-20"/>
                    <h3 className="text-lg font-bold text-foreground">Chưa có dữ liệu xếp hạng</h3>
                    <p>Mùa giải {selectedSeason} chưa có trận đấu nào diễn ra.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-4 py-4 text-center w-16">Hạng</th>
                                <th className="px-4 py-4 w-1/3 min-w-[200px]">Câu Lạc Bộ</th>
                                <th className="px-4 py-4 text-center" title="Số trận đã đấu">Trận</th>
                                <th className="px-4 py-4 text-center">Thắng</th>
                                <th className="px-4 py-4 text-center">Hòa</th>
                                <th className="px-4 py-4 text-center">Thua</th>
                                <th className="px-4 py-4 text-center" title="Bàn thắng">BT</th>
                                <th className="px-4 py-4 text-center" title="Bàn thua">BB</th>
                                <th className="px-4 py-4 text-center" title="Hiệu số">HS</th>
                                <th className="px-4 py-4 text-center w-24">Điểm</th>
                                <th className="px-4 py-4 text-center">Phong độ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {rankings.map((team: any, index: number) => {
                                const rank = index + 1;
                                const isTop = rank <= 3;
                                const isBottom = rank >= rankings.length - 1 && rankings.length > 5;
                                
                                const soTran = team.matches_played ?? team.matches ?? team.sotran ?? team.vong ?? 0;
                                const thang = team.won ?? team.wins ?? team.thang ?? 0;
                                const hoa = team.drawn ?? team.draws ?? team.hoa ?? 0;
                                const thua = team.lost ?? team.losses ?? team.thua ?? 0;
                                const bt = team.goals_for ?? team.banthang ?? 0;
                                const bb = team.goals_against ?? team.banthua ?? 0;
                                const hs = (team.goal_difference ?? team.goal_diff) ?? (bt - bb);
                                const diem = team.points ?? team.diem ?? 0;

                                return (
                                    <tr key={team.maclb} className={`hover:bg-muted/50 transition-colors ${isTop ? 'bg-green-500/10' : ''} ${isBottom ? 'bg-red-500/10' : ''}`}>
                                        <td className="px-4 py-4 text-center relative">
                                            {isTop && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>}
                                            {isBottom && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>}
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                                                rank === 1 ? 'bg-yellow-400 text-yellow-900 ring-2 ring-yellow-200' : 
                                                rank === 2 ? 'bg-muted text-foreground' :
                                                rank === 3 ? 'bg-orange-500/50 text-orange-900 dark:text-orange-100' : 'text-muted-foreground'
                                            }`}>
                                                {rank}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center font-bold text-muted-foreground text-xs shrink-0">
                                                    {team.tenclb ? team.tenclb.substring(0,2).toUpperCase() : team.maclb.substring(0,2)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground text-base">{team.tenclb || team.maclb}</div>
                                                    {rank <= 1 && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">AFC Champions League</span>}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-center font-medium text-foreground">{soTran}</td>
                                        <td className="px-4 py-4 text-center text-green-600 dark:text-green-400 font-medium">{thang}</td>
                                        <td className="px-4 py-4 text-center text-muted-foreground">{hoa}</td>
                                        <td className="px-4 py-4 text-center text-red-600 dark:text-red-400">{thua}</td>
                                        <td className="px-4 py-4 text-center text-muted-foreground">{bt}</td>
                                        <td className="px-4 py-4 text-center text-muted-foreground">{bb}</td>
                                        <td className="px-4 py-4 text-center font-bold text-foreground">
                                            {hs > 0 ? `+${hs}` : hs}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="text-lg font-bold text-blue-700 dark:text-blue-400">{diem}</span>
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                {(() => {
                                                    let forms: string[] = [];
                                                    if (team.form && typeof team.form === 'string') {
                                                        forms = team.form.split('');
                                                    } else {
                                                        // Fallback nếu không có dữ liệu form từ backend
                                                        const w = Array(thang).fill('W');
                                                        const d = Array(hoa).fill('D');
                                                        const l = Array(thua).fill('L');
                                                        forms = [...w, ...d, ...l].slice(0, 5);
                                                    }
                                                    
                                                    if (forms.length === 0) return <span className="text-muted-foreground">-</span>;

                                                    return forms.map((type, idx) => (
                                                        <Badge key={idx} type={type as 'W' | 'D' | 'L'} />
                                                    ));
                                                })()}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* STATISTICS SUMMARY */}
        {stats && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-green-600">
                   <Target className="h-5 w-5" />
                   Đội ghi bàn nhiều nhất
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-center">
                   <div className="text-2xl font-bold text-green-600">{stats.bestAttack.team}</div>
                   <div className="text-lg">{stats.bestAttack.goals_for} bàn thắng</div>
                   <div className="text-sm text-muted-foreground">Trung bình {(stats.bestAttack.matches_played > 0 ? stats.bestAttack.goals_for / stats.bestAttack.matches_played : 0).toFixed(1)} bàn/trận</div>
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-blue-600">
                   <Award className="h-5 w-5" />
                   Thủ môn xuất sắc nhất
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-center">
                   <div className="text-2xl font-bold text-blue-600">{stats.bestDefense.team}</div>
                   <div className="text-lg">{stats.bestDefense.goals_against} bàn thua</div>
                   <div className="text-sm text-muted-foreground">Trung bình {(stats.bestDefense.matches_played > 0 ? stats.bestDefense.goals_against / stats.bestDefense.matches_played : 0).toFixed(1)} bàn/trận</div>
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-purple-600">
                   <Trophy className="h-5 w-5" />
                   Hiệu số cao nhất
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-center">
                   <div className="text-2xl font-bold text-purple-600">{stats.bestGoalDiff.team}</div>
                   <div className="text-lg">{stats.bestGoalDiff.goal_difference > 0 ? '+' : ''}{stats.bestGoalDiff.goal_difference} hiệu số</div>
                   <div className="text-sm text-muted-foreground">{stats.bestGoalDiff.goals_for} BT / {stats.bestGoalDiff.goals_against} BB</div>
                 </div>
               </CardContent>
             </Card>
           </div>
        )}
      </div>
    </div>
  )
}

function Badge({ type }: { type: 'W' | 'D' | 'L' }) {
    const color = type === 'W' ? 'bg-green-500' : type === 'D' ? 'bg-gray-400' : 'bg-red-500';
    return (
        <span className={`${color} text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full`}>
            {type}
        </span>
    )
}