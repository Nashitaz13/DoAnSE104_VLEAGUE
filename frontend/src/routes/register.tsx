import { useState } from "react"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, UserPlus, Shield, UserCircle, Flag } from "lucide-react"

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

import { AuthService, ApiError } from "@/client"

const registerSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải trên 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải trên 6 ký tự"),
  confirmPassword: z.string(),
  role: z.enum(["admin", "manager", "official"], {
    required_error: "Vui lòng chọn vai trò",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "manager",
    },
  })
  
  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true)
      
      await AuthService.signup({
        requestBody: {
          username: data.username,
          password: data.password,
          role: data.role, 
          
          email: "",
          full_name: data.username 
        }
      })
      
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      router.navigate({ to: "/login" })
      
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error)
      let message = "Đăng ký thất bại."
      
      if (error instanceof ApiError) {
         message = (error.body as any)?.detail || error.message;
      }
      
      alert(message);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
             {selectedRole === 'admin' && <Shield className="h-8 w-8" />}
             {selectedRole === 'manager' && <UserCircle className="h-8 w-8" />}
             {selectedRole === 'official' && <Flag className="h-8 w-8" />}
             {!selectedRole && <UserPlus className="h-8 w-8" />}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Đăng ký tài khoản</h2>
          <p className="mt-2 text-sm text-gray-600">Tạo tài khoản mới để tham gia hệ thống</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label className="text-base font-semibold">Vai trò đăng ký</Label>
            <Select 
              onValueChange={(val) => setValue("role", val as any)} 
              defaultValue="manager"
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin" className="font-medium">
                  <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-600"/> Quản trị viên
                  </div>
                </SelectItem>
                <SelectItem value="manager" className="font-medium">
                  <div className="flex items-center gap-2">
                      <UserCircle className="w-4 h-4 text-blue-600"/> Quản lý đội bóng
                  </div>
                </SelectItem>
                <SelectItem value="official" className="font-medium">
                   <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-yellow-600"/> Quan chức trận đấu
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Tên đăng nhập</Label>
            <Input className="h-11" {...register("username")} placeholder="Chọn tên đăng nhập" />
            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Mật khẩu</Label>
            <Input className="h-11" type="password" {...register("password")} placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)" />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
             <Label>Xác nhận mật khẩu</Label>
             <Input className="h-11" type="password" {...register("confirmPassword")} placeholder="Nhập lại mật khẩu" />
             {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full h-11 bg-red-700 hover:bg-red-800 font-bold" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin mr-2"/> : "Đăng ký ngay"}
          </Button>
        </form>

        <div className="text-center text-sm">
          Đã có tài khoản? <Link to="/login" className="font-bold text-red-700 hover:underline">Đăng nhập</Link>
        </div>
      </div>
    </div>
  )
}