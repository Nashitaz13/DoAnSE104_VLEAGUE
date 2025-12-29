import { useQuery } from "@tanstack/react-query"
import { Loader2, Shield } from "lucide-react"
import { useMemo } from "react"

import { MatchesService, RostersService } from "@/client"
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
  const {
    data: matchDetail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    error: errorDetail,
  } = useQuery({
    queryKey: ["match-detail", matchId],
    queryFn: async () => {
      if (!matchId) return null
      const res = await MatchesService.readMatch({ matran: matchId })
      return res
    },
    enabled: !!matchId && isOpen,
    retry: 1,
  })

  const { data: homeRoster } = useQuery({
    queryKey: ["roster", homeTeamId, matchDetail?.muagiai],
    queryFn: async () => {
      const res = await RostersService.getRoster({
        maclb: homeTeamId,
        muagiai: matchDetail?.muagiai || "",
      })
      return Array.isArray(res) ? res : (res as any)?.data || []
    },
    enabled: !!homeTeamId && !!matchDetail?.muagiai && isOpen,
  })

  const { data: awayRoster } = useQuery({
    queryKey: ["roster", awayTeamId, matchDetail?.muagiai],
    queryFn: async () => {
      const res = await RostersService.getRoster({
        maclb: awayTeamId,
        muagiai: matchDetail?.muagiai || "",
      })
      return Array.isArray(res) ? res : (res as any)?.data || []
    },
    enabled: !!awayTeamId && !!matchDetail?.muagiai && isOpen,
  })

  const isLoading = isLoadingDetail
  const isError = isErrorDetail
  const errorMessage =
    (errorDetail as Error)?.message || "Có lỗi xảy ra khi tải dữ liệu."

  const playerMap = useMemo(() => {
    const map = new Map<string, string>()
    const numberMap = new Map<string, number>()

    ;(homeRoster || []).forEach((p: any) => {
      map.set(
        p.macauthu,
        p.cauthu?.hoten || p.hoten || p.tencauthu || p.macauthu,
      )
      if (p.soaothidau) numberMap.set(p.macauthu, p.soaothidau)
    })

    ;(awayRoster || []).forEach((p: any) => {
      map.set(
        p.macauthu,
        p.cauthu?.hoten || p.hoten || p.tencauthu || p.macauthu,
      )
      if (p.soaothidau) numberMap.set(p.macauthu, p.soaothidau)
    })

    return { nameMap: map, numberMap }
  }, [homeRoster, awayRoster])

  const getPlayerName = (macauthu: string) => {
    return playerMap.nameMap.get(macauthu) || macauthu
  }

  const getPlayerNumber = (macauthu: string) => {
    return playerMap.numberMap.get(macauthu)
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
    if (!players) return { GK: [], DF: [], MF: [], FW: [], Other: [] }
    return {
      GK: players.filter((p: any) => (p.vitri || p.vitrithidau) === "GK"),
      DF: players.filter((p: any) => (p.vitri || p.vitrithidau) === "DF"),
      MF: players.filter((p: any) => (p.vitri || p.vitrithidau) === "MF"),
      FW: players.filter((p: any) => (p.vitri || p.vitrithidau) === "FW"),
      Other: players.filter(
        (p: any) =>
          !["GK", "DF", "MF", "FW"].includes(p.vitri || p.vitrithidau),
      ),
    }
  }

  const renderPlayerGroup = (title: string, players: any[]) => {
    if (players.length === 0) return null
    return (
      <div className="mb-4 last:mb-0">
        <div className="bg-gray-100 dark:bg-muted px-3 py-1.5 font-bold text-gray-700 dark:text-foreground flex items-center gap-2 text-sm border-y dark:border-border">
          {title}
          <span className="bg-white dark:bg-card text-xs px-1.5 py-0.5 rounded-full ml-auto border dark:border-border font-normal">
            {players.length}
          </span>
        </div>
        <div className="relative w-full overflow-visible rounded-none">
          <table className="w-full caption-bottom text-sm">
            <TableBody>
              {players.map((p: any, _idx: number) => (
                <TableRow
                  key={p.macauthu}
                  className={`relative overflow-visible hover:bg-neutral-200 dark:hover:bg-muted/40 rounded-none before:content-[''] before:absolute before:left-0 before:inset-y-0 before:w-1.5 before:rounded-none ${
                    p.duocxuatphat
                      ? "bg-green-100 dark:bg-green-900/30 before:bg-green-600"
                      : "bg-gray-300 dark:bg-gray-600/30 before:bg-gray-600"
                  }`}
                >
                  <TableCell className="w-16 text-center py-2 rounded-none">
                    <span className="inline-block w-7 h-7 leading-7 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 font-bold text-[10px] shadow-sm dark:bg-muted dark:border-border dark:text-muted-foreground px-1 overflow-hidden whitespace-nowrap">
                      {getPlayerNumber(p.macauthu) || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 rounded-none">
                    <div className="font-medium text-sm text-foreground/90">
                      {p.tencauthu}
                      {p.ladoitruong && (
                        <sup className="ml-1 inline-flex items-center justify-center bg-yellow-400 text-black text-[8px] w-3 h-3 rounded-full font-bold shadow-sm">
                          C
                        </sup>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </table>
        </div>
      </div>
    )
  }

  const renderLineupSection = (players: any[], emptyMessage: string) => {
    if (!players || players.length === 0) {
      return (
        <div className="text-center text-muted-foreground text-sm py-8 italic border bg-gray-50/50 dark:bg-muted/20">
          {emptyMessage}
        </div>
      )
    }

    const groups = groupPlayersByPosition(players)

    return (
      <div className="border rounded-none bg-white dark:bg-card overflow-hidden">
        {renderPlayerGroup("Thủ Môn", groups.GK)}
        {renderPlayerGroup("Hậu Vệ", groups.DF)}
        {renderPlayerGroup("Tiền Vệ", groups.MF)}
        {renderPlayerGroup("Tiền Đạo", groups.FW)}
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
      <div className="border bg-white dark:bg-card shadow-sm h-full flex flex-col rounded-none">
        <div
          className={`p-4 border-b ${isHome ? "bg-red-50 dark:bg-red-900/10" : "bg-blue-50 dark:bg-blue-900/10"}`}
        >
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
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              Đội hình chính
            </h4>
            {renderLineupSection(lineup.starting_xi, "Chưa cập nhật đội hình")}
          </div>

          {/* Substitutes */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.6)]" />
              Dự bị
            </h4>
            {renderLineupSection(
              lineup.substitutes,
              "Chưa cập nhật danh sách dự bị",
            )}
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
          {matchDetail && (
            <div className="mt-2 text-center text-sm text-muted-foreground">
              Khán giả:{" "}
              {typeof (matchDetail as any).sokhangia === "number"
                ? ((matchDetail as any).sokhangia as number).toLocaleString()
                : (matchDetail as any).sokhangia || "---"}
            </div>
          )}
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

            <TabsContent
              value="lineup"
              className="flex-1 overflow-y-auto p-6 pt-4"
            >
              <div className="pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderLineupTable(
                    matchDetail
                      ? {
                          starting_xi: (matchDetail.lineup_home || [])
                            .filter((e: any) => e.duocxuatphat)
                            .map((e: any) => ({
                              macauthu: e.macauthu,
                              tencauthu: getPlayerName(e.macauthu),
                              vitri: e.vitri,
                              duocxuatphat: e.duocxuatphat,
                              ladoitruong: e.ladoitruong,
                              soaothidau: undefined,
                            })),
                          substitutes: (matchDetail.lineup_home || [])
                            .filter((e: any) => !e.duocxuatphat)
                            .map((e: any) => ({
                              macauthu: e.macauthu,
                              tencauthu: getPlayerName(e.macauthu),
                              vitri: e.vitri,
                              duocxuatphat: e.duocxuatphat,
                              ladoitruong: e.ladoitruong,
                              soaothidau: undefined,
                            })),
                        }
                      : null,
                    homeTeamName,
                    true,
                  )}
                  {renderLineupTable(
                    matchDetail
                      ? {
                          starting_xi: (matchDetail.lineup_away || [])
                            .filter((e: any) => e.duocxuatphat)
                            .map((e: any) => ({
                              macauthu: e.macauthu,
                              tencauthu: getPlayerName(e.macauthu),
                              vitri: e.vitri,
                              duocxuatphat: e.duocxuatphat,
                              ladoitruong: e.ladoitruong,
                              soaothidau: undefined,
                            })),
                          substitutes: (matchDetail.lineup_away || [])
                            .filter((e: any) => !e.duocxuatphat)
                            .map((e: any) => ({
                              macauthu: e.macauthu,
                              tencauthu: getPlayerName(e.macauthu),
                              vitri: e.vitri,
                              duocxuatphat: e.duocxuatphat,
                              ladoitruong: e.ladoitruong,
                              soaothidau: undefined,
                            })),
                        }
                      : null,
                    awayTeamName,
                    false,
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="events"
              className="flex-1 overflow-y-auto p-6 pt-4"
            >
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
                    {matchDetail?.events?.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center h-24 text-muted-foreground"
                        >
                          Chưa có sự kiện nào được ghi nhận
                        </TableCell>
                      </TableRow>
                    ) : (
                      matchDetail?.events?.map((event: any) => (
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
