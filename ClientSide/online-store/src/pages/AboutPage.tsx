import React from 'react';
import { Store, Users, Award, Heart, TrendingUp, Shield } from 'lucide-react';
import { Card } from '../components/ui/card';
import CountUp from '../components/common/CountUp';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Our Store</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your trusted online destination for quality products and exceptional service since 2020
        </p>
      </div>

      {/* Mission Section */}
      <div className="mb-16">
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Mission</h2>
          <p className="text-lg text-center max-w-3xl mx-auto text-muted-foreground">
            We're dedicated to providing our customers with the best shopping experience possible. 
            From carefully curated products to seamless delivery, we ensure every step of your 
            journey with us is memorable and satisfying.
          </p>
        </Card>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality First</h3>
              <p className="text-muted-foreground">
                We carefully select every product to ensure it meets our high standards of quality and durability.
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our top priority. We're here to help you find exactly what you need.
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trust & Integrity</h3>
              <p className="text-muted-foreground">
                We build lasting relationships with our customers through honest business practices.
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously improve our services and embrace new technologies to serve you better.
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Security</h3>
              <p className="text-muted-foreground">
                Your data and transactions are protected with industry-leading security measures.
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <Store className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-muted-foreground">
                From everyday essentials to unique finds, we offer a diverse range of products.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Story Section */}
      <div className="mb-16">
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="mb-4">
              Founded in 2020, our online store began with a simple vision: to make quality products 
              accessible to everyone. What started as a small venture has grown into a trusted platform 
              serving thousands of satisfied customers worldwide.
            </p>
            <p className="mb-4">
              Our journey has been driven by our passion for excellence and our commitment to customer 
              satisfaction. We've built relationships with the best suppliers and manufacturers to ensure 
              that every product we offer meets our rigorous quality standards.
            </p>
            <p className="mb-4">
              Today, we continue to grow and evolve, always keeping our customers at the heart of 
              everything we do. We're not just an online store – we're a community of people who 
              believe in quality, value, and exceptional service.
            </p>
          </div>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">By The Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              <CountUp end={50} duration={2500} suffix="K+" />
            </div>
            <div className="text-muted-foreground">Happy Customers</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              <CountUp end={5} duration={2000} suffix="K+" />
            </div>
            <div className="text-muted-foreground">Products</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              <CountUp end={99} duration={2500} suffix="%" />
            </div>
            <div className="text-muted-foreground">Satisfaction Rate</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">Support</div>
          </Card>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <Card className="p-8 text-center">
          <p className="text-lg text-muted-foreground">
            Behind every great product is a dedicated team of professionals who work tirelessly 
            to ensure your shopping experience is nothing short of excellent. From our customer 
            service representatives to our logistics experts, everyone plays a crucial role in 
            bringing you the best service possible.
          </p>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Card className="p-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
          <p className="text-lg mb-6">
            Discover our wide range of products and experience the difference quality makes.
          </p>
          <a 
            href="/products" 
            className="inline-block bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-background/90 transition-colors"
          >
            Browse Products
          </a>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
