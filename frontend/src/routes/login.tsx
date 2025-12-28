import { useState } from "react"
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, UserCircle, Shield, Flag, Briefcase, Users } from "lucide-react"
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

import { AuthService, UsersService, ApiError, OpenAPI } from "@/client"

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

  const getRoleName = (role: string) => {
    const map: Record<string, string> = {
      'admin': 'Quản trị viên',
      'btc': 'Ban tổ chức',
      'referee': 'Trọng tài',
      'club': 'Đại diện CLB'
    };
    return map[role] || role;
  }

  const inferRoleFromUser = (user: any): string => {
      // Priority 1: Check explicit role string from backend
      if (user.role && user.role !== "null") {
          const r = String(user.role).toLowerCase();
          if (r === 'admin') return 'admin';
          if (r === 'btc') return 'btc';
          if (r === 'trongtai') return 'referee';
          if (r === 'clb') return 'club';
          if (r === 'quanlydoi') return 'club'; // Fallback for legacy/other naming
      }

      // Priority 2: Check MaNhom (User Group ID)
      if (user.manhom && user.manhom !== null) {
          if (user.manhom === 1) return "admin";
          if (user.manhom === 2) return "btc";
          if (user.manhom === 3) return "referee";
          if (user.manhom === 4) return "club";
      }

      // Priority 3: Infer from username (fallback)
      const username = (user.tendangnhap || user.username || "").toLowerCase();

      if (username.includes("admin") || username.includes("quantri")) return "admin";
      if (username.includes("btc")) return "btc";
      if (username.includes("trongtai") || username.includes("referee")) return "referee";
      if (username.includes("clb") || username.includes("club") || username.includes("quanly")) return "club";
      
      return "club"; // Default fallback
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

      const accessToken = (response as any).token;

      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
        OpenAPI.TOKEN = accessToken;

        try {
            const currentUser: any = await UsersService.readUserMe();
            const realRole = inferRoleFromUser(currentUser);
            
            // Allow admin to login as any role for testing/convenience if needed, 
            // but strict check requires matching role. 
            // Here we enforce strict check as per previous logic.
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-background p-4 gap-6 transition-colors duration-300">
      
      {/* KHUNG ĐĂNG NHẬP CHÍNH */}
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg">
            {uiRole === "admin" && <Shield className="h-8 w-8" />}
            {uiRole === "btc" && <Briefcase className="h-8 w-8" />}
            {uiRole === "referee" && <Flag className="h-8 w-8" />}
            {uiRole === "club" && <Users className="h-8 w-8" />}
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-foreground">
            Đăng nhập hệ thống
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-muted-foreground">
             V-League 1 Management System
          </p>
        </div>

        <div className="bg-white dark:bg-card py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border dark:border-border transition-colors duration-300">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-foreground">Vai trò</Label>
              <Select value={uiRole} onValueChange={setUiRole}>
                <SelectTrigger className="h-11 bg-white dark:bg-background dark:border-input dark:text-foreground">
                  <SelectValue placeholder="Chọn vai trò đăng nhập" />
                </SelectTrigger>
                <SelectContent className="dark:bg-popover dark:border-border">
                  <SelectItem value="admin" className="font-medium dark:text-foreground dark:focus:bg-accent">
                    <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-red-600" /> Quản trị viên</div>
                  </SelectItem>
                  <SelectItem value="btc" className="font-medium dark:text-foreground dark:focus:bg-accent">
                    <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-purple-600" /> Ban tổ chức</div>
                  </SelectItem>
                  <SelectItem value="referee" className="font-medium dark:text-foreground dark:focus:bg-accent">
                    <div className="flex items-center gap-2"><Flag className="w-4 h-4 text-yellow-600" /> Trọng tài</div>
                  </SelectItem>
                  <SelectItem value="club" className="font-medium dark:text-foreground dark:focus:bg-accent">
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" /> Đại diện CLB</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="dark:text-foreground">Tên đăng nhập</Label>
              <Input id="username" className="h-11 bg-white dark:bg-background dark:border-input dark:text-foreground" {...register("username")} placeholder="Nhập tên đăng nhập"/>
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-foreground">Mật khẩu</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} className="h-11 pr-10 bg-white dark:bg-background dark:border-input dark:text-foreground" {...register("password")} placeholder="Nhập mật khẩu"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11 bg-red-700 hover:bg-red-800 text-white font-bold dark:bg-red-800 dark:hover:bg-red-900" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang kiểm tra...</> : "Đăng nhập"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground dark:text-muted-foreground">Chưa có tài khoản? </span>
            <Link to="/register" className="font-bold text-red-700 hover:underline dark:text-red-500">Đăng ký ngay</Link>
          </div>
        </div>
      </div>


    </div>
  )
}