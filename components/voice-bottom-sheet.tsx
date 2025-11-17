"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const MicOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6m0 0L3 3m6 6v4a7 7 0 01-7-7"
    />
  </svg>
)

const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

import { cn } from "@/lib/utils"

interface VoiceBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onCommandDetected: (command: string) => void
  isConfirmationMode?: boolean
  confirmationText?: string
}

export function VoiceBottomSheet({ 
  isOpen, 
  onClose, 
  onCommandDetected, 
  isConfirmationMode = false, 
  confirmationText 
}: VoiceBottomSheetProps) {
  const [isListening, setIsListening] = useState(false)
  const [textInput, setTextInput] = useState("")
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false)
      setTextInput("")
      setTranscript("")
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    } else if (isOpen && isConfirmationMode && !isListening) {
      // 如果是确认模式且界面打开，自动开始语音监听
      if (!("webkitSpeechRecognition" in window)) {
        return
      }
      
      setIsListening(true)
      setTranscript("")

      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = "zh-CN"
      recognitionRef.current = recognition

      recognition.onresult = (event: any) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        setTranscript(transcript)

        if (event.results[current].isFinal) {
          onCommandDetected(transcript)
          setIsListening(false)
          recognitionRef.current = null
          onClose()
        }
      }

      recognition.onerror = () => {
        setIsListening(false)
        recognitionRef.current = null
      }

      recognition.onend = () => {
        setIsListening(false)
        recognitionRef.current = null
      }

      recognition.start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isConfirmationMode])

  const handleVoiceToggle = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("您的浏览器不支持语音识别")
      return
    }

    if (isListening) {
      setIsListening(false)
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    } else {
      setIsListening(true)
      setTranscript("")

      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = "zh-CN"
      recognitionRef.current = recognition

      recognition.onresult = (event: any) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        setTranscript(transcript)

        if (event.results[current].isFinal) {
          onCommandDetected(transcript)
          setIsListening(false)
          recognitionRef.current = null
          onClose()
        }
      }

      recognition.onerror = () => {
        setIsListening(false)
        recognitionRef.current = null
      }

      recognition.onend = () => {
        setIsListening(false)
        recognitionRef.current = null
      }

      recognition.start()
    }
  }

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onCommandDetected(textInput.trim())
      setTextInput("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <Card className="rounded-t-3xl rounded-b-none border-t border-primary/30 bg-card/95 backdrop-blur-lg">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-balance">
                {isConfirmationMode ? "语音确认" : "语音交互"}
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <XIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Confirmation Mode Content */}
            {isConfirmationMode && confirmationText && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">确认操作：</p>
                <p className="text-sm text-muted-foreground">{confirmationText}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  请说"确认"、"是的"或"取消"、"不"
                </p>
              </div>
            )}

            {/* Voice Section */}
            <div className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  {isConfirmationMode 
                    ? "点击麦克风进行语音确认" 
                    : "点击麦克风开始语音交互"
                  }
                </p>

                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={handleVoiceToggle}
                    disabled={!("webkitSpeechRecognition" in window)}
                    className={cn(
                      "w-20 h-20 rounded-full transition-all duration-300 shadow-2xl border-0",
                      isListening
                        ? "bg-destructive hover:bg-destructive/90 pulse-glow"
                        : "voice-button-gradient hover:voice-button-gradient",
                    )}
                  >
                    {isListening ? <MicOffIcon className="w-10 h-10" /> : <MicIcon className="w-10 h-10" />}
                  </Button>
                </div>

                {isListening && (
                  <div className="space-y-2 fade-in">
                    <p className="text-sm text-primary animate-pulse">正在聆听...</p>
                    <div className="flex justify-center">
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                {transcript && (
                  <div className="p-3 bg-muted/50 rounded-lg fade-in">
                    <p className="text-sm text-foreground">{transcript}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Text Input Section */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="输入指令..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTextSubmit()}
                  className="flex-1 bg-muted/50 border-primary/20 focus:border-primary/50"
                />
                <Button
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim()}
                  className="px-4 bg-primary hover:bg-primary/90"
                >
                  <SendIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
