import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import axios from "axios"
import { format, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  MapPin,
} from "lucide-react"
import { useMemo, useState } from "react"

import { OpenAPI, SeasonManagementService } from "@/client"
import { MatchDetailModal } from "@/components/Match/MatchDetailModal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute("/_layout/fixtures")({
  component: FixturesPage,
  head: () => ({
    meta: [
      {
        title: "Lịch thi đấu - V-League",
      },
    ],
  }),
})

// Simple ImageWithFallback component since the original is missing
const ImageWithFallback = ({
  src,
  alt,
  className,
  fallbackSrc = "https://placehold.co/64x64?text=Club",
}: {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
}) => {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  )
}

function FixturesPage() {
  // Mặc định chọn 2024-2025
  const [selectedSeason, setSelectedSeason] = useState<string>("2024-2025")
  const [selectedDate, setSelectedDate] = useState<string>("all")
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [showFilters, setShowFilters] = useState<boolean>(false)

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<{
    id: string
    homeId: string
    awayId: string
    homeName: string
    awayName: string
  } | null>(null)

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

  // Fetch matches
  const {
    data: matchesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["matches", selectedSeason],
    queryFn: async () => {
      const token = localStorage.getItem("access_token") || ""
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      try {
        const res = await axios.get(
          `${OpenAPI.BASE}/api/v1/matches?skip=0&limit=100&muagiai=${selectedSeason}`,
          { headers },
        )
        return res.data as Array<{
          matran: string
          muagiai: string
          vong: number
          thoigianthidau: string
          maclbnha: string
          maclbkhach: string
          masanvandong: string | null
          tiso: string | null
        }>
      } catch (err) {
        console.error("Error fetching matches:", err)
        throw err
      }
    },
  })

  // Fetch teams for filter
  const { data: teamsData } = useQuery({
    queryKey: ["clubs", selectedSeason],
    queryFn: async () => {
      const token = localStorage.getItem("access_token") || ""
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      const res = await axios.get(
        `${OpenAPI.BASE}/api/v1/clubs?muagiai=${selectedSeason}`,
        { headers },
      )
      return res.data as Array<{
        maclb: string
        tenclb: string
        masanvandong: string
      }>
    },
  })

  // Fetch stadiums
  const { data: stadiums } = useQuery({
    queryKey: ["stadiums"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token") || ""
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      const res = await axios.get(`${OpenAPI.BASE}/api/v1/stadiums`, {
        headers,
      })
      return res.data as Array<{
        masanvandong: string
        tensanvandong: string
      }>
    },
  })

  const matches = matchesData || []

  // Get unique dates from matches
  const availableDates = useMemo(() => {
    if (!matches) return []
    const dates = new Set(
      matches.map((m) => format(new Date(m.thoigianthidau), "yyyy-MM-dd")),
    )
    return Array.from(dates).sort()
  }, [matches])

  // Helper to get club name
  const getClubName = (maclb: string) => {
    const team = teamsData?.find((t) => t.maclb === maclb)
    return team ? team.tenclb : maclb
  }

  // Helper to get match status
  const getMatchStatus = (match: any) => {
    if (match.tiso) return "Kết thúc"
    const matchTime = new Date(match.thoigianthidau)
    const now = new Date()
    if (matchTime < now) return "Kết thúc" // Should have score if finished, but fallback
    return "Sắp diễn ra"
  }

  // Helper to get stadium name
  const getStadiumName = (masanvandong: string | null) => {
    if (!masanvandong) return "Đang cập nhật"
    const stadium = stadiums?.find((s) => s.masanvandong === masanvandong)
    return stadium ? stadium.tensanvandong : masanvandong
  }

  const handleViewDetail = (match: any) => {
    setSelectedMatchForDetail({
      id: match.matran,
      homeId: match.maclbnha,
      awayId: match.maclbkhach,
      homeName: getClubName(match.maclbnha),
      awayName: getClubName(match.maclbkhach),
    })
    setIsDetailModalOpen(true)
  }

  // Filter matches
  const filteredMatches = matches.filter((match) => {
    const matchDateStr = format(new Date(match.thoigianthidau), "yyyy-MM-dd")
    const dateMatch = selectedDate === "all" || matchDateStr === selectedDate
    const teamMatch =
      selectedTeam === "all" ||
      match.maclbnha === selectedTeam ||
      match.maclbkhach === selectedTeam

    const status = getMatchStatus(match)
    const statusMatch = selectedStatus === "all" || status === selectedStatus

    return dateMatch && teamMatch && statusMatch
  })

  // Group by date
  const groupedMatches = filteredMatches.reduce(
    (acc, match) => {
      const dateStr = format(new Date(match.thoigianthidau), "yyyy-MM-dd")
      if (!acc[dateStr]) {
        acc[dateStr] = []
      }
      acc[dateStr].push(match)
      return acc
    },
    {} as Record<string, typeof matches>,
  )

  // Sort dates
  const sortedDates = Object.keys(groupedMatches).sort()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Kết thúc":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800">
            Kết thúc
          </Badge>
        )
      case "Sắp diễn ra":
        return (
          <Badge
            variant="outline"
            className="border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-full px-4 py-1"
          >
            Sắp diễn ra
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] text-red-600 gap-2">
        <p>Có lỗi xảy ra khi tải dữ liệu.</p>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Lỗi không xác định"}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background pb-12 transition-colors duration-300">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-red-800 to-red-900 dark:from-neutral-900 dark:to-neutral-800 text-white py-8 rounded-md mb-6 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Lịch thi đấu & Kết quả
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-red-100 dark:text-gray-400">
                  V-League 1
                </p>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger className="w-[140px] h-8 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Chọn mùa giải" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasonList.map((s: any) => (
                      <SelectItem key={s.muagiai} value={s.muagiai}>
                        {s.muagiai}
                      </SelectItem>
                    ))}

                  </SelectContent>
                </Select>
                <p className="text-red-100 dark:text-gray-400 text-sm">
                  - Thể thức vòng tròn 2 lượt
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-900 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white bg-transparent transition-colors"
              >
                <Bell className="w-4 h-4 mr-2" />
                Thông báo
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-900 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white bg-transparent transition-colors"
                onClick={() => setShowFilters((v) => !v)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-1 py-6">
        {/* Date Navigation */}
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 w-full">
              <Button
                variant={selectedDate === "all" ? "default" : "outline"}
                onClick={() => setSelectedDate("all")}
                className={`whitespace-nowrap ${
                  selectedDate === "all"
                    ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                    : "hover:bg-red-50 hover:text-red-600 dark:bg-card dark:text-foreground dark:hover:bg-red-900/30 dark:hover:text-red-400 border-gray-200 dark:border-gray-700"
                }`}
              >
                Tất cả
              </Button>

              {availableDates
                .map((dateStr) => {
                  const d = parseISO(dateStr)
                  return {
                    date: dateStr,
                    dayName: format(d, "EEEE", { locale: vi }),
                    dayNum: format(d, "dd"),
                    month: format(d, "MM"),
                    fullDate: d,
                  }
                })
                .map((item) => (
                  <Button
                    key={item.date}
                    variant={selectedDate === item.date ? "default" : "outline"}
                    onClick={() => setSelectedDate(item.date)}
                    className={`flex flex-col h-auto py-2 px-3 min-w-[80px] ${
                      selectedDate === item.date
                        ? "bg-red-600 text-white hover:bg-red-700 border-red-600 dark:bg-red-700 dark:hover:bg-red-600 dark:border-red-700"
                        : "hover:bg-red-50 hover:text-red-600 border-gray-200 dark:bg-card dark:border-gray-700 dark:text-foreground dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-medium opacity-80 mb-0.5">
                      {item.dayName}
                    </span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xl font-bold leading-none">
                        {item.dayNum}
                      </span>
                      <span className="text-xs font-medium opacity-80">
                        /{item.month}
                      </span>
                    </div>
                  </Button>
                ))}
            </div>

            <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Secondary Filters */}
          {showFilters && (
            <div className="flex gap-4 items-center flex-wrap">
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-48 bg-white dark:bg-card dark:border-gray-700">
                  <SelectValue placeholder="Chọn đội bóng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả đội</SelectItem>
                  {teamsData?.map((team) => (
                    <SelectItem key={team.maclb} value={team.maclb}>
                      {team.tenclb}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40 bg-white dark:bg-card dark:border-gray-700">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Sắp diễn ra">Sắp diễn ra</SelectItem>
                  <SelectItem value="Kết thúc">Kết thúc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </section>

        {/* Matches List */}
        <section className="space-y-8">
          {sortedDates.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground bg-white dark:bg-card rounded-xl border border-dashed dark:border-gray-700">
              Không tìm thấy trận đấu nào phù hợp.
            </div>
          ) : (
            sortedDates.map((dateStr) => (
              <div key={dateStr}>
                <div className="flex flex-col mb-4">
                  <h3 className="text-xl font-bold capitalize text-slate-900 dark:text-slate-100">
                    {format(parseISO(dateStr), "EEEE, d 'tháng' M, yyyy", {
                      locale: vi,
                    })}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Vòng {groupedMatches[dateStr][0].vong}
                  </p>
                </div>

                <div className="grid gap-4">
                  {groupedMatches[dateStr].map((match) => (
                    <Card
                      key={match.matran}
                      className="border shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow dark:bg-card dark:border-gray-700"
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                          {/* Home Team */}
                          <div className="flex items-center justify-start w-1/3 md:order-1 gap-3 md:gap-4">
                            <ImageWithFallback
                              src={`/images/clubs/${match.maclbnha}.png`}
                              alt={getClubName(match.maclbnha)}
                              className="w-10 h-10 md:w-14 md:h-14 object-contain"
                            />
                            <div className="flex flex-col items-start text-left">
                              <span className="font-bold text-sm md:text-lg leading-tight dark:text-foreground">
                                {getClubName(match.maclbnha)}
                              </span>
                              <span className="text-xs text-muted-foreground mt-0.5">
                                Chủ nhà
                              </span>
                            </div>
                          </div>

                          {/* Center Info: Time & Status */}
                          <div className="flex flex-col items-center justify-center w-1/3 md:order-2 px-2">
                            {match.tiso ? (
                              <span className="text-3xl md:text-4xl font-bold mb-2 text-red-600 dark:text-red-500 tracking-widest">
                                {match.tiso.replace("-", " - ")}
                              </span>
                            ) : (
                              <span className="text-xl md:text-2xl font-bold mb-2 dark:text-foreground">
                                {format(
                                  new Date(match.thoigianthidau),
                                  "HH:mm",
                                )}
                              </span>
                            )}
                            {getStatusBadge(getMatchStatus(match))}
                          </div>

                          {/* Away Team */}
                          <div className="flex items-center justify-end w-1/3 md:order-3 gap-3 md:gap-4">
                            <div className="flex flex-col items-end text-right">
                              <span className="font-bold text-sm md:text-lg leading-tight dark:text-foreground">
                                {getClubName(match.maclbkhach)}
                              </span>
                              <span className="text-xs text-muted-foreground mt-0.5">
                                Khách
                              </span>
                            </div>
                            <ImageWithFallback
                              src={`/images/clubs/${match.maclbkhach}.png`}
                              alt={getClubName(match.maclbkhach)}
                              className="w-10 h-10 md:w-14 md:h-14 object-contain"
                            />
                          </div>
                        </div>

                        {/* Footer: Stadium & Time */}
                        <div className="bg-slate-50 dark:bg-muted/30 py-3 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground border-t dark:border-gray-700">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{getStadiumName(match.masanvandong)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {getMatchStatus(match) === "Kết thúc"
                                  ? "Kết thúc"
                                  : format(
                                      new Date(match.thoigianthidau),
                                      "HH:mm",
                                    )}
                              </span>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full md:w-auto hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                            onClick={() => handleViewDetail(match)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      <MatchDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        matchId={selectedMatchForDetail?.id || null}
        homeTeamId={selectedMatchForDetail?.homeId || ""}
        awayTeamId={selectedMatchForDetail?.awayId || ""}
        homeTeamName={selectedMatchForDetail?.homeName}
        awayTeamName={selectedMatchForDetail?.awayName}
      />
    </div>
  )
}
