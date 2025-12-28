import { useQuery } from "@tanstack/react-query"
import { RostersService } from "@/client"
import { Users, CheckCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StadiumDetail } from "./StadiumDetail"

const calculateAge = (dateString: string) => {
  if (!dateString) return "-";
  const birthDate = new Date(dateString);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

interface TeamDetailProps {
  teamId: string;
  club: any;
  muagiai: string;
  stadiumMap?: Record<string, string>; // Optional now
}

export function TeamDetail({ teamId, club, muagiai }: TeamDetailProps) {
  
  // 1. Gọi API lấy danh sách cầu thủ cho mùa giải ĐANG CHỌN
  const { data: roster, isLoading } = useQuery({
    queryKey: ['roster', teamId, muagiai],
    queryFn: () => RostersService.getRoster({ maclb: teamId, muagiai: muagiai }),
    staleTime: 5 * 60 * 1000,
  })

  // 2. Gọi API lấy danh sách cầu thủ mùa 2025-2026 (DATA GỐC) để dự phòng
  const { data: rosterBackup } = useQuery({
    queryKey: ['roster', teamId, '2025-2026'],
    queryFn: () => RostersService.getRoster({ maclb: teamId, muagiai: '2025-2026' }),
    enabled: muagiai !== '2025-2026' // Chỉ gọi khi không phải mùa này
  })

  // LOGIC FALLBACK: Nếu mùa hiện tại ít hơn 5 cầu thủ, dùng data backup (mùa 25-26)
  let players = Array.isArray(roster) ? roster : (roster as any)?.data || [];
  const backupPlayers = Array.isArray(rosterBackup) ? rosterBackup : (rosterBackup as any)?.data || [];

  if (players.length < 5 && backupPlayers.length > 0) {
      players = backupPlayers; // Trám dữ liệu thật vào
  }

  // Nhóm theo vị trí
  const groupedPlayers = {
    GK: players.filter((p: any) => p.vitrithidau === 'GK'),
    DF: players.filter((p: any) => p.vitrithidau === 'DF'),
    MF: players.filter((p: any) => p.vitrithidau === 'MF'),
    FW: players.filter((p: any) => p.vitrithidau === 'FW'),
  };

  const renderPlayerRow = (p: any) => (
    <tr key={p.macauthu} className="border-b hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors dark:border-border">
        <td className="py-3 px-4 text-center">
            <span className="inline-block w-7 h-7 leading-7 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100 font-bold text-xs shadow-sm">
                {p.soaothidau}
            </span>
        </td>
        <td className="py-3 px-4">
            <div className="font-semibold text-gray-900 dark:text-foreground">{p.tencauthu}</div>
            {p.noisinh && <div className="text-xs text-gray-400 dark:text-muted-foreground">{p.noisinh}</div>}
        </td>
        <td className="py-3 px-4 text-center hidden md:table-cell font-medium text-gray-700 dark:text-muted-foreground">{p.quoctich}</td>
        <td className="py-3 px-4 text-center hidden md:table-cell text-gray-600 dark:text-muted-foreground">{calculateAge(p.ngaysinh)}</td>
        <td className="py-3 px-4 text-center text-gray-600 dark:text-muted-foreground hidden lg:table-cell font-mono">
            {p.chieucao ? `${p.chieucao}` : "-"}
        </td>
        <td className="py-3 px-4 text-center text-gray-600 dark:text-muted-foreground hidden lg:table-cell font-mono">
            {p.cannang ? `${p.cannang}` : "-"}
        </td>
    </tr>
  );

  if (isLoading) return <div className="p-10 text-center text-muted-foreground">Đang tải thông tin...</div>;

  return (
    <Tabs defaultValue="players" className="flex flex-col h-full overflow-hidden">
      
      {/* Header Area (Fixed) */}
      <div className="bg-red-50 dark:bg-red-900/10 p-6 border-b border-red-100 dark:border-red-900 shrink-0">
         <div className="flex justify-between items-center mb-4">
             <div>
                <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-1 flex items-center gap-2">
                    {club?.tenclb || "Thông tin CLB"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                    Mùa giải: <span className="font-bold">{muagiai}</span>
                </p>
             </div>
         </div>
         
         <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
             <TabsTrigger value="players">Danh sách thành viên</TabsTrigger>
             <TabsTrigger value="stadium">Sân vận động</TabsTrigger>
         </TabsList>
      </div>

      {/* Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-card">
          <TabsContent value="players" className="mt-0 p-6 space-y-8 min-h-full">
               <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-muted-foreground">
                  <Users className="w-4 h-4"/> 
                  Số lượng: <span className="font-bold bg-white dark:bg-card px-2 py-0.5 rounded border border-red-200 dark:border-red-800">{players.length}</span>
                  {muagiai !== '2025-2026' && players.length > 5 && (
                       <span className="text-xs text-blue-600 dark:text-blue-400 italic flex items-center gap-1 ml-2">
                           <CheckCircle className="w-3 h-3"/> Dữ liệu 2025-2026
                       </span>
                   )}
               </div>

               <div className="space-y-8 pb-10">
                  {players.length === 0 ? (
                      <div className="text-center p-10 bg-gray-50 dark:bg-muted/50 rounded-lg border border-dashed border-border text-muted-foreground">
                      Chưa có dữ liệu cầu thủ cho mùa giải {muagiai}.
                      </div>
                  ) : (
                      // Render từng nhóm vị trí
                      Object.entries(groupedPlayers).map(([pos, list]: [string, any[]]) => (
                          list.length > 0 && (
                              <div key={pos} className="bg-white dark:bg-card rounded-lg shadow-sm border dark:border-border overflow-hidden">
                                  <div className="bg-gray-100 dark:bg-muted px-4 py-2 font-bold text-gray-700 dark:text-foreground flex items-center gap-2 border-b dark:border-border">
                                      {pos === 'GK' && "Thủ Môn (Goalkeepers)"}
                                      {pos === 'DF' && "Hậu Vệ (Defenders)"}
                                      {pos === 'MF' && "Tiền Vệ (Midfielders)"}
                                      {pos === 'FW' && "Tiền Đạo (Forwards)"}
                                      <span className="bg-white dark:bg-card text-xs px-2 py-0.5 rounded-full ml-auto border dark:border-border font-normal">
                                          {list.length}
                                      </span>
                                  </div>
                                  <table className="w-full text-sm text-left">
                                      <thead className="bg-gray-50/50 dark:bg-muted/50 text-gray-500 dark:text-muted-foreground text-xs uppercase border-b dark:border-border">
                                          <tr>
                                              <th className="py-2 px-4 text-center w-14">Số</th>
                                              <th className="py-2 px-4">Họ tên / Nơi sinh</th>
                                              <th className="py-2 px-4 text-center hidden md:table-cell">Quốc tịch</th>
                                              <th className="py-2 px-4 text-center hidden md:table-cell">Tuổi</th>
                                              <th className="py-2 px-4 text-center hidden lg:table-cell" title="Chiều cao">Cao (cm)</th>
                                              <th className="py-2 px-4 text-center hidden lg:table-cell" title="Cân nặng">Nặng (kg)</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100 dark:divide-border">
                                          {list.map(renderPlayerRow)}
                                      </tbody>
                                  </table>
                              </div>
                          )
                      ))
                  )}
               </div>
          </TabsContent>
          
          <TabsContent value="stadium" className="h-full overflow-y-auto pr-2">
              <StadiumDetail club={club} />
          </TabsContent>
      </div>
    </Tabs>
  )
}