import { useState, useEffect, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { getOptimizedImageUrl } from "../../utils/cloudinaryOptimization";
import { getWhatsAppLink } from "../../utils/whatsapp";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Users,
  Award,
  GraduationCap,
  BookOpen,
  Clock,
  TrendingUp,
  Target,
  Star,
} from "lucide-react";
import { getBlogPosts, BlogPost, getPrograms, Program, getTestimonials, Testimonial } from "../services/api";

// Direct imports for critical images
import studentsTwo from "../../assets/refined/studentsTwo.jpeg";
import zionTowersThree from "../../assets/refined/zionTowersThree.jpeg";
import zionStaffsTwo from "../../assets/refined/zionStaffsTwo.jpeg";

// Lazy load components
const SearchCourse = lazy(() => import("../components/SearchCourse"));
const ChooseZion = lazy(() => import("../components/ChooseZion"));
const AboutSummaryComponent = lazy(() => import("../components/AboutSummary"));
const OurPrograms = lazy(() => import("../components/OurPrograms"));
const ParallaxSection = lazy(() => import("../components/ParallaxSection"));

// Skeleton loaders
const ComponentSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-96 bg-gray-200 rounded-lg"></div>
  </div>
);

export function HomePage() {
  const [latestPost, setLatestPost] = useState<BlogPost | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogImages, setBlogImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const staticHeroImages = [
    studentsTwo,
    zionTowersThree,
    zionStaffsTwo,
  ];

  // Merge static images with blog images
  const heroImages = [...staticHeroImages, ...blogImages];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [posts, programsData, testimonialsData] = await Promise.all([
          getBlogPosts(),
          getPrograms(),
          getTestimonials()
        ]);
                // Latest blog post (by date)
        if (posts.length > 0) {
          const sorted = [...posts].sort(
            (a, b) => new Date(b.timestamp ? new Date(b.timestamp) : new Date(0)).getTime() - new Date(a.timestamp ? new Date(a.timestamp) : new Date(0)).getTime()
          );
          setLatestPost(sorted[0]);
          
          // Calculate the date 1 week ago from today
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          // Get blog images (exclude social-media-posts, require image, and must be newer than 1 week)
          const blogPostImages = sorted
            .filter(post => {
              const postDate = new Date(post.timestamp ? new Date(post.timestamp) : new Date(0));
              return (
                post.type !== "social-media-post" &&
                post.image &&
                postDate.getTime() >= oneWeekAgo.getTime() // Filter out older than 1 week
              );
            })
            .map(post => getOptimizedImageUrl(post.image, "hero"));
            
          setBlogImages(blogPostImages);
        }
        if (programsData) {
          setPrograms(programsData);
        }
        if (testimonialsData && testimonialsData.length > 0) {
          setTestimonials(testimonialsData);
        }
      } catch (error) {
        console.error("Failed to fetch data for homepage", error);
      }
    };
    fetchData();
  }, []);

  // Update carousel indexes when images array changes
    useEffect(() => {
    // Prevent interval if no images exist yet
    if (heroImages.length === 0) return;

    // Safety check: ensure current index is always valid for the new array length
    setCurrentImageIndex((prev) => (prev >= heroImages.length ? 0 : prev));

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        // Explicitly calculate safely and return 0 when hitting the max length
        if (prevIndex + 1 >= heroImages.length) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 5000); 

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const stats = [
    { icon: Users, value: "35,000+", label: "Students Trained" },
    { icon: Award, value: "25+", label: "Years Experience" },
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

  return (
    <div className="min-h-screen">
      {/* Hero Section - Optimized */}
     <section className="group relative text-white h-[80vh] flex justify-start items-end overflow-hidden bg-gray-900">
        {heroImages.map((image, index) => (
          <div
            key={`${image}-${index}`} 
            className={`absolute inset-0 bg-cover bg-no-repeat bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        
        <div className="w-full h-full bg-black absolute z-10 opacity-70"></div>
        <div className="container px-4 relative z-10 w-full mb-10">
          <div className="max-w-3xl rounded-[24px] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md transition-all duration-700 hover:-translate-y-1 sm:p-8">
            <div className="inline-flex items-center rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-amber-100">
              Trusted Learning Partner
            </div>
            <h1 className="mt-5 text-3xl font-bold leading-tight text-[#FAF9F6] sm:text-4xl lg:text-5xl">
              Welcome to Zion Study Centre
            </h1>
            <div className="mt-4 h-1.5 w-24 rounded-full bg-amber-400"></div>
            <p className="mt-5 text-lg font-medium leading-relaxed text-[#E2DFD2] sm:text-xl">
              Preparing students and professionals for academic excellence, global opportunities, and future-ready success.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#F5F3EA] sm:text-base">
              With 25+ years of experience, we guide learners through university admissions, international exams, and practical digital skills that open doors worldwide.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-amber-500 border-amber-500 text-white hover:bg-amber-600 transition-all duration-300 hover:scale-[1.02]">
                <Link to="/register">Start Your Journey</Link>
              </Button>
              <Button size="lg" asChild className="bg-white/90 text-blue-900 border-white/90 hover:bg-white transition-all duration-300 hover:scale-[1.02]">
                <a href={getWhatsAppLink()} target="_blank" rel="noreferrer">
                  Book Counselling Session
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,0.2)]  opacity-100 z-0"></div>
      </section>

      <Suspense fallback={<ComponentSkeleton />}>
        <SearchCourse />
      </Suspense>

      {/* Award Highlight Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-[28px] border border-blue-200 bg-blue-900 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)]">
            <div className="grid gap-8 px-8 py-10 md:grid-cols-[1.2fr_0.8fr] md:px-12 md:py-12">
              <div className="text-white">
                <div className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-blue-100">
                  <Award size={16} className="mr-2" />
                  Profile Awards Nigeria 2023
                </div>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  Zion Study Centre & Leadership Academy — recipient of the Profile Awards Nigeria award as the Most Outstanding Study Centre of the Year 2023
                </h2>
              </div>
              <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-6 text-center text-blue-50">
                <div>
                  <p className="text-5xl font-bold text-white">2023</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.3em] text-blue-100">
                    Most Outstanding Study Centre of the Year
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center hover:scale-105 hover:shadow-md py-4 px-20 rounded-md w-fit mx-auto">
                <div className="flex justify-center mb-3 mx-auto">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <stat.icon className="text-blue-700" size={28} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section - moved after stats */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Our Story in Video</h2>
          <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
            <iframe 
              className="absolute top-0 left-0 w-full h-full" 
              src="https://www.youtube.com/embed/x_qxLmke_3E?modestbranding=1&rel=0" 
              title="Zion history documentary video" 
              frameBorder="0" 
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-gray-600 text-center mt-6 text-sm md:text-base">
            Watch our journey and learn more about Zion Study Centre and Leadership Academy
          </p>
        </div>
      </section>

      {/* Testimonials - moved after stats */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Student Success Stories
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from our students who have achieved their educational and career goals.
            </p>
          </div>
          <div className="mx-auto px-4">
            {testimonials.length > 0 ? (
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
                          <div className="w-12 h-12 rounded-full mr-3 overflow-hidden bg-gray-100">
                            {testimonial.image ? (
                              <img
                                src={getOptimizedImageUrl(testimonial.image, 'testimonial')}
                                alt={testimonial.name}
                                loading="lazy"
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {testimonial.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
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
            ) : (
              <div className="text-center py-12 bg-gray-100 rounded-lg">
                <p className="text-gray-600 text-lg">No testimonials available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Summary - Lazy Loaded */}
      <Suspense fallback={<ComponentSkeleton />}>
        <AboutSummaryComponent />
      </Suspense>

      {/* Programs Overview - Lazy Loaded */}
      <Suspense fallback={<ComponentSkeleton />}>
        <OurPrograms />
      </Suspense>

      {/* Featured Programs - Carousel */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl md:text-3xl text-gray-900">
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
                      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                        <img
                          src={course.heroImage || course.imageUrl}
                          alt={course.title}
                          loading="lazy"
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
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="flex bg-blue-900 text-white rounded-none relative left-[35px] bottom-0" />
              <CarouselNext className="flex bg-blue-900 text-white rounded-none relative left-[80px] bottom-[31px]" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <Suspense fallback={<ComponentSkeleton />}>
        <ChooseZion />
      </Suspense>

      {/* Parallax Section - Lazy Loaded */}
      <Suspense fallback={<ComponentSkeleton />}>
        <ParallaxSection />
      </Suspense>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-base md:text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
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