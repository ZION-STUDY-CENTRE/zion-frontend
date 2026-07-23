import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import logo from "../../assets/logo.png";
import { getWhatsAppLink } from "../../utils/whatsapp";

const TikTokIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M192 64a64 64 0 0 1-64-64v96a32 32 0 1 0 32 32h32V64zM88 152a40 40 0 1 0 40 40 40 40 0 0 0-40-40z" />
  </svg>
);

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
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/share/1F6xj2FNDL/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="https://www.tiktok.com/@zionstudy1?_r=1&_t=ZN-981wClAfoO7"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <TikTokIcon size={16} />
                </a>
                <a
                  href="https://www.instagram.com/zionstudycentre1?igsh=OHF1c3Vnb2UwMTNq&utm_source=qr"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/company/zion-study-centre/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Linkedin size={16} />
                </a>
              </div>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
              >
                Need Help Choosing a Programme? Chat with Us on WhatsApp
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
                  ZION TOWERS OPPOSITE MTN OFFICE ALONG GENERAL HOSPITAL, <br/>
                  KUBWA Abuja.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-500 flex-shrink-0" />
                <span className="text-gray-400">+234 803 329 7541 OR +234 817 938 3426</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-500 flex-shrink-0" />
                <span className="text-gray-400">info@zionstudycentre.com.ng</span>
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
          <p>All Rights Reserved. © 2024 Zion Study Centre & Leadership Academy</p>
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
