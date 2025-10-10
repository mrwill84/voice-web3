"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarryBackground } from "@/components/starry-background"
import { useToast } from "@/hooks/use-toast"

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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

export default function ServiceDetailPage() {
  const [tool, setTool] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    if (params.id) {
      loadToolDetail(params.id as string)
    }
  }, [params.id])

  const loadToolDetail = async (toolId: string) => {
    setLoading(true)
    try {
      const toolData = await apiClient.getToolById(toolId)
      setTool(toolData)
    } catch (error: any) {
      console.error("加载服务详情失败:", error)
      toast({
        title: "加载失败",
        description: "获取服务详情失败",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <StarryBackground />
        <Loader2Icon className="w-8 h-8 animate-spin text-primary relative z-10" />
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <StarryBackground />
        <Card className="p-8 text-center card-gradient-blue relative z-10">
          <p className="text-muted-foreground">服务不存在</p>
          <Button onClick={() => router.push("/services")} className="mt-4">
            返回服务列表
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <StarryBackground />

      <div className="relative z-10">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/95">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push("/services")} className="h-8 w-8 p-0">
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <ZapIcon className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold">服务详情</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6">
          <Card className="card-gradient-blue">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{tool.name || tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </div>
                <Badge className="text-sm">{tool.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {tool.tags && tool.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {tool.provider && (
                <div>
                  <h3 className="text-sm font-medium mb-2">提供者</h3>
                  <p className="text-sm text-muted-foreground">{tool.provider}</p>
                </div>
              )}

              {tool.config && (
                <div>
                  <h3 className="text-sm font-medium mb-2">配置信息</h3>
                  <div className="bg-black/60 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    <pre>{JSON.stringify(tool.config, null, 2)}</pre>
                  </div>
                </div>
              )}

              {tool.parameters && (
                <div>
                  <h3 className="text-sm font-medium mb-2">参数定义</h3>
                  <div className="bg-black/60 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    <pre>{JSON.stringify(tool.parameters, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={() => router.push("/")} className="flex-1">
                  使用此服务
                </Button>
                <Button onClick={() => router.push("/services")} variant="outline" className="flex-1">
                  返回列表
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
