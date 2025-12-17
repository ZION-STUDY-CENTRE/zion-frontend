import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CircleCheck, ArrowRight, Mail, Phone } from "lucide-react";

export function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CircleCheck className="text-green-600" size={48} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thank You for Your Registration!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            We've received your application and our admissions team will review it shortly. You'll hear from us within 24-48 hours.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">What Happens Next?</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>You'll receive a confirmation email with your application details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Our admissions team will contact you to discuss the next steps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>You'll receive information about payment options and class schedules</span>
              </li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 border rounded-lg">
              <Mail className="mx-auto text-blue-700 mb-2" size={24} />
              <p className="text-sm text-gray-600">Email Us</p>
              <p className="font-semibold text-gray-900">info@zionstudycentre.com</p>
            </div>
            <div className="p-4 border rounded-lg">
              <Phone className="mx-auto text-blue-700 mb-2" size={24} />
              <p className="text-sm text-gray-600">Call Us</p>
              <p className="font-semibold text-gray-900">+234 123 456 7890</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                <ArrowRight className="mr-2" size={20} />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/programs">View Programs</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}