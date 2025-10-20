import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderIcon,
  GraduationCap,
  Sparkle,
  User,
} from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import { ColorPicker } from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'

const ResumeBuilder = () => {
  const { resumeID } = useParams()

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: 'classic', // ✅ correct template field
    accent_color: '#3B82F6', // ✅ correct color field
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

  useEffect(() => {
    const loadExistingResume = async () => {
      const resume = dummyResumeData.find((r) => r._id === resumeID)
      if (resume) {
        setResumeData(resume)
        document.title = resume.title
      }
    }
    loadExistingResume()
  }, [resumeID])

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
                {/* ✅ Template & ColorPicker side by side */}
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

                {/* Section navigation buttons */}
                <div className="flex items-center gap-2">
                  {activeSectionIndex !== 0 && (
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

              {/* Form Sections */}
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
                {activeSection.id === 'summary' &&(
                  <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data)=>setResumeData(prev=>({...prev, professional_summary:data}))}/>
                )}
                {activeSection.id === 'experience' &&(
                  <ExperienceForm data={resumeData.experience} onChange={(data)=>setResumeData(prev=>({...prev, experience:data}))} />
                )}
                {activeSection.id === 'education' &&(
                  <EducationForm data={resumeData.education} onChange={(data)=>setResumeData(prev=>({...prev, education:data}))} />
                )}
                {/* Add other sections here */}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - PREVIEW */}
          <div className="lg:col-span-7">
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
