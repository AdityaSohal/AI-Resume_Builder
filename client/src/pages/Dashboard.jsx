import React, { useEffect, useState } from 'react'
import { FilePenLineIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud } from 'lucide-react'
import { dummyResumeData } from '../assets/assets'

const Dashboard = () => {
  const colors = [
    "#9333ea",
    "#d97706",
    "#dc2626",
    "#0284c7",
    "#16a34a"
  ]

  const [allResume, setAllResume] = useState([])

  const loadAllResume = async () => {
    setAllResume(dummyResumeData)
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
        <button className="w-full sm:max-w-36 h-48 bg-white flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <PlusIcon className="size-11 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full transition-transform duration-300 group-hover:scale-105" />
          <p className="text-sm transition-colors duration-300 group-hover:text-indigo-600">
            Create Resume
          </p>
        </button>

        {/* Upload Resume */}
        <button className="w-full sm:max-w-36 h-48 bg-white flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
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

              <p
                className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors duration-300 px-2 text-center"
              >
                Updated on {new Date(resume.updatedAt).toLocaleDateString()}
              </p>

              {/* Hover Icons */}
              <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1">
                <TrashIcon
                  className="size-6 p-1.5 rounded text-slate-700 hover:bg-white/50 transition-all duration-300"
                />
                <PencilIcon
                  className="size-6 p-1.5 rounded text-slate-700 hover:bg-white/50 transition-all duration-300"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
