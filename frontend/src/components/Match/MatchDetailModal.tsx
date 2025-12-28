
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader2, Shield } from "lucide-react"
import { useMemo } from "react"

import { OpenAPI } from "@/client"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MatchDetailModalProps {
  isOpen: boolean
  onClose: () => void
  matchId: string | null
  homeTeamId: string
  awayTeamId: string
  homeTeamName?: string
  awayTeamName?: string
}

export function MatchDetailModal({
  isOpen,
  onClose,
  matchId,
  homeTeamId,
  awayTeamId,
  homeTeamName = "Đội nhà",
  awayTeamName = "Đội khách",
}: MatchDetailModalProps) {
  // Fetch Home Lineup
  const {
    data: homeLineup,
    isLoading: isLoadingHomeLineup,
    isError: isErrorHome,
    error: errorHome,
  } = useQuery({
    queryKey: ["match-lineup", matchId, homeTeamId],
    queryFn: async () => {
      if (!matchId || !homeTeamId) return null
      const token = localStorage.getItem("access_token") || ""
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      try {
        const res = await axios.get(
          `${OpenAPI.BASE}/api/v1/matches/${matchId}/lineup?maclb=${homeTeamId}`,
          { headers },
        )
        return res.data
      } catch (err: any) {
        if (err.response?.status === 403) {
          throw new Error("Phiên đăng nhập hết hạn hoặc không có quyền truy cập.")
        }
        throw err
      }
    },
    enabled: !!matchId && !!homeTeamId && isOpen,
    retry: 1,
  })

  // Fetch Away Lineup
  const {
    data: awayLineup,
    isLoading: isLoadingAwayLineup,
    isError: isErrorAway,
    error: errorAway,
  } = useQuery({
    queryKey: ["match-lineup", matchId, awayTeamId],
    queryFn: async () => {
      if (!matchId || !awayTeamId) return null
      const token = localStorage.getItem("access_token") || ""
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      try {
        const res = await axios.get(
          `${OpenAPI.BASE}/api/v1/matches/${matchId}/lineup?maclb=${awayTeamId}`,
          { headers },
        )
        return res.data
      } catch (err: any) {
        if (err.response?.status === 403) {
          throw new Error("Phiên đăng nhập hết hạn hoặc không có quyền truy cập.")
        }
        throw err
      }
    },
    enabled: !!matchId && !!awayTeamId && isOpen,
    retry: 1,
  })

  // Fetch Events
  const {
    data: events,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
    error: errorEvents,
  } = useQuery({
    queryKey: ["match-events", matchId],
    queryFn: async () => {
      if (!matchId) return null
      const token = localStorage.getItem("access_token") || ""
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      try {
        const res = await axios.get(
          `${OpenAPI.BASE}/api/v1/matches/${matchId}/events`,
          { headers },
        )
        return res.data
      } catch (err: any) {
        if (err.response?.status === 403) {
          throw new Error("Phiên đăng nhập hết hạn hoặc không có quyền truy cập.")
        }
        throw err
      }
    },
    enabled: !!matchId && isOpen,
    retry: 1,
  })

  const isLoading =
    isLoadingHomeLineup || isLoadingAwayLineup || isLoadingEvents
  const isError = isErrorHome || isErrorAway || isErrorEvents
  const errorMessage =
    (errorHome as Error)?.message ||
    (errorAway as Error)?.message ||
    (errorEvents as Error)?.message ||
    "Có lỗi xảy ra khi tải dữ liệu."

  // Create a map of player ID -> Name for easy lookup in events
  const playerMap = useMemo(() => {
    const map = new Map<string, string>()
    const processPlayers = (lineup: any) => {
      if (!lineup) return
      lineup.starting_xi?.forEach((p: any) => map.set(p.macauthu, p.tencauthu))
      lineup.substitutes?.forEach((p: any) => map.set(p.macauthu, p.tencauthu))
    }
    processPlayers(homeLineup)
    processPlayers(awayLineup)
    return map
  }, [homeLineup, awayLineup])

  const getPlayerName = (macauthu: string) => {
    return playerMap.get(macauthu) || macauthu
  }

  const getTeamName = (maclb: string) => {
    if (maclb === homeTeamId) return homeTeamName
    if (maclb === awayTeamId) return awayTeamName
    return maclb
  }

  const formatEventType = (type: string) => {
    switch (type) {
      case "BanThang":
        return <Badge className="bg-green-600">Bàn thắng</Badge>
      case "TheVang":
        return <Badge className="bg-yellow-500 text-black">Thẻ vàng</Badge>
      case "TheDo":
        return <Badge className="bg-red-600">Thẻ đỏ</Badge>
      case "ThayNguoi":
        return <Badge variant="outline">Thay người</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const groupPlayersByPosition = (players: any[]) => {
    if (!players) return { GK: [], DF: [], MF: [], FW: [], Other: [] };
    return {
      GK: players.filter((p: any) => (p.vitri || p.vitrithidau) === 'GK'),
      DF: players.filter((p: any) => (p.vitri || p.vitrithidau) === 'DF'),
      MF: players.filter((p: any) => (p.vitri || p.vitrithidau) === 'MF'),
      FW: players.filter((p: any) => (p.vitri || p.vitrithidau) === 'FW'),
      Other: players.filter((p: any) => !['GK', 'DF', 'MF', 'FW'].includes(p.vitri || p.vitrithidau))
    };
  };

  const renderPlayerGroup = (title: string, players: any[]) => {
    if (players.length === 0) return null;
    return (
      <div className="mb-4 last:mb-0">
        <div className="bg-gray-100 dark:bg-muted px-3 py-1.5 font-bold text-gray-700 dark:text-foreground flex items-center gap-2 text-sm border-y dark:border-border">
          {title}
          <span className="bg-white dark:bg-card text-xs px-1.5 py-0.5 rounded-full ml-auto border dark:border-border font-normal">
             {players.length}
          </span>
        </div>
        <Table>
            <TableBody>
              {players.map((p: any) => (
                <TableRow key={p.macauthu} className="hover:bg-gray-50 dark:hover:bg-muted/50 border-b-0">
                  <TableCell className="w-16 text-center py-2">
                    <span className="inline-block w-7 h-7 leading-7 rounded-full bg-white border border-gray-200 text-gray-500 font-bold text-xs shadow-sm dark:bg-muted dark:border-border dark:text-muted-foreground">
                      {p.soaothidau || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="font-medium text-sm text-foreground/90">
                      {p.tencauthu}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
      </div>
    );
  };

  const renderLineupSection = (players: any[], emptyMessage: string) => {
    if (!players || players.length === 0) {
       return (
        <div className="text-center text-muted-foreground text-sm py-8 italic border rounded-md bg-gray-50/50">
          {emptyMessage}
        </div>
       )
    }

    const groups = groupPlayersByPosition(players);
    
    return (
       <div className="rounded-md border overflow-hidden bg-white dark:bg-card">
          {renderPlayerGroup("Thủ Môn (GK)", groups.GK)}
          {renderPlayerGroup("Hậu Vệ (DF)", groups.DF)}
          {renderPlayerGroup("Tiền Vệ (MF)", groups.MF)}
          {renderPlayerGroup("Tiền Đạo (FW)", groups.FW)}
          {renderPlayerGroup("Khác", groups.Other)}
       </div>
    )
  }

  const renderLineupTable = (
    lineup: any,
    teamName: string,
    isHome: boolean,
  ) => {
    if (!lineup) return null

    return (
      <div className="border rounded-lg bg-white dark:bg-card shadow-sm h-full flex flex-col">
        <div className={`p-4 border-b ${isHome ? "bg-red-50 dark:bg-red-900/10" : "bg-blue-50 dark:bg-blue-900/10"}`}>
          <h3
            className={`font-bold text-xl ${isHome ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400"}`}
          >
            {teamName}
          </h3>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Starting XI */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              Đội hình chính
            </h4>
            {renderLineupSection(lineup.starting_xi, "Chưa cập nhật đội hình")}
          </div>

          {/* Substitutes */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.6)]"></span>
              Dự bị
            </h4>
            {renderLineupSection(lineup.substitutes, "Chưa cập nhật danh sách dự bị")}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-7xl h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b bg-white dark:bg-card z-10 shrink-0">
          <DialogTitle className="text-2xl font-bold text-center uppercase tracking-tight">
            Chi tiết trận đấu
          </DialogTitle>
          <div className="flex justify-center items-center gap-6 mt-4">
            <span className="text-red-700 dark:text-red-400 font-bold text-2xl md:text-3xl text-right flex-1 truncate">
              {homeTeamName}
            </span>
            <div className="px-3 py-1 bg-gray-100 dark:bg-muted rounded-lg font-bold text-sm text-muted-foreground shrink-0 shadow-inner">
              VS
            </div>
            <span className="text-blue-700 dark:text-blue-400 font-bold text-2xl md:text-3xl text-left flex-1 truncate">
              {awayTeamName}
            </span>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col justify-center items-center h-64 p-6 text-center">
            <Shield className="w-12 h-12 text-red-500 mb-4" />
            <div className="text-red-600 mb-2 text-lg font-semibold">
              {errorMessage}
            </div>
            <p className="text-muted-foreground">
              Vui lòng đăng nhập lại để xem chi tiết trận đấu.
            </p>
          </div>
        ) : (
          <Tabs
            defaultValue="lineup"
            className="w-full flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lineup">Đội hình</TabsTrigger>
                <TabsTrigger value="events">Diễn biến</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="lineup" className="flex-1 overflow-y-auto p-6 pt-4">
              <div className="pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderLineupTable(homeLineup, homeTeamName, true)}
                  {renderLineupTable(awayLineup, awayTeamName, false)}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events" className="flex-1 overflow-y-auto p-6 pt-4">
              <div className="pr-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Phút</TableHead>
                      <TableHead className="w-40">Đội bóng</TableHead>
                      <TableHead className="w-32">Sự kiện</TableHead>
                      <TableHead>Cầu thủ</TableHead>
                      <TableHead>Chi tiết</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events?.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center h-24 text-muted-foreground"
                        >
                          Chưa có sự kiện nào được ghi nhận
                        </TableCell>
                      </TableRow>
                    ) : (
                      events?.map((event: any) => (
                        <TableRow key={event.masukien}>
                          <TableCell className="font-bold">
                            {event.phutthidau}'
                            {event.bugio ? `+${event.bugio}` : ""}
                          </TableCell>
                          <TableCell className="font-medium text-muted-foreground">
                            {getTeamName(event.maclb)}
                          </TableCell>
                          <TableCell>
                            {formatEventType(event.loaisukien)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {getPlayerName(event.macauthu)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {event.motasukien || "-"}
                            {event.loaisukien === "ThayNguoi" &&
                              event.cauthulienquan && (
                                <span className="text-xs ml-1 block text-green-600">
                                  Vào: {getPlayerName(event.cauthulienquan)}
                                </span>
                              )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}

