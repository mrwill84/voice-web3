"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

interface DeveloperTool {
  id: string
  tool_id: string
  name: string
  description: string
  type: string
  status: string
  is_public?: boolean
  endpoint?: {
    platform: string
    api_key?: string
    app_config?: any
  }
  created_at?: string
  updated_at?: string
}

export default function DeveloperPage() {
  const [tools, setTools] = useState<DeveloperTool[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "http",
    platform: "dify", // 默认选择Dify平台
    api_key: "",
    bot_id: "", // Coze平台需要
    tags: "",
  })
  const [creating, setCreating] = useState(false)
  const [testResult, setTestResult] = useState("")
  const [testing, setTesting] = useState(false)

  const { isAuthenticated, role } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    if (role !== "developer" && role !== "admin") {
      toast({
        title: "权限不足",
        description: "您需要开发者权限才能访问此页面",
        variant: "destructive",
      })
      router.push("/")
      return
    }
    loadTools()
  }, [isAuthenticated, role, router])

  const loadTools = async () => {
    setLoading(true)
    try {
      const data = await apiClient.getIntegrations({ page: 1, page_size: 50 })
      setTools(data.items || [])
    } catch (error: any) {
      console.error("加载集成列表失败:", error)
      toast({
        title: "加载失败",
        description: error.message || "获取集成列表失败",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestService = async () => {
    if (!formData.name.trim() || !formData.api_key.trim()) {
      toast({
        title: "验证失败",
        description: "请填写集成名称和API Key",
        variant: "destructive",
      })
      return
    }

    setTesting(true)
    setTestResult("正在测试...")

    const integrationConfig = {
      name: formData.name.trim(),
      type: "http",
      description: formData.description.trim(),
      endpoint: {
        platform: formData.platform,
        api_key: formData.api_key.trim(),
        ...(formData.platform === "coze" && { app_config: { bot_id: formData.bot_id.trim() } })
      }
    }

    const testData = { query: "你好，请介绍一下你的功能" }

    try {
      const response = await apiClient.testUnsavedIntegration(integrationConfig, testData)

      if (response.data.success) {
        setTestResult(JSON.stringify(response.data.result, null, 2))
        toast({
          title: "测试成功",
          description: "集成响应正常",
        })
      } else {
        setTestResult(JSON.stringify(response.data, null, 2))
        toast({
          title: "测试失败",
          description: response.data.error || "未知错误",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      setTestResult(`测试失败: ${error.message}`)
      toast({
        title: "测试失败",
        description: error.message || "测试集成时发生错误",
        variant: "destructive",
      })
    }

    setTesting(false)
  }

  const handleCreateIntegration = async () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.api_key.trim()) {
      toast({
        title: "验证失败",
        description: "请填写集成名称、描述和API Key",
        variant: "destructive",
      })
      return
    }

    if (formData.platform === "coze" && !formData.bot_id.trim()) {
      toast({
        title: "验证失败",
        description: "Coze平台需要提供Bot ID",
        variant: "destructive",
      })
      return
    }

    setCreating(true)
    try {
      const integrationData = {
        name: formData.name.trim(),
        type: "http",
        description: formData.description.trim(),
        endpoint: {
          platform: formData.platform,
          api_key: formData.api_key.trim(),
          ...(formData.platform === "coze" && { app_config: { bot_id: formData.bot_id.trim() } })
        }
      }

      const response = await apiClient.createIntegration(integrationData)
      
      toast({
        title: "创建成功",
        description: `集成 "${formData.name}" 已成功创建！Tool ID: ${response.data.tool_id}`,
      })

      // 重置表单
      setFormData({
        name: "",
        description: "",
        type: "http",
        platform: "dify",
        api_key: "",
        bot_id: "",
        tags: "",
      })
      setShowCreateForm(false)
      setTestResult("")
      loadTools()

      // 可选：立即测试集成
      const shouldTest = confirm('是否立即测试该集成？')
      if (shouldTest && response.data.id) {
        await testIntegration(response.data.id)
      }
    } catch (error: any) {
      console.error("创建集成失败:", error)
      let errorMessage = "创建集成时发生错误"
      
      if (error.response?.status === 422) {
        errorMessage = "参数错误: " + (error.response.data.detail || "API Key格式错误")
      } else if (error.response?.status === 400) {
        errorMessage = "连接失败: " + (error.response.data.detail || "连通性测试失败")
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "创建失败",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const testIntegration = async (integrationId: string) => {
    const testQuery = prompt('请输入测试查询:', '你好，请介绍一下你的功能')
    if (!testQuery) return

    try {
      const response = await apiClient.testIntegration(integrationId, { query: testQuery })
      
      if (response.data.success) {
        toast({
          title: "测试成功",
          description: `响应: ${response.data.result}\n耗时: ${response.data.execution_time}秒`,
        })
      } else {
        toast({
          title: "测试失败",
          description: response.data.error || "未知错误",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "测试失败",
        description: error.message || "测试请求失败",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTool = async (toolId: string) => {
    if (!confirm("确定要删除这个工具吗？此操作不可逆。")) {
      return
    }

    try {
      const response = await apiClient.deleteDeveloperService(toolId)

      if (response.status === 200 || response.status === 204) {
        toast({
          title: "删除成功",
          description: "工具已成功删除",
        })
        loadTools()
      }
    } catch (error: any) {
      console.error("删除工具错误:", error)
      toast({
        title: "删除失败",
        description: error.message || "删除工具失败",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated || (role !== "developer" && role !== "admin")) {
    return null
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
                <h1 className="text-lg font-bold">API集成管理</h1>
              </div>
              <Button onClick={() => setShowCreateForm(!showCreateForm)} size="sm">
                <PlusIcon className="w-4 h-4 mr-2" />
                创建集成
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6">
          {showCreateForm && (
            <Card className="card-gradient-blue">
              <CardHeader>
                <CardTitle>创建API集成</CardTitle>
                <CardDescription>配置并测试您的Dify或Coze API集成</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">集成名称</Label>
                    <Input
                      id="name"
                      placeholder="例如：客服助手"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform">平台类型</Label>
                    <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value, bot_id: "" })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dify">Dify</SelectItem>
                        <SelectItem value="coze">Coze</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">集成描述</Label>
                  <Textarea
                    id="description"
                    placeholder="描述这个集成的用途和功能"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api_key">
                    {formData.platform === "dify" ? "Dify API Key" : "Coze API Key"}
                  </Label>
                  <Input
                    id="api_key"
                    type="password"
                    placeholder={formData.platform === "dify" ? "app-xxxxxxxxxxxxxxxx" : "pat_xxxxxxxxxxxxxxxx"}
                    value={formData.api_key}
                    onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  />
                  <div className="text-sm text-muted-foreground">
                    {formData.platform === "dify" ? (
                      <>Dify API Key 格式：以 "app-" 开头</>
                    ) : (
                      <>Coze API Key 格式：以 "pat_" 开头</>
                    )}
                  </div>
                </div>

                {formData.platform === "coze" && (
                  <div className="space-y-2">
                    <Label htmlFor="bot_id">Bot ID</Label>
                    <Input
                      id="bot_id"
                      placeholder="例如：7342866812345"
                      value={formData.bot_id}
                      onChange={(e) => setFormData({ ...formData, bot_id: e.target.value })}
                    />
                    <div className="text-sm text-muted-foreground">
                      Coze平台需要提供Bot ID
                    </div>
                  </div>
                )}


                <div className="space-y-2">
                  <Label htmlFor="tags">标签（用逗号分隔，可选）</Label>
                  <Input
                    id="tags"
                    placeholder="developer, http, translation, ai"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>

                {testResult && (
                  <div className="space-y-2">
                    <Label>测试结果</Label>
                    <div className="bg-black/60 rounded-lg p-4 font-mono text-xs max-h-60 overflow-y-auto">
                      <pre>{testResult}</pre>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleTestService}
                    disabled={testing}
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    {testing ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : null}
                    测试集成
                  </Button>
                  <Button onClick={handleCreateIntegration} disabled={creating || !formData.name || !formData.description || !formData.api_key || (formData.platform === "coze" && !formData.bot_id)} className="flex-1">
                    {creating ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : null}
                    创建集成
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-bold">我的服务</h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : tools.length === 0 ? (
              <Card className="p-8 text-center card-gradient-blue">
                <p className="text-muted-foreground">暂无集成，点击上方按钮创建您的第一个API集成</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <Card key={tool.id} className="card-gradient-blue">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <Badge variant={tool.status === "active" ? "default" : "secondary"}>{tool.status}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
                      {tool.tool_id && (
                        <div className="text-xs text-muted-foreground font-mono">
                          Tool ID: {tool.tool_id}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {tool.endpoint?.platform || tool.type}
                          </Badge>
                          {tool.is_public && (
                            <Badge variant="outline" className="text-xs">
                              公开
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => testIntegration(tool.tool_id || tool.id)}
                            className="h-8 w-8 p-0"
                            title="测试集成"
                          >
                            <EditIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTool(tool.tool_id || tool.id)}
                            className="h-8 w-8 p-0"
                          >
                            <TrashIcon className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
