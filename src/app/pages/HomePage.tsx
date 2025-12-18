import { Link } from "react-router-dom";
import imageOne from "../../assets/imageOne.png";
import { Button } from "../components/ui/button";
import { CourseCard } from "../components/CourseCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  GraduationCap,
  Users,
  Award,
  Clock,
  BookOpen,
  Target,
  TrendingUp,
  CircleCheck,
  ArrowRight,
  Star,
} from "lucide-react";

export function HomePage() {
  const featuredCourses = [
    {
      id: "web-development",
      title: "Full Stack Web Development",
      category: "Technology",
      description: "Master modern web development with HTML, CSS, JavaScript, React, and Node.js",
      duration: "6 months",
      schedule: "Mon - Fri",
      students: 250,
      imageUrl: "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc2NTk4NjgyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "ielts-preparation",
      title: "IELTS Preparation Course",
      category: "International Exams",
      description: "Comprehensive IELTS training with expert instructors to achieve your target band score",
      duration: "3 months",
      schedule: "Mon, Wed, Fri",
      students: 180,
      imageUrl: "https://images.unsplash.com/photo-1654366698665-e6d611a9aaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2NTk1NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "jamb-waec",
      title: "JAMB & WAEC Preparation",
      category: "Secondary School",
      description: "Intensive preparation for JAMB and WAEC exams with proven success rates",
      duration: "4 months",
      schedule: "Mon - Sat",
      students: 320,
      imageUrl: "https://images.unsplash.com/photo-1639741660848-a07ebe5e2ce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwc3VjY2Vzc3xlbnwxfHx8fDE3NjU5NTUzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const stats = [
    { icon: Users, value: "5,000+", label: "Students Trained" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: GraduationCap, value: "95%", label: "Success Rate" },
    { icon: BookOpen, value: "50+", label: "Courses Offered" },
  ];

  const whyChooseUs = [
    {
      icon: Target,
      title: "Result-Oriented Approach",
      description: "Focused on achieving measurable outcomes and student success in exams and certifications.",
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Highly qualified and experienced educators dedicated to student excellence.",
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Weekday and weekend classes designed to fit your busy lifestyle.",
    },
    {
      icon: TrendingUp,
      title: "Proven Track Record",
      description: "Over 95% success rate with thousands of satisfied students and graduates.",
    },
  ];

  const testimonials = [
    {
      name: "Amina Adeyemi",
      course: "IELTS Preparation",
      rating: 5,
      text: "Thanks to Zion Study Centre, I achieved a band 7.5 in IELTS! The instructors were exceptional and the study materials were comprehensive.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
    {
      name: "Chukwudi Okonkwo",
      course: "Web Development",
      rating: 5,
      text: "The web development course transformed my career. Now I'm working as a full-stack developer. Highly recommended!",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    },
    {
      name: "Blessing Michael",
      course: "JAMB Preparation",
      rating: 5,
      text: "I scored 285 in JAMB after attending the preparation classes. The teachers know exactly what they're doing!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
    {
      name: "Amina Adeyemi",
      course: "IELTS Preparation",
      rating: 5,
      text: "Thanks to Zion Study Centre, I achieved a band 7.5 in IELTS! The instructors were exceptional and the study materials were comprehensive.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
    {
      name: "Chukwudi Okonkwo",
      course: "Web Development",
      rating: 5,
      text: "The web development course transformed my career. Now I'm working as a full-stack developer. Highly recommended!",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    },
    {
      name: "Blessing Michael",
      course: "JAMB Preparation",
      rating: 5,
      text: "I scored 285 in JAMB after attending the preparation classes. The teachers know exactly what they're doing!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
  ];

  const heroImage = "https://images.unsplash.com/photo-1654366698665-e6d611a9aaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2NTk1NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white bg-cover h-[83vh] bg-center flex justify-center items-end"
        style={{
          backgroundImage: `url(${heroImage})`
        }}
      >
        
        <div className="2xl:container flex relative mx-auto px-4 z-10">
          <div className="grid items-center ">
            <div className="">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
                Transform Your Future Through Quality Education
              </h1>
              <p className="text-lg md:text-xl mb-2 text-blue-100">
                Leading multi-disciplinary educational institution for computer training, international exams, and academic excellence.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
                <Button size="lg" variant="outline" className="hover:bg-white hover:text-blue-900 bg-blue-900 text-white text-lg" asChild>
                  <Link to="/programs">View Programs</Link>
                </Button>
              </div>
            </div>
           
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-100 z-0"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center hover:scale-105 hover:shadow-md py-4 px-20 rounded-md w-fit mx-auto">
                <div className="flex justify-center mb-3mx-auto">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <stat.icon className="text-blue-700" size={32} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-16 md:py-24  bg-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive training programs designed for success in technology, international exams, and academic excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Link to="/programs/technology" className="group">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-700 transition-colors">
                  <BookOpen className="text-blue-700 group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Technology & Computer Academy
                </h3>
                <p className="text-gray-600 mb-4">
                  Professional training in web development, programming, digital marketing, graphic design, and more.
                </p>
                <span className="text-blue-700 font-semibold flex items-center gap-2">
                  Learn More <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            <Link to="/programs/international-exams" className="group">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-700 transition-colors">
                  <GraduationCap className="text-green-700 group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  International Exams & Certifications
                </h3>
                <p className="text-gray-600 mb-4">
                  Expert preparation for IELTS, TOEFL, SAT, GRE, GMAT, and Cambridge exams.
                </p>
                <span className="text-blue-700 font-semibold flex items-center gap-2">
                  Learn More <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            <Link to="/programs/secondary-exams" className="group">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-700 transition-colors">
                  <Award className="text-amber-700 group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Secondary & High School Exam Preparation
                </h3>
                <p className="text-gray-600 mb-4">
                  Intensive preparation for WAEC, NECO, JAMB, and Cambridge IGCSE exams.
                </p>
                <span className="text-blue-700 font-semibold flex items-center gap-2">
                  Learn More <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/programs">View All Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of students who have achieved success through our expert-led programs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section 
        className="py-16 md:py-24 bg-fixed bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${imageOne})`
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-[midnightblue] opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Zion Study Centre
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              We are committed to providing quality education and training that delivers real results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="text-blue-700" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Student Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from our students who have achieved their educational and career goals.
            </p>
          </div>

          <div className="mx-auto max-w-6xl px-4">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                }),
              ]}
              className="w-full relative"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="bg-white p-6 rounded-lg shadow-md h-full border">
                      <div className="flex items-center mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-3 object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.course}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={16} className="fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <p className="text-gray-700 italic">"{testimonial.text}"</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2" />
              <CarouselNext className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join Zion Study Centre today and take the first step towards achieving your academic and professional goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700" asChild>
              <Link to="/register">Register Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-blue-900 hover:bg-gray-100" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}