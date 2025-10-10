"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
const WalletIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
)

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const ArrowUpRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7m0 0H7m10 0v10" />
  </svg>
)

const ArrowDownLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7L7 17m0 0h10m-10 0V7" />
  </svg>
)

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const CoinsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

export function Web3Dashboard() {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const web3Services = [
    {
      id: "wallet",
      name: "钱包管理",
      description: "管理您的数字资产",
      icon: WalletIcon,
      status: "connected",
      balance: "1,234.56 ETH",
      color: "text-blue-400",
    },
    {
      id: "defi",
      name: "DeFi 协议",
      description: "去中心化金融服务",
      icon: TrendingUpIcon,
      status: "connected",
      balance: "45,678.90 USDC",
      color: "text-cyan-400",
    },
    {
      id: "nft",
      name: "NFT 收藏",
      description: "非同质化代币管理",
      icon: ShieldIcon,
      status: "disconnected",
      balance: "23 NFTs",
      color: "text-purple-400",
    },
    {
      id: "staking",
      name: "质押服务",
      description: "代币质押获得收益",
      icon: CoinsIcon,
      status: "connected",
      balance: "8.5% APY",
      color: "text-blue-300",
    },
  ]

  const recentTransactions = [
    {
      id: 1,
      type: "send",
      amount: "0.5 ETH",
      to: "0x1234...5678",
      time: "2分钟前",
      status: "confirmed",
    },
    {
      id: 2,
      type: "receive",
      amount: "100 USDC",
      from: "0xabcd...efgh",
      time: "15分钟前",
      status: "confirmed",
    },
    {
      id: 3,
      type: "swap",
      amount: "1 ETH → 2,500 USDC",
      platform: "Uniswap",
      time: "1小时前",
      status: "pending",
    },
  ]

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-balance">Web3 服务</h2>
        <p className="text-sm text-muted-foreground">管理数字资产</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {web3Services.map((service, index) => {
          const Icon = service.icon
          const gradientClass =
            index === 0
              ? "card-gradient-blue glow-blue"
              : index === 1
                ? "card-gradient-cyan glow-cyan"
                : index === 2
                  ? "card-gradient-purple"
                  : "card-gradient-blue"
          return (
            <Card
              key={service.id}
              className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${gradientClass} ${
                selectedService === service.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedService(service.id)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Icon className={`w-6 h-6 ${service.color}`} />
                  <Badge variant={service.status === "connected" ? "default" : "secondary"} className="text-xs">
                    {service.status === "connected" ? "连接" : "断开"}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">{service.name}</h3>
                  <p className="text-xs text-muted-foreground text-pretty">{service.description}</p>
                </div>

                <div className="pt-2 border-t border-border/30">
                  <p className="text-sm font-bold text-primary">{service.balance}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">最近交易</h3>
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              全部
            </Button>
          </div>

          <div className="space-y-3">
            {recentTransactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === "send" ? "bg-red-500/20" : tx.type === "receive" ? "bg-blue-500/20" : "bg-blue-500/20"
                    }`}
                  >
                    {tx.type === "send" ? (
                      <ArrowUpRightIcon className="w-4 h-4 text-red-400" />
                    ) : tx.type === "receive" ? (
                      <ArrowDownLeftIcon className="w-4 h-4 text-blue-400" />
                    ) : (
                      <ZapIcon className="w-4 h-4 text-blue-400" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {tx.type === "send" ? "发送" : tx.type === "receive" ? "接收" : "交换"}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.time}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium">{tx.amount}</p>
                  <Badge variant={tx.status === "confirmed" ? "default" : "secondary"} className="text-xs">
                    {tx.status === "confirmed" ? "确认" : "待确认"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card/30 backdrop-blur-sm border-border/30">
        <div className="space-y-3">
          <h3 className="text-base font-semibold">快速操作</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "发送", icon: ArrowUpRightIcon },
              { label: "接收", icon: ArrowDownLeftIcon },
              { label: "交换", icon: ZapIcon },
              { label: "钱包", icon: WalletIcon },
            ].map((action, index) => {
              const Icon = action.icon
              return (
                <Button key={index} variant="outline" className="h-12 flex-col gap-1 bg-transparent text-xs">
                  <Icon className="w-4 h-4" />
                  <span>{action.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
