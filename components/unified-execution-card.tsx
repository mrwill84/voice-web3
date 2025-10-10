"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const TerminalIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z"
    />
  </svg>
)

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const AlertCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const Loader2Icon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

const RotateCcwIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 4v6h6m16 10v-6h-6M7.05 9.05l-3.54 3.54m0 0l3.54 3.54M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const MicIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    />
  </svg>
)

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
)

interface UnifiedExecutionCardProps {
  command: string
  executionStatus: "idle" | "executing" | "completed" | "error"
  logs: string[]
  onComplete: () => void
  onNewTask?: () => void
  onVoiceCommand?: () => void
}

export function UnifiedExecutionCard({
  command,
  executionStatus,
  logs,
  onComplete,
  onNewTask,
  onVoiceCommand,
}: UnifiedExecutionCardProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (executionStatus === "executing") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            onComplete()
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      return () => clearInterval(interval)
    } else if (executionStatus === "completed") {
      setProgress(100)
    } else {
      setProgress(0)
    }
  }, [executionStatus, onComplete])


  return (
    <Card className="p-4 bg-card/90 backdrop-blur-sm border-primary/30 slide-up">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">当前执行指令</span>
              <Badge
                variant={
                  executionStatus === "executing"
                    ? "default"
                    : executionStatus === "completed"
                      ? "secondary"
                      : "outline"
                }
                className="text-xs"
              >
                {executionStatus === "executing" ? (
                  "执行中"
                ) : executionStatus === "completed" ? (
                  <div className="flex items-center gap-1">
                    <CheckCircleIcon className="w-3 h-3 text-green-500" />
                    <span>已完成</span>
                  </div>
                ) : (
                  "待执行"
                )}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            {executionStatus === "executing" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2Icon className="w-3 h-3 animate-spin" />
                <span>正在处理指令...</span>
              </div>
            )}
          </div>
        </div>


        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>执行进度</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
    
      </div>
    </Card>
  )
}
