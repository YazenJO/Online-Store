import React from 'react';
import { Truck, Package, Clock, DollarSign, Globe, Shield, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/card';

const ShippingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Fast, reliable delivery to your doorstep
        </p>
      </div>

      {/* Shipping Options */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Shipping Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Standard Shipping</h3>
              <div className="text-3xl font-bold text-primary mb-2">$5.99</div>
              <p className="text-muted-foreground mb-2">5-7 Business Days</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Tracking included</li>
                <li>✓ Signature not required</li>
                <li>✓ Available nationwide</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-primary border-2">
            <div className="absolute top-4 right-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                Popular
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Express Shipping</h3>
              <div className="text-3xl font-bold text-primary mb-2">$12.99</div>
              <p className="text-muted-foreground mb-2">2-3 Business Days</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Priority handling</li>
                <li>✓ Real-time tracking</li>
                <li>✓ Available nationwide</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Next Day Delivery</h3>
              <div className="text-3xl font-bold text-primary mb-2">$24.99</div>
              <p className="text-muted-foreground mb-2">1 Business Day</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Guaranteed delivery</li>
                <li>✓ Signature required</li>
                <li>✓ Limited areas</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* Free Shipping Banner */}
      <div className="mb-12">
        <Card className="p-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="h-8 w-8" />
            <h2 className="text-3xl font-bold">Free Shipping on Orders Over $50</h2>
          </div>
          <p className="text-lg">
            Enjoy complimentary standard shipping on all orders above $50!
          </p>
        </Card>
      </div>

      {/* Delivery Information */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Delivery Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Globe className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Delivery Areas</h3>
                <p className="text-muted-foreground mb-2">
                  We ship to all 50 states in the United States, as well as select international locations.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Domestic (US): All states</li>
                  <li>• Canada: Major cities</li>
                  <li>• International: Contact us for availability</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Processing Time</h3>
                <p className="text-muted-foreground mb-2">
                  Orders are typically processed within 1-2 business days before shipping.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Order cutoff time: 2:00 PM EST</li>
                  <li>• Weekend orders ship on Monday</li>
                  <li>• Holiday processing may take longer</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Package className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Tracking Your Order</h3>
                <p className="text-muted-foreground mb-2">
                  Stay informed every step of the way with our comprehensive tracking system.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Email notification when shipped</li>
                  <li>• Track in your account dashboard</li>
                  <li>• Real-time status updates</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Package Protection</h3>
                <p className="text-muted-foreground mb-2">
                  Your items are carefully packaged and insured for your peace of mind.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Secure packaging materials</li>
                  <li>• Insurance on all shipments</li>
                  <li>• Fragile items handled with care</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* International Shipping */}
      <div className="mb-12">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="h-7 w-7 text-primary" />
            International Shipping
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              We're excited to serve customers around the world! International shipping rates and 
              delivery times vary by destination.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Canada</h3>
                <ul className="text-sm space-y-1">
                  <li>• Shipping: $15.99 - $29.99</li>
                  <li>• Delivery: 7-14 business days</li>
                  <li>• Customs fees may apply</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Other Countries</h3>
                <ul className="text-sm space-y-1">
                  <li>• Contact us for quote</li>
                  <li>• Delivery: 14-21 business days</li>
                  <li>• Customs fees apply</li>
                </ul>
              </div>
            </div>
            <p className="text-sm pt-4">
              <strong>Note:</strong> International customers are responsible for any customs duties, 
              taxes, or fees imposed by their country.
            </p>
          </div>
        </Card>
      </div>

      {/* Shipping Restrictions */}
      <div className="mb-12">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Shipping Restrictions</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              For safety and legal reasons, certain items cannot be shipped to specific locations:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>P.O. Boxes: Most items can be shipped to P.O. Boxes (large items excluded)</li>
              <li>APO/FPO Addresses: Standard shipping only, delivery times may vary</li>
              <li>Hawaii & Alaska: Additional shipping charges apply</li>
              <li>Territories: Contact us for availability and rates</li>
            </ul>
          </div>
        </Card>
      </div>

      {/* What to Expect */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">What to Expect</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <div className="text-2xl font-bold text-primary">1</div>
            </div>
            <h3 className="font-semibold mb-2">Order Placed</h3>
            <p className="text-sm text-muted-foreground">
              You'll receive an order confirmation email
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <div className="text-2xl font-bold text-primary">2</div>
            </div>
            <h3 className="font-semibold mb-2">Processing</h3>
            <p className="text-sm text-muted-foreground">
              We prepare your order for shipment
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <div className="text-2xl font-bold text-primary">3</div>
            </div>
            <h3 className="font-semibold mb-2">Shipped</h3>
            <p className="text-sm text-muted-foreground">
              Tracking number sent to your email
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <div className="text-2xl font-bold text-primary">4</div>
            </div>
            <h3 className="font-semibold mb-2">Delivered</h3>
            <p className="text-sm text-muted-foreground">
              Package arrives at your door
            </p>
          </Card>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center">
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5">
          <h3 className="text-2xl font-bold mb-2">Questions About Shipping?</h3>
          <p className="text-muted-foreground mb-6">
            Our customer service team is here to help with any shipping questions or concerns.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </Card>
      </div>
    </div>
  );
};

export default ShippingPage;
