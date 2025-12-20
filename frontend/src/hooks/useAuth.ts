import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import axios from "axios"

import {
  type Body_login_login_access_token as AccessToken,
  OpenAPI,
  type UserPublic,
  type UserRegister,
} from "@/client"
import { handleError } from "@/utils"
import useCustomToast from "./useCustomToast"

const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null
}

const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showErrorToast } = useCustomToast()

  const { data: user } = useQuery<UserPublic | null, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await axios.get(`${OpenAPI.BASE}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      })
      return res.data
    },
    enabled: isLoggedIn(),
  })

  const signUpMutation = useMutation({
    mutationFn: async (data: UserRegister) => {
      const res = await axios.post(`${OpenAPI.BASE}/api/v1/auth/signup`, data, {
        headers: { "Content-Type": "application/json" },
      })
      return res.data
    },
    onSuccess: () => {
      navigate({ to: "/login" })
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const login = async (data: AccessToken) => {
    const res = await axios.post(`${OpenAPI.BASE}/api/v1/auth/login`, data, {
      headers: { "Content-Type": "application/json" },
    })
    localStorage.setItem("access_token", res.data.token)
    if (res.data.role) {
      localStorage.setItem("role", res.data.role)
    }
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate({ to: "/" })
    },
    onError: handleError.bind(showErrorToast),
  })

  const logout = () => {
    localStorage.removeItem("access_token")
    navigate({ to: "/login" })
  }

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
  }
}

export { isLoggedIn }
export const getRole = () => localStorage.getItem("role") || null
export const isBTC = () => getRole() === "BTC"
export const isQuanLyDoi = () => ["QuanLyDoi", "CLB"].includes(getRole() || "")
export default useAuth
