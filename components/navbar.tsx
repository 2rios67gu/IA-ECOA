"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Bird, Menu, User, LogOut, History, Home, Search, BookOpen } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { isAuthenticated, user, logout, audioHistory } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/species-identification", label: "Identificación", icon: Search },
    { href: "/instructions", label: "Instrucciones", icon: BookOpen },
    { href: "/history", label: "Historial", icon: History },
  ]

  return (
    <nav className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-800 text-white shadow-xl border-b border-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Bird className="h-8 w-8 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" />
                <div className="absolute -inset-1 bg-yellow-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                EcoAcústica
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const isAccessible = !isAuthenticated ? item.href === "/" : true

              if (!isAccessible) return null

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                    isActive ? "bg-white/20 text-yellow-300 shadow-lg" : "hover:bg-white/10 hover:text-yellow-400",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.href === "/history" && audioHistory.length > 0 && (
                    <span className="bg-yellow-400 text-green-800 text-xs rounded-full px-2 py-0.5 font-medium">
                      {audioHistory.length}
                    </span>
                  )}
                </Link>
              )
            })}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-yellow-400 hover:bg-white/10 ml-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="hidden lg:block">{user?.name}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/history" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Mi Historial
                      {audioHistory.length > 0 && (
                        <span className="ml-auto bg-green-100 text-green-800 text-xs rounded-full px-2 py-0.5">
                          {audioHistory.length}
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="text-green-800 border-white hover:bg-white hover:text-green-800 ml-4"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-green-600 mt-2">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                const isAccessible = !isAuthenticated ? item.href === "/" : true

                if (!isAccessible) return null

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                      isActive ? "bg-white/20 text-yellow-300" : "hover:bg-white/10 hover:text-yellow-400",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {item.href === "/history" && audioHistory.length > 0 && (
                      <span className="bg-yellow-400 text-green-800 text-xs rounded-full px-2 py-0.5 font-medium ml-auto">
                        {audioHistory.length}
                      </span>
                    )}
                  </Link>
                )
              })}

              {isAuthenticated ? (
                <>
                  <div className="border-t border-green-600 my-2"></div>
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-yellow-300">{user?.name}</p>
                    <p className="text-xs text-green-200">{user?.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full justify-start text-white hover:text-yellow-400 hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 hover:text-yellow-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
