import {
  createFileRoute,
  Outlet,
  Link as RouterLink,
  redirect,
} from "@tanstack/react-router"
import {
  BarChart3,
  Calendar,
  LogOut,
  Monitor,
  Moon,
  Sun,
  Trophy,
  User,
  Users,
} from "lucide-react"
import { Footer } from "@/components/Common/Footer"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useAuth, { isBTC, isLoggedIn, isQuanLyDoi } from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      })
    }
  },
})

function Layout() {
  const { user: currentUser, logout } = useAuth()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const navItems = [
    { to: "/", label: "Trang chủ", Icon: Trophy },
    { to: "/fixtures", label: "Lịch thi đấu", Icon: Calendar },
    { to: "/league-table", label: "Bảng xếp hạng", Icon: BarChart3 },
    { to: "/stats", label: "Thống kê", Icon: BarChart3 },
    { to: "/teams", label: "Đội bóng", Icon: Users },
  ]

  return (
    <>
      <header className="sticky top-0 z-10 shrink-0 border-b">
        <div className="bg-gradient-to-r from-red-800 to-red-900 dark:from-neutral-900 dark:to-neutral-800">
          <div className="px-4 md:px-6">
            <div className="flex h-16 items-center justify-between">
              <RouterLink to="/" className="flex items-center gap-3">
                <div className="bg-white dark:bg-neutral-800 p-2 rounded-lg">
                  <Trophy className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-white dark:text-white">
                  <div className="text-lg font-bold leading-none">
                    V-League 1
                  </div>
                  <div className="text-xs text-red-100 dark:text-red-200">
                    Giải Vô Địch Bóng Đá Quốc Gia
                  </div>
                </div>
              </RouterLink>

              <nav className="hidden md:flex items-center gap-2">
                {navItems.map(({ to, label, Icon }) => (
                  <Button
                    key={to}
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-red-500 dark:hover:bg-red-600 [&.active]:bg-white [&.active]:text-red-600 [&.active]:hover:bg-gray-100 dark:[&.active]:bg-neutral-800 dark:[&.active]:text-white dark:[&.active]:hover:bg-neutral-700"
                  >
                    <RouterLink to={to} className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </RouterLink>
                  </Button>
                ))}
                {isBTC() && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-red-500 dark:hover:bg-red-600 [&.active]:bg-white [&.active]:text-red-600 [&.active]:hover:bg-gray-100 dark:[&.active]:bg-neutral-800 dark:[&.active]:text-white dark:[&.active]:hover:bg-neutral-700"
                  >
                    <RouterLink
                      to="/admin-dashboard"
                      className="flex items-center"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Quản trị
                    </RouterLink>
                  </Button>
                )}
                {isQuanLyDoi() && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-red-500 dark:hover:bg-red-600 [&.active]:bg-white [&.active]:text-red-600 [&.active]:hover:bg-gray-100 dark:[&.active]:bg-neutral-800 dark:[&.active]:text-white dark:[&.active]:hover:bg-neutral-700"
                  >
                    <RouterLink
                      to="/team-manager"
                      className="flex items-center"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Quản lý đội
                    </RouterLink>
                  </Button>
                )}
              </nav>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-red-500 dark:hover:bg-red-600"
                      aria-label="Chế độ giao diện"
                    >
                      {resolvedTheme === "dark" ? (
                        <Moon className="h-4 w-4" />
                      ) : resolvedTheme === "light" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Monitor className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup
                      value={theme}
                      onValueChange={(value) =>
                        setTheme(value as "light" | "dark" | "system")
                      }
                    >
                      <DropdownMenuRadioItem value="light">
                        Sáng
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark">
                        Tối
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="system">
                        Hệ thống
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                {currentUser ? (
                  <>
                    <div className="text-white dark:text-white text-sm">
                      <span className="hidden sm:inline">Xin chào, </span>
                      <span className="font-medium">
                        {currentUser.full_name ||
                          (currentUser as any).tendangnhap ||
                          currentUser.email}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="text-white hover:bg-red-500 dark:hover:bg-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-red-500 dark:hover:bg-red-600 [&.active]:bg-white [&.active]:text-red-600 [&.active]:hover:bg-gray-100 dark:[&.active]:bg-neutral-800 dark:[&.active]:text-white dark:[&.active]:hover:bg-neutral-700"
                  >
                    <RouterLink to="/login" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Đăng nhập
                    </RouterLink>
                  </Button>
                )}
              </div>

              <div className="md:hidden pb-3">
                <div className="flex flex-wrap gap-2">
                  {navItems.map(({ to, label, Icon }) => (
                    <Button
                      key={to}
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-red-500 dark:hover:bg-red-600 [&.active]:bg-white [&.active]:text-red-600 [&.active]:hover:bg-gray-100 dark:[&.active]:bg-neutral-800 dark:[&.active]:text-white dark:[&.active]:hover:bg-neutral-700"
                    >
                      <RouterLink to={to} className="flex items-center">
                        <Icon className="h-4 w-4 mr-1" />
                        {label}
                      </RouterLink>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Layout
