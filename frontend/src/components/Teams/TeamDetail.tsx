import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { RostersService, ClubsService } from "@/client"
import { Users, CheckCircle, Flag, MapPin, Building2, User } from "lucide-react"
import { PlayerDetailModal } from "./PlayerDetailModal"

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
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)

    // 1. Gọi API lấy thông tin CLB
    const { data: clubInfo } = useQuery({
        queryKey: ['club', teamId, muagiai],
        queryFn: () => ClubsService.getClub({ club_id: teamId, muagiai }),
        staleTime: 5 * 60 * 1000, // Cache 5 phút
    })

    // 2. Gọi API lấy danh sách cầu thủ cho mùa giải ĐANG CHỌN (BM3.2 - 3.3)
    const { data: roster, isLoading } = useQuery({
        queryKey: ['roster', teamId, muagiai],
        queryFn: () => RostersService.getRoster({ maclb: teamId, muagiai: muagiai }),
        staleTime: 5 * 60 * 1000, // Cache 5 phút
    })

    // Parse data đơn giản
    const players = Array.isArray(roster) ? roster : (roster as any)?.data || [];

    // Nhóm theo vị trí
    const groupedPlayers = {
        GK: players.filter((p: any) => p.vitrithidau === 'GK'),
        DF: players.filter((p: any) => p.vitrithidau === 'DF'),
        MF: players.filter((p: any) => p.vitrithidau === 'MF'),
        FW: players.filter((p: any) => p.vitrithidau === 'FW'),
    };

    const renderPlayerRow = (p: any) => (
        <tr
            key={p.macauthu}
            className="border-b hover:bg-gray-50 transition-colors cursor-pointer group"
            onClick={() => setSelectedPlayerId(p.macauthu)}
        >
            <td className="py-3 px-4 text-center">
                <span className="inline-block w-7 h-7 leading-7 rounded-full bg-red-100 text-red-700 font-bold text-xs shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors">
                    {p.soaothidau}
                </span>
            </td>
            <td className="py-3 px-4">
                <div className="font-semibold text-gray-900 group-hover:text-red-700">{p.tencauthu}</div>
                {p.noisinh && <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {p.noisinh}</div>}
            </td>
            <td className="py-3 px-4 text-center hidden md:table-cell font-medium text-gray-700">
                {p.quoctich !== 'Vietnam' ? (
                    <span className="text-purple-600 font-bold flex items-center justify-center gap-1"><Flag className="w-3 h-3" /> {p.quoctich}</span>
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
        <div className="flex flex-col h-full overflow-hidden relative">
            <PlayerDetailModal
                playerId={selectedPlayerId}
                muagiai={muagiai}
                onClose={() => setSelectedPlayerId(null)}
            />

            {/* HEADER CLB (Mới thêm) */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 shrink-0 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Building2 className="w-64 h-64" />
                </div>

                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-800 shadow-xl border-4 border-gray-700">
                        {clubInfo?.tenclb ? clubInfo.tenclb.substring(0, 2).toUpperCase() : teamId.substring(0, 2)}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold uppercase tracking-wider">{clubInfo?.tenclb || teamId}</h1>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                            <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                <Building2 className="w-4 h-4" /> Sân vận động: <strong className="text-white ml-1">{stadiumMap[clubInfo?.masanvandong] || "Đang cập nhật"}</strong>
                            </span>
                            {/* Coach info placeholder if available or can be added */}
                            <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                <User className="w-4 h-4" /> HLV Trưởng: <strong className="text-white ml-1">Chu Đình Nghiêm</strong>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-red-50 p-4 border-b border-red-100 shrink-0 flex justify-between items-center">
                <h2 className="text-sm font-bold text-red-800 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Danh sách cầu thủ đăng ký
                </h2>
                <p className="text-xs text-gray-600 flex items-center gap-2">
                    Mùa giải: <span className="font-bold">{muagiai}</span> •
                    <span className="font-bold bg-white px-2 py-0.5 rounded border border-red-200">{players.length} cầu thủ</span>
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
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