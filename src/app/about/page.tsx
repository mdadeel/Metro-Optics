'use client';

import { Eye, Heart, Award, Users, Globe, Shield, Truck, Clock, Target, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Eye className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Welcome to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                {" "}OpticalBD
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your trusted partner for premium eyewear in Bangladesh. We're dedicated to bringing you 
              the world's finest glasses and sunglasses with unmatched quality and service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                Shop Our Collection
              </Button>
              <Button variant="outline" className="px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:border-emerald-600 transition-all">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-200 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '50,000+', label: 'Happy Customers', icon: Users },
              { number: '100+', label: 'Premium Brands', icon: Award },
              { number: '1000+', label: 'Eyewear Styles', icon: Eye },
              { number: '15+', label: 'Years Experience', icon: Clock }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-emerald-100 text-emerald-800 mb-4">Our Story</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Vision Meets Excellence
              </h2>
              <div className="space-y-4 text-gray-600 mb-8">
                <p className="leading-relaxed">
                  Founded in 2009, OpticalBD began with a simple mission: to provide Bangladeshis with 
                  access to world-class eyewear at affordable prices. What started as a small optical shop 
                  in Dhaka has grown into the nation's most trusted eyewear destination.
                </p>
                <p className="leading-relaxed">
                  We believe that clear vision is a fundamental right, not a luxury. That's why we've 
                  carefully curated collections from renowned international brands while maintaining 
                  prices that make quality eyewear accessible to everyone.
                </p>
                <p className="leading-relaxed">
                  Today, with over 50,000 satisfied customers and partnerships with more than 100 premium 
                  brands, we continue to innovate and expand our services to meet the evolving needs of 
                  the Bangladeshi market.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  '100% Authentic Products',
                  '7-Day Easy Returns',
                  'Free Nationwide Shipping',
                  'Expert Customer Support'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=500&fit=crop&crop=center"
                alt="Our Story"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl filter blur-2xl opacity-40"></div>
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl filter blur-2xl opacity-40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-emerald-100 text-emerald-800 mb-4">Our Values</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Drives Us Forward
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our core values shape every decision we make and every interaction we have with our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Trust & Authenticity',
                description: 'We guarantee 100% authentic products sourced directly from authorized distributors.',
                color: 'from-blue-500 to-indigo-600'
              },
              {
                icon: Heart,
                title: 'Customer First',
                description: 'Your satisfaction is our priority. We go above and beyond to exceed your expectations.',
                color: 'from-red-500 to-pink-600'
              },
              {
                icon: Target,
                title: 'Quality Excellence',
                description: 'Every product is carefully selected for superior craftsmanship and durability.',
                color: 'from-emerald-500 to-teal-600'
              },
              {
                icon: Globe,
                title: 'Local Presence',
                description: 'Deep understanding of Bangladeshi needs with global quality standards.',
                color: 'from-purple-500 to-indigo-600'
              },
              {
                icon: Sparkles,
                title: 'Innovation',
                description: 'Continuously bringing the latest eyewear technology and trends to Bangladesh.',
                color: 'from-yellow-500 to-orange-600'
              },
              {
                icon: Truck,
                title: 'Reliable Service',
                description: 'Fast, secure delivery across Bangladesh with comprehensive after-sales support.',
                color: 'from-cyan-500 to-blue-600'
              }
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-emerald-100 text-emerald-800 mb-4">Our Team</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet the Visionaries
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to bringing you the best eyewear experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Ahmed Rahman',
                role: 'Founder & CEO',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center',
                expertise: 'Business Strategy'
              },
              {
                name: 'Dr. Farhana Islam',
                role: 'Head Optometrist',
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=center',
                expertise: 'Eye Care Specialist'
              },
              {
                name: 'Karim Chowdhury',
                role: 'Operations Director',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=center',
                expertise: 'Supply Chain'
              },
              {
                name: 'Nusrat Jahan',
                role: 'Customer Experience Lead',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=300&h=300&fit=crop&crop=center',
                expertise: 'Client Relations'
              }
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover ring-4 ring-emerald-100 group-hover:ring-emerald-200 transition-all duration-300"
                  />
                  <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust OpticalBD for their eyewear needs. 
            Discover clarity, style, and confidence with our premium collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
              Explore Collection
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-all">
              Book Appointment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}