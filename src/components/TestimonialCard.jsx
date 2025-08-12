import { Star } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={16}
                className={`${index < rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
            />
        ));
    };

    return (
        <div className="card hover:shadow-lg transition-shadow duration-300">
            {/* Rating */}
            <div className="flex items-center mb-4">
                <div className="flex items-center mr-3">
                    {renderStars(testimonial.rating)}
                </div>
                <span className="text-sm text-gray-600">
                    {testimonial.rating}/5
                </span>
            </div>

            {/* Content */}
            <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
            </p>

            {/* Author */}
            <div className="flex items-center">
                <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.student}</p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;
