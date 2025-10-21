import React, { useEffect, useState } from 'react'
import { dummyResumeData } from '../assets/assets'
import { useParams, Link } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import Loaders from '../components/Loaders'
import { ArrowLeftIcon } from 'lucide-react'

const Preview = () => {
  const { resumeID } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null)

  useEffect(() => {
    const loadResume = async () => {
      const foundResume = dummyResumeData.find(resume => resume._id === resumeID)
      setResumeData(foundResume || null)
      setIsLoading(false)
    }
    loadResume()
  }, [resumeID])

  if (isLoading) return <Loaders />

  return resumeData ? (
    <div className='bg-slate-100'>
      <div className='max-w-3xl mx-auto py-10'>
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          className='py-4 bg-white'
        />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <p className='text-center text-6xl text-slate-400 font-medium'>
        Resume not found
      </p>
      <Link
        to="/"
        className='mt-6 flex items-center bg-green-500 hover:bg-green-700 text-white rounded-full px-6 h-9 ring-offset-1 ring-1 ring-green-400 transition-colors'
      >
        <ArrowLeftIcon className='size-4 mr-2' />
        Go to home page
      </Link>
    </div>
  )
}

export default Preview
