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
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import api from '../configs/api'
import pdfToText from 'react-pdftotext'

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth)

  const colors = ['#9333ea', '#d97706', '#dc2626', '#0284c7', '#16a34a']

  const [allResume, setAllResume] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState(null)
  const [deleteResumeId, setDeleteResumeId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  // Load all resumes
  const loadAllResume = async () => {
    try {
      const { data } = await api.get('/api/users/resume', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAllResume(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    loadAllResume()
  }, [])

  // Create Resume
  const createResume = async (event) => {
    event.preventDefault()
    try {
      if (!token) {
        toast.error('Please login first')
        return
      }

      const { data } = await api.post(
        '/api/resume/create',
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setAllResume([...allResume, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
      toast.success('Resume created successfully!')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  // Upload Resume
  const uploadResume = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (!resume) {
        toast.error('Please select a resume file.')
        return
      }

      const resumeText = await pdfToText(resume)

      const { data } = await api.post(
        '/api/ai/upload-resume',
        { title, resumeText },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      navigate(`/app/builder/${data.resumeID}`)
      toast.success('Resume uploaded successfully!')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Fixed Edit Resume Title
  const editTitle = async (event) => {
    event.preventDefault()
    try {
      const { data } = await api.put(
        `/api/resume/update-title/${editResumeId}`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setAllResume((prev) =>
        prev.map((r) => (r._id === editResumeId ? { ...r, title } : r))
      )

      setTitle('')
      setEditResumeId(null)
      toast.success(data.message || 'Title updated successfully!')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  // Delete Resume
  const confirmDeleteResume = async () => {
    try {
      const { data } = await api.delete(`/api/resume/delete/${deleteResumeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAllResume((prev) => prev.filter((r) => r._id !== deleteResumeId))
      setDeleteResumeId(null)
      toast.success(data.message || 'Resume deleted successfully!')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent sm:hidden">
        Welcome, {user?.name || 'John Doe'}
      </p>

      {/* Create & Upload Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowCreateResume(true)}
          className="w-full sm:max-w-[9rem] h-48 bg-white flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <PlusIcon className="w-11 h-11 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full transition-transform duration-300 group-hover:scale-105" />
          <p className="text-sm transition-colors duration-300 group-hover:text-indigo-600">
            Create Resume
          </p>
        </button>

        <button
          onClick={() => setShowUploadResume(true)}
          className="w-full sm:max-w-[9rem] h-48 bg-white flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <UploadCloud className="w-11 h-11 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full transition-transform duration-300 group-hover:scale-105" />
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
              key={resume._id}
              className="relative w-full sm:max-w-[9rem] h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                borderColor: `${baseColor}40`
              }}
              onClick={() => navigate(`/app/builder/${resume._id}`)}
            >
              <FilePenLineIcon
                className="w-7 h-7 transition-transform duration-300 group-hover:scale-105"
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
                <TrashIcon
                  className="w-6 h-6 p-1.5 rounded text-slate-700 hover:bg-white/50 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteResumeId(resume._id)
                    toast('Click "Delete" below to confirm.', {
                      icon: '🗑️'
                    })
                  }}
                />
                <PencilIcon
                  className="w-6 h-6 p-1.5 rounded text-slate-700 hover:bg-white/50 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditResumeId(resume._id)
                    setTitle(resume.title)
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteResumeId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur z-20 flex items-center justify-center">
          <div className="bg-slate-50 p-6 rounded-lg shadow-md w-full max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to delete this resume?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                onClick={() => setDeleteResumeId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={confirmDeleteResume}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
            <label className="block text-sm text-slate-700" htmlFor="resume-input">
              Select Resume File
            </label>
            <div
              className="flex flex-col items-center justify-center gap-2 border text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-600 hover:text-green-800 cursor-pointer transition-colors"
              onClick={() => document.getElementById('resume-input').click()}
            >
              {resume ? (
                <p className="text-green-800">{resume.name}</p>
              ) : (
                <>
                  <UploadIcon className="w-14 h-14 stroke-1" />
                  <p>Upload Resume</p>
                </>
              )}
            </div>
            <input
              id="resume-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    toast.error('File size should be less than 5 MB.')
                    e.target.value = ''
                    return
                  }
                  setResume(file)
                  toast.success('File selected successfully!')
                }
              }}
            />
            <p className="text-xs text-slate-500 mt-1 italic">
              * Only PDF files allowed (Max size: 5 MB)
            </p>

            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="Enter Resume Title"
              className="w-full px-4 py-2 mb-4 border rounded focus:border-green-600 outline-none"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Uploading...' : 'Upload Resume'}
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

      {/* Edit Resume Modal */}
      {editResumeId && (
        <form
          onSubmit={editTitle}
          className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="Enter Resume Title"
              className="w-full px-4 py-2 mb-4 border rounded focus:border-green-600 outline-none"
              required
            />
            <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
              Update
            </button>
            <XIcon
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              onClick={() => setEditResumeId(null)}
            />
          </div>
        </form>
      )}
    </div>
  )
}

export default Dashboard
