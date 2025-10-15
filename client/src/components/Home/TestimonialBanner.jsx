import React from 'react';
import { UserIcon } from 'lucide-react'; // replace with actual icon you want

export default function TestimonialBanner() {
    return (
        <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 text-sm text-green-800 bg-green-100 border border-green-300 rounded-full px-4 py-1.5 shadow-sm">
                <UserIcon className="w-5 h-5 stroke-green-600" />
                <span className="font-medium">Testimonial</span>
            </div>
        </div>
    );
}
