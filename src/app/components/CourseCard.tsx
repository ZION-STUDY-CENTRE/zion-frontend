import { Link } from "react-router-dom";
import { Clock, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

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
  duration,
  schedule,
  students,
  imageUrl,
}: CourseCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {category}
          </span>
          {students && (
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <Users size={14} />
              {students}+ students
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{title}</h3>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-gray-600 line-clamp-3 mb-4">{description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="text-blue-600" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-blue-600" />
            <span>{schedule}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/course/${id}`}>Learn More</Link>
        </Button>
        <Button className="flex-1 bg-blue-700 hover:bg-blue-800" asChild>
          <Link to="/register">
            Enroll Now <ArrowRight size={16} className="ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
