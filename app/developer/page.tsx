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
  name: string
  description: string
  type: string
  status: string
  is_public: boolean
  created_at: string
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
    endpoint_url: "",
    api_key: "",
    user_input_var: "query",
    documentation: "",
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
      const data = await apiClient.getDeveloperServices({ page: 1, page_size: 50 })
      setTools(data.tools || [])
    } catch (error: any) {
      console.error("加载开发者工具失败:", error)
      toast({
        title: "加载失败",
        description: error.message || "获取工具列表失败",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestService = async () => {
    if (!formData.endpoint_url.trim()) {
      toast({
        title: "验证失败",
        description: "请输入端点URL",
        variant: "destructive",
      })
      return
    }

    setTesting(true)
    setTestResult("正在测试...")

    try {
      const toolConfig = {
        type: formData.type,
        endpoint_url: formData.endpoint_url.trim(),
        api_key: formData.api_key.trim(),
        user_input_var: formData.user_input_var || "query",
      }

      const testData = { [formData.user_input_var || "query"]: "测试消息" }

      const response = await apiClient.testUnsavedDeveloperTool({
        tool_config: toolConfig,
        test_data: testData,
        timeout: 30,
      })

      if (response.status === 200 && response.data.success) {
        setTestResult(JSON.stringify(response.data.result, null, 2))
        toast({
          title: "测试成功",
          description: "服务响应正常",
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
      console.error("测试服务错误:", error)
      setTestResult(`测试失败: ${error.message || "未知错误"}`)
      toast({
        title: "测试错误",
        description: error.message || "测试服务时发生错误",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const handleCreateService = async () => {
    if (!formData.name.trim() || !formData.endpoint_url.trim()) {
      toast({
        title: "验证失败",
        description: "请填写服务名称和端点URL",
        variant: "destructive",
      })
      return
    }

    setCreating(true)

    try {
      const serviceData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        config: {
          endpoint_url: formData.endpoint_url.trim(),
          api_key: formData.api_key.trim(),
          user_input_var: formData.user_input_var || "query",
          documentation: formData.documentation.trim(),
        },
      }

      const response = await apiClient.createDeveloperService(serviceData)

      if (response.status === 200 || response.status === 201) {
        toast({
          title: "创建成功",
          description: "服务已成功创建",
        })
        setShowCreateForm(false)
        setFormData({
          name: "",
          description: "",
          type: "http",
          endpoint_url: "",
          api_key: "",
          user_input_var: "query",
          documentation: "",
        })
        setTestResult("")
        loadTools()
      }
    } catch (error: any) {
      console.error("创建服务错误:", error)
      toast({
        title: "创建失败",
        description: error.message || "创建服务时发生错误",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
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
                <h1 className="text-lg font-bold">开发者控制台</h1>
              </div>
              <Button onClick={() => setShowCreateForm(!showCreateForm)} size="sm">
                <PlusIcon className="w-4 h-4 mr-2" />
                创建服务
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6">
          {showCreateForm && (
            <Card className="card-gradient-blue">
              <CardHeader>
                <CardTitle>创建新服务</CardTitle>
                <CardDescription>配置并测试您的自定义服务</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">服务名称</Label>
                    <Input
                      id="name"
                      placeholder="输入服务名称"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">平台类型</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="http">HTTP</SelectItem>
                        <SelectItem value="dify">Dify</SelectItem>
                        <SelectItem value="coze">Coze</SelectItem>
                        <SelectItem value="mcp">MCP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">服务描述</Label>
                  <Textarea
                    id="description"
                    placeholder="输入服务描述"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endpoint_url">端点URL</Label>
                  <Input
                    id="endpoint_url"
                    placeholder="https://api.example.com/endpoint"
                    value={formData.endpoint_url}
                    onChange={(e) => setFormData({ ...formData, endpoint_url: e.target.value })}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="api_key">API密钥</Label>
                    <Input
                      id="api_key"
                      type="password"
                      placeholder="输入API密钥"
                      value={formData.api_key}
                      onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user_input_var">用户输入变量名</Label>
                    <Input
                      id="user_input_var"
                      placeholder="query"
                      value={formData.user_input_var}
                      onChange={(e) => setFormData({ ...formData, user_input_var: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentation">文档说明</Label>
                  <Textarea
                    id="documentation"
                    placeholder="输入服务文档说明"
                    value={formData.documentation}
                    onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
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
                    测试服务
                  </Button>
                  <Button onClick={handleCreateService} disabled={creating} className="flex-1">
                    {creating ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : null}
                    创建服务
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
                <p className="text-muted-foreground">暂无服务，点击上方按钮创建您的第一个服务</p>
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
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {tool.type}
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
                            onClick={() => handleDeleteTool(tool.id)}
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
