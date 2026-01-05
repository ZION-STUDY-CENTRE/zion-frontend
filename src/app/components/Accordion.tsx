import { useState } from "react";

type AccordionItem = {
  title: string;
  content: string[];
};

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {items.map((item, index) => {
        const isOpen = activeIndex === index;

        return (
          <div
            key={index}
            className="border-b border-gray-300 py-8"
          >
            {/* Header */}
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-blue-900">
                {item.title}
              </h2>

              <span className="flex items-center justify-center w-12 h-12 border-2 border-blue-600 text-blue-600 text-2xl font-bold">
                {isOpen ? "✕" : "+"}
              </span>
            </button>

            {/* Body */}
            {isOpen && (
              <div className="mt-6 pl-6">
                <ul className="space-y-4 list-disc marker:text-blue-600">
                  {item.content.map((text, i) => (
                    <li key={i} className="text-gray-700 leading-relaxed">
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
