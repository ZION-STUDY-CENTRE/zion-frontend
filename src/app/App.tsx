import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { WhatsAppFloat } from "./components/WhatsAppFloat";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ProgramsPage } from "./pages/ProgramsPage";
import { ContactPage } from "./pages/ContactPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ThankYouPage } from "./pages/ThankYouPage";
import HistoryPage from "./pages/HistoryPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/programs/technology" element={<ProgramsPage />} />
            <Route path="/programs/international-exams" element={<ProgramsPage />} />
            <Route path="/programs/secondary-exams" element={<ProgramsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admissions" element={<RegisterPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            {/* Placeholder routes for other pages */}
            <Route path="/gallery" element={<ComingSoonPage title="Gallery" />} />
            <Route path="/blog" element={<ComingSoonPage title="Blog & Resources" />} />
            <Route path="/privacy-policy" element={<ComingSoonPage title="Privacy Policy" />} />
            <Route path="/terms-conditions" element={<ComingSoonPage title="Terms & Conditions" />} />
            <Route path="/course/:id" element={<CourseDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Simple Coming Soon component for placeholder pages
function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-blue-100">
            This page is coming soon. Please check back later.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 mb-8">
            In the meantime, explore our other pages or contact us for more information.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/" className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
              Go to Home
            </a>
            <a href="/programs" className="px-6 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              View Programs
            </a>
            <a href="/contact" className="px-6 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
