import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, Info, Star } from "lucide-react"

interface StadiumDetailProps {
  club: any
}

export function StadiumDetail({ club }: StadiumDetailProps) {
  if (!club) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <Info className="w-12 h-12 mb-4 opacity-50" />
        <p>Chọn một đội bóng để xem thông tin sân vận động</p>
      </div>
    )
  }

  // Helper an toàn để lấy sức chứa
  const getCapacity = () => {
      if (!club.suc_chua_san) return "---";
      try {
          return parseInt(String(club.suc_chua_san)).toLocaleString();
      } catch (e) {
          return String(club.suc_chua_san);
      }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-6">
      <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-lg group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img 
          src={club.san_van_dong?.hinh_anh || "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop"} 
          alt={club.ten_san_hien_thi || "Sân vận động"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
          <h2 className="text-3xl font-bold mb-2">{club.ten_san_hien_thi || "Chưa cập nhật tên sân"}</h2>
          <p className="text-white/80 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {club.dia_chi_san || "Đang cập nhật địa chỉ"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Sức chứa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {getCapacity()}
              <span className="text-sm font-normal text-muted-foreground ml-2">chỗ ngồi</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Tiêu chuẩn & Đánh giá
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
             <div className="flex justify-between items-center py-2 border-b border-border">
               <span className="text-muted-foreground">Đánh giá FIFA:</span>
               <span className="font-bold text-primary">{club.danh_gia_fifa || club.danhgiafifa || "Chưa đánh giá"}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-border">
               <span className="text-muted-foreground">Mặt cỏ:</span>
               <span>Tự nhiên</span>
             </div>
             <div className="flex justify-between items-center py-2">
               <span className="text-muted-foreground">Kích thước:</span>
               <span>105m x 68m</span>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mô tả</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Sân vận động {club.ten_san_hien_thi || ""} là sân nhà của câu lạc bộ {club.tenclb || "này"}. 
            Đây là nơi diễn ra các trận đấu hấp dẫn trong khuôn khổ giải V-League.
            Với sức chứa {getCapacity()}, 
            sân luôn tạo nên bầu không khí sôi động từ các cổ động viên nhiệt thành.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
