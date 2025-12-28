import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

// import { type UserPublic, UsersService } from "@/client"
// import AddUser from "@/components/Admin/AddUser"
// import { columns, type UserTableData } from "@/components/Admin/columns"
// import { DataTable } from "@/components/Common/DataTable"
// import PendingUsers from "@/components/Pending/PendingUsers"
import useAuth from "@/hooks/useAuth"

/*
function getUsersQueryOptions() {
  return {
    queryFn: () => UsersService.readUsers({ skip: 0, limit: 100 }),
    queryKey: ["users"],
  }
}
*/

export const Route = createFileRoute("/_layout/admin")({
  component: Admin,
  head: () => ({
    meta: [
      {
        title: "Admin - FastAPI Cloud",
      },
    ],
  }),
})

function UsersTableContent() {
  const { user: currentUser } = useAuth()
  const { data: users } = useSuspenseQuery({
    queryFn: () => fetch("/api/users?skip=0&limit=100").then(res => res.json()),
    queryKey: ["users"],
  })

  const tableData = users.data.map((user: any) => ({

    ...user,
    isCurrentUser: currentUser?.id === user.id,
  }))
  // TODO: use tableData once DataTable component is restored
  console.log(tableData) // Suppress unused warning

  return <div className="rounded-md border p-4">DataTable component not available</div>
}

function UsersTable() {
  return (
    <Suspense fallback={<div className="rounded-md border p-4">Loading users...</div>}>
      <UsersTableContent />
    </Suspense>
  )
}

function Admin() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Người dùng</h1>
          <p className="text-muted-foreground">
            Quản lý tài khoản và phân quyền
          </p>
        </div>
        {/* <AddUser /> */}
      </div>
      <UsersTable />
    </div>
  )
}
