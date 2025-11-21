"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"
import { getSessionId, generateSessionId, clearSessionId } from "@/lib/session"
import { useToast } from "@/hooks/use-toast"
import { useTTS } from "@/hooks/use-tts"

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

const VolumeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M6.343 6.343a1 1 0 011.414 0L9 7.586l1.243-1.243a1 1 0 011.414 1.414L10.414 9l1.243 1.243a1 1 0 01-1.414 1.414L9 10.414l-1.243 1.243a1 1 0 01-1.414-1.414L7.586 9 6.343 7.757a1 1 0 010-1.414z"
    />
  </svg>
)

const VolumeXIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
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
import { UnifiedExecutionCard } from "@/components/unified-execution-card"
import { Web3Dashboard } from "@/components/web3-dashboard"
import { InteractionHistory } from "@/components/interaction-history"
import { StarryBackground } from "@/components/starry-background"
import { UserMenuDrawer } from "@/components/user-menu-drawer"

interface ChatMessage {
  id: string
  type: "user" | "assistant" | "tool_execution" | "confirmation" | "execution" | "waiting_confirmation"
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
  isListening?: boolean
}

export default function HomePage() {
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
  const [isConfirmationMode, setIsConfirmationMode] = useState(false)
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    messageId: string
    sessionId: string
    confirmationText: string
    waitingMessageId?: string
  } | null>(null)
  const pendingConfirmationRef = useRef<{
    messageId: string
    sessionId: string
    confirmationText: string
    waitingMessageId?: string
  } | null>(null)

  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const { speak, stop, isPlaying, isSupported } = useTTS()
  const sessionIdRef = useRef<string>(getSessionId())
  const [isProcessing, setIsProcessing] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const menuItems = [
    { id: "voice", label: "语音", icon: MicIcon },
    { id: "dashboard", label: "Web3", icon: GlobeIcon },
    { id: "history", label: "历史", icon: UsersIcon },
  ]

  const handleTabClick = (tabId: string) => {
    if (tabId === "voice") {
      // 清除对话历史，创建新会话
      setChatMessages([])
      clearSessionId()
      sessionIdRef.current = generateSessionId()
      
      // 重置相关状态
      setIsConfirmationMode(false)
      setPendingConfirmation(null)
      pendingConfirmationRef.current = null
      setIsProcessing(false)
      setExecutingCommand(null)
      setExecutionStatus("idle")
      setHasExecutionCompleted(false)
      setHasShownVoiceSheet(false)
      
      // 停止语音识别
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
      
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

          // TTS播报执行结果
          if (isSupported) {
            speak(textToSpeak).catch(error => {
              console.warn('TTS播报失败:', error)
            })
          }

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
          
          // TTS播报错误信息
          if (isSupported) {
            speak(`执行失败: ${message}`).catch(error => {
              console.warn('TTS播报失败:', error)
            })
          }
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
        
        // TTS播报错误信息
        if (isSupported) {
          speak(`执行错误: ${error.message || "执行操作时出错"}`).catch(ttsError => {
            console.warn('TTS播报失败:', ttsError)
          })
        }
      }
    },
    [user, isSupported, speak, handleExecutionComplete],
  )

  const handleConfirmationCommand = useCallback(
    async (command: string) => {
      // 使用 ref 获取最新的确认数据，避免闭包问题
      const currentConfirmation = pendingConfirmationRef.current || pendingConfirmation
      if (!currentConfirmation) {
        console.error("No pending confirmation found")
        return
      }

      // 解析语音命令
      const lowerCommand = command.toLowerCase().trim()
      let isConfirm = false

      // 检查确认词汇
      if (lowerCommand.includes('确认') || lowerCommand.includes('是的') || 
          lowerCommand.includes('好的') || lowerCommand.includes('同意') ||
          lowerCommand.includes('y') || lowerCommand.includes('yes') ||
          lowerCommand.includes('ok') || lowerCommand.includes('确定')) {
        isConfirm = true
      } else if (lowerCommand.includes('取消') || lowerCommand.includes('不') ||
                 lowerCommand.includes('拒绝') || lowerCommand.includes('n') ||
                 lowerCommand.includes('no') || lowerCommand.includes('stop')) {
        isConfirm = false
      } else {
        // 如果无法识别，显示提示
        toast({
          title: "请说确认或取消",
          description: "请说'确认'、'是的'或'取消'、'不'",
          variant: "destructive",
        })
        return
      }

      // 替换等待消息为"已确认"或"已取消"
      const confirmationText = isConfirm ? "已确认" : "已取消"
      if (currentConfirmation.waitingMessageId) {
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === currentConfirmation.waitingMessageId
              ? {
                  id: currentConfirmation.waitingMessageId,
                  type: "user" as const,
                  content: confirmationText,
                  timestamp: new Date(),
                }
              : m
          )
        )
      } else {
        // 如果没有等待消息，添加新的用户消息
        const userMessage: ChatMessage = {
          id: `user-voice-${Date.now()}`,
          type: "user",
          content: confirmationText,
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, userMessage])
      }

      // 标记确认消息为已确认
      setChatMessages((prev) => 
        prev.map(m => 
          m.id === currentConfirmation.messageId 
            ? { ...m, isConfirmed: true }
            : m
        )
      )

      // 创建执行消息
      const executionMessageId = `execution-${Date.now()}`
      const executionMessage: ChatMessage = {
        id: executionMessageId,
        type: "execution",
        content: currentConfirmation.confirmationText,
        timestamp: new Date(),
        executionStatus: "executing",
        logs: [],
      }
      setChatMessages((prev) => [...prev, executionMessage])

      // 执行确认或取消
      const userInput = isConfirm ? "是的" : "取消"
      await executeToolAndHandleResult(
        currentConfirmation.sessionId,
        userInput,
        executionMessageId
      )

      // 重置确认状态，停止语音识别
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
      setIsConfirmationMode(false)
      setPendingConfirmation(null)
      pendingConfirmationRef.current = null
    },
    [pendingConfirmation, toast, executeToolAndHandleResult],
  )

  const handleCommandWithBackend = useCallback(
    async (command: string) => {
      // 如果是确认模式，处理确认命令
      if (isConfirmationMode && pendingConfirmation) {
        await handleConfirmationCommand(command)
        return
      }
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
          const confirmationMessageId = `confirmation-${Date.now()}`

          const confirmationMessage: ChatMessage = {
            id: confirmationMessageId,
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
          
          // 添加等待用户确认的消息
          const waitingMessageId = `waiting-${Date.now()}`
          const waitingMessage: ChatMessage = {
            id: waitingMessageId,
            type: "waiting_confirmation",
            content: "等待用户确认...",
            timestamp: new Date(),
            isListening: false,
          }
          setChatMessages((prev) => [...prev, waitingMessage])
          
          // 设置确认模式，不打开语音界面，直接在消息历史中显示
          const confirmationData = {
            messageId: confirmationMessageId,
            sessionId: result.sessionId || "",
            confirmationText: result.confirmationText,
            waitingMessageId,
          }
          setIsConfirmationMode(true)
          setPendingConfirmation(confirmationData)
          pendingConfirmationRef.current = confirmationData
          
          // TTS播报确认文本，播报完成后再开始语音监听
          const startVoiceRecognition = () => {
            if ("webkitSpeechRecognition" in window) {
              // 更新等待消息为正在语音输入
              setChatMessages((prev) =>
                prev.map((m) =>
                  m.id === waitingMessageId
                    ? { ...m, content: "正在语音输入...", isListening: true }
                    : m
                )
              )
              
              const recognition = new (window as any).webkitSpeechRecognition()
              recognition.continuous = false
              recognition.interimResults = true
              recognition.lang = "zh-CN"
              recognitionRef.current = recognition

              let isProcessing = false
              
              recognition.onresult = (event: any) => {
                const current = event.resultIndex
                const transcript = event.results[current][0].transcript

                if (event.results[current].isFinal) {
                  // 标记正在处理，避免 onend 回调覆盖
                  isProcessing = true
                  
                  // 立即停止识别，避免 onend 回调干扰
                  if (recognitionRef.current) {
                    recognitionRef.current.stop()
                  }
                  
                  // 处理确认命令，使用 ref 获取最新的确认数据
                  const currentConfirmation = pendingConfirmationRef.current
                  if (currentConfirmation) {
                    handleConfirmationCommand(transcript).then(() => {
                      recognitionRef.current = null
                    }).catch(() => {
                      recognitionRef.current = null
                    })
                  } else {
                    console.error("No pending confirmation found")
                    recognitionRef.current = null
                  }
                }
              }

              recognition.onerror = () => {
                // 只有在没有处理确认时才重置为等待状态
                if (!isProcessing) {
                  setChatMessages((prev) =>
                    prev.map((m) =>
                      m.id === waitingMessageId
                        ? { ...m, content: "等待用户确认...", isListening: false }
                        : m
                    )
                  )
                }
                recognitionRef.current = null
              }

              recognition.onend = () => {
                // 只有在没有处理确认时才重置为等待状态
                if (!isProcessing) {
                  setChatMessages((prev) => {
                    // 检查消息是否已经被更新为"已确认"或"已取消"
                    const currentMessage = prev.find(m => m.id === waitingMessageId)
                    if (currentMessage && (currentMessage.content === "已确认" || currentMessage.content === "已取消")) {
                      // 消息已经被更新，不需要重置
                      return prev
                    }
                    // 消息还没有被更新，重置为等待状态
                    return prev.map((m) =>
                      m.id === waitingMessageId
                        ? { ...m, content: "等待用户确认...", isListening: false }
                        : m
                    )
                  })
                }
                recognitionRef.current = null
              }

              recognition.start()
            }
          }
          
          if (isSupported) {
            speak(confirmMsg)
              .then(() => {
                // TTS播报完成后，开始语音监听
                startVoiceRecognition()
              })
              .catch(error => {
                console.warn('TTS播报确认文本失败:', error)
                // 即使TTS失败，也开始语音监听
                startVoiceRecognition()
              })
          } else {
            // 如果不支持TTS，直接开始语音监听
            startVoiceRecognition()
          }
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
          
          // TTS播报回答
          if (isSupported) {
            speak(message).catch(error => {
              console.warn('TTS播报失败:', error)
            })
          }
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
        
        // TTS播报错误信息
        if (isSupported) {
          speak(`错误: ${error.message || "理解指令时出错"}`).catch(ttsError => {
            console.warn('TTS播报失败:', ttsError)
          })
        }
      } finally {
        setIsProcessing(false)
      }
    },
    [isAuthenticated, user, toast, isConfirmationMode, pendingConfirmation, handleConfirmationCommand, isSupported, speak, executeToolAndHandleResult],
  )

  const handleStartExecution = (command: string) => {
    handleCommandWithBackend(command)
  }

  const handleVoiceSheetClose = () => {
    setIsVoiceSheetOpen(false)
    setHasShownVoiceSheet(true)
    
    // 如果是确认模式，更新等待消息为"等待用户确认..."
    if (isConfirmationMode && pendingConfirmation?.waitingMessageId) {
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === pendingConfirmation.waitingMessageId
            ? { ...m, content: "等待用户确认...", isListening: false }
            : m
        )
      )
    }
  }

  // 监听语音界面打开，更新等待消息
  useEffect(() => {
    if (isVoiceSheetOpen && isConfirmationMode && pendingConfirmation?.waitingMessageId) {
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === pendingConfirmation.waitingMessageId
            ? { ...m, content: "正在语音输入...", isListening: true }
            : m
        )
      )
    }
  }, [isVoiceSheetOpen, isConfirmationMode, pendingConfirmation?.waitingMessageId])

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
              {!isSupported && (
                <Badge variant="outline" className="text-xs">
                  TTS不支持
                </Badge>
              )}
              {isSupported && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full"
                  onClick={() => {
                    if (isPlaying) {
                      stop()
                    } else {
                      // 播报最后一条助手消息，如果没有则播报测试文本
                      const lastAssistantMessage = chatMessages
                        .filter(msg => msg.type === "assistant")
                        .pop()
                      
                      const textToSpeak = lastAssistantMessage?.content || "TTS测试，你好世界"
                      console.log('[TTS] 准备播报:', textToSpeak)
                      
                      speak(textToSpeak).catch(error => {
                        console.error('TTS播报失败:', error)
                        toast({
                          title: "TTS播报失败",
                          description: error.message,
                          variant: "destructive",
                        })
                      })
                    }
                  }}
                  title={isPlaying ? "停止播报" : "重新播报"}
                >
                  {isPlaying ? (
                    <VolumeXIcon className="w-4 h-4" />
                  ) : (
                    <VolumeIcon className="w-4 h-4" />
                  )}
                </Button>
              )}
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
                            className={`flex ${message.type === "user" || message.type === "waiting_confirmation" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                message.type === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : message.type === "waiting_confirmation"
                                    ? message.isListening
                                      ? "bg-red-100 text-red-900 border border-red-300"
                                      : "bg-primary/50 text-primary-foreground border border-dashed border-primary/50"
                                    : message.type === "confirmation"
                                      ? "bg-muted/80 text-foreground relative"
                                      : "bg-muted/80 text-foreground"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  {message.type === "waiting_confirmation" && message.isListening ? (
                                    <div className="flex items-center gap-2">
                                      <Loader2Icon className="w-4 h-4 animate-spin" />
                                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                    </div>
                                  ) : (
                                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                  )}
                                  <p className="text-xs mt-1 opacity-70">
                                    {message.timestamp.toLocaleTimeString("zh-CN", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                                {message.type === "assistant" && isSupported && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                                    onClick={() => {
                                      speak(message.content).catch(error => {
                                        console.warn('TTS播报失败:', error)
                                      })
                                    }}
                                    title="播报此消息"
                                  >
                                    <VolumeIcon className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                              {message.type === "waiting_confirmation" && pendingConfirmation && pendingConfirmation.waitingMessageId === message.id && (
                            <div className="flex gap-2 mt-3 pt-3">
                              <Button
                                size="sm"
                                onClick={async () => {
                                  // 找到对应的确认消息并标记为已确认
                                  setChatMessages((prev) => {
                                    const confirmationMessage = prev.find(m => m.id === pendingConfirmation.messageId)
                                    if (confirmationMessage) {
                                      return prev.map(m => 
                                        m.id === confirmationMessage.id 
                                          ? { ...m, isConfirmed: true }
                                          : m
                                      )
                                    }
                                    return prev
                                  })
                                  
                                  // 替换等待消息为"已确认"
                                  setChatMessages((prev) =>
                                    prev.map((m) =>
                                      m.id === message.id
                                        ? {
                                            id: message.id,
                                            type: "user" as const,
                                            content: "已确认",
                                            timestamp: new Date(),
                                          }
                                        : m
                                    )
                                  )
                                  
                                  // 重置确认状态，停止语音识别
                                  if (recognitionRef.current) {
                                    recognitionRef.current.stop()
                                    recognitionRef.current = null
                                  }
                                  setIsConfirmationMode(false)
                                  const currentConfirmation = pendingConfirmation
                                  setPendingConfirmation(null)
                                  pendingConfirmationRef.current = null
                                  
                                  setExecutingCommand(currentConfirmation.confirmationText)
                                  setExecutionStatus("executing")
                                  setIsExecuting(true)
                                  setHasExecutionCompleted(false)
                                  
                                  // 创建执行消息
                                  const executionMessageId = `execution-${Date.now()}`
                                  const executionMessage: ChatMessage = {
                                    id: executionMessageId,
                                    type: "execution",
                                    content: currentConfirmation.confirmationText,
                                    timestamp: new Date(),
                                    executionStatus: "executing",
                                    logs: [],
                                  }
                                  setChatMessages((prev) => [...prev, executionMessage])
                                  
                                  // 直接执行确认操作
                                  await executeToolAndHandleResult(
                                    currentConfirmation.sessionId || "",
                                    "是的",
                                    executionMessageId
                                  )
                                }}
                                className="flex-1 text-xs h-7 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                              >
                                确认
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // 找到对应的确认消息并标记为已确认
                                  setChatMessages((prev) => {
                                    const confirmationMessage = prev.find(m => m.id === pendingConfirmation.messageId)
                                    if (confirmationMessage) {
                                      return prev.map(m => 
                                        m.id === confirmationMessage.id 
                                          ? { ...m, isConfirmed: true }
                                          : m
                                      )
                                    }
                                    return prev
                                  })
                                  
                                  // 替换等待消息为"已取消"
                                  setChatMessages((prev) =>
                                    prev.map((m) =>
                                      m.id === message.id
                                        ? {
                                            id: message.id,
                                            type: "user" as const,
                                            content: "已取消",
                                            timestamp: new Date(),
                                          }
                                        : m
                                    )
                                  )
                                  
                                  // 重置确认状态，停止语音识别
                                  if (recognitionRef.current) {
                                    recognitionRef.current.stop()
                                    recognitionRef.current = null
                                  }
                                  setIsConfirmationMode(false)
                                  setPendingConfirmation(null)
                                  pendingConfirmationRef.current = null
                                  
                                  const assistantMessage: ChatMessage = {
                                    id: `assistant-cancel-${Date.now()}`,
                                    type: "assistant",
                                    content: "好的，已取消操作",
                                    timestamp: new Date(),
                                  }
                                  setChatMessages((prev) => [...prev, assistantMessage])
                                  
                                  // TTS播报取消消息
                                  if (isSupported) {
                                    speak("好的，已取消操作").catch(error => {
                                      console.warn('TTS播报失败:', error)
                                    })
                                  }
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
        onCommandDetected={isConfirmationMode ? handleConfirmationCommand : handleCommandWithBackend}
        isConfirmationMode={isConfirmationMode}
        confirmationText={pendingConfirmation?.confirmationText}
      />

      <UserMenuDrawer isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
    </div>
  )
}
