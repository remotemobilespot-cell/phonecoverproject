import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  customer_name: string;
  customer_image: string;
  rating: number;
  review_text: string;
}

// Fallback testimonials using your mockData.ts
const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    customer_name: 'Sarah Johnson',
    customer_image: '/assets/testimonials/sarah.jpg',
    rating: 5,
    review_text: 'Amazing quality! Got my custom case printed in minutes at the mall. The colors came out perfect and the case feels durable.'
  },
  {
    id: 2,
    customer_name: 'Mike Chen',
    customer_image: '/images/MikeChen.jpg',
    rating: 5,
    review_text: 'Super convenient! Found a machine near my office and printed a case with my dog\'s photo. Love the instant results!'
  },
  {
    id: 3,
    customer_name: 'Emily Rodriguez',
    customer_image: '/images/Testimonial.jpg',
    rating: 4,
    review_text: 'Great service and easy to use. The photo quality exceeded my expectations. Will definitely use again!'
  },
  {
    id: 4,
    customer_name: 'David Thompson',
    customer_image: '/assets/testimonials/david.jpg',
    rating: 5,
    review_text: 'Printed cases for my whole family during our vacation. Fast, affordable, and the kids loved designing their own!'
  },
  {
    id: 5,
    customer_name: 'Jessica Lee',
    customer_image: '/images/Testimonial.jpg',
    rating: 5,
    review_text: 'The machine at the airport saved my trip! My case broke and I got a new custom one in 5 minutes. Brilliant!'
  }
];

export default function TestimonialsSliderWorking() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
        // Keep fallback testimonials
      } else if (data && data.length > 0) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Keep fallback testimonials
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy customers who love their custom phone cases
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  {/* Stars */}
                  <div className="flex justify-center mb-6">
                    {renderStars(currentTestimonial.rating)}
                  </div>

                  {/* Review Text */}
                  <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                    "{currentTestimonial.review_text}"
                  </blockquote>

                  {/* Customer Info */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-4 bg-gray-200">
                      <img
                        src={currentTestimonial.customer_image}
                        alt={currentTestimonial.customer_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${currentTestimonial.customer_name}&background=3b82f6&color=ffffff&size=64`;
                        }}
                      />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {currentTestimonial.customer_name}
                    </h4>
                    <p className="text-gray-500">Verified Customer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
              <>
                <Button
                  onClick={prevTestimonial}
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  onClick={nextTestimonial}
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 shadow-lg"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {testimonials.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentIndex === index
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="text-center mt-4">
              <p className="text-gray-500">Loading testimonials...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}