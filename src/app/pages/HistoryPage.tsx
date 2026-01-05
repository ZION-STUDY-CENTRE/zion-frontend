import { Link } from "react-router-dom";
import zionBuilding from '../../assets/building.jpg';
import Accordion from '../components/Accordion';

const HistoryPage = () => {

    interface Card {
        id: number,
        image: string,
        title: string,
        description: string
    }

    const timelineData = [
        {
            title: "2000 – 2010",
            content: [
            "2000 lorem ipsum gsjsy wyikg",
            "2002 lorem ipsum gsjsy wyikg",
            "2005 lorem ipsum gsjsy wyikg",
            "2010 lorem ipsum gsjsy wyikg"
            ]
        },
        {
            title: "2011 – 2020",
            content: [
            "2012 lorem ipsum gsjsy wyikg",
            "2015 lorem ipsum gsjsy wyikg",
            "2020 lorem ipsum gsjsy wyikg",
            ]
        },
        {
            title: "2021 – 2025",
            content: [
            "2021 lorem ipsum gsjsy wyikg",
            "2023 lorem ipsum gsjsy wyikg",
            ]
        }
    ];

    const history = [
        {
          id:1,
          image: zionBuilding,
          title: "Our Pioneer Director",
          description: "Recognized for excellence in professional training, 2022",
        },
        {
          id:2,
          image: zionBuilding,
          title: "Pioneer Location",
          description: "Honesty and transparency in all our dealings with students and partners.",
        },
        {
          id:3,
          image: zionBuilding,
          title: "Our Facilities",
          description: "Consistent high performance in exam preparation and certification",
        },
    ];

    return(
        <div className="min-h-screen relative">
            <section className="relative flex justify-center items-center bg-gradient-to-r from-blue-700 to-blue-900 h-[60vh] text-white py-16 md:py-20">
                <h1 className="text-4xl md:text-5xl text-center px-4 md:px-0 font-bold mb-4">History of the Zion Study Center</h1>
                <div className="absolute bottom-0 w-full bg-blue-900 p-4 text-white">
                    <ul className="flex gap-10">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li className="hidden md:flex list-disc">
                        <Link to="/about">About Us</Link>
                    </li>
                    <li className="hidden md:flex list-disc">
                        <Link to="#">Our History</Link>
                    </li>
                    </ul>
                </div>
            </section>

            <section className="bg-gray-50 flex justify-center py-6 text-center">
                <div className="w-[90%] lg:w-[80%] py-4 lg:py-8">
                    <p className="text-xl lg:text-2xl leading-9">The Zion Study Center and Leadership Academy is unlike many other institution. Our commitment to widening access has shaped our history, from our foundation in 2000 to the present day.</p>
                </div>
            </section>

            <section className="relative bg-no-repeat bg-cover bg-top bg-fixed" style={{backgroundImage: `url(${zionBuilding})`}}>
                <div className="relative z-2 py-8 md:py-20">
                    <h2 className="text-2xl md:text-3xl text-blue-400 font-extrabold pl-4 md:pl-26 mb-4 md:mb-8 ">Our History</h2>
                    <div className="text-center text-white/90 w-[90%] md:w-[70%] mx-auto ">
                        <p className="text-xl font-medium lg:leading-12">
                            Zion Study Centre and Leadership Academy (Limited) was born in the year 2002 and incorporated after 10 years. It’s more than an extra-moral education center; it’s a study center with a great vision.  Our commitment is to provide excellent learning experiences, using modern teaching approaches and a dedicated team of educators to guide students toward success in their academic journeys and beyond.hrough innovation, quality, and dedication, we strive to create an inclusive environment where students can thrive, explore, and reach their fullest potential.
                        </p>
                        {/* <p>
                            Our commitment is to provide excellent learning experiences, using modern teaching approaches and a dedicated team of educators to guide students toward success in their academic journeys and beyond.
                        </p>
                        <p>
                            Through innovation, quality, and dedication, we strive to create an inclusive environment where students can thrive, explore, and reach their fullest potential.
                        </p> */}
                    </div>
                </div>
                <div className="absolute inset-0 bg-black/50 z-1"></div>
            </section>

            <section className="py-16 md:py-24 bg-blue-50">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl md:text-3xl text-gray-900 mb-12 font-extrabold">Our Timeline</h1>
                    <div className="px-8">
                        <Accordion items={timelineData} />
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-blue-50">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl md:text-3xl text-gray-900 mb-12 font-extrabold">In This Section</h1>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {
                        history.map((element: Card) => (
                            <Link to={'#'} key={element.id}>
                            <div className="cursor-pointer group">
                                <figure className="h-[200px] mb-3">
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
            </section>

        </div>
    );
}

export default HistoryPage;