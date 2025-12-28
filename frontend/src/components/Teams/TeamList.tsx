import { cn } from "@/lib/utils"

interface TeamListProps {
  clubs: any[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function TeamList({ clubs, selectedId, onSelect }: TeamListProps) {
  return (
    <div className="flex flex-col p-2 gap-2">
      {clubs.map((club) => (
        <div
          key={club.maclb || club.id} 
          onClick={() => onSelect(club.maclb)} 
          className={cn(
            "cursor-pointer rounded-md p-4 transition-colors hover:bg-accent border",
            selectedId === club.maclb ? "bg-accent text-accent-foreground border-l-4 border-primary" : "bg-card"
          )}
        >
          <div className="font-bold">{club.tenclb || club.ten_clb}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
             {/* SỬA: Hiển thị tên sân đã xử lý */}
             📍 {club.ten_san_hien_thi}
          </div>
        </div>
      ))}
    </div>
  )
}
