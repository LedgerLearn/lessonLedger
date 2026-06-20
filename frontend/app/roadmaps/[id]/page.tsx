'use client'

import { useState } from 'react'
import { ChevronDown, CheckCircle2, Circle } from 'lucide-react'

interface Topic {
  id: string
  title: string
  completed: boolean
  subtopics: string[]
}

interface Section {
  title: string
  topics: Topic[]
}

const roadmapData: Section[] = [
  {
    title: 'Foundations',
    topics: [
      {
        id: '1',
        title: 'HTML Basics',
        completed: true,
        subtopics: ['Semantic HTML', 'Forms', 'Accessibility'],
      },
      {
        id: '2',
        title: 'CSS Fundamentals',
        completed: true,
        subtopics: ['Selectors', 'Box Model', 'Flexbox', 'Grid'],
      },
      {
        id: '3',
        title: 'Responsive Design',
        completed: false,
        subtopics: ['Media Queries', 'Mobile First', 'Breakpoints'],
      },
    ],
  },
  {
    title: 'JavaScript',
    topics: [
      {
        id: '4',
        title: 'Variables & Data Types',
        completed: true,
        subtopics: ['let/const', 'Primitives', 'Objects'],
      },
      {
        id: '5',
        title: 'Functions',
        completed: false,
        subtopics: ['Arrow Functions', 'Closures', 'Callbacks'],
      },
      {
        id: '6',
        title: 'DOM Manipulation',
        completed: false,
        subtopics: ['Selectors', 'Events', 'DOM Methods'],
      },
    ],
  },
  {
    title: 'Frameworks',
    topics: [
      {
        id: '7',
        title: 'React Basics',
        completed: false,
        subtopics: ['Components', 'JSX', 'Props', 'State'],
      },
      {
        id: '8',
        title: 'React Hooks',
        completed: false,
        subtopics: ['useState', 'useEffect', 'Custom Hooks'],
      },
    ],
  },
]

export default function RoadmapDetailPage({ params }: { params: { id: string } }) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['Foundations'])
  const [expandedTopics, setExpandedTopics] = useState<string[]>([])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((t) => t !== topicId) : [...prev, topicId]
    )
  }

  const totalTopics = roadmapData.reduce((acc, section) => acc + section.topics.length, 0)
  const completedTopics = roadmapData.reduce(
    (acc, section) => acc + section.topics.filter((t) => t.completed).length,
    0
  )
  const progress = Math.round((completedTopics / totalTopics) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Frontend Development</h1>
          <p className="text-gray-600 mt-2">Master HTML, CSS, JavaScript, and React</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold text-primary">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{completedTopics} of {totalTopics}</p>
              <p className="font-semibold text-primary">Topics Done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {roadmapData.map((section) => (
            <div key={section.title} className="card">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between hover:bg-gray-50 p-4 -m-4 rounded-lg"
              >
                <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    expandedSections.includes(section.title) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedSections.includes(section.title) && (
                <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                  {section.topics.map((topic) => (
                    <div key={topic.id}>
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {topic.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={`flex-1 text-left font-medium ${topic.completed ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                          {topic.title}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-600 transition-transform ${
                            expandedTopics.includes(topic.id) ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {expandedTopics.includes(topic.id) && (
                        <div className="ml-8 mt-2 space-y-2 pb-2">
                          {topic.subtopics.map((subtopic, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                              {subtopic}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
