import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, Link as RouterLink } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { AuthLayout } from "@/components/Common/AuthLayout"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import useAuth from "@/hooks/useAuth"

const formSchema = z.object({
  username: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập" }),
  password: z
    .string()
    .min(1, { message: "Vui lòng nhập mật khẩu" })
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" }),
})

type FormData = z.infer<typeof formSchema>

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({
    meta: [
      {
        title: "Đăng nhập - V-League",
      },
    ],
  }),
})

function Login() {
  const { loginMutation } = useAuth()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: { username: "", password: "" },
  })

  const onSubmit = (data: FormData) => {
    if (loginMutation.isPending) return
    const { username, password } = data
    loginMutation.mutate({ username, password } as any)
  }

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center py-6 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl text-white">
          <h1 className="text-3xl font-bold mb-2">Đăng nhập hệ thống</h1>
          <p className="text-red-100">V-League 1 Management System</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Thông tin đăng nhập
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="username">Tên đăng nhập</Label>
                      <FormControl>
                        <Input
                          id="username"
                          type="text"
                          placeholder="Nhập tên đăng nhập"
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
                      <div className="flex items-center">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <RouterLink
                          to="/recover-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Quên mật khẩu?
                        </RouterLink>
                      </div>
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
                {form.formState.errors.root?.message && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {form.formState.errors.root.message}
                    </AlertDescription>
                  </Alert>
                )}
                <LoadingButton
                  type="submit"
                  className="w-full"
                  loading={loginMutation.isPending}
                >
                  Đăng nhập
                </LoadingButton>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="text-center text-sm">
          Chưa có tài khoản?{" "}
          <RouterLink to="/signup" className="underline underline-offset-4">
            Đăng ký
          </RouterLink>
        </div>
      </div>
    </AuthLayout>
  )
}
