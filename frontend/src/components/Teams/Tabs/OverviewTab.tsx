import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OverviewTab({ team }: { team: any }) { 
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Trụ sở</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Kiểm tra cả 2 trường hợp tên biến */}
          <div className="text-lg font-bold">{team.diachitruso || team.dia_chi_tru_so || "Chưa cập nhật"}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Đơn vị chủ quản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{team.donvichuquan || team.don_vi_chu_quan || "Chưa cập nhật"}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Trang phục</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex justify-between">
            <span>Sân nhà:</span>
            <span className="font-semibold">{team.trangphucchunha || team.trang_phuc_chu_nha}</span>
          </div>
          <div className="flex justify-between">
            <span>Sân khách:</span>
            <span className="font-semibold">{team.trangphuckhach || team.trang_phuc_khach}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
