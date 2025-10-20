import { Plus, Trash2, Sparkle } from 'lucide-react'
import React from 'react'

const ProjectForm = ({ data, onChange }) => {
    const addProject = () => {
        const newProject = {
            name: '',
            type: '',
            description: '',
        }
        onChange([...data, newProject])
    }

    const removeProject = (index) => {
        const updated = data.filter((_, i) => i !== index)
        onChange(updated)
    }

    const updateProject = (index, field, value) => {
        const updated = [...data]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <Sparkle className="size-5 text-gray-700" />
                        Projects
                    </h3>
                    <p className="text-sm text-gray-500">Add your project details.</p>
                </div>
                <button
                    onClick={addProject}
                    type="button"
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                    <Plus className="size-4" />
                    Add Project
                </button>
            </div>

            <div className="space-y-4 mt-6">
                {data.map((project, index) => (
                    <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-800">
                                Project #{index + 1}
                            </h4>
                            <button
                                onClick={() => removeProject(index)}
                                type="button"
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                            <input
                                value={project.name || ''}
                                onChange={(e) =>
                                    updateProject(index, 'name', e.target.value)
                                }
                                type="text"
                                placeholder="Project name"
                                className="px-3 py-2 text-sm border rounded w-full"
                            />
                            <input
                                value={project.type || ''}
                                onChange={(e) =>
                                    updateProject(index, 'type', e.target.value)
                                }
                                type="text"
                                placeholder="Project type"
                                className="px-3 py-2 text-sm border rounded w-full"
                            />
                        </div>

                        <textarea
                            value={project.description || ''}
                            onChange={(e) =>
                                updateProject(index, 'description', e.target.value)
                            }
                            placeholder="Describe your project"
                            className="px-3 py-2 text-sm border rounded w-full"
                            rows={4}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProjectForm
