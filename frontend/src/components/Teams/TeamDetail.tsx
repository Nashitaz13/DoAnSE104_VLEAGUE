import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { RostersService, ClubsService, PlayersService } from "@/client"
import { Users, Flag, MapPin, Building2, User, Pencil, X, Loader2 } from "lucide-react"
import { PlayerDetailModal } from "./PlayerDetailModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { canEditClub } from "@/utils/auth"
import { useToast } from "@/hooks/use-toast"

const calculateAge = (dateString: string) => {
    if (!dateString) return "-";
    const birthDate = new Date(dateString);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Format date to dd/mm/yyyy for display (avoid timezone issues)
const formatDisplayDate = (dateValue: string | null | undefined): string => {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

interface TeamDetailProps {
    teamId: string;
    stadiumMap: Record<string, string>;
    muagiai: string;
}

export function TeamDetail({ teamId, stadiumMap, muagiai }: TeamDetailProps) {
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
    const [editingPlayer, setEditingPlayer] = useState<any>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    
    // Check if user can edit THIS SPECIFIC club (BTC = all, QuanLyDoi = only their club)
    const canEdit = canEditClub(teamId)

    // 1. Gọi API lấy thông tin CLB (song song với roster)
    const { data: clubInfo } = useQuery({
        queryKey: ['club', teamId, muagiai],
        queryFn: () => ClubsService.getClub({ club_id: teamId, muagiai }),
        staleTime: 5 * 60 * 1000, // Cache 5 phút
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
    })

    // 2. Gọi API lấy danh sách cầu thủ cho mùa giải ĐANG CHỌN
    const { data: roster, isLoading } = useQuery({
        queryKey: ['roster', teamId, muagiai],
        queryFn: () => RostersService.getRoster({ maclb: teamId, muagiai: muagiai }),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
    })

    // Parse data
    const rosterData = Array.isArray(roster) ? roster : (roster as any)?.data || [];

    // 3. Conditional Backup: Chỉ gọi khi 2025-2026 VÀ roster rỗng
    const shouldFetchBackup = muagiai === "2025-2026" && rosterData.length === 0;
    
    const { data: rosterBackup } = useQuery({
        queryKey: ['roster', teamId, "2024-2025"],
        queryFn: () => RostersService.getRoster({ maclb: teamId, muagiai: "2024-2025" }),
        enabled: shouldFetchBackup, // CHỈ fetch khi cần
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    // Chọn data source
    const players = rosterData.length > 0 
        ? rosterData 
        : (shouldFetchBackup && rosterBackup) 
            ? (Array.isArray(rosterBackup) ? rosterBackup : (rosterBackup as any)?.data || [])
            : [];

    // Nhóm theo vị trí
    const groupedPlayers = {
        GK: players.filter((p: any) => p.vitrithidau === 'GK'),
        DF: players.filter((p: any) => p.vitrithidau === 'DF'),
        MF: players.filter((p: any) => p.vitrithidau === 'MF'),
        FW: players.filter((p: any) => p.vitrithidau === 'FW'),
    };

    // Handler mở modal edit
    const handleEditClick = (e: React.MouseEvent, player: any) => {
        e.stopPropagation() // Ngăn mở modal chi tiết
        setEditingPlayer(player)
        setIsEditModalOpen(true)
    }

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
                {p.ngaysinh ? formatDisplayDate(p.ngaysinh) : "-"}
                <span className="block text-xs text-gray-400">({calculateAge(p.ngaysinh)} tuổi)</span>
            </td>
            <td className="py-3 px-4 text-center text-gray-600 hidden lg:table-cell font-mono">
                {p.chieucao ? `${p.chieucao}` : "-"}
            </td>
            <td className="py-3 px-4 text-center text-gray-600 hidden lg:table-cell font-mono">
                {p.cannang ? `${p.cannang}` : "-"}
            </td>
            {/* Cột thao tác - chỉ hiện cho BTC/QuanLyDoi */}
            {canEdit && (
                <td className="py-3 px-4 text-center">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        onClick={(e) => handleEditClick(e, p)}
                        title="Chỉnh sửa cầu thủ"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                </td>
            )}
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
            
            {/* Modal chỉnh sửa cầu thủ */}
            <EditPlayerInTeamModal 
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setEditingPlayer(null); }}
                player={editingPlayer}
                clubId={teamId}
                season={muagiai}
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
                                            {canEdit && <th className="py-2 px-4 text-center w-16">Sửa</th>}
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

// ====================================================================
// COMPONENT: MODAL CHỈNH SỬA CẦU THỦ (cho trang Đội bóng)
// ====================================================================
function EditPlayerInTeamModal({ 
    isOpen, 
    onClose, 
    player, 
    clubId, 
    season 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    player: any; 
    clubId: string; 
    season: string;
}) {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    
    const [formData, setFormData] = useState({
        tencauthu: "", 
        soaothidau: "", 
        vitrithidau: "", 
        quoctich: "", 
        ngaysinh: "", 
        chieucao: "", 
        cannang: ""
    });

    // Helper: Format date to YYYY-MM-DD without timezone shift
    const formatDateForInput = (dateValue: string | null | undefined): string => {
        if (!dateValue) return "";
        // Nếu đã là format YYYY-MM-DD thì giữ nguyên
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return dateValue;
        // Parse và format lại, tránh timezone shift bằng cách lấy trực tiếp từ string
        const date = new Date(dateValue);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (player) {
            setFormData({
                tencauthu: player.tencauthu || "",
                soaothidau: String(player.soaothidau || ""),
                vitrithidau: player.vitrithidau || "MF",
                quoctich: player.quoctich || "",
                ngaysinh: formatDateForInput(player.ngaysinh),
                chieucao: String(player.chieucao || ""),
                cannang: String(player.cannang || "")
            });
        }
    }, [player]);

    const mutation = useMutation({
        mutationFn: async (updatedData: any) => {
            // 1. Cập nhật thông tin cầu thủ trong bảng CauThu
            const playerPayload: Record<string, any> = {};
            
            // So sánh và chỉ gửi fields đã thay đổi
            if (updatedData.tencauthu !== player.tencauthu) {
                playerPayload.tencauthu = updatedData.tencauthu;
            }
            if (updatedData.vitrithidau !== player.vitrithidau) {
                playerPayload.vitrithidau = updatedData.vitrithidau;
            }
            if (updatedData.quoctich !== player.quoctich) {
                playerPayload.quoctich = updatedData.quoctich;
            }
            
            // Ngày sinh: so sánh đúng format
            const oldNgaysinh = formatDateForInput(player.ngaysinh);
            if (updatedData.ngaysinh && updatedData.ngaysinh !== oldNgaysinh) {
                playerPayload.ngaysinh = updatedData.ngaysinh;
            }
            
            // Chiều cao: so sánh số (convert cả 2 về number)
            const newChieucao = updatedData.chieucao ? parseFloat(updatedData.chieucao) : null;
            const oldChieucao = player.chieucao ? parseFloat(player.chieucao) : null;
            if (newChieucao !== oldChieucao && newChieucao !== null) {
                playerPayload.chieucao = newChieucao;
            }
            
            // Cân nặng: so sánh số (convert cả 2 về number)  
            const newCannang = updatedData.cannang ? parseFloat(updatedData.cannang) : null;
            const oldCannang = player.cannang ? parseFloat(player.cannang) : null;
            if (newCannang !== oldCannang && newCannang !== null) {
                playerPayload.cannang = newCannang;
            }
            
            // Chỉ gọi API nếu có thay đổi
            if (Object.keys(playerPayload).length > 0) {
                await PlayersService.updatePlayer({
                    player_id: player.macauthu,
                    requestBody: playerPayload
                });
            }
            
            // 2. Nếu số áo thay đổi, cập nhật trong bảng ChiTietDoiBong
            const newShirt = parseInt(updatedData.soaothidau, 10);
            const oldShirt = parseInt(player.soaothidau, 10);
            if (newShirt !== oldShirt && !isNaN(newShirt)) {
                await RostersService.updateRosterPlayer({
                    player_id: player.macauthu,
                    maclb: clubId,
                    muagiai: season,
                    requestBody: { soaothidau: newShirt }
                });
            }
            
            return { ...player, ...updatedData };
        },
        onSuccess: () => {
            // Invalidate để refetch dữ liệu mới từ server
            queryClient.invalidateQueries({ queryKey: ['roster', clubId, season] });
            queryClient.invalidateQueries({ queryKey: ['player', player.macauthu] });
            toast({ title: "Thành công", description: `Đã cập nhật thông tin cầu thủ: ${formData.tencauthu}` });
            onClose();
        },
        onError: (err: any) => {
            const status = err?.status || err?.response?.status;
            const detail = err?.body?.detail || err?.message || "Có lỗi xảy ra";
            
            if (status === 403) {
                toast({ title: "Không có quyền", description: "Bạn không có quyền chỉnh sửa cầu thủ này", variant: "destructive" });
            } else {
                toast({ title: "Lỗi", description: detail, variant: "destructive" });
            }
        }
    });

    if (!isOpen || !player) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-orange-200">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-orange-50">
                    <h3 className="font-bold text-lg text-orange-800 flex items-center gap-2">
                        <Pencil className="w-4 h-4"/> Chỉnh sửa thông tin cầu thủ
                    </h3>
                    <button onClick={onClose} disabled={mutation.isPending}>
                        <X className="w-5 h-5 text-gray-400 hover:text-gray-600"/>
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label>Họ và tên</Label>
                            <Input 
                                value={formData.tencauthu}
                                onChange={(e) => setFormData({...formData, tencauthu: e.target.value})}
                            />
                        </div>
                        <div>
                            <Label>Số áo</Label>
                            <Input type="number" value={formData.soaothidau} onChange={(e) => setFormData({...formData, soaothidau: e.target.value})}/>
                        </div>
                        <div>
                            <Label>Vị trí</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.vitrithidau} onChange={(e) => setFormData({...formData, vitrithidau: e.target.value})}>
                                <option value="GK">Thủ môn (GK)</option>
                                <option value="DF">Hậu vệ (DF)</option>
                                <option value="MF">Tiền vệ (MF)</option>
                                <option value="FW">Tiền đạo (FW)</option>
                            </select>
                        </div>
                        <div>
                            <Label>Ngày sinh</Label>
                            <Input type="date" value={formData.ngaysinh} onChange={(e) => setFormData({...formData, ngaysinh: e.target.value})}/>
                        </div>
                        <div>
                            <Label>Quốc tịch</Label>
                            <Input value={formData.quoctich} onChange={(e) => setFormData({...formData, quoctich: e.target.value})}/>
                        </div>
                        <div>
                            <Label>Chiều cao (cm)</Label>
                            <Input type="number" value={formData.chieucao} onChange={(e) => setFormData({...formData, chieucao: e.target.value})}/>
                        </div>
                        <div>
                            <Label>Cân nặng (kg)</Label>
                            <Input type="number" value={formData.cannang} onChange={(e) => setFormData({...formData, cannang: e.target.value})}/>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>Hủy bỏ</Button>
                    <Button 
                        className="bg-orange-600 hover:bg-orange-700 text-white" 
                        onClick={() => mutation.mutate(formData)}
                        disabled={mutation.isPending || !formData.tencauthu.trim()}
                    >
                        {mutation.isPending && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}
                        {mutation.isPending ? "Đang lưu..." : "Cập nhật"}
                    </Button>
                </div>
            </div>
        </div>
    );
}