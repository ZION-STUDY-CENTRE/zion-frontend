import { useState, useEffect } from "react";
import { Link, Links } from "react-router-dom";
import imageOne from "../../assets/imageOne.png";
import { Button } from "../components/ui/button";
import { CourseCard } from "../components/CourseCard";
import SearchCourse from "../components/SearchCourse";
import ChooseZion from "../components/ChooseZion";
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
  Search,
} from "lucide-react";
import AboutSummaryComponent from "../components/AboutSummary";
import OurPrograms from "../components/OurPrograms";
import ParallaxSection from "../components/ParallaxSection";

import { getBlogPosts, BlogPost, getPrograms, Program } from "../services/api";

export function HomePage() {
  const [latestPost, setLatestPost] = useState<BlogPost | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [posts, programsData] = await Promise.all([
          getBlogPosts(),
          getPrograms()
        ]);
        
        if (posts.length > 0) {
           // Sort by date descending
           const sorted = [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
           setLatestPost(sorted[0]);
        }
        
        if (programsData) {
          setPrograms(programsData);
        }
      } catch (error) {
        console.error("Failed to fetch data for homepage", error);
      }
    };
    fetchData();
  }, []);

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

  const heroImages = [
    "https://images.unsplash.com/photo-1654366698665-e6d611a9aaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2NTk1NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="group relative text-white h-[70vh] flex justify-start items-end overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-start transition-all duration-1000 ease-in-out group-hover:scale-110 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${latestPost ? latestPost.image : image})` }}
          />
        ))}
        
        <div className="2xl:container flex relative px-4 z-10 mx-auto mb-10">
          <div className="grid items-end ">
            <div className="">
              
               <div className="relative inline-block">
                <Link to="/blog" className="block group/link">
                {
                  latestPost && 
                    <span className="inline-block bg-blue-900 text-white text-xs px-2 py-1 mb-2 font-bold uppercase tracking-wider rounded-sm">
                      Latest News
                    </span>
                }
                  
                  <h3 className="text-3xl lg:text-4xl mb-1 font-bold leading-tight ">
                    {latestPost ? latestPost.shortDescription : "Zion Study Center & Leadership Academy"}
                  </h3>
                </Link>
                  <span
                    className="absolute left-0 bottom-1 h-[2px] w-full bg-blue-900 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
                </div>
            </div>
           
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-100 z-0"></div>
      </section>
      
      <SearchCourse />

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-8">
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

      <AboutSummaryComponent/>

      {/* Programs Overview */}
      <OurPrograms />

{/* Featured Courses - News Style */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-5xl text-gray-900">
              OUR PROGRAMS
            </h2>
          </div>

          <div className="mx-auto px-4">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
              className="w-full relative"
            >
              <CarouselContent className="-ml-4">
                {programs.map((course) => (
                  <CarouselItem key={course._id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <Link to={`/course/${course.id}`} className="block bg-white group cursor-pointer h-full">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={course.heroImage || course.imageUrl} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-serif text-gray-900 mb-4 leading-tight group-hover:text-red-600 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 mb-6 flex-grow leading-relaxed hover:underline line-clamp-3">
                          {course.shortDescription || course.description}
                        </p>
                        <div className="flex items-start gap-2 text-red-600 text-sm">
                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex bg-blue-900 text-white rounded-none relative left-[35px] bottom-0" />
              <CarouselNext className="hidden md:flex bg-blue-900 text-white rounded-none relative left-[80px] bottom-[31px]" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <ChooseZion />

      {/* Parallax Section */}
      <ParallaxSection />

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

          <div className="mx-auto px-4">
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
              <CarouselContent className="">
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