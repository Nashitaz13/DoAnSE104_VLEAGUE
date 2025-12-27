import { Card, CardContent } from "@/components/ui/card"

interface StatsTabProps {
  teamId: string
}

export function StatsTab({ teamId }: StatsTabProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center text-muted-foreground">
          <p>Thống kê đội bóng (ID: {teamId})</p>
          <p className="text-sm">Chức năng đang được phát triển...</p>
        </div>
      </CardContent>
    </Card>
  )
}
