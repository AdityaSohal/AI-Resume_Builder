import { Briefcase, Plus, Sparkle, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ExperienceForm = ({ data, onChange }) => {
    const { token } = useSelector(state => state.auth)
    const [generatingIndex, setGeneratingIndex] = useState(-1)

    const addExperience = () => {
        const newExperience = {
            company: '',
            position: '',
            start_date: '',
            end_date: '',
            description: '',
            is_current: false,
        }
        onChange([...data, newExperience])
    }

    const removeExperience = (index) => {
        const updated = data.filter((_, i) => i !== index)
        onChange(updated)
    }

    const updateExperience = (index, field, value) => {
        const updated = [...data]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    const enhanceDescription = async (index) => {
        const experience = data[index]
        if (!experience.description) {
            toast.error('Please enter a description first')
            return
        }

        setGeneratingIndex(index)
        try {
            const response = await api.post(
                '/api/ai/enhance-job-desc',
                { userContent: experience.description },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            updateExperience(index, 'description', response.data.enhancedContent)
            toast.success('Description enhanced successfully')
        } catch (error) {
            toast.error('Failed to enhance description')
        } finally {
            setGeneratingIndex(-1)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <Briefcase className="size-5 text-gray-700" />
                        Professional Experience
                    </h3>
                    <p className="text-sm text-gray-500">Add your job experience.</p>
                </div>
                <button
                    onClick={addExperience}
                    type="button"
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                    <Plus className="size-4" />
                    Add Experience
                </button>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No work experience added yet.</p>
                    <p className="text-sm">Click "Add Experience" to get started.</p>
                </div>
            ) : (
                <div className="space-y-4 mt-4">
                    {data.map((experience, index) => (
                        <div
                            key={index}
                            className="p-4 border border-gray-200 rounded-lg space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-800">
                                    Experience #{index + 1}
                                </h4>
                                <button
                                    onClick={() => removeExperience(index)}
                                    type="button"
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                <input
                                    value={experience.company || ''}
                                    onChange={(e) =>
                                        updateExperience(index, 'company', e.target.value)
                                    }
                                    type="text"
                                    placeholder="Company Name"
                                    className="px-3 py-2 text-sm border rounded-lg w-full"
                                />
                                <input
                                    value={experience.position || ''}
                                    onChange={(e) =>
                                        updateExperience(index, 'position', e.target.value)
                                    }
                                    type="text"
                                    placeholder="Job Title"
                                    className="px-3 py-2 text-sm border rounded-lg w-full"
                                />
                                <input
                                    value={experience.start_date || ''}
                                    onChange={(e) =>
                                        updateExperience(index, 'start_date', e.target.value)
                                    }
                                    type="month"
                                    className="px-3 py-2 text-sm border rounded-lg w-full"
                                />
                                <input
                                    disabled={experience.is_current}
                                    value={experience.end_date || ''}
                                    onChange={(e) =>
                                        updateExperience(index, 'end_date', e.target.value)
                                    }
                                    type="month"
                                    className="px-3 py-2 text-sm border rounded-lg w-full disabled:bg-gray-100"
                                />
                            </div>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={experience.is_current || false}
                                    onChange={(e) =>
                                        updateExperience(index, 'is_current', e.target.checked)
                                    }
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                    Currently working here
                                </span>
                            </label>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">
                                        Job Description
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => enhanceDescription(index)}
                                        disabled={generatingIndex === index}
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                                    >
                                        <Sparkle className="h-3 w-3" />
                                        {generatingIndex === index ? 'Enhancing...' : 'Enhance with AI'}
                                    </button>
                                </div>
                                <textarea
                                    value={experience.description || ''}
                                    onChange={(e) =>
                                        updateExperience(index, 'description', e.target.value)
                                    }
                                    placeholder="Describe your role, responsibilities, and achievements..."
                                    className="w-full px-3 py-2 text-sm border rounded-lg"
                                    rows={3}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ExperienceForm