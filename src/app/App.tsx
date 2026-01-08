import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
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
import { LoginPage } from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminDashboard } from "./pages/dashboard/AdminDashboard";
import { InstructorDashboard } from "./pages/dashboard/InstructorDashboard";
import { MediaManagerDashboard } from "./pages/dashboard/MediaManagerDashboard";
import { GalleryPage } from "./pages/GalleryPage";
import BlogPostsComponent from "./pages/Blog";
import { StudentDashboard } from "./pages/dashboard/StudentDashboard";
import ScrollToTop from "./components/ScrollToTop";
import { ScrollToTopButton } from "./components/ScrollToTopButton";

// Layout for the public-facing website
const WebsiteLayout = () => {
  return (
    <div className="min-h-screen flex flex-col cormorant-garamond">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <ScrollToTopButton />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<WebsiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/blog" element={<BlogPostsComponent />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/programs/technology" element={<ProgramsPage />} />
            <Route path="/programs/international-exams" element={<ProgramsPage />} />
            <Route path="/programs/secondary-exams" element={<ProgramsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admissions" element={<RegisterPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/course/:id" element={<CourseDetailPage />} />
            {/* Placeholder routes */}
            <Route path="/privacy-policy" element={<ComingSoonPage title="Privacy Policy" />} />
            <Route path="/terms-conditions" element={<ComingSoonPage title="Terms & Conditions" />} />
          </Route>

          {/* System Routes (Standalone) */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Dashboard Routes (Protected) */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/media/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['media-manager']}>
                <MediaManagerDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
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
