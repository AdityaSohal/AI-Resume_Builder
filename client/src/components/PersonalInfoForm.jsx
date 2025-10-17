import { BriefcaseBusiness, Globe2, Linkedin, Mail, MapPin, Phone, UserIcon } from 'lucide-react'
import React from 'react'

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {
    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value })
    }

    const fields = [
        { key: "full_name", label: "Full Name", icon: UserIcon, type: "text", required: true },
        { key: "email", label: "E-mail", icon: Mail, type: "email", required: true },
        { key: "phone", label: "Phone No.", icon: Phone, type: "tel", required: true },
        { key: "location", label: "Location", icon: MapPin, type: "text" },
        { key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text" },
        { key: "linkedin", label: "LinkedIn", icon: Linkedin, type: "url" },
        { key: "personal_website", label: "Personal Website", icon: Globe2, type: "url" },
    ]

    return (
        <div>
            <h3 className='text-lg font-semibold text-shadow-gray-900'>Personal Information</h3>
            <p className='text-sm text-gray-600'>Get started with personal information</p>

            <div className='flex items-center gap-2'>
                <label className='cursor-pointer'>
                    {data.image ? (
                        <img
                            src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
                            alt='user-image'
                            className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80'
                        />
                    ) : (
                        <div className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700'>
                            <UserIcon className='w-10 h-10 p-2.5 border rounded-full' />
                            Upload user image
                        </div>
                    )}
                    <input
                        type="file"
                        accept='image/jpeg, image/png'
                        className='hidden'
                        onChange={(e) => handleChange("image", e.target.files[0])}
                    />
                </label>

                {typeof data.image === 'object' && (
                    <div className='ml-4'>
                        <p>Remove Background</p>
                        <label className='relative inline-flex items-center cursor-pointer gap-3'>
                            <input
                                type="checkbox"
                                className='sr-only peer'
                                onChange={() => setRemoveBackground(prev => !prev)}
                                checked={removeBackground}
                            />
                            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-600 transition-colors duration-200'></div>
                            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
                        </label>
                    </div>
                )}
            </div>

            <div>
                {fields.map((field) => {
                    const Icon = field.icon
                    return (
                        <div key={field.key} className='mt-5 space-y-1'>
                            <label className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                                <Icon className='w-4 h-4' />
                                {field.label}
                                {field.required && <span className='text-red-500'>*</span>}
                            </label>
                            <input
                                type={field.type}
                                value={data[field.key] || ""}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                className='mt-1 w-full px-3 py-2 border border-gray-500 rounded-lg focus:border-blue-500 outline-none transition-colors text-sm'
                                placeholder={`Enter Your ${field.label.toLowerCase()}`}
                                required={field.required}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PersonalInfoForm
