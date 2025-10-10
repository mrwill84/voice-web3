"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StarryBackground } from "@/components/starry-background"
import { useToast } from "@/hooks/use-toast"

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

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

interface Tool {
  id: string
  tool_id?: string
  name: string
  title?: string
  description: string
  type: string
  tags?: string[]
  provider?: string
  created_at?: string
  rating?: number
}

export default function ServicesPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [filteredTools, setFilteredTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadTools()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredTools(filtered)
    } else {
      setFilteredTools(tools)
    }
  }, [searchQuery, tools])

  const loadTools = async () => {
    setLoading(true)
    try {
      const toolsData = await apiClient.getTools()
      setTools(toolsData)
      setFilteredTools(toolsData)
    } catch (error: any) {
      console.error("加载服务失败:", error)
      toast({
        title: "加载失败",
        description: "获取服务列表失败，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "http":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "mcp":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "dify":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "coze":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <StarryBackground />

      <div className="relative z-10">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/95">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="h-8 w-8 p-0">
                  <ArrowLeftIcon className="w-4 h-4" />
                </Button>
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                  <ZapIcon className="w-4 h-4 text-primary-foreground" />
                </div>
                <h1 className="text-lg font-bold">服务中心</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-balance">可用服务</h2>
              <p className="text-sm text-muted-foreground mt-1">浏览和管理所有可用的Web3服务</p>
            </div>

            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索服务..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-primary/20 focus:border-primary/50"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredTools.length === 0 ? (
            <Card className="p-8 text-center card-gradient-blue">
              <p className="text-muted-foreground">{searchQuery ? "未找到匹配的服务" : "暂无可用服务"}</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <Card
                  key={tool.id || tool.tool_id}
                  className="cursor-pointer hover:border-primary/50 transition-all card-gradient-blue"
                  onClick={() => router.push(`/services/${tool.id || tool.tool_id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{tool.name || tool.title}</CardTitle>
                      <Badge className={`text-xs ${getTypeColor(tool.type)}`}>{tool.type}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tool.tags?.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {tool.provider && <p className="text-xs text-muted-foreground mt-3">提供者: {tool.provider}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
