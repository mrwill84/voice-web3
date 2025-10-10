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
      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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

interface ExecutionLogsProps {
  logs: string[]
  onComplete: () => void
  onNewTask?: () => void
  onVoiceCommand?: () => void
}

export function ExecutionLogs({ logs, onComplete, onNewTask, onVoiceCommand }: ExecutionLogsProps) {
  const [currentLogs, setCurrentLogs] = useState<
    Array<{
      id: number
      message: string
      type: "info" | "success" | "error" | "warning"
      timestamp: string
    }>
  >([])
  const [isComplete, setIsComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  const executionSteps = [
    { message: "连接MCP服务器...", type: "info" as const },
    { message: "验证用户权限...", type: "info" as const },
    { message: "解析指令参数...", type: "info" as const },
    { message: "调用Web3服务...", type: "info" as const },
    { message: "等待区块链确认...", type: "warning" as const },
    { message: "交易已确认", type: "success" as const },
    { message: "操作完成", type: "success" as const },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStep < executionSteps.length) {
        const step = executionSteps[currentStep]
        const newLog = {
          id: Date.now() + currentStep,
          message: step.message,
          type: step.type,
          timestamp: new Date().toLocaleTimeString("zh-CN", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        }

        setCurrentLogs((prev) => [...prev, newLog])
        setCurrentStep((prev) => prev + 1)
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [currentStep])

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="w-3 h-3 text-green-500" />
      case "error":
        return <AlertCircleIcon className="w-3 h-3 text-red-500" />
      case "warning":
        return <AlertCircleIcon className="w-3 h-3 text-yellow-500" />
      default:
        return <Loader2Icon className="w-3 h-3 text-blue-500 animate-spin" />
    }
  }

  return (
    <Card className="mx-4 mb-4 p-4 bg-card/90 backdrop-blur-sm border-primary/30 slide-up">
      <div className="space-y-4">
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-muted/20 -m-2 p-2 rounded-lg transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <TerminalIcon className="w-4 h-4 text-primary" />
          <h3 className="text-base font-semibold flex-1">执行日志</h3>
          <Badge variant={isComplete ? "default" : "secondary"} className="text-xs">
            {isComplete ? "完成" : "执行中"}
          </Badge>
          {isExpanded ? (
            <ChevronUpIcon className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        {!isExpanded && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>执行进度</span>
              <span>
                {Math.min(currentStep, executionSteps.length)}/{executionSteps.length}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out glow-effect"
                style={{
                  width: `${(Math.min(currentStep, executionSteps.length) / executionSteps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {isExpanded && (
          <>
            <div className="bg-black/60 rounded-lg p-3 font-mono text-xs max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {currentLogs.map((log, index) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-2 fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {getLogIcon(log.type)}
                    <span className="text-muted-foreground text-xs">[{log.timestamp}]</span>
                    <span
                      className={`flex-1 ${
                        log.type === "success"
                          ? "text-green-400"
                          : log.type === "error"
                            ? "text-red-400"
                            : log.type === "warning"
                              ? "text-yellow-400"
                              : "text-blue-400"
                      }`}
                    >
                      {log.message}
                    </span>
                  </div>
                ))}

                {!isComplete && (
                  <div className="flex items-center gap-2 text-primary animate-pulse">
                    <Loader2Icon className="w-3 h-3 animate-spin" />
                    <span className="text-xs text-muted-foreground">
                      [
                      {new Date().toLocaleTimeString("zh-CN", {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                      ]
                    </span>
                    <span className="text-xs">等待下一步...</span>
                    <div className="loading-dots ml-1">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>执行进度</span>
                <span>
                  {Math.min(currentStep, executionSteps.length)}/{executionSteps.length}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out glow-effect"
                  style={{
                    width: `${(Math.min(currentStep, executionSteps.length) / executionSteps.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </>
        )}

        {isComplete && (
          <div className="space-y-3">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">操作已完成</span>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={onVoiceCommand}
                  size="sm"
                  className="text-xs bg-primary/20 hover:bg-primary/30 text-primary border-primary/30"
                  variant="outline"
                >
                  <MicIcon className="w-3 h-3 mr-1" />
                  语音指令
                </Button>
                <Button
                  onClick={() => {
                    setCurrentLogs([])
                    setCurrentStep(0)
                    setIsComplete(false)
                    setIsExpanded(false)
                    onNewTask?.()
                  }}
                  size="sm"
                  variant="outline"
                  className="text-xs bg-transparent"
                >
                  <RotateCcwIcon className="w-3 h-3 mr-1" />
                  新任务
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
