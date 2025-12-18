import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import logo from "../../assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-14 h-14 flex items-center justify-center">
                <img src={logo} className="h-full w-full object-cover" alt="" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Zion Study Centre</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              A leading multi-disciplinary educational and training institution committed to academic excellence and professional development.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-gray-400 hover:text-white transition-colors">
                  Our Programs
                </Link>
              </li>
              <li>
                <Link to="/admissions" className="text-gray-400 hover:text-white transition-colors">
                  Admissions
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-bold text-lg mb-4">Programs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/programs/technology" className="text-gray-400 hover:text-white transition-colors">
                  Technology & Computer Academy
                </Link>
              </li>
              <li>
                <Link to="/programs/international-exams" className="text-gray-400 hover:text-white transition-colors">
                  International Exams (IELTS, TOEFL, SAT, GRE)
                </Link>
              </li>
              <li>
                <Link to="/programs/secondary-exams" className="text-gray-400 hover:text-white transition-colors">
                  Secondary School Preparation
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Resources & Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Education Street,<br />
                  Victoria Island, Lagos,<br />
                  Nigeria
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-500 flex-shrink-0" />
                <span className="text-gray-400">+234 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-500 flex-shrink-0" />
                <span className="text-gray-400">zionstudycenter@gmail.com</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Office Hours:</p>
              <p className="text-sm">Mon - Sat: 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>All Rights Reserved. © 2024 Zion Study Center & Leadership Academy</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
