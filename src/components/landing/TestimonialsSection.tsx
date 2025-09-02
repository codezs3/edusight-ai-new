'use client';

import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/20/solid';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Parent',
    school: 'Lincoln Elementary',
    content: 'EduSight has transformed how we understand our daughter\'s learning needs. The comprehensive reports helped us identify areas for improvement and celebrate her strengths.',
    rating: 5,
    image: '/avatars/sarah.jpg',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    role: 'School Principal',
    school: 'Riverside High School',
    content: 'The AI-powered insights have revolutionized our approach to student support. We can now identify at-risk students early and provide targeted interventions.',
    rating: 5,
    image: '/avatars/michael.jpg',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'School Counselor',
    school: 'Oakwood Middle School',
    content: 'The psychological wellbeing assessments are incredibly valuable. They help us understand the whole child, not just their academic performance.',
    rating: 5,
    image: '/avatars/emily.jpg',
  },
];

export function TestimonialsSection() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center animate-fade-in-up">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary-600">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by educators and parents
          </p>
        </div>
        
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center gap-x-1 text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
                
                <blockquote className="text-gray-900">
                  <p>"{testimonial.content}"</p>
                </blockquote>
                
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}, {testimonial.school}</div>
                  </div>
                </figcaption>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
