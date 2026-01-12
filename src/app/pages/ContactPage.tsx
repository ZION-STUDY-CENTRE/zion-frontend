import { useState } from "react";
import { Link } from "react-router-dom";
import { sendEmail } from "../services/api";
import { MapPin, Phone, Mail, Clock, Loader2, CircleCheck, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import MapEmbed from "../components/MapEmbed";

export function ContactPage() {
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submittedSubject, setSubmittedSubject] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Capture subject before clearing form
      const currentSubject = formData.subject;
      
      await sendEmail('contact', formData);
      
      setStatus('success');
      setSubmittedSubject(currentSubject);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); // Reset form
      // Alert removed in favor of UI change
    } catch (error) {
      console.error(error);
      setStatus('error');
      alert('Failed to send message. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
        ...prev,
        // Map id to state key. The input ids match the state keys except fullName -> name
        [id === 'fullName' ? 'name' : id]: value
    }));
  };

  const officeAddress = "Zion Study Centre, ZION TOWERS OPPOSITE MTN OFFICE ALONG GENERAL HOSPITAL KUBWA Abuja, FCT Off nadrem supermarket before UBA, Kubwa";
  const officeLat = 9.149028;
  const officeLng = 7.279051;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Get in touch with us. We're here to help you start your learning journey.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                <p className="text-gray-600 mb-6">
                  Have questions about our programs? We're here to help. Reach out through any of these channels.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-blue-700" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-600 text-sm">
                      123 Education Street,<br />
                      Victoria Island, Lagos,<br />
                      Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-blue-700" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600 text-sm">+234 123 456 7890</p>
                    <p className="text-gray-600 text-sm">+234 098 765 4321</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-blue-700" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600 text-sm">zionstudycenter@gmail.com</p>
                    <p className="text-gray-600 text-sm">admissions@zionstudycentre.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-blue-700" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office Hours</h3>
                    <p className="text-gray-600 text-sm">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600 text-sm">Saturday: 9:00 AM - 4:00 PM</p>
                    <p className="text-gray-600 text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-md border text-center h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CircleCheck className="text-green-600" size={48} />
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Message Received!
                  </h2>
                  
                  <p className="text-lg text-gray-600 mb-8">
                    Thank you, we've received your message about <span className="font-semibold text-gray-900">"{submittedSubject}"</span>.
                  </p>

                  <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800">
                    <Link to="/">
                      <ArrowRight className="mr-2" size={20} />
                      Back to Home
                    </Link>
                  </Button>
                  
                  <div className="mt-6">
                    <Button 
                        variant="link" 
                        onClick={() => setStatus('idle')} 
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Send another message
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-md border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          type="email"
                          placeholder="your.email@example.com"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          type="tel"
                          placeholder="+234 123 456 7890"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What is this about?"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        required
                        className="mt-1"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full md:w-auto bg-blue-700 hover:bg-blue-800" disabled={status === 'loading'}>
                      {status === 'loading' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Message'}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full bg-gray-50 md:py-0 flex flex-col md:m-0 md:p-0">
        <div className="w-full h-full flex-1 px-0 md:m-0 md:p-0">
          <div className="w-full h-80 md:h-full overflow-hidden md:m-0 md:p-0">
            <MapEmbed lat={officeLat} lng={officeLng} address={officeAddress} width="100%" />
          </div>
        </div>
      </section>
    </div>
  );
}
