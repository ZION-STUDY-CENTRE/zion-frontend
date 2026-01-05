import React from 'react';
import { Users, Award, Clock, TrendingUp } from 'lucide-react';

const WhyChooseUsComponent: React.FC = () => {
  const whyChooseUs = [
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from experienced professionals with industry expertise and proven teaching methods."
    },
    {
      icon: Award,
      title: "Proven Track Record",
      description: "Our students consistently achieve excellent results in their exams and career goals."
    },
    {
      icon: Clock,
      title: "Flexible Learning",
      description: "Study at your own pace with flexible schedules designed to fit your lifestyle."
    },
    {
      icon: TrendingUp,
      title: "Career Support",
      description: "Get comprehensive career counseling and guidance for your academic future."
    }
  ];

  return (
    <section className="py-20 px-6 bg-blue-900">
      <div className="container mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-serif text-white mb-6">
            Why Choose Zion Study Centre
          </h2>
          <p className="text-xl text-white max-w-2xl">
            We are committed to providing quality education and training that delivers real results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="mb-6">
                <div className="text-red-600">
                  <item.icon className="w-12 h-12" />
                </div>
              </div>
              
              <h3 className="text-2xl font-serif text-white mb-4 leading-tight">
                {item.title}
              </h3>
              
              <p className="text-white leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsComponent;