'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, BookOpen, ChevronLeft } from 'lucide-react'
import { api } from '@/lib/api'
import { getStoredAuth } from '@/lib/auth'
import Navbar from '@/components/Navbar'

interface Roadmap {
  id: string
  title: string
  description: string
  category: string
  sections: any[]
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function RoadmapsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const currentPage = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    const { user } = getStoredAuth()
    setUser(user)
  }, [])

  useEffect(() => {
    fetchRoadmaps(currentPage)
  }, [currentPage])

  const fetchRoadmaps = async (page: number) => {
    setLoading(true)
    const { data } = await api.getRoadmaps(page, 10)
    if (data) {
      const responseData = data as any
      setRoadmaps(responseData.roadmaps || [])
      setPagination(responseData.pagination || null)
    }
    setLoading(false)
  }

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    router.push(`/roadmaps?page=${newPage}`)
  }

  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-yellow-500 to-orange-500',
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading roadmaps...</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Learning Roadmaps</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">Choose a path and start your learning journey</p>
          {pagination && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-2">
              Showing {roadmaps.length} of {pagination.total} roadmaps
            </p>
          )}
        </div>
      </div>

      {/* Roadmaps Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {roadmaps.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">No roadmaps available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {roadmaps.map((roadmap, idx) => (
                <Link key={roadmap.id} href={`/roadmaps/${roadmap.id}`}>
                  <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className={`h-24 sm:h-32 bg-gradient-to-r ${colors[idx % colors.length]} rounded-lg mb-4 flex items-center justify-center`}>
                      <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-50" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{roadmap.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{roadmap.description}</p>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{roadmap.sections?.length || 0} sections</span>
                        <span className="font-semibold text-primary">0%</span>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: '0%' }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center text-primary font-semibold text-sm sm:text-base">
                      View Roadmap
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev || loading}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first, last, current, and adjacent pages
                      const showPage =
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - currentPage) <= 1

                      if (!showPage) {
                        // Show ellipsis
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span
                              key={page}
                              className="px-3 py-2 text-gray-400 dark:text-gray-600"
                            >
                              ...
                            </span>
                          )
                        }
                        return null
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            page === currentPage
                              ? 'bg-primary text-white'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          aria-label={`Go to page ${page}`}
                          aria-current={page === currentPage ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext || loading}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    aria-label="Next page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
