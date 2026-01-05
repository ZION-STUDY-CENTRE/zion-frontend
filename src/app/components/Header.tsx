import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Search } from "lucide-react";
import { Button } from "./ui/button";
import logo from "../../assets/logo.png";
import { SearchCourse } from "./SearchCourse";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAboutUsDropdown, setIsAboutUsDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleAboutUsMobileClick = () => {
    return setIsAboutUsDropdown(!isAboutUsDropdown)
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 xl:min-h-[13vh]">
        {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold hidden lg:block xl:hidden">Zion Study Center</span>
            <span>📧 zionstudycenter@gmail.com</span>
            <span className="hidden sm:inline">📞 +234 123 456 7890</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline">Mon - Sat: 8:00 AM - 6:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-14 h-14 flex items-center justify-center">
              <img src={logo} className="h-full w-full object-cover" alt="" />
            </div>
            <div className="flex flex-col lg:hidden xl:flex">
              <span className="font-bold text-xl text-blue-900">Zion Study Centre</span>
              <span className="text-xs text-gray-600">Excellence in Education</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`hover:text-blue-700 transition-colors ${
                isActive("/") ? "text-blue-700 font-semibold" : "text-gray-700"
              }`}
            >
              Home
            </Link>
           
            {/* About us Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-700 hover:text-blue-700 transition-colors">
                About <ChevronDown size={16} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/about"
                  className="block px-4 py-2 hover:bg-blue-50 transition-colors"
                >
                  About Us
                </Link>
                <Link
                  to="/history"
                  className="block px-4 py-2 hover:bg-blue-50 transition-colors"
                >
                  Our History
                </Link>
              </div>
            </div>

            {/* Programs Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-700 hover:text-blue-700 transition-colors">
                Programs <ChevronDown size={16} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/programs"
                  className="block px-4 py-2 hover:bg-blue-50 transition-colors"
                >
                  All Programs
                </Link>
                <Link
                  to="/programs/technology"
                  className="block px-4 py-2 hover:bg-blue-50 transition-colors"
                >
                  Technology & Computer Academy
                </Link>
                <Link
                  to="/programs/international-exams"
                  className="block px-4 py-2 hover:bg-blue-50 transition-colors"
                >
                  International Exams
                </Link>
                <Link
                  to="/programs/secondary-exams"
                  className="block px-4 py-2 hover:bg-blue-50 transition-colors"
                >
                  Secondary School Preparation
                </Link>
              </div>
            </div>

            <Link
              to="/admissions"
              className={`hover:text-blue-700 transition-colors ${
                isActive("/admissions") ? "text-blue-700 font-semibold" : "text-gray-700"
              }`}
            >
              Admissions
            </Link>
            <Link
              to="/gallery"
              className={`hover:text-blue-700 transition-colors ${
                isActive("/gallery") ? "text-blue-700 font-semibold" : "text-gray-700"
              }`}
            >
              Gallery
            </Link>
            <Link
              to="/contact"
              className={`hover:text-blue-700 transition-colors ${
                isActive("/contact") ? "text-blue-700 font-semibold" : "text-gray-700"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-600 hover:text-blue-700 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Button variant="outline" asChild>
              <Link to="/contact">Enquire Now</Link>
            </Button>
            <Button asChild className="bg-blue-900 border-blue-900 border-1 hover:bg-white hover:text-blue-900">
              <Link to="/register">Register</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-600 hover:text-blue-700 transition-colors"
            >
              <Search size={24} />
            </button>
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="py-2 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>

              {/* About us Dropdown */}
              <div className="relative group">
                <p className="flex items-center gap-1 text-gray-700 hover:text-blue-700 transition-colors" onClick={() => handleAboutUsMobileClick()}>
                  About <ChevronDown size={16} />
                </p>
                {
                  isAboutUsDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-2 transition-all duration-200">
                      <Link
                        to="/about"
                        className="block px-4 py-2 hover:bg-blue-50 transition-colors"
                      >
                        About Us
                      </Link>
                      <Link
                        to="/history"
                        className="block px-4 py-2 hover:bg-blue-50 transition-colors"
                      >
                        Our History
                      </Link>
                    </div>
                  )
                }
              </div>

              <Link to="/programs" className="py-2 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>
                Programs
              </Link>
              <Link to="/admissions" className="py-2 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>
                Admissions
              </Link>
              <Link to="/gallery" className="py-2 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>
                Gallery
              </Link>
              <Link to="/contact" className="py-2 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" asChild>
                  <Link to="/contact">Enquire Now</Link>
                </Button>
                <Button asChild className="bg-blue-900 border-blue-900 border-1 hover:bg-white hover:text-blue-900">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
      
      {isSearchOpen && <SearchCourse onClose={() => setIsSearchOpen(false)} />}
    </>
  )
}
