import { Check, Palette } from 'lucide-react';
import React, { useState } from 'react';

export const ColorPicker = ({ selectedColor, onChange }) => {
  const colors = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Indigo", value: "#6366F1" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Green", value: "#22C55E" },
    { name: "Red", value: "#EF4444" },
    { name: "Orange", value: "#F97316" },
    { name: "Teal", value: "#14B8A6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Gray", value: "#6B7280" },
    { name: "Yellow", value: "#EAB308" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-r from-purple-50 to-purple-100 ring-1 ring-purple-300 hover:ring-2 transition-all px-3 py-2 rounded-lg"
      >
        <Palette size={16} /> <span className="max-sm:hidden">Accent</span>
      </button>

      {isOpen && (
        <div className="grid grid-cols-4 w-48 gap-2 absolute top-full left-0 p-3 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-md">
          {colors.map((color) => (
            <div
              key={color.value}
              onClick={() => {
                onChange(color.value);
                setIsOpen(false);
              }}
              className="relative cursor-pointer group flex flex-col items-center"
            >
              <div
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color.value
                    ? "border-black/40 scale-105"
                    : "border-transparent group-hover:border-black/25"
                }`}
                style={{ backgroundColor: color.value }}
              >
                {selectedColor === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="size-5 text-white drop-shadow" />
                  </div>
                )}
              </div>
              <p className="text-xs text-center mt-1 text-gray-600">{color.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
