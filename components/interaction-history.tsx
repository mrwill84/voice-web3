"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
    />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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

const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
)

export function InteractionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "voice" | "text">("all")

  const interactions = [
    {
      id: 1,
      type: "voice",
      command: "查询我的ETH余额",
      timestamp: "2024-01-15 14:30:25",
      status: "success",
      result: "余额: 1.234 ETH",
      duration: "2.3s",
    },
    {
      id: 2,
      type: "text",
      command: "向0x1234...发送0.5ETH",
      timestamp: "2024-01-15 14:25:10",
      status: "success",
      result: "交易已确认: 0x5678...",
      duration: "45.2s",
    },
    {
      id: 3,
      type: "voice",
      command: "在Uniswap上交换1ETH为USDC",
      timestamp: "2024-01-15 14:20:45",
      status: "failed",
      result: "错误: 滑点过高",
      duration: "12.1s",
    },
    {
      id: 4,
      type: "voice",
      command: "查看我的NFT收藏",
      timestamp: "2024-01-15 14:15:30",
      status: "success",
      result: "找到23个NFT",
      duration: "3.7s",
    },
    {
      id: 5,
      type: "text",
      command: "连接MetaMask钱包",
      timestamp: "2024-01-15 14:10:15",
      status: "success",
      result: "钱包已连接",
      duration: "1.2s",
    },
  ]

  const filteredInteractions = interactions.filter((interaction) => {
    const matchesSearch = interaction.command.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || interaction.type === filterType
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircleIcon className="w-4 h-4 text-red-500" />
      case "pending":
        return <ClockIcon className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertTriangleIcon className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="text-xs">
            成功
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="text-xs">
            失败
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="text-xs">
            进行中
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            未知
          </Badge>
        )
    }
  }

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-balance">交互历史</h2>
        <p className="text-sm text-muted-foreground">查看交互记录</p>
      </div>

      <Card className="p-4 card-gradient-blue glow-blue">
        <div className="space-y-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索记录..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm bg-background/50 border-border/50"
            />
          </div>

          <div className="flex gap-2">
            {[
              { key: "all", label: "全部", icon: FilterIcon },
              { key: "voice", label: "语音", icon: MicIcon },
              { key: "text", label: "文字", icon: MessageSquareIcon },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={filterType === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(key as any)}
                className="text-xs"
              >
                <Icon className="w-3 h-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "总次数", value: "156", color: "text-blue-400", gradient: "card-gradient-blue" },
          { label: "成功率", value: "94.2%", color: "text-cyan-400", gradient: "card-gradient-cyan" },
          { label: "语音", value: "89", color: "text-purple-400", gradient: "card-gradient-purple" },
          { label: "响应", value: "3.2s", color: "text-blue-300", gradient: "card-gradient-blue" },
        ].map((stat, index) => (
          <Card key={index} className={`p-3 ${stat.gradient} backdrop-blur-sm`}>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 card-gradient-cyan glow-cyan">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">记录</h3>
            <p className="text-xs text-muted-foreground">{filteredInteractions.length} 条</p>
          </div>

          <div className="space-y-3">
            {filteredInteractions.slice(0, 10).map((interaction) => (
              <div key={interaction.id} className="p-3 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      {interaction.type === "voice" ? (
                        <MicIcon className="w-3 h-3 text-purple-400 shrink-0" />
                      ) : (
                        <MessageSquareIcon className="w-3 h-3 text-blue-400 shrink-0" />
                      )}
                      <p className="text-sm font-medium text-pretty flex-1">{interaction.command}</p>
                    </div>
                    {getStatusIcon(interaction.status)}
                  </div>

                  <p className="text-xs text-muted-foreground pl-5">{interaction.result}</p>

                  <div className="flex items-center justify-between pl-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ClockIcon className="w-3 h-3" />
                      <span>{interaction.timestamp.split(" ")[1]}</span>
                      <span>•</span>
                      <span>{interaction.duration}</span>
                    </div>
                    {getStatusBadge(interaction.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredInteractions.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">没有找到记录</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
