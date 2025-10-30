'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Facebook, Instagram, Twitter, Youtube, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl opacity-90 mb-8">
              We&apos;re here to help you find the perfect eyewear. Reach out to us through any of the channels below.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm">
                <Phone className="w-4 h-4 mr-2" />
                24/7 Support
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                Nationwide Service
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                Quick Response
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Phone,
                title: 'Call Us',
                info: ['+880 1234-567890', '+880 2345-678901'],
                description: 'Available 24/7 for your queries',
                color: 'from-blue-500 to-indigo-600'
              },
              {
                icon: Mail,
                title: 'Email Us',
                info: ['info@opticalbd.com', 'support@opticalbd.com'],
                description: 'We respond within 24 hours',
                color: 'from-emerald-500 to-teal-600'
              },
              {
                icon: MapPin,
                title: 'Visit Us',
                info: ['Dhanmondi, Dhaka-1205', 'Banani, Dhaka-1213'],
                description: 'Showrooms open 10 AM - 8 PM',
                color: 'from-purple-500 to-pink-600'
              }
            ].map((contact, index) => {
              const Icon = contact.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${contact.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{contact.title}</h3>
                    <div className="space-y-2 mb-4">
                      {contact.info.map((item, idx) => (
                        <p key={idx} className="text-gray-700 font-medium">{item}</p>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{contact.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Have a question or need assistance? Fill out the form below and we&apos;ll get back to you soon.
              </p>

              {isSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-600">Thank you for contacting us. We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="+880 1234-567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                      placeholder="Tell us more about your query..."
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Map & Office Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Locations</h2>
              
              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-lg h-64 mb-6 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1579532584939-d25bc1df9a6e?w=600&h=400&fit=crop&crop=center"
                  alt="Map"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <MapPin className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="font-semibold">Multiple Locations</p>
                    <p className="text-sm text-gray-600">Across Bangladesh</p>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div className="space-y-4">
                {[
                  {
                    title: 'Dhanmondi Showroom',
                    address: 'Road 8, Dhanmondi, Dhaka-1205',
                    hours: '10:00 AM - 8:00 PM',
                    phone: '+880 1234-567890'
                  },
                  {
                    title: 'Banani Showroom',
                    address: 'Road 11, Banani, Dhaka-1213',
                    hours: '10:00 AM - 8:00 PM',
                    phone: '+880 2345-678901'
                  },
                  {
                    title: 'Gulshan Showroom',
                    address: 'Gulshan-1 Circle, Dhaka-1212',
                    hours: '11:00 AM - 7:00 PM',
                    phone: '+880 3456-789012'
                  }
                ].map((location, index) => (
                  <Card key={index} className="hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">{location.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {location.address}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {location.hours}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {location.phone}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect With Us</h2>
            <p className="text-lg text-gray-600">
              Follow us on social media for updates, offers, and eyewear tips
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Facebook',
                icon: Facebook,
                username: '@OpticalBD',
                followers: '50K+',
                color: 'bg-blue-600 hover:bg-blue-700'
              },
              {
                name: 'Instagram',
                icon: Instagram,
                username: '@OpticalBD',
                followers: '25K+',
                color: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              },
              {
                name: 'Twitter',
                icon: Twitter,
                username: '@OpticalBD',
                followers: '15K+',
                color: 'bg-sky-500 hover:bg-sky-600'
              },
              {
                name: 'YouTube',
                icon: Youtube,
                username: 'OpticalBD',
                followers: '10K+',
                color: 'bg-red-600 hover:bg-red-700'
              }
            ].map((social, index) => {
              const Icon = social.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${social.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{social.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{social.username}</p>
                    <Badge variant="secondary">{social.followers} followers</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions about our products and services
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'How do I know which glasses are right for me?',
                answer: 'We offer virtual try-on and expert consultations to help you find the perfect fit. You can also visit our showrooms for personalized assistance.'
              },
              {
                question: 'Do you offer home delivery across Bangladesh?',
                answer: 'Yes, we provide nationwide delivery with secure packaging. Orders above ৳2000 qualify for free shipping.'
              },
              {
                question: 'What is your return policy?',
                answer: 'We offer a 7-day easy return policy. If you\'re not satisfied with your purchase, you can return it for a full refund or exchange.'
              },
              {
                question: 'Are your products authentic?',
                answer: 'Absolutely! We source all our products directly from authorized distributors and guarantee 100% authenticity.'
              },
              {
                question: 'Do you provide eye testing services?',
                answer: 'Yes, we have qualified optometrists at our showrooms who provide comprehensive eye testing services.'
              }
            ].map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <MessageSquare className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}