"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
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

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
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

interface CommandConfirmationProps {
  command: string
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function CommandConfirmation({ command, isOpen, onConfirm, onCancel }: CommandConfirmationProps) {
  const [isListeningForConfirmation, setIsListeningForConfirmation] = useState(false)

  // 模拟指令解析
  const parseCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase()

    if (lowerCmd.includes("转账") || lowerCmd.includes("发送")) {
      return {
        type: "transfer",
        action: "转账操作",
        details: "向指定地址发送代币",
        risk: "high",
      }
    } else if (lowerCmd.includes("查询") || lowerCmd.includes("余额")) {
      return {
        type: "query",
        action: "查询操作",
        details: "获取账户余额信息",
        risk: "low",
      }
    } else if (lowerCmd.includes("交换") || lowerCmd.includes("兑换")) {
      return {
        type: "swap",
        action: "代币交换",
        details: "在DEX上交换代币",
        risk: "medium",
      }
    } else {
      return {
        type: "general",
        action: "通用操作",
        details: "执行用户指定的操作",
        risk: "low",
      }
    }
  }

  const commandInfo = parseCommand(command)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "default"
    }
  }

  const handleVoiceConfirmation = () => {
    setIsListeningForConfirmation(true)
    // 这里可以添加语音确认逻辑
    setTimeout(() => {
      setIsListeningForConfirmation(false)
      onConfirm()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md mx-4 bg-card/95 backdrop-blur-sm border-primary/50">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-base">
            <AlertTriangleIcon className="w-5 h-5 text-primary" />
            指令确认
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">请确认以下操作信息</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">原始指令:</p>
            <p className="text-sm font-medium text-pretty">{command}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">操作类型</span>
              <Badge variant="outline" className="text-xs">
                {commandInfo.action}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">风险等级</span>
              <Badge variant={getRiskColor(commandInfo.risk) as any} className="text-xs">
                {commandInfo.risk === "high" ? "高风险" : commandInfo.risk === "medium" ? "中风险" : "低风险"}
              </Badge>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium">操作详情</span>
              <p className="text-xs text-muted-foreground">{commandInfo.details}</p>
            </div>
          </div>

          {commandInfo.risk === "high" && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-xs text-destructive font-medium">⚠️ 高风险操作：此操作可能涉及资产转移，请仔细确认</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 pt-2">
            <DialogClose asChild>
              <Button onClick={onConfirm} size="sm" className="text-xs">
                <CheckCircleIcon className="w-3 h-3 mr-1" />
                确认
              </Button>
            </DialogClose>

            <Button
              onClick={handleVoiceConfirmation}
              variant="outline"
              size="sm"
              className="text-xs bg-transparent"
              disabled={isListeningForConfirmation}
            >
              <MicIcon className="w-3 h-3 mr-1" />
              {isListeningForConfirmation ? "监听中" : "语音"}
            </Button>

            <DialogClose asChild>
              <Button onClick={onCancel} variant="destructive" size="sm" className="text-xs">
                <XCircleIcon className="w-3 h-3 mr-1" />
                取消
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
