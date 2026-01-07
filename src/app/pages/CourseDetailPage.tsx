import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  ArrowRight,
  Download
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { getProgramBySlug, Program } from '../services/api';

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProgramBySlug(id)
      .then(data => {
        setCourse(data);
        setError(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        <div className="text-xl text-gray-600">Loading course details...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Course Not Found</h1>
        <p className="text-gray-600">The course you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link to="/programs">Browse All Programs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={course.heroImage || course.imageUrl} 
            alt={course.title} 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-6 h-full flex flex-col justify-center">
          <div className="max-w-4xl">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-900 text-sm font-medium mb-6 tracking-wide uppercase">
              {course.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              {course.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed">
              {course.shortDescription || course.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Main Info */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Overview */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Overview</h2>
              <div className="prose prose-lg text-gray-600 leading-relaxed">
                <p>{course.overview || course.description}</p>
                <p className="mt-4">
                  At Zion Study Centre, we believe in a holistic approach to education. This course not only covers the technical aspects but also focuses on soft skills, critical thinking, and professional development to ensure you are well-rounded and ready for the challenges of the modern workplace.
                </p>
              </div>
            </section>

            {/* Course Structure */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Course Structure</h2>
              <div className="grid gap-6">
                {course.modules && course.modules.map((module, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg text-blue-700 mt-1">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                        <p className="text-gray-600">{module.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Entry Requirements */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Entry Requirements</h2>
              <div className="bg-white border-l-4 border-red-600 p-8 shadow-sm">
                <ul className="space-y-4">
                  {course.entryRequirements && course.entryRequirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 className="text-red-600 flex-shrink-0 mt-1" size={20} />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Career Opportunities */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Career Opportunities</h2>
              <p className="text-gray-600 mb-6">
                Graduates of this program are well-equipped to pursue various roles in the industry, including:
              </p>
              <div className="flex flex-wrap gap-3">
                {course.careerOpportunities && course.careerOpportunities.map((career, index) => (
                  <span key={index} className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full font-medium text-sm">
                    {career}
                  </span>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-30 space-y-8">
              
              {/* Key Stats Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-blue-900 text-white p-6">
                  <h3 className="text-xl font-bold">Key Information</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <Clock className="text-gray-400" size={24} />
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Duration</p>
                      <p className="text-gray-900 font-medium">{course.keyStats.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Briefcase className="text-gray-400" size={24} />
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Study Mode</p>
                      <p className="text-gray-900 font-medium">{course.keyStats.studyMode}</p>
                    </div>
                  </div>

                  {/* <div className="flex items-center gap-4">
                    <Calendar className="text-gray-400" size={24} />
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Intakes</p>
                      <p className="text-gray-900 font-medium">{course.keyStats.intakes.join(", ")}</p>
                    </div>
                  </div> */}

                  <div className="flex items-center gap-4">
                    <GraduationCap className="text-gray-400" size={24} />
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Certification</p>
                      <p className="text-gray-900 font-medium">{course.keyStats.certification}</p>
                    </div>
                  </div>

                  {/* <div className="pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Course Fees</p>
                    <p className="text-2xl font-bold text-blue-900">{course.fees}</p>
                  </div> */}

                  <div className="pt-4 flex flex-col gap-3">
                    <Button className="w-full bg-blue-900  text-white py-6 text-lg" asChild>
                      <Link to="/register">Apply Now</Link>
                    </Button>
                    <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50 py-6" asChild>
                      <Link to="/contact">Enquire</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Download Brochure */}
              {/* <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Need more information?</h4>
                <p className="text-gray-600 text-sm mb-4">Download our detailed course brochure for complete curriculum and schedule.</p>
                <button className="flex items-center gap-2 text-blue-700 font-medium hover:underline">
                  <Download size={18} />
                  <span>Download Brochure (PDF)</span>
                </button>
              </div> */}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
