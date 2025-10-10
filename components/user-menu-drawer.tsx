"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { AddressManagement } from "@/components/address-management"

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const LogOutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
)

const LoginIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  </svg>
)

const UserPlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
    />
  </svg>
)

interface UserMenuDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function UserMenuDrawer({ isOpen, onClose }: UserMenuDrawerProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogin = () => {
    onClose()
    router.push("/login")
  }

  const handleRegister = () => {
    onClose()
    router.push("/register")
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>用户中心</SheetTitle>
          <SheetDescription>{isAuthenticated ? "管理您的账户设置" : "登录以使用完整功能"}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {isAuthenticated ? (
            <>
              {/* User Info Section */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user?.username}</p>
                  <p className="text-sm text-muted-foreground truncate">{user?.role}</p>
                </div>
              </div>

              <Separator />

              {/* User Actions */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    onClose()
                    router.push("/services")
                  }}
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  服务管理
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    onClose()
                    router.push("/developer")
                  }}
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  开发者控制台
                </Button>
              </div>

              <Separator />

              {/* Address Management */}
              <AddressManagement />

              <Separator />

              {/* Logout Button */}
              <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                <LogOutIcon className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </>
          ) : (
            <>
              {/* Not Logged In Section */}
              <div className="space-y-4">
                <div className="text-center p-6 rounded-lg bg-muted/50">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">登录后即可使用语音交互、服务管理等完整功能</p>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" onClick={handleLogin}>
                    <LoginIcon className="w-4 h-4 mr-2" />
                    登录
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleRegister}>
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    注册新账号
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
