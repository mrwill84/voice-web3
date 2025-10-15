"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"
import { getSessionId } from "@/lib/session"
import { useToast } from "@/hooks/use-toast"

const MicIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z"
    />
  </svg>
)

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const ActivityIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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

import { VoiceBottomSheet } from "@/components/voice-bottom-sheet"
import { CommandConfirmation } from "@/components/command-confirmation"
import { UnifiedExecutionCard } from "@/components/unified-execution-card"
import { Web3Dashboard } from "@/components/web3-dashboard"
import { InteractionHistory } from "@/components/interaction-history"
import { StarryBackground } from "@/components/starry-background"
import { UserMenuDrawer } from "@/components/user-menu-drawer"

interface ChatMessage {
  id: string
  type: "user" | "assistant" | "tool_execution" | "confirmation" | "execution"
  content: string
  timestamp: Date
  toolId?: string
  executionStatus?: "idle" | "executing" | "completed" | "error"
  pendingAction?: {
    toolId: string
    params: any
    confirmationText?: string
    sessionId?: string
  }
  isConfirmed?: boolean
  logs?: string[]
}

export default function HomePage() {
  const [currentCommand, setCurrentCommand] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionLogs, setExecutionLogs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"voice" | "dashboard" | "history">("voice")
  const [isVoiceSheetOpen, setIsVoiceSheetOpen] = useState(false)
  const [hasExecutionCompleted, setHasExecutionCompleted] = useState(false)
  const [executingCommand, setExecutingCommand] = useState<string | null>(null)
  const [executionStatus, setExecutionStatus] = useState<"idle" | "executing" | "completed" | "error">("idle")
  const [hasShownVoiceSheet, setHasShownVoiceSheet] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const sessionIdRef = useRef<string>(getSessionId())
  const [isProcessing, setIsProcessing] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const menuItems = [
    { id: "voice", label: "语音", icon: MicIcon },
    { id: "dashboard", label: "Web3", icon: GlobeIcon },
    { id: "history", label: "历史", icon: UsersIcon },
  ]

  const handleTabClick = (tabId: string) => {
    if (tabId === "voice") {
      setActiveTab("voice")
      setIsVoiceSheetOpen(true)
    } else {
      setActiveTab(tabId as any)
      setHasShownVoiceSheet(false)
    }
  }

  useEffect(() => {
    if (activeTab === "voice" && !isVoiceSheetOpen && !executingCommand && !hasShownVoiceSheet) {
      const timer = setTimeout(() => {
        setIsVoiceSheetOpen(true)
        setHasShownVoiceSheet(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [activeTab, isVoiceSheetOpen, executingCommand, hasShownVoiceSheet])

  const handleExecutionComplete = () => {
    setIsExecuting(false)
    setHasExecutionCompleted(true)
    setExecutionStatus("completed")
  }

  const handleNewTask = () => {
    setHasExecutionCompleted(false)
    setExecutionLogs([])
    setExecutingCommand(null)
    setExecutionStatus("idle")
  }

  const handleVoiceCommand = () => {
    setIsVoiceSheetOpen(true)
  }

  const handleCommandWithBackend = useCallback(
    async (command: string) => {
      if (!isAuthenticated) {
        toast({
          title: "需要登录",
          description: "请先登录以使用语音功能",
          variant: "destructive",
        })
        setIsUserMenuOpen(true)
        return
      }

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        type: "user",
        content: command,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, userMessage])

      setIsProcessing(true)

      try {
        console.log("[] Sending interpret request with sessionId:", sessionIdRef.current)

        const result = await apiClient.interpret(command, sessionIdRef.current, user?.id)

        console.log("[] Interpret response:", result)

        if (result.sessionId) {
          sessionIdRef.current = result.sessionId
        }

        if (result.confirmationText) {
          console.log("[] Needs user confirmation")
          
          let toolId = result.toolId || result.action || ""
          let params = result.params || {}
          
          if (result.toolCalls && result.toolCalls.length > 0) {
            toolId = result.toolCalls[0].tool_id
            params = result.toolCalls[0].parameters
          }
          
          const confirmMsg = result.confirmationText

          const confirmationMessage: ChatMessage = {
            id: `confirmation-${Date.now()}`,
            type: "confirmation",
            content: confirmMsg,
            timestamp: new Date(),
            pendingAction: {
              toolId,
              params,
              confirmationText: result.confirmationText,
              sessionId: result.sessionId,
            },
          }
          setChatMessages((prev) => [...prev, confirmationMessage])
        } else if (result.toolId || result.action) {
          setExecutingCommand(command)
          setExecutionStatus("executing")
          setIsExecuting(true)
          setHasExecutionCompleted(false)

          // 创建执行消息
          const executionMessageId = `execution-${Date.now()}`
          const executionMessage: ChatMessage = {
            id: executionMessageId,
            type: "execution",
            content: command,
            timestamp: new Date(),
            executionStatus: "executing",
            logs: [],
          }
          setChatMessages((prev) => [...prev, executionMessage])

          // 根据业务场景测试用例文档，这里应该显示确认信息
          // 然后用户确认后调用 confirm API
          const userConfirm = confirm(result.confirmationText || "是否执行此操作？")
          if (userConfirm) {
            await executeToolAndHandleResult(result.sessionId || "", "是的", executionMessageId)
          } else {
            await executeToolAndHandleResult(result.sessionId || "", "取消", executionMessageId)
          }
        } else {
          const message = result.content || result.tts_message || result.message || "已收到您的消息"
          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            type: "assistant",
            content: message,
            timestamp: new Date(),
          }
          setChatMessages((prev) => [...prev, assistantMessage])
        }
      } catch (error: any) {
        console.error("[] Interpret API call failed:", error)
        toast({
          title: "错误",
          description: error.message || "理解指令时出错",
          variant: "destructive",
        })
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          type: "assistant",
          content: `错误: ${error.message || "理解指令时出错"}`,
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsProcessing(false)
      }
    },
    [isAuthenticated, user, toast],
  )

  const executeToolAndHandleResult = useCallback(
    async (sessionId: string, userInput: string, executionMessageId: string) => {
      try {
        console.log("[] Confirming execution for session:", sessionId, "with input:", userInput)

        const confirmResult = await apiClient.confirm(sessionId, userInput, user?.id)

        console.log("[] Confirm API Result:", confirmResult)

        if (confirmResult.sessionId && confirmResult.sessionId !== sessionIdRef.current) {
          sessionIdRef.current = confirmResult.sessionId
        }

        if (confirmResult.success && (confirmResult.data || confirmResult.content)) {
          // 更新执行消息状态为完成
          setChatMessages((prev) =>
            prev.map((m) =>
              m.id === executionMessageId
                ? { ...m, executionStatus: "completed" as const }
                : m
            )
          )

          let textToSpeak
          // 优先使用 content 字段（API 直接返回的内容）
          if (confirmResult.content) {
            textToSpeak = confirmResult.content
          } else if (confirmResult.data) {
            if (confirmResult.data.tts_message) {
              textToSpeak = confirmResult.data.tts_message
            } else if (confirmResult.data.summary) {
              textToSpeak = confirmResult.data.summary
            } else if (typeof confirmResult.data === "string") {
              textToSpeak = confirmResult.data
            } else if (confirmResult.data.result || confirmResult.data.message) {
              textToSpeak = confirmResult.data.result || confirmResult.data.message
            } else {
              textToSpeak = "操作成功"
            }
          } else {
            textToSpeak = "操作成功"
          }

          const assistantMessage: ChatMessage = {
            id: `tool-result-${Date.now()}`,
            type: "assistant",
            content: textToSpeak,
            timestamp: new Date(),
          }
          setChatMessages((prev) => [...prev, assistantMessage])

          setExecutionStatus("completed")
          setIsExecuting(false)
          handleExecutionComplete()
        } else {
          const message = confirmResult.error?.message || "确认失败"
          
          // 更新执行消息状态为错误
          setChatMessages((prev) =>
            prev.map((m) =>
              m.id === executionMessageId
                ? { ...m, executionStatus: "error" as const }
                : m
            )
          )
          
          setExecutionStatus("error")
          setIsExecuting(false)

          const errorMessage: ChatMessage = {
            id: `error-${Date.now()}`,
            type: "assistant",
            content: `执行失败: ${message}`,
            timestamp: new Date(),
          }
          setChatMessages((prev) => [...prev, errorMessage])
        }
      } catch (error: any) {
        console.error("[] Execute API call failed:", error)
        
        // 更新执行消息状态为错误
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === executionMessageId
              ? { ...m, executionStatus: "error" as const }
              : m
          )
        )
        
        setExecutionStatus("error")
        setIsExecuting(false)

        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          type: "assistant",
          content: `执行错误: ${error.message || "执行操作时出错"}`,
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, errorMessage])
      }
    },
    [user],
  )

  const handleStartExecution = (command: string) => {
    handleCommandWithBackend(command)
  }

  const handleVoiceSheetClose = () => {
    setIsVoiceSheetOpen(false)
    setHasShownVoiceSheet(true)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, executingCommand])

  return (
    <div className="h-screen bg-background grid-pattern flex flex-col overflow-hidden relative">
      <StarryBackground />

      <header className="border-b border-border/50 backdrop-blur-sm bg-background/95 shrink-0 relative z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <ZapIcon className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold text-balance">EchoWeb3</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="pulse-glow text-xs">
                <ActivityIcon className="w-3 h-3 mr-1" />
                在线
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full"
                onClick={() => setIsUserMenuOpen(true)}
              >
                <UserIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative z-10">
        <div className="h-full">
          {activeTab === "voice" && (
            <div className="h-full flex flex-col">
              <div className="px-4 pt-4 pb-2 space-y-1 shrink-0">
                <h2 className="text-xl font-bold text-balance">对话中心</h2>
                <p className="text-sm text-muted-foreground">与 AI 持续对话，执行 Web3 操作</p>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-20">
                {chatMessages.length === 0 && !executingCommand ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-4 text-muted-foreground">
                      <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                        <MicIcon className="w-8 h-8" />
                      </div>
                      <p className="text-sm">开始对话</p>
                      <p className="text-xs">点击麦克风开始语音交互</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    {chatMessages.map((message) => (
                      <div key={message.id}>
                        {message.type === "execution" ? (
                          <UnifiedExecutionCard
                            command={message.content}
                            executionStatus={message.executionStatus || "idle"}
                            logs={message.logs || []}
                            onComplete={() => {}}
                            onNewTask={() => {}}
                            onVoiceCommand={() => {}}
                          />
                        ) : (
                          <div
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                message.type === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : message.type === "confirmation"
                                    ? "bg-muted/80 text-foreground relative"
                                    : "bg-muted/80 text-foreground"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {message.timestamp.toLocaleTimeString("zh-CN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              {message.type === "confirmation" && message.pendingAction && !message.isConfirmed && (
                            <div className="flex gap-2 mt-3 pt-3">
                              <Button
                                size="sm"
                                onClick={async () => {
                                  // 标记确认消息为已确认，隐藏按钮
                                  setChatMessages((prev) => 
                                    prev.map(m => 
                                      m.id === message.id 
                                        ? { ...m, isConfirmed: true }
                                        : m
                                    )
                                  )
                                  
                                  const confirmMessage: ChatMessage = {
                                    id: `user-confirm-${Date.now()}`,
                                    type: "user",
                                    content: "确认",
                                    timestamp: new Date(),
                                  }
                                  setChatMessages((prev) => [...prev, confirmMessage])
                                  
                                  setExecutingCommand(message.content)
                                  setExecutionStatus("executing")
                                  setIsExecuting(true)
                                  setHasExecutionCompleted(false)
                                  
                                  // 创建执行消息
                                  const executionMessageId = `execution-${Date.now()}`
                                  const executionMessage: ChatMessage = {
                                    id: executionMessageId,
                                    type: "execution",
                                    content: message.content,
                                    timestamp: new Date(),
                                    executionStatus: "executing",
                                    logs: [],
                                  }
                                  setChatMessages((prev) => [...prev, executionMessage])
                                  
                                  // 根据业务场景测试用例文档，这里应该显示确认信息
                                  // 然后用户确认后调用 confirm API
                                  const userConfirm = confirm(message.pendingAction!.confirmationText || "是否执行此操作？")
                                  if (userConfirm) {
                                    await executeToolAndHandleResult(
                                      message.pendingAction!.sessionId || "",
                                      "是的",
                                      executionMessageId
                                    )
                                  } else {
                                    await executeToolAndHandleResult(
                                      message.pendingAction!.sessionId || "",
                                      "取消",
                                      executionMessageId
                                    )
                                  }
                                }}
                                className="flex-1 text-xs h-7 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                              >
                                确认
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // 标记确认消息为已确认，隐藏按钮
                                  setChatMessages((prev) => 
                                    prev.map(m => 
                                      m.id === message.id 
                                        ? { ...m, isConfirmed: true }
                                        : m
                                    )
                                  )
                                  
                                  const cancelMessage: ChatMessage = {
                                    id: `user-cancel-${Date.now()}`,
                                    type: "user",
                                    content: "取消",
                                    timestamp: new Date(),
                                  }
                                  setChatMessages((prev) => [...prev, cancelMessage])
                                  
                                  const assistantMessage: ChatMessage = {
                                    id: `assistant-cancel-${Date.now()}`,
                                    type: "assistant",
                                    content: "好的，已取消操作",
                                    timestamp: new Date(),
                                  }
                                  setChatMessages((prev) => [...prev, assistantMessage])
                                }}
                                className="flex-1 text-xs h-7 bg-red-600 hover:bg-red-700 text-white border-red-600"
                              >
                                取消
                              </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        )}
                      </div>
                    ))}

                    {isProcessing && !executingCommand && (
                      <div className="flex justify-start">
                        <div className="bg-muted/80 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Loader2Icon className="w-4 h-4 animate-spin" />
                            <p className="text-sm text-muted-foreground">正在思考...</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "dashboard" && <Web3Dashboard />}
          {activeTab === "history" && <InteractionHistory />}
        </div>
      </main>

      <nav className="border-t border-border/50 backdrop-blur-sm bg-background/95 shrink-0 relative z-10">
        <div className="px-2 py-2">
          <div className="flex justify-around">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  activeTab === id
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${activeTab === id ? "glow-effect" : ""}`} />
                <span className="text-xs font-medium">{label}</span>
                {activeTab === id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full glow-effect" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <VoiceBottomSheet
        isOpen={isVoiceSheetOpen}
        onClose={handleVoiceSheetClose}
        onCommandDetected={setCurrentCommand}
      />

      <CommandConfirmation
        command={currentCommand || ""}
        isOpen={!!currentCommand}
        onConfirm={() => {
          if (currentCommand) {
            handleStartExecution(currentCommand)
          }
        }}
        onCancel={() => {
          setCurrentCommand(null)
        }}
      />

      <UserMenuDrawer isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
    </div>
  )
}
