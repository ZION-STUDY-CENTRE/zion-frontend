import { Link } from "react-router-dom";
import zionBuilding from '../../assets/building.jpg';
import classRoom from '../../assets/287522350_1387577808421737_4478080586879130110_n.jpg';
import pioneer from '../../assets/babat.jpg';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const HistoryPage = () => {

    interface Card {
        id: number,
        image: string,
        title: string,
        description: string,
        link: string
    }

    const [expandedTimeline, setExpandedTimeline] = useState<number | null>(0);

    const timelineData = [
        {
            id: 0,
            period: "2002 – 2010",
            content: [
                "2002 - Foundation of Zion Study Centre and Leadership Academy",
                "2005 - Expansion of academic programs and facilities",
                "2008 - Recognition for excellence in professional training",
                "2010 - Incorporation as a limited company"
            ]
        },
        {
            id: 1,
            period: "2011 – 2020",
            content: [
                "2012 - Introduction of digital learning platforms",
                "2015 - Establishment of leadership development programs",
                "2018 - Expansion of international partnerships",
                "2020 - Adaptation to online and hybrid learning models"
            ]
        },
        {
            id: 2,
            period: "2021 – 2025",
            content: [
                "2021 - Full modernization of teaching infrastructure",
                "2023 - Launch of advanced certification programs",
                "2024 - Continued excellence in exam preparation",
                "2025 - Vision for global expansion"
            ]
        }
    ];

    const historyCards: Card[] = [
        {
            id: 1,
            image: zionBuilding,
            title: "Our Pioneer Director",
            description: "Recognized for excellence in professional training, our founding director shaped the vision and mission of Zion Study Centre.",
            link: "#"
        },
        {
            id: 2,
            image: classRoom,
            title: "Pioneer Location",
            description: "Honesty and transparency in all our dealings with students and partners have been the cornerstone of our growth.",
            link: "#"
        },
        {
            id: 3,
            image: pioneer,
            title: "Our Facilities",
            description: "Consistent high performance in exam preparation and certification through state-of-the-art learning environments.",
            link: "#"
        },
    ];

    return(
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-800 to-blue-950 text-white py-24 md:py-32">
                <div className="max-w-6xl mx-auto px-6 md:px-8">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Our History</h1>
                    <p className="text-lg text-blue-100 mb-8">
                        The Zion Study Center and Leadership Academy
                    </p>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="bg-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-6 md:px-8">
                    <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-light">
                        The Zion Study Center and Leadership Academy is unlike many other institutions. Our commitment to widening access has shaped our history, from our foundation in 2002 to the present day.
                    </p>
                </div>
            </section>

            {/* The Mission Section */}
            <section className="bg-gray-50 py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-6 md:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                        <p>
                            At Zion Study Centre, our mission is to cultivate world changers. We strive to empower our students to become leaders and innovators who are equipped to make a positive impact on society.
                        </p>
                        <p>
                            We provide excellent learning experiences through modern teaching approaches and a dedicated team of educators. We guide students toward success in their academic journeys and beyond.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Journey Section */}
            <section className="bg-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-6 md:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Story in  Zion</h2>
                    <div className="space-y-6">
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Zion Study Centre was established in the year 2000 and has since evolved into a reputable institution dedicated to academic excellence. Over the past two decades, we have proudly groomed more than 5,000 students, equipping them with the knowledge and skills necessary to succeed in their academic and professional pursuits.
                        </p>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Our journey began with a simple belief: that education should be accessible to all who seek it. We recognized early that students required more than traditional classroom instruction—they needed personalized attention, modern learning tools, and mentors who genuinely cared about their success. This philosophy continues to guide us today.
                        </p>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="bg-gray-50 py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-6 md:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Our Timeline</h2>
                    
                    <div className="space-y-4">
                        {timelineData.map((period) => (
                            <div key={period.id} className="border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setExpandedTimeline(expandedTimeline === period.id ? null : period.id)}
                                    className="w-full bg-white hover:bg-gray-50 px-6 py-4 flex items-center justify-between text-left transition-colors"
                                >
                                    <h3 className="text-xl font-semibold text-gray-900">{period.period}</h3>
                                    <ChevronDown
                                        className={`w-6 h-6 text-gray-600 transition-transform ${
                                            expandedTimeline === period.id ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                
                                {expandedTimeline === period.id && (
                                    <div className="bg-blue-50 px-6 py-6 border-t border-gray-300">
                                        <ul className="space-y-3">
                                            {period.content.map((item, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="text-blue-600 font-bold mr-4">•</span>
                                                    <span className="text-gray-700">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="bg-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-6 md:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">About Us</h2>
                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                        <p>
                            Zion Study Centre is a premier academic institution that specializes in preparing students for a wide array of local and international examinations. Our comprehensive programs cover exams such as the SAT, TOEFL, IELTS, JAMB UTME, WASSCE, NABTEB, GCE, NECO, and many more.
                        </p>
                        <p>
                            In addition to our exam preparation services, we also operate a subsidiary known as Zion Computer College. Here, we offer a diverse range of technical courses including Front-end Development, Back-end Development (Python), Graphic Design, Data Analysis, and Computer Diploma programs, among others. Our goal is to provide students with a well-rounded education that also includes essential skills for the digital age.
                        </p>
                    </div>
                </div>
            </section>

            {/* Vision for Education Section */}
            <section className="bg-gray-50 py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-6 md:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Vision for Education</h2>
                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                        <p>
                            We envision an educational experience that encompasses not only academic learning but also character development. Our approach emphasises the importance of integrity, responsibility, and personal growth alongside intellectual achievement, ensuring that our students are fully prepared for the challenges of the future.
                        </p>
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 italic text-blue-900">
                            "The mind serves as a crucial factory for achieving overall success in life, and it's important for individuals to explore and understand its potential."
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section className="bg-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-6 md:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Story in Video</h2>
                    <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="Zion Study Centre"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <p className="text-gray-600 text-center mt-6">
                        Watch our journey and learn more about Zion Study Centre and Leadership Academy
                    </p>
                </div>
            </section>
        </div>
    );
}

export default HistoryPage;