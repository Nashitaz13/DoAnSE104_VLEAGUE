import { Card, CardContent } from "@/components/ui/card"
import { Trophy } from "lucide-react"

export function MVPTab() {
  return (
    <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <Trophy className="w-12 h-12 mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">Cầu thủ xuất sắc nhất trận</h3>
            <p>Tính năng đang được phát triển. Dữ liệu sẽ được cập nhật sau khi có kết quả bình chọn.</p>
        </CardContent>
    </Card>
  )
}
