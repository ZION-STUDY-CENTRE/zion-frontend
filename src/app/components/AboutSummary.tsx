import React from 'react';
import { ArrowRight, Mountain, Eye, GraduationCap } from 'lucide-react';
import zionStaffTwo from '../../assets/refined/zionStaffTwo.jpeg'; 
import image2 from '../../assets/bk3.jpg';  
import diplomaClass from '../../assets/refined/diplomaClass.jpeg';  
import biologyClass from '../../assets/refined/biologyClass.jpeg';  
 

const AboutSummaryComponent: React.FC = () => {
  const handleNavigation = () => {
    window.location.href = '/about';
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Text with matching height */}
          <div className="flex flex-col justify-center h-full">
            <div className="space-y-6 text-gray-800 leading-relaxed">
              <h2 className="text-3xl font-bold mb-6">WELCOME TO ZION STUDY CENTRE</h2>

              <p className="text-base">
                <span className='font-bold'>Zion Study Centre</span> offers intensive coaching for students preparing for any forms of Examinations both local and international.
              </p>
              
              <p className="text-base">
                We manage Students, offer career counselling on their academic future and guide them in selection of courses into university, based on their I/Q and E/Q.
              </p>
              
              <p className="text-base">
                Zion Study Centre is a modern organization set up to bring about the best in Students and ignite the fire of greatness in them. We also provide Scholarship through our foundation to intelligent students from humble homes.
              </p>

              <button 
                onClick={handleNavigation}
                className="border-2 border-red-700 text-red-700 px-6 py-3 hover:bg-red-700 hover:text-white transition-colors duration-300 inline-block mt-4"
              >
                Learn more about studying with us
              </button>
            </div>
          </div>

          {/* Right Side - Three Cards */}
          <div className="space-y-8">
            {/* Mission Card */}
            <div 
              onClick={handleNavigation}
              className="cursor-pointer group"
            >
              <div className="relative h-60 bg-gradient-to-br from-blue-100 to-teal-200 rounded-lg overflow-hidden">
                <img 
                  src={zionStaffTwo}
                  alt="Computer Science classroom"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className='flex items-center gap-2'>
                    <Mountain className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-bold text-gray-900">Mission</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm mt-2">
                  Our mission at Zion Study Centre and Leadership Academy is to provide an exceptional and transformative learning experience that nurtures the academic, personal, and professional growth of each student.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div 
              onClick={handleNavigation}
              className="cursor-pointer group"
            >
              <div className="relative h-60 bg-gradient-to-br from-purple-100 to-pink-200 rounded-lg overflow-hidden">
                <img 
                  src={diplomaClass}
                  alt="Professional accounting"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className='flex items-center gap-2'>
                    <Eye className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-bold text-gray-900">Vision</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm mt-2">
                  Our vision is to become a premier institution known for excellence in education, where students not only excel academically but also develop the leadership qualities necessary to thrive in an ever-changing world.
                </p>
              </div>
            </div>

            {/* Educational Philosophy Card */}
            <div 
              onClick={handleNavigation}
              className="cursor-pointer group"
            >
              <div className="relative h-60 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg overflow-hidden">
                <img 
                  src={biologyClass}
                  alt="Marketing strategy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className='flex items-center gap-2'>
                    <GraduationCap className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-bold text-gray-900">Educational Philosophy</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm mt-2">
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