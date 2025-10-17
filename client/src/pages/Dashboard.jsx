import React, { useEffect, useState } from 'react'
import {
  FilePenLineIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadIcon,
  XIcon
} from 'lucide-react'
import { dummyResumeData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const colors = ['#9333ea', '#d97706', '#dc2626', '#0284c7', '#16a34a']

  const [allResume, setAllResume] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const navigate = useNavigate()

  const loadAllResume = async () => {
    setAllResume(dummyResumeData)
  }

  const createResume = async (event) => {
    event.preventDefault()
    setShowCreateResume(false)
    navigate(`/app/builder/res123`)
  }

  const uploadResume = async (event) => {
    event.preventDefault()
    setShowUploadResume(false)
    navigate(`/app/builder/res123`)
  }

  useEffect(() => {
    loadAllResume()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent sm:hidden">
        Welcome, John Doe
      </p>

      {/* Create & Upload Buttons */}
      <div className="flex gap-4">
        {/* Create Resume */}
        <button
          onClick={() => setShowCreateResume(true)}
          className="w-full sm:max-w-36 h-48 bg-white flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <PlusIcon className="size-11 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full transition-transform duration-300 group-hover:scale-105" />
          <p className="text-sm transition-colors duration-300 group-hover:text-indigo-600">
            Create Resume
          </p>
        </button>

        {/* Upload Resume */}
        <button
          onClick={() => setShowUploadResume(true)}
          className="w-full sm:max-w-36 h-48 bg-white flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <UploadCloud className="size-11 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full transition-transform duration-300 group-hover:scale-105" />
          <p className="text-sm transition-colors duration-300 group-hover:text-purple-600">
            Upload Existing
          </p>
        </button>
      </div>

      <hr className="border-slate-300 my-6 sm:w-[305px]" />

      {/* Resume Cards */}
      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
        {allResume.map((resume, index) => {
          const baseColor = colors[index % colors.length]

          return (
            <div
              key={index}
              className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                borderColor: `${baseColor}40`
              }}
            >
              <FilePenLineIcon
                className="size-7 transition-transform duration-300 group-hover:scale-105"
                style={{ color: baseColor }}
              />

              <p
                className="text-sm px-2 text-center transition-transform duration-300 group-hover:scale-105"
                style={{ color: baseColor }}
              >
                {resume.title}
              </p>

              <p className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors duration-300 px-2 text-center">
                Updated on {new Date(resume.updatedAt).toLocaleDateString()}
              </p>

              {/* Hover Icons */}
              <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1">
                <TrashIcon className="size-6 p-1.5 rounded text-slate-700 hover:bg-white/50 transition-all duration-300" />
                <PencilIcon className="size-6 p-1.5 rounded text-slate-700 hover:bg-white/50 transition-all duration-300" />
              </div>
            </div>
          )
        })}

        {/* Create Resume Modal */}
        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="w-full px-4 py-2 mb-4 border rounded focus:border-green-600 outline-none"
                required
              />
              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Create Resume
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreateResume(false)
                  setTitle('')
                }}
              />
            </div>
          </form>
        )}

        {/* Upload Resume Modal */}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Upload Resume</h2>

              {/* File Upload */}
              <label
                className="block text-sm text-slate-700"
                htmlFor="resume-input"
              >
                Select Resume File
              </label>
              <div
                className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-600 hover:text-green-800 cursor-pointer transition-colors"
                onClick={() => document.getElementById('resume-input').click()}
              >
                {resume ? (
                  <p className="text-green-800">{resume.name}</p>
                ) : (
                  <>
                    <UploadIcon className="size-14 stroke-1" />
                    <p>Upload Resume</p>
                  </>
                )}
              </div>
              <input
                id="resume-input"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => setResume(e.target.files[0])}
              />

              {/* Title Input */}
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="w-full px-4 py-2 mb-4 border rounded focus:border-green-600 outline-none"
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Upload Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false)
                  setTitle('')
                  setResume(null)
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Dashboard
