import React from 'react';
import { ArrowRight, Mountain, Eye, GraduationCap } from 'lucide-react';

const AboutSummaryComponent: React.FC = () => {
  const handleNavigation = () => {
    window.location.href = '/about';
  };

  return (
    <div className="bg-gray-50 py-16 flex justify-center">
      <div className="container px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900">Welcome to Zion Study Centre</h2>
          <button 
            onClick={handleNavigation}
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors group"
          >
            <span>Learn more about studying with us</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Large Card */}
          <div 
            onClick={handleNavigation}
            className="cursor-pointer group w-full lg:w-[55%]"
          >
            <div className="relative bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop"
                alt="Students collaborating"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-serif text-gray-900 mb-4">
                
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                <span className='font-bold text-lg'>Zion Study Centre</span> offers intensive coaching for students preparing for any forms of Examinations both local and international.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We manage Students, offer career counselling on their academic future and guide them in selection of courses into university, based on their I/Q and E/Q.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Zion Study Centre is a modern organization set up to bring about the best in Students and ignite the fire of greatness in them. We also provide Scholarship through our foundation to intelligent students from humble homes.
              </p>
              <div className="mt-6 flex items-center gap-2 text-red-600">
                <Mountain className="w-5 h-5" />
                <span className="font-medium">Study</span>
              </div>
            </div>
          </div>

          {/* Right Column - Three Cards */}
          <div className="space-y-8 w-full lg:w-[45%]">
            {/* Mission Card */}
            <div 
              onClick={handleNavigation}
              className=" cursor-pointer  group"
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-teal-200">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="Computer Science classroom"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className='flex items-center'>
                    <div className="inline-block p-2">
                    <Mountain className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="inline text-xl font-serif text-gray-900">Mission</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Our mission at Zion Study Centre and Leadership Academy is to provide an exceptional and transformative learning experience that nurtures the academic, personal, and professional growth of each student.
                </p>
               
              </div>
            </div>

            {/* Vision Card */}
            <div 
              onClick={handleNavigation}
              className=" cursor-pointer  group"
            >
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-200">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop"
                  alt="Professional accounting"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className='flex items-center'>
                    <div className="inline-block p-2">
                    <Eye className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="inline text-xl font-serif text-gray-900">Vision</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Our vision is to become a premier institution known for excellence in education, where students not only excel academically but also develop the leadership qualities necessary to thrive in an ever-changing world.
                </p>
               
              </div>
            </div>

            {/* Educational Philosophy Card */}
            <div 
              onClick={handleNavigation}
              className=" cursor-pointer  group"
            >
              <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-200">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop"
                  alt="Marketing strategy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className='flex items-center'>
                    <div className="inline-block p-2">
                    <GraduationCap className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="inline text-xl font-serif text-gray-900">Educational Philosophy</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  At Zion Study Centre and Leadership Academy, our educational philosophy is rooted in the belief that learning should be a dynamic, engaging, and personalized experience. We view education as more than just the acquisition of knowledge.
                </p>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSummaryComponent;