import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    text: 'Amazing quality! Got my custom case printed in minutes at the mall. The colors came out perfect and the case feels durable.',
    image: '/images/Testimonial.jpg'
  },
  {
    id: 2,
    name: 'Mike Chen',
    rating: 5,
    text: 'Super convenient! Found a machine near my office and printed a case with my dog\'s photo. Love the instant results!',
    image: '/images/MikeChen.jpg'
  },
  {
    id: 3,
    name: 'David Thompson',
    rating: 5,
    text: 'Printed cases for my whole family during our vacation. Fast, affordable, and the kids loved designing their own!',
    image: '/images/Testimonial.jpg'
  }
];

export default function SimpleTestimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const currentTestimonial = testimonials[current];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of happy customers who love their custom cases
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8 text-center relative">
              
              {/* Navigation */}
              <Button
                variant="ghost"
                size="icon"
                onClick={prev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {/* Stars */}
              <div className="flex justify-center mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < currentTestimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg text-gray-700 mb-6 italic">
                "{currentTestimonial.text}"
              </blockquote>

              {/* Customer */}
              <div className="flex items-center justify-center">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${currentTestimonial.name}&background=3b82f6&color=ffffff&size=48`;
                  }}
                />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{currentTestimonial.name}</p>
                  <p className="text-sm text-gray-600">Verified Customer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  current === index ? 'bg-blue-600 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}