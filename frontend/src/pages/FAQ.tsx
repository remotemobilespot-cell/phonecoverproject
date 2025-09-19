import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail } from 'lucide-react';

const faqs = [
  {
    question: "How long does it take to print a phone case?",
    answer: "Our advanced printing technology creates your custom phone case in under 5 minutes! The process includes selecting your design, payment processing, and printing - all done quickly and efficiently."
  },
  {
    question: "What phone models do you support?",
    answer: "We support all major phone models including the latest iPhones (15 series), Samsung Galaxy devices (S24 series), Google Pixel phones, and many others. If you don't see your model listed, please contact us as we regularly add new models."
  },
  {
    question: "What image formats can I upload?",
    answer: "You can upload JPG, PNG, and HEIC image files up to 10MB in size. For best results, we recommend high-resolution images (at least 1080x1080 pixels) with good lighting and contrast."
  },
  {
    question: "How durable are the printed cases?",
    answer: "Our cases are made from premium materials with scratch-resistant printing that won't fade, peel, or crack under normal use. They provide excellent protection against drops and daily wear while maintaining vibrant colors."
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer: "Yes! We offer a 30-day satisfaction guarantee. If you're not completely happy with your case, bring it to any of our locations with your receipt for a full refund or replacement."
  },
  {
    question: "Do you offer bulk printing for events?",
    answer: "Absolutely! We offer special rates for bulk orders (10+ cases). Contact our team to discuss pricing and availability for weddings, corporate events, or other special occasions."
  },
  {
    question: "Are there any design restrictions?",
    answer: "We maintain family-friendly standards, so we cannot print copyrighted material, inappropriate content, or images that violate our terms of service. Personal photos, original artwork, and creative designs are all welcome!"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards, Apple Pay, Google Pay, and Samsung Pay through our secure Stripe payment system. Cash payments are not accepted at our vending machines."
  },
  {
    question: "Can I preview my case before printing?",
    answer: "Yes! Our system shows you a detailed preview of how your case will look before you complete your purchase. You can make adjustments to positioning, size, and other elements until you're completely satisfied."
  },
  {
    question: "What if the machine is out of order?",
    answer: "All our machines are monitored 24/7. If you encounter any issues, contact our support team immediately at 1-800-PRINT-ME or use the help button on the machine for instant assistance."
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about printing custom phone cases
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:text-blue-600">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Phone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <CardTitle className="text-lg">Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Speak with our support team
                </p>
                <Button variant="outline" className="w-full">
                  1-800-PRINT-ME
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Mail className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <CardTitle className="text-lg">Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get help via email
                </p>
                <Button variant="outline" className="w-full">
                  support@printphonecover.com
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <CardTitle className="text-lg">Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Chat with us instantly
                </p>
                <Button variant="outline" className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Still have questions? */}
          <div className="mt-12 text-center bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our customer support team is here to help.
            </p>
            <Button size="lg">Contact Support</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}