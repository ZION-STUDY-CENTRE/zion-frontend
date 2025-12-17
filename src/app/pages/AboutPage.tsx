import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Target, Eye, Award, Users, TrendingUp, Heart } from "lucide-react";

export function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for the highest standards in education and training delivery.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Honesty and transparency in all our dealings with students and partners.",
    },
    {
      icon: Users,
      title: "Student-Centered",
      description: "Every decision we make is focused on student success and wellbeing.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Continuously improving our methods and adopting best practices in education.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Zion Study Centre</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            A trusted leader in multi-disciplinary education and professional training for over 15 years.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Founded in 2009, Zion Study Centre began with a simple mission: to provide accessible, high-quality education and training to students and professionals seeking to advance their careers and academic achievements.
                </p>
                <p>
                  Over the past 15 years, we have grown from a small tutoring center to a comprehensive multi-disciplinary educational institution, serving thousands of students across various programs including computer technology, international exam preparation, and secondary school preparation.
                </p>
                <p>
                  Our success is built on a foundation of experienced instructors, proven teaching methodologies, and an unwavering commitment to student success. We take pride in our 95% success rate and the countless lives we've transformed through quality education.
                </p>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1654366698665-e6d611a9aaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2NTk1NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Students in classroom"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 md:p-10 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="text-blue-700" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To provide world-class education and professional training that equips students with the knowledge, skills, and confidence needed to excel in their academic pursuits and professional careers, while maintaining the highest standards of integrity and excellence.
              </p>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Eye className="text-green-700" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To be the leading multi-disciplinary educational institution in Nigeria and West Africa, recognized for our exceptional training quality, student success rates, and contribution to developing skilled professionals who drive societal and economic growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Zion Study Centre.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-blue-700" size={36} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 md:py-24 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Achievements</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Milestones that demonstrate our commitment to educational excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Award className="text-blue-700 mb-4" size={40} />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Best Training Institute Award</h4>
              <p className="text-gray-600">Recognized for excellence in professional training, 2022</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="text-blue-700 mb-4" size={40} />
              <h4 className="text-xl font-bold text-gray-900 mb-2">5,000+ Graduates</h4>
              <p className="text-gray-600">Successfully trained and certified professionals across various fields</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <TrendingUp className="text-blue-700 mb-4" size={40} />
              <h4 className="text-xl font-bold text-gray-900 mb-2">95% Success Rate</h4>
              <p className="text-gray-600">Consistent high performance in exam preparation and certification</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Community of Successful Students
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Experience the difference that quality education makes.
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
