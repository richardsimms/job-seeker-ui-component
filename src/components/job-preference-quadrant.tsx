"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

const questions = [
  {
    question: "What's more important – a higher base salary or a lower base salary with performance bonuses?",
    xAxis: { left: "Higher Base", right: "Performance Bonuses" },
    yAxis: { top: "Very Important", bottom: "Less Important" },
  },
  {
    question: "Would you consider a lower base salary if you received company stock options?",
    xAxis: { left: "Base Salary", right: "Stock Options" },
    yAxis: { top: "Strongly Prefer", bottom: "Open to Both" },
  },
  {
    question: "How important are regular raises and promotions in your job choice?",
    xAxis: { left: "Essential", right: "Nice to Have" },
    yAxis: { top: "Career Growth", bottom: "Stability" },
  },
  {
    question: "Are you open to negotiating salary based on company perks and benefits?",
    xAxis: { left: "Fixed Salary", right: "Flexible Package" },
    yAxis: { top: "Very Open", bottom: "Less Flexible" },
  },
  {
    question: "Would you take a lower salary for a job with better long-term career growth?",
    xAxis: { left: "Higher Salary Now", right: "Future Growth" },
    yAxis: { top: "Strongly Agree", bottom: "Strongly Disagree" },
  },
  {
    question: "Would you prefer fully remote, hybrid, or in-office work?",
    xAxis: { left: "Remote", right: "In-Office" },
    yAxis: { top: "Strong Preference", bottom: "Flexible" },
  },
]

const presets = [
  { name: "Career Growth", position: { x: 65, y: 25 } },
  { name: "Work-Life Balance", position: { x: 35, y: 75 } },
  { name: "Compensation", position: { x: 25, y: 35 } },
  { name: "Flexibility", position: { x: 75, y: 65 } },
]

export function JobPreferenceQuadrant() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const quadrantRef = useRef<HTMLDivElement>(null)
  const currentQuestion = questions[currentQuestionIndex]

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    updatePosition(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updatePosition(e)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    updateTouchPosition(e)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      updateTouchPosition(e)
      e.preventDefault()
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const updatePosition = (e: React.MouseEvent) => {
    if (!quadrantRef.current) return

    const rect = quadrantRef.current.getBoundingClientRect()
    const x = Math.min(Math.max(0, ((e.clientX - rect.left) / rect.width) * 100), 100)
    const y = Math.min(Math.max(0, ((e.clientY - rect.top) / rect.height) * 100), 100)

    setPosition({ x, y })
  }

  const updateTouchPosition = (e: React.TouchEvent) => {
    if (!quadrantRef.current || !e.touches[0]) return

    const rect = quadrantRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = Math.min(Math.max(0, ((touch.clientX - rect.left) / rect.width) * 100), 100)
    const y = Math.min(Math.max(0, ((touch.clientY - rect.top) / rect.height) * 100), 100)

    setPosition({ x, y })
  }

  const handlePresetClick = (preset: { position: { x: number; y: number } }) => {
    setPosition(preset.position)
  }

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length)
  }

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => (prev - 1 + questions.length) % questions.length)
  }

  useEffect(() => {
    // Reset position when changing questions
    setPosition({ x: 50, y: 50 })
  }, [currentQuestionIndex])

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Job Preference</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              Question {currentQuestionIndex + 1}/{questions.length}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="mt-2 text-sm font-semibold">{currentQuestion.question}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div
            ref={quadrantRef}
            className="relative w-full aspect-square border rounded-md grid grid-cols-3 grid-rows-3 overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Quadrant labels */}
            <div className="absolute top-2 w-full text-center text-sm text-gray-500">
              {currentQuestion.yAxis.top}
              </div>
            <div className="absolute bottom-2 w-full text-center text-sm text-gray-500">
              {currentQuestion.yAxis.bottom}
            </div>
            <div className="absolute left-2 h-full flex items-center text-sm text-gray-500">
              <span className="transform -rotate-90 -translate-x-30 w-3xs text-center " >{currentQuestion.xAxis.left}</span>
            </div>
          
            <div className="absolute right-2 h-full flex items-center text-sm text-gray-500">
              <span className="transform rotate-90 w-3xs text-center translate-x-30">{currentQuestion.xAxis.right}</span>
            </div>

            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              <div className="border-r border-b border-gray-200"></div>
              <div className="border-r border-l border-b border-gray-200"></div>
              <div className="border-l border-b border-gray-200"></div>
              <div className="border-r border-t border-b border-gray-200"></div>
              <div className="border border-gray-200"></div>
              <div className="border-l border-t border-b border-gray-200"></div>
              <div className="border-r border-t border-gray-200"></div>
              <div className="border-r border-l border-t border-gray-200"></div>
              <div className="border-l border-t border-gray-200"></div>
            </div>

            {/* Indicator dot */}
            <div
              className="absolute w-6 h-6 bg-orange-500 rounded-full -ml-3 -mt-3 cursor-grab active:cursor-grabbing"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                boxShadow: "0 0 0 4px rgba(249, 115, 22, 0.3)",
              }}
            ></div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Or pick a preset</p>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handlePresetClick(preset)}
                  className="justify-center"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={handlePrevious} className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <Button variant="outline" size="sm" onClick={handleNext} className="flex items-center gap-1">
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

