import { Link } from "react-router-dom";
import { CourseCard } from "../components/CourseCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";

export function ProgramsPage() {
  const technologyCourses = [
    {
      id: "web-dev",
      title: "Full Stack Web Development",
      category: "Technology",
      description: "Learn HTML, CSS, JavaScript, React, Node.js, and database management",
      duration: "6 months",
      schedule: "Mon, Wed, Fri",
      students: 250,
    },
    {
      id: "graphic-design",
      title: "Graphic Design & Digital Marketing",
      category: "Technology",
      description: "Master Adobe Photoshop, Illustrator, and digital marketing strategies",
      duration: "4 months",
      schedule: "Tue, Thu, Sat",
      students: 180,
    },
    {
      id: "data-science",
      title: "Data Science & Analytics",
      category: "Technology",
      description: "Python programming, machine learning, and data visualization",
      duration: "5 months",
      schedule: "Weekdays",
      students: 150,
    },
  ];

  const internationalExams = [
    {
      id: "ielts",
      title: "IELTS Preparation",
      category: "International Exams",
      description: "Comprehensive preparation for all IELTS sections - Listening, Reading, Writing, Speaking",
      duration: "3 months",
      schedule: "Mon, Wed, Fri",
      students: 200,
    },
    {
      id: "toefl",
      title: "TOEFL Preparation",
      category: "International Exams",
      description: "Expert coaching for TOEFL iBT with practice tests and strategies",
      duration: "3 months",
      schedule: "Tue, Thu, Sat",
      students: 150,
    },
    {
      id: "sat-gre",
      title: "SAT & GRE Coaching",
      category: "International Exams",
      description: "Intensive preparation for SAT and GRE with proven success strategies",
      duration: "4 months",
      schedule: "Weekdays",
      students: 120,
    },
  ];

  const secondaryExams = [
    {
      id: "jamb",
      title: "JAMB UTME Preparation",
      category: "Secondary School",
      description: "Complete JAMB preparation covering all subjects and practice tests",
      duration: "4 months",
      schedule: "Mon - Sat",
      students: 300,
    },
    {
      id: "waec",
      title: "WAEC Preparation",
      category: "Secondary School",
      description: "Thorough WAEC preparation with experienced teachers",
      duration: "6 months",
      schedule: "Mon - Sat",
      students: 280,
    },
    {
      id: "neco",
      title: "NECO Preparation",
      category: "Secondary School",
      description: "Expert coaching for NECO examinations",
      duration: "5 months",
      schedule: "Mon - Sat",
      students: 200,
    },
  ];

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
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-12">
              <TabsTrigger value="all">All Programs</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
              <TabsTrigger value="international">International</TabsTrigger>
              <TabsTrigger value="secondary">Secondary</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-16">
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
                  {technologyCourses.map((course) => (
                    <CourseCard key={course.id} {...course} />
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
                  {internationalExams.map((course) => (
                    <CourseCard key={course.id} {...course} />
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
                  {secondaryExams.map((course) => (
                    <CourseCard key={course.id} {...course} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="technology">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {technologyCourses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="international">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {internationalExams.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="secondary">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {secondaryExams.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
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
