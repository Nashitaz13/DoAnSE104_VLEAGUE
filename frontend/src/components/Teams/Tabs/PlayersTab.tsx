import { useQuery } from "@tanstack/react-query"
import { RostersService } from "@/client"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface PlayersTabProps {
  teamId: string;
  muagiai: string;
}

export function PlayersTab({ teamId, muagiai }: PlayersTabProps) {
  const { data: roster, isLoading } = useQuery({
    queryKey: ["roster", teamId, muagiai], 
    queryFn: () => RostersService.getRoster({
      maclb: teamId,
      muagiai: muagiai 
    })
  })

  if (isLoading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>

  const players = Array.isArray(roster) ? roster : [];

  if (players.length === 0) {
    return <div className="p-4 text-center text-muted-foreground border rounded-md bg-muted/20">
      Chưa có cầu thủ nào được đăng ký cho mùa giải {muagiai}.
    </div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {players.map((p: any) => (
        <Card key={p.macauthu} className="flex items-center p-4 gap-4 hover:shadow-sm transition-shadow">
           <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
             {p.soaothidau}
           </div>
           <div>
             <div className="font-bold">{p.tencauthu}</div>
             <div className="text-sm text-muted-foreground flex gap-2">
                <span>{p.vitrithidau}</span>
                <span>•</span>
                <span>{p.quoctich}</span>
             </div>
           </div>
        </Card>
      ))}
    </div>
  )
}
