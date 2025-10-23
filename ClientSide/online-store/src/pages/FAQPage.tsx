import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const faqs: FAQItem[] = [
    // Ordering
    {
      id: 1,
      category: 'Ordering',
      question: 'How do I place an order?',
      answer: 'Browse our products, add items to your cart, and proceed to checkout. You\'ll need to create an account or login, then provide shipping and payment information to complete your order.'
    },
    {
      id: 2,
      category: 'Ordering',
      question: 'Can I modify or cancel my order after placing it?',
      answer: 'You can modify or cancel your order within 1 hour of placing it. After that, your order enters processing and cannot be changed. Contact customer support immediately if you need assistance.'
    },
    {
      id: 3,
      category: 'Ordering',
      question: 'Do I need an account to place an order?',
      answer: 'Yes, creating an account is required to place an order. This allows you to track your orders, save shipping addresses, and manage your account preferences.'
    },
    {
      id: 4,
      category: 'Ordering',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), debit cards, PayPal, and digital wallets like Apple Pay and Google Pay.'
    },

    // Shipping
    {
      id: 5,
      category: 'Shipping',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Next Day delivery arrives in 1 business day. Processing time of 1-2 business days is added before shipping begins.'
    },
    {
      id: 6,
      category: 'Shipping',
      question: 'Do you offer free shipping?',
      answer: 'Yes! We offer free standard shipping on all orders over $50. Orders under $50 have a standard shipping fee of $5.99.'
    },
    {
      id: 7,
      category: 'Shipping',
      question: 'Can I track my order?',
      answer: 'Absolutely! Once your order ships, you\'ll receive an email with a tracking number. You can also track your order anytime by logging into your account and viewing your order history.'
    },
    {
      id: 8,
      category: 'Shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to Canada and select international locations. Shipping rates and delivery times vary by destination. International customers are responsible for any customs duties or taxes.'
    },

    // Returns & Refunds
    {
      id: 9,
      category: 'Returns & Refunds',
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of delivery for most items in original condition with tags attached. Items must be unworn, unused, and in original packaging. Some items like personal care products are non-returnable.'
    },
    {
      id: 10,
      category: 'Returns & Refunds',
      question: 'How do I return an item?',
      answer: 'Login to your account, go to order history, select the order, and click "Return Item". Follow the instructions to print a return label and ship the item back to us. Refunds are processed within 5-7 business days of receiving the return.'
    },
    {
      id: 11,
      category: 'Returns & Refunds',
      question: 'Who pays for return shipping?',
      answer: 'For defective items or our error, we provide a prepaid return label. For standard returns (change of mind), customers are responsible for return shipping costs, which will be deducted from your refund.'
    },
    {
      id: 12,
      category: 'Returns & Refunds',
      question: 'Can I exchange an item instead of returning it?',
      answer: 'Yes! If you want a different size or color, select "Exchange" when initiating your return. We\'ll ship the replacement as soon as we receive your return. Exchanges are subject to product availability.'
    },

    // Account & Security
    {
      id: 13,
      category: 'Account & Security',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a reset link. The link is valid for 24 hours. Make sure to check your spam folder if you don\'t see the email.'
    },
    {
      id: 14,
      category: 'Account & Security',
      question: 'Is my payment information secure?',
      answer: 'Yes! We use industry-standard SSL encryption to protect your data. We never store your full credit card information on our servers. All payment processing is handled securely through trusted payment providers.'
    },
    {
      id: 15,
      category: 'Account & Security',
      question: 'Can I save multiple shipping addresses?',
      answer: 'Yes, you can save multiple shipping addresses in your account. During checkout, you can select from your saved addresses or add a new one.'
    },
    {
      id: 16,
      category: 'Account & Security',
      question: 'How do I delete my account?',
      answer: 'To delete your account, contact customer support. Please note that deleting your account will remove your order history and saved information permanently.'
    },

    // Products
    {
      id: 17,
      category: 'Products',
      question: 'Are your product photos accurate?',
      answer: 'We strive to display products as accurately as possible. However, colors may vary slightly due to different monitor settings. Product dimensions and detailed descriptions are provided for each item.'
    },
    {
      id: 18,
      category: 'Products',
      question: 'How do I know if an item is in stock?',
      answer: 'Stock availability is shown on each product page. If an item is out of stock, you can sign up for email notifications when it becomes available again.'
    },
    {
      id: 19,
      category: 'Products',
      question: 'Do you restock sold-out items?',
      answer: 'Most items are restocked regularly. Use the "Notify Me" button on out-of-stock products to receive an email when they\'re back in stock. Popular items usually restock within 2-4 weeks.'
    },
    {
      id: 20,
      category: 'Products',
      question: 'Can I request a product that you don\'t carry?',
      answer: 'Yes! We love customer suggestions. Contact us with your product request, and we\'ll do our best to add it to our catalog if there\'s enough demand.'
    },

    // Customer Support
    {
      id: 21,
      category: 'Customer Support',
      question: 'How can I contact customer support?',
      answer: 'You can reach us via email at support@onlinestore.com, call us at +1 (555) 123-4567, or use the contact form on our Contact page. We\'re available Monday-Friday 9am-6pm EST.'
    },
    {
      id: 22,
      category: 'Customer Support',
      question: 'What if I receive a damaged or defective item?',
      answer: 'We\'re sorry if that happens! Contact us within 48 hours of delivery with photos of the damage. We\'ll send a replacement immediately or issue a full refund, including return shipping costs.'
    },
    {
      id: 23,
      category: 'Customer Support',
      question: 'Do you offer price matching?',
      answer: 'We don\'t offer price matching at this time. However, we frequently run promotions and sales. Sign up for our newsletter to stay informed about special offers and discounts.'
    },
    {
      id: 24,
      category: 'Customer Support',
      question: 'Can I get a discount code?',
      answer: 'Subscribe to our newsletter to receive exclusive discount codes and early access to sales. We also offer special promotions during holidays and seasonal events.'
    }
  ];

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about ordering, shipping, returns, and more
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto space-y-3 mb-12">
        {filteredFaqs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No questions found matching your search. Try different keywords or browse by category.
            </p>
          </Card>
        ) : (
          filteredFaqs.map(faq => (
            <Card key={faq.id} className="overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded mb-2">
                    {faq.category}
                  </div>
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                </div>
                {openId === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
                )}
              </button>
              {openId === faq.id && (
                <div className="px-6 pb-6 text-muted-foreground border-t">
                  <p className="pt-4">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Still Have Questions */}
      <div className="text-center">
        <Card className="p-8 max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5">
          <h3 className="text-2xl font-bold mb-2">Still Have Questions?</h3>
          <p className="text-muted-foreground mb-6">
            Can't find the answer you're looking for? Our customer support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
            <a 
              href="/shipping" 
              className="inline-block bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
            >
              Shipping Info
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FAQPage;
