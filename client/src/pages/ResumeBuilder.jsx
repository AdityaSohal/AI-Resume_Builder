import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets' 
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, FileText, FolderIcon, GraduationCap, Sparkle, User } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'

const Resumebuilder = () => {
  const { resumeId } = useParams()

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: 'classic', // Fixed: should be template name, not color
    accent_color: '#3B82F6', // Fixed: corrected hex color
    public: false,
  })

  const [removeBackground, setRemoveBackground] = useState(false)

  const loadExistingResume = async () => {
    const resume = dummyResumeData.find((resume) => resume._id === resumeId)
    if (resume) {
      setResumeData(resume)
      document.title = resume.title
    }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkle },
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(() => {
    loadExistingResume()
  }, [resumeId])

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-600 hover:text-slate-800 transition-all'>
          <ArrowLeftIcon className='w-4 h-4'/> Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Left Panel - Form */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-300 p-6 pt-1 relative'>
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-300'/>
              <hr 
                className='absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 to-green-700 border-none transition-all duration-2000'
                style={{ width: `${activeSectionIndex * 100 / (sections.length-1)}%` }}
              />

              {/* Section navigation */}
              <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                <div></div>
                <div className='flex items-center gap-2'>
                  {activeSectionIndex !== 0 && (
                    <button 
                      onClick={() => setActiveSectionIndex(prev => Math.max(prev-1, 0))} 
                      className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all'
                    >
                      <ChevronLeft className='w-4 h-4'/> Previous
                    </button>
                  )}
                  <button 
                    onClick={() => setActiveSectionIndex(prev => Math.min(prev+1, sections.length-1))} 
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    disabled={activeSectionIndex === sections.length-1}
                  >
                    Next <ChevronRight className='w-4 h-4'/>
                  </button>
                </div>
              </div>

              {/* Info form */}
              <div className='space-y-6'>
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm 
                    data={resumeData.personal_info} 
                    onChange={(data) => setResumeData(prev => ({...prev, personal_info: data}))} 
                    removeBackground={removeBackground} 
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {/* Add other sections here */}
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className='lg:col-span-7'>
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resumebuilder