import { cn } from "@/lib/utils"
import { MapPin } from "lucide-react"

interface TeamListProps {
  clubs: any[]
  selectedId: string | null
  onSelect: (id: string) => void
  onTeamHover?: (id: string) => void
}

export function TeamList({ clubs, selectedId, onSelect, onTeamHover }: TeamListProps) {
  return (
    <div className="flex flex-col gap-1">
      {clubs.map((club) => {
          const isSelected = selectedId === club.maclb;
          return (
            <div
            key={club.maclb || club.id} 
            onClick={() => onSelect(club.maclb)}
            onMouseEnter={() => onTeamHover?.(club.maclb)}
            className={cn(
                "cursor-pointer rounded-lg p-3 transition-all border flex items-center justify-between group",
                isSelected 
                ? "bg-red-50 border-red-200 shadow-sm" 
                : "bg-white hover:bg-gray-50 border-transparent hover:border-gray-200"
            )}
            >
            <div className="flex-1 min-w-0">
                <div className={cn("font-bold truncate text-sm transition-colors", isSelected ? "text-red-700" : "text-gray-800")}>
                    {club.tenclb || club.ten_clb}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3 text-gray-400 shrink-0" /> 
                    {club.ten_san_hien_thi}
                </div>
            </div>
            
            {/* Logo placeholder if needed */}
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 transition-colors", 
                isSelected ? "bg-red-200 text-red-800" : "bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-gray-600"
            )}>
                {club.tenclb ? club.tenclb.substring(0,2).toUpperCase() : "CL"}
            </div>
            </div>
        )
      })}
    </div>
  )
}
