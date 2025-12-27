import { useState } from "react"
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, UserCircle, Shield, Flag, Copy } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { AuthService, ApiError, OpenAPI } from "@/client"
import { toast } from "sonner"

const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
})

type LoginForm = z.infer<typeof loginSchema>

export const Route = createFileRoute("/login")({
  component: LoginPage,
  beforeLoad: async () => {
    if (localStorage.getItem("access_token")) {
      throw redirect({ to: "/" })
    }
  },
})

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uiRole, setUiRole] = useState("admin") 
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const fillCredential = (u: string, p: string, role: string) => {
    setValue("username", u);
    setValue("password", p);
    setUiRole(role);
    toast.success(`Đã điền thông tin: ${u}`);
  }

  const getRoleName = (role: string) => {
    const map: Record<string, string> = {
      'admin': 'Quản trị viên',
      'manager': 'Quản lý đội bóng',
      'official': 'Quan chức trận đấu'
    };
    return map[role] || role;
  }

  const inferRoleFromUser = (user: any): string => {
      if (user.role && user.role !== "null") return String(user.role);
      if (user.manhom && user.manhom !== null) {
          if (user.manhom === 2) return "admin";
          if (user.manhom === 3) return "manager";
          if (user.manhom === 4) return "official";
      }

      const username = (user.tendangnhap || user.username || "").toLowerCase();

      if (username.includes("admin") || username.includes("quantri")) return "admin";
      if (username.includes("trongtai") || username.includes("giamsat") || username.includes("official")) return "official";
      
      return "manager"; 
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true)

      const response = await AuthService.login({
        requestBody: {
          username: data.username,
          password: data.password,
        },
      })

      const accessToken = (response as any).token || response.access_token;

      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
        OpenAPI.TOKEN = accessToken;

        try {
            const currentUser: any = await AuthService.getCurrentUserInfo();
            const realRole = inferRoleFromUser(currentUser);
            
            if (realRole !== uiRole) {
                 localStorage.removeItem("access_token");
                 localStorage.removeItem("currentUser");
                 
                 const tenRoleThat = getRoleName(realRole);
                 const tenRoleChon = getRoleName(uiRole);

                 alert(`⛔ SAI VAI TRÒ\n\nTài khoản "${data.username}" là: "${tenRoleThat}".\nBạn đang chọn: "${tenRoleChon}".\n\nVui lòng chọn đúng vai trò trên giao diện!`);
                 setIsLoading(false);
                 return;
            }

            localStorage.setItem("currentUser", JSON.stringify({
                ...currentUser,
                role: realRole 
            }));
            
            window.location.href = "/";

        } catch (infoError) {
            console.error("Lỗi lấy thông tin:", infoError);
            alert("Không thể xác thực thông tin người dùng từ Server.");
            localStorage.removeItem("access_token");
        }
      }

    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error)
      let message = "Đăng nhập thất bại."
      if (error instanceof ApiError) {
         message = (error.body as any)?.detail || error.message;
      }
      alert(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-neutral-900 p-4 gap-6">
      
      {/* KHUNG ĐĂNG NHẬP CHÍNH */}
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg">
            {uiRole === "admin" && <Shield className="h-8 w-8" />}
            {uiRole === "manager" && <UserCircle className="h-8 w-8" />}
            {uiRole === "official" && <Flag className="h-8 w-8" />}
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Đăng nhập hệ thống
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
             V-League 1 Management System
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border dark:border-neutral-700">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="space-y-2">
              <Label className="text-base font-semibold">Vai trò</Label>
              <Select value={uiRole} onValueChange={setUiRole}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Chọn vai trò đăng nhập" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin" className="font-medium">
                    <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-red-600" /> Quản trị viên</div>
                  </SelectItem>
                  <SelectItem value="manager" className="font-medium">
                    <div className="flex items-center gap-2"><UserCircle className="w-4 h-4 text-blue-600" /> Quản lý đội bóng</div>
                  </SelectItem>
                  <SelectItem value="official" className="font-medium">
                    <div className="flex items-center gap-2"><Flag className="w-4 h-4 text-yellow-600" /> Quan chức trận đấu</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input id="username" className="h-11" {...register("username")} placeholder="Nhập tên đăng nhập"/>
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} className="h-11 pr-10" {...register("password")} placeholder="Nhập mật khẩu"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11 bg-red-700 hover:bg-red-800 text-white font-bold" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang kiểm tra...</> : "Đăng nhập"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Chưa có tài khoản? </span>
            <Link to="/register" className="font-bold text-red-700 hover:underline">Đăng ký ngay</Link>
          </div>
        </div>
      </div>

      {/* --- KHUNG TÀI KHOẢN DEMO (MỚI THÊM) --- */}
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 p-6 shadow-lg rounded-xl border dark:border-neutral-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Tài khoản demo</h3>
        
        <div className="space-y-4">
            
            {/* Admin Section */}
            <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Shield className="w-4 h-4 text-red-600" /> Quản trị viên
                </div>
                <div 
                    onClick={() => fillCredential("admin", "admin123", "admin")}
                    className="cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors bg-gray-50 dark:bg-neutral-900 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 text-sm font-mono text-gray-600 dark:text-gray-400 flex justify-between items-center group"
                >
                    <span>admin / admin123</span>
                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                </div>
            </div>

            {/* Manager Section */}
            <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <UserCircle className="w-4 h-4 text-blue-600" /> Đại diện đội bóng
                </div>
                <div className="space-y-2">
                    <div 
                        onClick={() => fillCredential("hanoi", "hanoi123", "manager")}
                        className="cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors bg-gray-50 dark:bg-neutral-900 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 text-sm font-mono text-gray-600 dark:text-gray-400 flex justify-between items-center group"
                    >
                        <span>hanoi / hanoi123</span>
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </div>
                    <div 
                        onClick={() => fillCredential("binhdinh", "binhdinh123", "manager")}
                        className="cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors bg-gray-50 dark:bg-neutral-900 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 text-sm font-mono text-gray-600 dark:text-gray-400 flex justify-between items-center group"
                    >
                        <span>binhdinh / binhdinh123</span>
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </div>
                     <div 
                        onClick={() => fillCredential("SLNA", "SLNA123", "manager")}
                        className="cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors bg-gray-50 dark:bg-neutral-900 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 text-sm font-mono text-gray-600 dark:text-gray-400 flex justify-between items-center group"
                    >
                        <span>SLNA / SLNA123</span>
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </div>
                </div>
            </div>

            {/* Official Section */}
            <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Flag className="w-4 h-4 text-yellow-600" /> Quan chức trận đấu
                </div>
                <div className="space-y-2">
                    <div 
                        onClick={() => fillCredential("trongtai1", "trongtai123", "official")}
                        className="cursor-pointer hover:bg-yellow-50 hover:border-yellow-200 transition-colors bg-gray-50 dark:bg-neutral-900 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 text-sm font-mono text-gray-600 dark:text-gray-400 flex justify-between items-center group"
                    >
                        <span>trongtai1 / trongtai123</span>
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </div>
                    <div 
                        onClick={() => fillCredential("trongtai2", "trongtai123", "official")}
                        className="cursor-pointer hover:bg-yellow-50 hover:border-yellow-200 transition-colors bg-gray-50 dark:bg-neutral-900 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 text-sm font-mono text-gray-600 dark:text-gray-400 flex justify-between items-center group"
                    >
                        <span>trongtai2 / trongtai123</span>
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </div>
                    <div 
                        onClick={() => fillCredential("giamsat1", "giấmt123", "official")}
                        className="cursor-pointer hover:bg-yellow-50 hover:border-yellow-200 transition-colors bg-gray-50 dark:bg-neutral-900 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 text-sm font-mono text-gray-600 dark:text-gray-400 flex justify-between items-center group"
                    >
                        <span>giamsat1 / giấmt123</span>
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  )
}