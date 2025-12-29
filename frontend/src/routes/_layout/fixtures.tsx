import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { format } from "date-fns"
import { CalendarDays, MapPin, Shield, Trophy } from "lucide-react"
import { useMemo, useState } from "react"

import { MatchesService, SeasonManagementService } from "@/client"
import { MatchDetailModal as ExternalMatchDetailModal } from "@/components/Match/MatchDetailModal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute("/_layout/fixtures")({
  component: MatchCenterPage,
})

// --- COMPONENTS ---

// 1. Match Card Component
function MatchCard({ match, onClick }: { match: any; onClick: () => void }) {
  const isFinished = !!match.tiso
  const matchDate = new Date(match.thoigianthidau)
  const isUpcoming = !isFinished && matchDate > new Date()

  // Helper to fallback logo/name
  const getLogo = (id: string) => `/images/clubs/${id}.png`

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative bg-white dark:bg-card border border-gray-100 dark:border-neutral-800 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden
      ${isFinished ? "hover:border-gray-300 dark:hover:border-neutral-700" : "hover:border-blue-300 dark:hover:border-blue-700"}`}
    >
      {/* Status Strip */}
      <div
        className={`h-1 w-full ${isFinished ? "bg-gray-200 dark:bg-neutral-700" : "bg-blue-500 dark:bg-blue-600"}`}
      />

      <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Home Team */}
        <div className="flex-1 flex items-center justify-end gap-3 md:gap-4 w-full">
          <span className="font-bold text-lg md:text-xl text-right truncate dark:text-foreground">
            {match.ten_clb_nha || match.maclb_nha}
          </span>
          <img
            src={getLogo(match.maclb_nha)}
            alt="Home"
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/64x64?text=Club"
            }}
          />
        </div>

        {/* Score / Time Center */}
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          {isFinished ? (
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-wider drop-shadow-sm">
              {match.tiso?.replace("-", " - ")}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-300">
                {format(matchDate, "HH:mm")}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mt-1">
                {format(matchDate, "dd/MM")}
              </span>
            </div>
          )}

          <div className="mt-2 text-center">
            {isFinished && (
              <Badge
                variant="secondary"
                className="text-[10px] uppercase tracking-wide dark:bg-neutral-800 dark:text-neutral-200"
              >
                Kết thúc
              </Badge>
            )}
            {isUpcoming && (
              <Badge className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 text-[10px] uppercase tracking-wide">
                Sắp diễn ra
              </Badge>
            )}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex-1 flex items-center justify-start gap-3 md:gap-4 w-full">
          <img
            src={getLogo(match.maclb_khach)}
            alt="Away"
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/64x64?text=Club"
            }}
          />
          <span className="font-bold text-lg md:text-xl text-left truncate">
            {match.ten_clb_khach || match.maclb_khach}
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 flex justify-between items-center gap-4 border-t border-gray-100 group-hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {match.ten_san || match.masanvandong}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" /> Vòng {match.vong}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-blue-700 border-blue-200 hover:bg-blue-50"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          Xem chi tiết
        </Button>
      </div>
    </button>
  )
}

// --- MAIN PAGE ---

function MatchCenterPage() {
  const [selectedSeason, setSelectedSeason] = useState<string>("2024-2025")
  const [selectedRound, setSelectedRound] = useState<string>("all")

  // Modal State
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 1. Fetch Seasons
  const { data: seasonsData } = useQuery({
    queryKey: ["seasons"],
    queryFn: () => SeasonManagementService.getSeasons({ limit: 10 }),
  })

  const seasonOptions = useMemo(() => {
    const list = Array.isArray(seasonsData)
      ? seasonsData
      : (seasonsData as any)?.data || []
    return list
      .map((s: any) => s.muagiai)
      .sort()
      .reverse()
  }, [seasonsData])

  // 2. Fetch Matches
  const { data: matchesData, isLoading } = useQuery({
    queryKey: ["matches", selectedSeason],
    queryFn: () =>
      MatchesService.readMatches({ muagiai: selectedSeason, limit: 100 }),
  })

  // 3. Process Logic
  const processedMatches = useMemo(() => {
    let list = Array.isArray(matchesData)
      ? matchesData
      : (matchesData as any)?.data || []

    // Fix Mapping (Backend -> Frontend)
    list = list.map((m: any) => ({
      ...m,
      maclb_nha: m.maclb_nha || m.maclbnha,
      maclb_khach: m.maclb_khach || m.maclbkhach,
    }))

    // Filter by Round
    if (selectedRound !== "all") {
      list = list.filter((m: any) => String(m.vong) === selectedRound)
    }

    // Sort: Latest round first? Or earliest?
    // User probably wants to see upcoming.
    // Let's sort by Date.
    return list.sort(
      (a: any, b: any) =>
        new Date(a.thoigianthidau).getTime() -
        new Date(b.thoigianthidau).getTime(),
    )
  }, [matchesData, selectedRound])

  // Group by Round for "All" view
  const matchesByRound = useMemo(() => {
    const groups: Record<string, any[]> = {}
    processedMatches.forEach((m: any) => {
      const r = `Vòng ${m.vong}`
      if (!groups[r]) groups[r] = []
      groups[r].push(m)
    })
    return groups
  }, [processedMatches])

  const handleMatchClick = (match: any) => {
    setSelectedMatch(match)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-background pb-20">
      {/* 1. HERO HEADER */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 dark:from-red-900 dark:to-red-950 text-white shadow-lg pb-12 pt-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 opacity-90 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-bold tracking-widest uppercase">
              Vietnam Professional Football
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Lịch thi đấu (BM4)
          </h1>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10 inline-flex">
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-[180px] bg-white dark:bg-neutral-800 text-red-900 dark:text-red-400 font-bold border-none h-10">
                <SelectValue placeholder="Chọn mùa giải" />
              </SelectTrigger>
              <SelectContent>
                {seasonOptions.length > 0 ? (
                  seasonOptions.map((s: string) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                )}
              </SelectContent>
            </Select>

            <Select value={selectedRound} onValueChange={setSelectedRound}>
              <SelectTrigger className="w-[180px] bg-black/20 text-white border-none h-10 hover:bg-black/30 transition-colors font-medium">
                <SelectValue placeholder="Chọn vòng đấu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vòng đấu</SelectItem>
                {Array.from({ length: 26 }, (_, i) => i + 1).map((r) => (
                  <SelectItem key={String(r)} value={String(r)}>
                    Vòng {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        {isLoading ? (
          <div className="bg-white dark:bg-card p-20 rounded-xl shadow-sm text-center">
            <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500 dark:text-muted-foreground">
              Đang tải dữ liệu trận đấu...
            </p>
          </div>
        ) : processedMatches.length === 0 ? (
          <div className="bg-white dark:bg-card p-20 rounded-xl shadow-sm text-center border-dashed border-2 dark:border-neutral-800">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-200 dark:text-neutral-700" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-foreground">
              Không tìm thấy trận đấu
            </h3>
            <p className="text-gray-500 dark:text-muted-foreground mt-2">
              Không có dữ liệu cho Mùa {selectedSeason} - Vòng{" "}
              {selectedRound === "all" ? "bất kỳ" : selectedRound}.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(matchesByRound)
              .sort(
                (a, b) =>
                  parseInt(a.replace("Vòng ", ""), 10) -
                  parseInt(b.replace("Vòng ", ""), 10),
              )
              .map((roundKey) => (
                <div
                  key={roundKey}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-foreground bg-white dark:bg-card px-4 py-1 rounded shadow-sm border border-gray-100 dark:border-neutral-800 inline-block">
                      {roundKey}
                    </h2>
                    <div className="h-px bg-gray-300 dark:bg-red-800/60 flex-1" />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {matchesByRound[roundKey].map((match: any) => (
                      <MatchCard
                        key={match.matran}
                        match={match}
                        onClick={() => handleMatchClick(match)}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 3. DETAIL MODAL */}
      <ExternalMatchDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        matchId={selectedMatch?.matran || null}
        homeTeamId={selectedMatch?.maclb_nha}
        awayTeamId={selectedMatch?.maclb_khach}
        homeTeamName={selectedMatch?.ten_clb_nha || selectedMatch?.maclb_nha}
        awayTeamName={
          selectedMatch?.ten_clb_khach || selectedMatch?.maclb_khach
        }
      />
    </div>
  )
}
