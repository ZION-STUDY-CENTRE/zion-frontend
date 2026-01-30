import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Target, Eye, Award, Users, TrendingUp, Heart, Tag } from "lucide-react";
import whoWeAre from '../../assets/refined/zionStaffs.jpeg';
import whatWeDo from '../../assets/refined/dataAnalysisClass.jpeg';
import students from '../../assets/refined/codingStudents.jpeg';
import vision from '../../assets/refined/zionTowersTwo.jpeg';
import history from '../../assets/new.jpg';
import unique from '../../assets/refined/students.jpeg';
import anotherHeroImage from '../../assets/refined/zionTowersThree.jpeg';
import classRoom from '../../assets/refined/Director.jpeg';
import { useState, useEffect } from "react";

export function AboutPage() {

   interface Card {
    id: number,
    image: string,
    title: string,
    description: string,
    other?: string,
    link?: string
  }

  interface Props {
    Card: Card[]
  }

  const [isOpenModal, setisOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card|null>(null)
  const [offset, setOffset] = useState(0);

  useEffect(()=>{
     const onScroll = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll)
  }, [])


  const values = [
    {
      icon: Tag,
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

  const findOutMore = [
    {
      id:1,
      image: whoWeAre,
      title: "Who are we",
      description: "We strive for the highest standards in education and training delivery.",
      other: 'modal',
    },
    {
      id:2,
      image: unique,
      title: "What we do",
      description: "Honesty and transparency in all our dealings with students and partners.",
      other: 'modal',
    },
    {
      id:3,
      image: whatWeDo,
      title: "What makes us unique",
      description: "Every decision we make is focused on student success and wellbeing.",
      other: 'modal',
    },
    {
      id:4,
      image: students,
      title: "Our Mission",
      description: "To provide world-class education and professional training that equips students with the knowledge, skills, and confidence needed to excel in their academic pursuits and professional careers, while maintaining the highest standards of integrity and excellence.",
      other: 'modal',
    },
    {
      id:5,
      image: vision,
      title: "Our Vision",
      description: "To be the leading multi-disciplinary educational institution in Nigeria and West Africa, recognized for our exceptional training quality, student success rates, and contribution to developing skilled professionals who drive societal and economic growth.",
      other: 'modal',
    },
    {
      id:6,
      image: history,
      title: "Our History",
      description: "Founded in 2009, Zion Study Centre began with a simple mission: to provide accessible, high-quality education and training to students and professionals seeking to advance their careers and academic achievements...",
      other: 'page',
      link: '/history'
    },
  ];


  const openModal = (card: Card) => {
    setSelectedCard(card)
    setisOpenModal(true)
  };

  const closeModal = () => {
    setSelectedCard(null)
    setisOpenModal(false)
  };



  return (
    <div className="min-h-screen relative">
      {/* Hero */}
      <section className="min-h-screen w-full">
        <article className="relative flex justify-center items-center bg-gradient-to-r from-blue-700 to-blue-900 h-[60vh] lg:h-[70vh] text-white py-16 md:py-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Us</h1>
          <div className="absolute bottom-0 w-full bg-blue-900 p-4 text-white">
            <ul className="flex gap-10">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li className="hidden md:flex list-disc">
                <Link to="#">About Us</Link>
              </li>
            </ul>
          </div>
        </article>
        <div className="relative h-[70vh] overflow-hidden z-0">
          <div className="absolute bg-black h-full w-full top-0 left-0 opacity-40 z-20"></div>
          <img
            src={anotherHeroImage}
            className={`w-full bg-center bg-cover absolute -top-[250px] md:-top-[400px] left-0 h-[650px] md:h-[900px]`}
            style={{
              transform: `translateY(${offset * 0.5}px)`
            }}
          />
        </div>
        <article className="bg-gray-50 relative z-20 flex justify-center py-6 text-center ">
          <div className="w-[90%] lg:w-[80%] py-4 lg:py-8">
            <p className="text-xl lg:text-4xl leading-12"><span className="font-medium">Zion study Centre and Leadership Academy Limited was born in the year 2002 and incorporated after 10 years.</span> It's more than an extra-moral but a study center with a great vision. We are committed to providing quality education and training to individuals seeking to enhance their knowledge and skills in various fields. Our mission is to empower our students to achieve their academic and professional goals through innovative teaching methods, practical learning experiences, and a supportive learning environment.</p>
          </div>
        </article>
      </section>

      {/* Our Story */}
      <section className="py-4">
        <div className="container-fluid">
          <div className="flex flex-col lg:flex-row-reverse">
            <figure className="lg:flex-1 lg:h-[70vh] bg-amber-700">
              <img
                src={classRoom}
                alt="Students in classroom"
                className="w-full h-full object-fill"
              />
            </figure>

            <div className="lg:flex-1 text-center p-8 lg:px-16 lg:flex flex-col justify-center lg:h-[70vh] bg-blue-700">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Study and Leadership Center of Your Dream</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Founded in 2009, Zion Study Centre began with a simple mission: to provide accessible, high-quality education and training to students and professionals seeking to advance their careers and academic achievements.
                </p>
                <Link to="/futures" className="inline-block bg-transparent text-white py-2 px-8 border border-white hover:bg-white hover:text-blue-700 transition duration-300">Read More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find Out More */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-16">
          <h1 className="text-2xl md:text-4xl text-gray-900 mb-12 font-bold">Find Out More</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3  gap-y-8 gap-x-4">
           {
            findOutMore.map((container: Card) => (
              container.link ?
              <Link to={container.link} key={container.id}>
                <div className="cursor-pointer group">
                  <figure className="h-[300px] mb-1">
                    <img src={container.image} alt="image" className="w-full h-full"/>
                  </figure>
                  <div className="relative inline-block">
                    <h3 className="group-hover:text-blue-700 transition text-xl font-medium font-serif mb-2 0">{container.title}</h3>
                    <span
                      className="absolute left-0 bottom-1 h-[2px] w-full bg-amber-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
                  </div>
                  <p className="text-gray-700">
                    {container.description}
                  </p>
                  <div className="flex gap-1 items-center mt-2">
                    <Tag className="fill-blue-500"/>
                    <i className="text-sm text-blue-700">{container.other}</i>
                  </div>
                </div>
              </Link> :

              <div className="cursor-pointer group" key={container.id} onClick={() => openModal(container)}>
                <figure className="h-[300px] mb-1">
                  <img src={container.image} alt="image" className="w-full h-full"/>
                </figure>
                <div className="relative inline-block">
                  <h3 className="group-hover:text-blue-700 transition text-xl font-medium font-serif mb-2 0">{container.title}</h3>
                  <span
                    className="absolute left-0 bottom-1 h-[2px] w-full bg-amber-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
                </div>
                <p className="text-gray-700">
                  {container.description}
                </p>
                <div className="flex gap-1 items-center mt-2">
                  <Tag className="fill-blue-500"/>
                  <i className="text-sm text-blue-700">{container.other}</i>
                </div>
              </div>
            ))
           } 
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
      {/* <section className="py-16 md:py-24 bg-blue-50">
        <div className="container mx-auto px-4 lg:px-16">
           <h1 className="text-2xl md:text-3xl text-gray-900 mb-12 font-extrabold">Our Latest News and Achievement</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              news.map((element: Card) => (
                <Link to={'#'} key={element.id}>
                  <div className="cursor-pointer group">
                    <figure className="h-[250px] mb-1">
                      <img src={element.image} alt="image" className="w-full h-full transform duration-500 ease-out hover:scale-110"/>
                    </figure>
                    <div className="relative inline-block">
                      <h3 className="group-hover:text-blue-700 transition text-xl font-medium font-serif mb-2 0">{element.title}</h3>
                      <span
                        className="absolute left-0 bottom-1 h-[2px] w-full bg-amber-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
                    </div>
                    <p className="text-gray-700">
                      {element.description}
                    </p>
                  </div>
                </Link> 
              ))
            } 
          </div>
        </div>
      </section> */}

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

      {
        isOpenModal && selectedCard && (
          <section className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shaodow-lg w-[400px]">
              <h2 className="text-xl font-bold mb-2">{selectedCard.title}</h2>
              <p className="mb-4">{selectedCard.description}</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer" onClick={closeModal}>Close</button>
            </div>
          </section>
        )
      }
    </div>
  );
}
