"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuthenticator } from "@aws-amplify/ui-react"
import { signOut } from "aws-amplify/auth"
import toast from "react-hot-toast"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const amplifyAuth = useAuthenticator((context) => [context.error]);
  const isAuthenticated = amplifyAuth.authStatus === "authenticated";

  console.log("Authenitcated",isAuthenticated)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  async function handleLogout() {
    try {
      const logout = await signOut();
      console.log("Logout", logout)
      // Additional logic after successful logout
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out. Please try again.")
    }
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled ? "bg-white/70 backdrop-blur-md shadow-sm" : "bg-white shadow-md",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl">
              Al Ramz Bot
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm hover:bg-gray-100">
                Home
              </Link>
              <Link href="#contact" className="px-3 py-2 rounded-md text-sm hover:bg-gray-100">
                Contact
              </Link>
              {isAuthenticated ? 
                <Button size="sm" onClick={handleLogout}>
                  Logout
                </Button>:
                <Button size="sm"  >
                  Get Started
                </Button>
              }
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-3 pt-2">
            <div className="flex flex-col space-y-2 px-2">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#features"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#contact"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {isAuthenticated ? 
                (<Button className="w-full" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                  Logout
                </Button> ):
                (<Button className="w-full" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                  Get Started
                </Button>)
              }
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

