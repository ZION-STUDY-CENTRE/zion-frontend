import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { CircleCheck } from "lucide-react";

export function RegisterPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration
    window.location.href = "/thank-you";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Register Now</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Take the first step towards your success. Register for our programs today.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Benefits Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What You Get</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CircleCheck className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700">Expert instruction from qualified professionals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CircleCheck className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700">Comprehensive study materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CircleCheck className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700">Flexible class schedules</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CircleCheck className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700">Certificate upon completion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CircleCheck className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700">Career guidance and support</span>
                    </li>
                  </ul>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      Need help with registration? Call us at{" "}
                      <a href="tel:+2341234567890" className="text-blue-700 font-semibold">
                        +234 123 456 7890
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Registration Form</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input id="firstName" required className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input id="lastName" required className="mt-1" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input id="email" type="email" required className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input id="phone" type="tel" required className="mt-1" />
                        </div>
                      </div>

                      <div className="mt-6">
                        <Label htmlFor="address">Address *</Label>
                        <Textarea id="address" rows={3} required className="mt-1" />
                      </div>
                    </div>

                    {/* Program Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Selection</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="programCategory">Program Category *</Label>
                          <Select required>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technology">Technology & Computer Academy</SelectItem>
                              <SelectItem value="international">International Exams</SelectItem>
                              <SelectItem value="secondary">Secondary School Preparation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="specificCourse">Specific Course *</Label>
                          <Select required>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="web-dev">Web Development</SelectItem>
                              <SelectItem value="graphic-design">Graphic Design</SelectItem>
                              <SelectItem value="ielts">IELTS Preparation</SelectItem>
                              <SelectItem value="toefl">TOEFL Preparation</SelectItem>
                              <SelectItem value="jamb">JAMB Preparation</SelectItem>
                              <SelectItem value="waec">WAEC Preparation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Label htmlFor="schedule">Preferred Schedule *</Label>
                        <Select required>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekday-morning">Weekday Morning</SelectItem>
                            <SelectItem value="weekday-evening">Weekday Evening</SelectItem>
                            <SelectItem value="weekend">Weekend</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="mt-6">
                        <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                        <Textarea
                          id="additionalInfo"
                          rows={4}
                          placeholder="Tell us about your goals, experience, or any questions you have..."
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="terms" required className="w-4 h-4" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <a href="/terms-conditions" className="text-blue-700 underline">
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/privacy-policy" className="text-blue-700 underline">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-blue-700 hover:bg-blue-800"
                    >
                      Submit Registration
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}