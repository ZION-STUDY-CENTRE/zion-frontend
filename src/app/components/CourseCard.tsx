import { Link, useLocation } from "react-router-dom";
import { ArrowRight, } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  schedule: string;
  students?: number;
  imageUrl?: string;
}

export function CourseCard({
  id,
  title,
  category,
  description,
}: CourseCardProps) {
  const location = useLocation();
  const path = location.pathname;
  const shouldHideCategory = path.includes("technology") || path.includes("international-exams") || path.includes("secondary-exams");

  return (
    <Link 
      to={`/course/${id}`}
      className="block group"
    >
      <div className="border-b border-gray-200 pb-8 hover:border-gray-300 transition-colors md:min-h-[170px]">
        {/* Category */}
        {!shouldHideCategory && (
          <div className="mb-4">
            <span className="text-sm font-light text-gray-500 italic">
              {category}
            </span>
          </div>
        )}

        {/* Title and Arrow */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-2xl font-serif font-medium text-gray-900 leading-tight">
            {title}
          </h3>
          <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-blue-900 flex items-center justify-center group-hover:bg-blue-900 transition-colors">
            <ArrowRight className="w-4 h-4 tex-blue-900 group-hover:text-white transition-colors" strokeWidth={2.5} />
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}