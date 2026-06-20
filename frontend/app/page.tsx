'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BookOpen, Target, TrendingUp, Award, Zap } from 'lucide-react'
import { getStoredAuth } from '@/lib/auth'
import Navbar from '@/components/Navbar'

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const { user } = getStoredAuth()
    setUser(user)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master Your Learning Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Organize, track, and stay accountable to your academic and career goals with structured roadmaps, task tracking, and blockchain-verified achievements.
          </p>
          {!user ? (
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-3 inline-block">
              Get Started Free
            </Link>
          ) : (
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-3 inline-block">
              Go to Dashboard
            </Link>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="card">
            <BookOpen className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Learning Roadmaps</h3>
            <p className="text-gray-600 text-sm">Structured, hierarchical learning paths for any skill</p>
          </div>

          <div className="card">
            <Target className="w-8 h-8 text-secondary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Task Tracking</h3>
            <p className="text-gray-600 text-sm">Daily and weekly goals with progress monitoring</p>
          </div>

          <div className="card">
            <TrendingUp className="w-8 h-8 text-accent mb-4" />
            <h3 className="font-semibold text-lg mb-2">Progress Analytics</h3>
            <p className="text-gray-600 text-sm">Streak tracking and GitHub-style contribution heatmap</p>
          </div>

          <div className="card">
            <Award className="w-8 h-8 text-success mb-4" />
            <h3 className="font-semibold text-lg mb-2">NFT Achievements</h3>
            <p className="text-gray-600 text-sm">Verifiable on-chain learning credentials</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-white text-center">
          <Zap className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of learners building accountability and earning verifiable achievements
          </p>
          {!user && (
            <Link href="/auth/signup" className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 inline-block">
              Start Learning Today
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-600">
            Built with ❤️ for learners and educators worldwide
          </p>
        </div>
      </footer>
    </div>
  )
