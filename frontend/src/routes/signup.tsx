import { zodResolver } from "@hookform/resolvers/zod"
import {
  createFileRoute,
  Link as RouterLink,
  redirect,
} from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AuthLayout } from "@/components/Common/AuthLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/ui/loading-button"
import { PasswordInput } from "@/components/ui/password-input"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"

const formSchema = z
  .object({
    email: z.email({ message: "Email không hợp lệ" }),
    full_name: z.string().min(1, { message: "Vui lòng nhập họ tên" }),
    password: z
      .string()
      .min(1, { message: "Vui lòng nhập mật khẩu" })
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" }),
    confirm_password: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  })

type FormData = z.infer<typeof formSchema>

export const Route = createFileRoute("/signup")({
  component: SignUp,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
  head: () => ({
    meta: [
      {
        title: "Đăng ký - V-League",
      },
    ],
  }),
})

function SignUp() {
  const { signUpMutation } = useAuth()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
    },
  })

  const onSubmit = (data: FormData) => {
    if (signUpMutation.isPending) return

    // exclude confirm_password from submission data
    const { confirm_password: _confirm_password, ...submitData } = data
    signUpMutation.mutate(submitData)
  }

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center py-6 bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-900 dark:to-orange-800 rounded-2xl text-white shadow-lg transition-colors">
          <h1 className="text-3xl font-bold mb-2">Đăng ký tài khoản</h1>
          <p className="text-red-100 dark:text-red-200">
            V-League 1 Management System
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Thông tin tài khoản
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="full_name">Họ tên</Label>
                      <FormControl>
                        <Input
                          id="full_name"
                          type="text"
                          placeholder="Nhập họ tên"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email">Email</Label>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="user@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password">Mật khẩu</Label>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="Nhập mật khẩu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="confirm_password">
                        Xác nhận mật khẩu
                      </Label>
                      <FormControl>
                        <PasswordInput
                          id="confirm_password"
                          placeholder="Nhập lại mật khẩu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <LoadingButton
                  type="submit"
                  className="w-full"
                  loading={signUpMutation.isPending}
                >
                  Đăng ký
                </LoadingButton>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="text-center text-sm">
          Đã có tài khoản?{" "}
          <RouterLink to="/login" className="underline underline-offset-4">
            Đăng nhập
          </RouterLink>
        </div>
      </div>
    </AuthLayout>
  )
}

export default SignUp
