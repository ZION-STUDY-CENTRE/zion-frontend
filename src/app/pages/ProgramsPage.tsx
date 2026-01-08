import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CourseCard } from "../components/CourseCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { getPrograms, Program } from "../services/api";
import { Pagination } from "../components/Pagination";

const ITEMS_PER_PAGE = 10;

export function ProgramsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPageTech, setCurrentPageTech] = useState(1);
  const [currentPageInt, setCurrentPageInt] = useState(1);
  const [currentPageSec, setCurrentPageSec] = useState(1);

  const paginate = (items: any[], pageNumber: number) => {
      const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
      return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getPrograms();
        setPrograms(data);
      } catch (error) {
        console.error("Failed to fetch programs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  // Determine active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/technology")) return "technology";
    if (path.includes("/international-exams")) return "international";
    if (path.includes("/secondary-exams")) return "secondary";
    return "all";
  };

  const activeTab = getActiveTab();

  const handleTabChange = (value: string) => {
    switch (value) {
      case "technology":
        navigate("/programs/technology");
        break;
      case "international":
        navigate("/programs/international-exams");
        break;
      case "secondary":
        navigate("/programs/secondary-exams");
        break;
      default:
        navigate("/programs");
    }
  };

  const technologyCourses = programs.filter(course => course.category === "Technology");
  const internationalExams = programs.filter(course => course.category === "International Exams");
  const secondaryExams = programs.filter(course => course.category === "Secondary School");

  // Helper to map Program to CourseCard props
  // The API already maps 'code' to 'id' for us
  const mapToCard = (course: Program) => ({
    id: course.id || course.code, 
    title: course.title,
    category: course.category,
    description: course.description || course.shortDescription,
    duration: course.keyStats.duration,
    schedule: course.schedule || course.keyStats.studyMode,
    students: course.students,
    imageUrl: course.imageUrl || course.heroImage
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Programs</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Explore our comprehensive range of programs designed to help you achieve your academic and professional goals.
          </p>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-12">
              <TabsTrigger value="all">All Programs</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
              <TabsTrigger value="international">International</TabsTrigger>
              <TabsTrigger value="secondary">Secondary</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-16">
              {loading ? (
                <div className="text-center py-12">Loading programs...</div>
              ) : programs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">No programs found.</p>
                    <p className="text-sm mt-2">Please check back later or contact support.</p>
                </div>
              ) : (
                <>
                {/* Technology */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Technology & Computer Academy</h2>
                      <p className="text-gray-600">Professional training in modern technology skills</p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link to="/programs/technology">View All</Link>
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {technologyCourses.slice(0, 6).map((course) => (
                      <CourseCard key={course._id} {...mapToCard(course)} />
                    ))}
                  </div>
                </div>

                {/* International Exams */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">International Exams</h2>
                      <p className="text-gray-600">Expert preparation for global examinations</p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link to="/programs/international-exams">View All</Link>
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {internationalExams.slice(0, 6).map((course) => (
                      <CourseCard key={course._id} {...mapToCard(course)} />
                    ))}
                  </div>
                </div>

                {/* Secondary Exams */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Secondary & High School Preparation</h2>
                      <p className="text-gray-600">Intensive coaching for academic success</p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link to="/programs/secondary-exams">View All</Link>
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {secondaryExams.slice(0, 6).map((course) => (
                      <CourseCard key={course._id} {...mapToCard(course)} />
                    ))}
                  </div>
                </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="technology">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {paginate(technologyCourses, currentPageTech).map((course) => (
                  <CourseCard key={course._id} {...mapToCard(course)} />
                ))}
              </div>
              {technologyCourses.length > 0 && (
                <Pagination 
                    currentPage={currentPageTech}
                    totalPages={Math.ceil(technologyCourses.length / ITEMS_PER_PAGE)}
                    onPageChange={setCurrentPageTech}
                />
              )}
            </TabsContent>

            <TabsContent value="international">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {paginate(internationalExams, currentPageInt).map((course) => (
                  <CourseCard key={course._id} {...mapToCard(course)} />
                ))}
              </div>
               {internationalExams.length > 0 && (
                <Pagination 
                    currentPage={currentPageInt}
                    totalPages={Math.ceil(internationalExams.length / ITEMS_PER_PAGE)}
                    onPageChange={setCurrentPageInt}
                />
              )}
            </TabsContent>

            <TabsContent value="secondary">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {paginate(secondaryExams, currentPageSec).map((course) => (
                  <CourseCard key={course._id} {...mapToCard(course)} />
                ))}
              </div>
               {secondaryExams.length > 0 && (
                <Pagination 
                    currentPage={currentPageSec}
                    totalPages={Math.ceil(secondaryExams.length / ITEMS_PER_PAGE)}
                    onPageChange={setCurrentPageSec}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us to discuss custom programs or get more information about our offerings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-blue-700 hover:bg-blue-800">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register">Register Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
