import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2,
  Sparkle,
  User,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import { toast } from 'react-hot-toast'

import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import { ColorPicker } from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillForm from '../components/SkillForm'

const ResumeBuilder = () => {
  const { resumeID } = useParams()
  const { token } = useSelector((state) => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    projects: [], // Fixed: was "project" in some places
    skills: [],
    template: 'classic',
    accent_color: '#3B82F6',
    public: false,
  })

  const [removeBackground, setRemoveBackground] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'projects', name: 'Projects', icon: FolderIcon },
    { id: 'skills', name: 'Skills', icon: Sparkle },
  ]

  const activeSection = sections[activeSectionIndex]

  // Load existing resume data
  useEffect(() => {
    const loadExistingResume = async () => {
      try {
        const { data } = await api.get(`/api/resume/${resumeID}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (data.resume) {
          setResumeData(data.resume)
          document.title = data.resume.title || 'Resume Builder'
        }
      } catch (error) {
        console.error('Error loading resume:', error.message)
        toast.error('Failed to load resume')
      }
    }

    if (resumeID && token) {
      loadExistingResume()
    }
  }, [resumeID, token])

  // Toggle visibility between public/private
  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData()
      formData.append('resumeID', resumeID)
      formData.append(
        'resumeData',
        JSON.stringify({ public: !resumeData.public })
      )

      const { data } = await api.put('/api/resume/update', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setResumeData((prev) => ({ ...prev, public: !prev.public }))
      toast.success(data.message || 'Visibility updated successfully!')
    } catch (error) {
      console.error('Error updating resume visibility:', error)
      toast.error('Failed to update visibility.')
    }
  }

  // Share resume link
  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0]
    const resumeUrl = `${frontendUrl}/view/${resumeID}`

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'Check out my resume!' })
    } else {
      navigator.clipboard.writeText(resumeUrl)
      toast.info('Link copied to clipboard!')
    }
  }

  // Download resume (print as PDF)
  const downloadResume = () => {
    window.print()
  }

  // Save resume changes - FIXED VERSION
  // Add this function to your ResumeBuilder.jsx component
// Replace the existing saveResumeChanges function with this one

const saveResumeChanges = async () => {
  try {
    console.log('=== SAVING RESUME CHANGES ===')
    
    // Create FormData for multipart upload
    const formData = new FormData()
    formData.append('resumeID', resumeData._id)
    
    // Create clean resume data copy (without the image file object)
    const cleanResumeData = {
      title: resumeData.title,
      personal_info: {
        full_name: resumeData.personal_info?.full_name || '',
        email: resumeData.personal_info?.email || '',
        phone: resumeData.personal_info?.phone || '',
        location: resumeData.personal_info?.location || '',
        profession: resumeData.personal_info?.profession || '',
        linkedin: resumeData.personal_info?.linkedin || '',
        personal_website: resumeData.personal_info?.personal_website || '',
        // Keep existing image URL if it's a string (already uploaded)
        image: typeof resumeData.personal_info?.image === 'string' 
          ? resumeData.personal_info.image 
          : ''
      },
      professional_summary: resumeData.professional_summary || '',
      experience: resumeData.experience || [],
      education: resumeData.education || [],
      projects: resumeData.projects || [],
      skills: resumeData.skills || [],
      template: resumeData.template || 'classic',
      accent_color: resumeData.accent_color || '#3B82F6',
      public: resumeData.public || false,
    }

    // Append resume data as JSON string
    formData.append('resumeData', JSON.stringify(cleanResumeData))
    
    // Handle NEW image upload if it's a File object (newly selected image)
    if (resumeData.personal_info?.image && typeof resumeData.personal_info.image === 'object') {
      console.log('Adding new image to form data:', resumeData.personal_info.image.name)
      console.log('Image size:', resumeData.personal_info.image.size, 'bytes')
      formData.append('image', resumeData.personal_info.image)
      
      // Add removeBackground flag if checked
      if (removeBackground) {
        console.log('Background removal enabled')
        formData.append('removeBackground', 'yes')
      }
    } else if (typeof resumeData.personal_info?.image === 'string') {
      console.log('Using existing image URL:', resumeData.personal_info.image)
    }

    // Log FormData contents for debugging
    console.log('FormData contents:')
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(pair[0], '-> File:', pair[1].name, pair[1].size, 'bytes')
      } else {
        console.log(pair[0], '->', typeof pair[1] === 'string' && pair[1].length > 100 
          ? pair[1].substring(0, 100) + '...' 
          : pair[1])
      }
    }

    // Send request - Don't set Content-Type, let browser handle it for FormData
    console.log('Sending update request...')
    const { data } = await api.put('/api/resume/update', formData, {
      headers: { 
        Authorization: `Bearer ${token}`
        // Don't set Content-Type - browser will set it correctly with boundary
      },
    })

    console.log('=== SAVE SUCCESSFUL ===')
    console.log('Updated resume received:', data.resume._id)
    console.log('Image URL in response:', data.resume.personal_info?.image)

    // Update local state with the response from server
    setResumeData(data.resume)
    setRemoveBackground(false) // Reset the toggle
    
    return Promise.resolve()
  } catch (error) {
    console.error('=== SAVE ERROR ===')
    console.error('Error:', error.message)
    console.error('Response:', error.response?.data)
    throw error
  }
}

  return (
    <div>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-600 hover:text-slate-800 transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* LEFT PANEL - FORM */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 pt-1 relative">
              {/* Progress bar */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-300" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-700 border-none transition-all duration-700"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />

              {/* Section navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex items-center gap-3">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />

                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({ ...prev, accent_color: color }))
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  {activeSectionIndex > 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prev) => Math.max(prev - 1, 0))
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex((prev) =>
                        Math.min(prev + 1, sections.length - 1)
                      )
                    }
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic Form Sections */}
              <div className="space-y-6">
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, personal_info: data }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === 'experience' && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, experience: data }))
                    }
                  />
                )}

                {activeSection.id === 'education' && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, education: data }))
                    }
                  />
                )}

                {activeSection.id === 'projects' && (
                  <ProjectForm
                    data={resumeData.projects} // Fixed: using "projects"
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, projects: data }))
                    }
                  />
                )}

                {activeSection.id === 'skills' && (
                  <SkillForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, skills: data }))
                    }
                  />
                )}
              </div>

              <button
                onClick={() => {
                  toast.promise(saveResumeChanges(), {
                    loading: 'Saving...',
                    success: 'Saved!',
                    error: 'Failed to save'
                  })
                }}
                className="bg-gradient-to-r from-green-100 to-green-200 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* RIGHT PANEL - PREVIEW */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-3 text-sm bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                  >
                    <Share2 className="size-4" />
                  </button>
                )}

                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center gap-1 p-2 px-3 text-sm bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-lg ring-purple-300 hover:ring transition-colors"
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>

                <button
                  onClick={downloadResume}
                  className="flex items-center p-2 px-3 text-sm bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors"
                >
                  <DownloadIcon className="size-4" />
                  Download
                </button>
              </div>
            </div>

            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder