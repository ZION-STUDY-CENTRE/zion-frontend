import React from 'react';
import { BookOpen, GraduationCap, Award, ArrowRight } from 'lucide-react';

const WaysToStudyComponent: React.FC = () => {
  const programs = [
    {
      icon: <BookOpen className="w-12 h-12" />,
      title: "Technology & Computer Academy",
      description: "Professional training in web development, programming, digital marketing, graphic design, and more.",
      link: "/programs/technology"
    },
    {
      icon: <GraduationCap className="w-12 h-12" />,
      title: "International Exams & Certifications",
      description: "Expert preparation for IELTS, TOEFL, SAT, GRE, GMAT, and Cambridge exams.",
      link: "/programs/international-exams"
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Secondary & High School Exam Preparation",
      description: "Intensive preparation for WAEC, NECO, JAMB, and Cambridge IGCSE exams.",
      link: "/programs/secondary-exams"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-5xl md:text-6xl font-serif text-gray-900 mb-16">
          Our Programs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {programs.map((program, index) => (
            <div key={index} className="flex flex-col">
              <div className="mb-6">
                <div className="text-red-600">
                  {program.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-serif text-gray-900 mb-4 leading-tight">
                {program.title}
              </h3>
              
              <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                {program.description}
              </p>
              
              <a 
                href={program.link}
                className="inline-flex items-center gap-2 text-gray-900 hover:text-red-600 transition-colors group"
              >
                <span className="font-medium">Learn More</span>
                <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all">
                  <ArrowRight className="w-3 h-3 group-hover:text-white" />
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WaysToStudyComponent;