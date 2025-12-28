import { useQuery } from "@tanstack/react-query"
import { RostersService } from "@/client"
import { Users, CheckCircle, Flag, MapPin, User, CalendarDays } from "lucide-react"

const calculateAge = (dateString: string) => {
  if (!dateString) return "-";
  const birthDate = new Date(dateString);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

interface TeamDetailProps {
  teamId: string;
  stadiumMap: Record<string, string>;
  muagiai: string;
}

export function TeamDetail({ teamId, stadiumMap, muagiai }: TeamDetailProps) {
  
  // 1. Gọi API lấy danh sách cầu thủ cho mùa giải ĐANG CHỌN (BM3.2 - 3.3)
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
    <tr key={p.macauthu} className="border-b hover:bg-gray-50 transition-colors">
        <td className="py-3 px-4 text-center">
            <span className="inline-block w-7 h-7 leading-7 rounded-full bg-red-100 text-red-700 font-bold text-xs shadow-sm">
                {p.soaothidau}
            </span>
        </td>
        <td className="py-3 px-4">
            <div className="font-semibold text-gray-900">{p.tencauthu}</div>
            {p.noisinh && <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3"/> {p.noisinh}</div>}
        </td>
        <td className="py-3 px-4 text-center hidden md:table-cell font-medium text-gray-700">
             {p.quoctich !== 'Vietnam' ? (
                 <span className="text-purple-600 font-bold flex items-center justify-center gap-1"><Flag className="w-3 h-3"/> {p.quoctich}</span>
             ) : (
                 <span className="text-gray-500">Việt Nam</span>
             )}
        </td>
        <td className="py-3 px-4 text-center hidden md:table-cell text-gray-600">
            {p.ngaysinh ? new Date(p.ngaysinh).toLocaleDateString("vi-VN") : "-"}
            <span className="block text-xs text-gray-400">({calculateAge(p.ngaysinh)} tuổi)</span>
        </td>
        <td className="py-3 px-4 text-center text-gray-600 hidden lg:table-cell font-mono">
            {p.chieucao ? `${p.chieucao}` : "-"}
        </td>
        <td className="py-3 px-4 text-center text-gray-600 hidden lg:table-cell font-mono">
            {p.cannang ? `${p.cannang}` : "-"}
        </td>
    </tr>
  );

  if (isLoading) return <div className="p-10 text-center text-gray-500">Đang tải thông tin...</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-red-50 p-6 border-b border-red-100 shrink-0">
         <h2 className="text-xl font-bold text-red-800 mb-1 flex items-center gap-2">
            <Users className="w-5 h-5"/> Danh sách cầu thủ đăng ký (BM3.3)
         </h2>
         <p className="text-sm text-gray-600 flex items-center gap-2">
            Mùa giải: <span className="font-bold">{muagiai}</span> • 
            Số lượng: <span className="font-bold bg-white px-2 py-0.5 rounded border border-red-200">{players.length}</span>
         </p>
         
         {muagiai !== '2025-2026' && players.length > 5 && (
             <p className="text-xs text-blue-600 mt-2 italic flex items-center gap-1">
                 <CheckCircle className="w-3 h-3"/> Đang hiển thị đội hình chuẩn (dựa trên dữ liệu 2025-2026)
             </p>
         )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {players.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed text-gray-500">
               Chưa có dữ liệu cầu thủ cho mùa giải {muagiai}.
            </div>
        ) : (
            // Render từng nhóm vị trí
            Object.entries(groupedPlayers).map(([pos, list]: [string, any[]]) => (
                list.length > 0 && (
                    <div key={pos} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="bg-gray-100 px-4 py-2 font-bold text-gray-700 flex items-center gap-2 border-b">
                            {pos === 'GK' && "Thủ Môn (Goalkeepers)"}
                            {pos === 'DF' && "Hậu Vệ (Defenders)"}
                            {pos === 'MF' && "Tiền Vệ (Midfielders)"}
                            {pos === 'FW' && "Tiền Đạo (Forwards)"}
                            <span className="bg-white text-xs px-2 py-0.5 rounded-full ml-auto border font-normal">
                                {list.length}
                            </span>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase border-b">
                                <tr>
                                    <th className="py-2 px-4 text-center w-14">Số</th>
                                    <th className="py-2 px-4">Họ tên / Nơi sinh</th>
                                    <th className="py-2 px-4 text-center hidden md:table-cell">Quốc tịch</th>
                                    <th className="py-2 px-4 text-center hidden md:table-cell">Ngày sinh (Tuổi)</th>
                                    <th className="py-2 px-4 text-center hidden lg:table-cell" title="Chiều cao">Cao (cm)</th>
                                    <th className="py-2 px-4 text-center hidden lg:table-cell" title="Cân nặng">Nặng (kg)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {list.map(renderPlayerRow)}
                            </tbody>
                        </table>
                    </div>
                )
            ))
        )}
      </div>
    </div>
  )
}