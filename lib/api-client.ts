import axios, { type AxiosInstance, type AxiosError } from "axios"

const API_URL = '/api-proxy' //#process.env.NEXT_PUBLIC_API_BASE_URL

console.log("[API Client] API_URL:", API_URL)
console.log("[API Client] process.env.NEXT_PUBLIC_API_BASE_URL:", process.env.NEXT_PUBLIC_API_BASE_URL)

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL 环境变量未设置")
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    let errorMsg = "请求失败，发生未知错误。"

    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
        }
        errorMsg = "身份验证失败，请重新登录"
      } else if (status === 405) {
        errorMsg = "请求方法不被允许，请检查API配置"
      } else if (data?.detail) {
        if (Array.isArray(data.detail)) {
          errorMsg = data.detail.map((err: any) => `${err.loc ? err.loc.join(".") + ": " : ""}${err.msg}`).join("; ")
        } else {
          errorMsg = data.detail
        }
      } else {
        errorMsg = data?.error?.message || `请求失败，状态码: ${status}`
      }
    } else if (error.request) {
      errorMsg = "无法连接到服务器，请检查网络连接或后端服务是否运行。"
    } else {
      errorMsg = `请求设置错误: ${error.message}`
    }

    return Promise.reject({ message: errorMsg, originalError: error })
  },
)

export const apiClient = {
  // Set auth token
  setAuthToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
    }
  },

  // Authentication APIs
  async login(username: string, password: string) {
    try {
      const form = new URLSearchParams()
      form.append("username", username)
      form.append("password", password)

      const response = await api.post("/api/v1/auth/login", form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })

      return {
        success: true,
        token: response.data.access_token || response.data.token,
        user: response.data.user || {
          id: response.data.user_id,
          username: username,
          role: response.data.role || "user",
        },
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "登录失败",
      }
    }
  },

  async register(username: string, password: string, email: string) {
    try {
      const response = await api.post("/api/v1/auth/register", {
        username,
        password,
        email,
      })

      return {
        success: true,
        user: response.data.user || response.data,
        token: response.data.token || response.data.access_token,
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "注册失败",
      }
    }
  },

  async getUserInfo() {
    try {
      const response = await api.get("/api/v1/auth/me")
      return {
        success: true,
        user: response.data.user || response.data,
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "获取用户信息失败",
      }
    }
  },

  async refreshToken() {
    try {
      const response = await api.post("/api/v1/auth/refresh")
      return {
        success: true,
        token: response.data.access_token || response.data.token,
        user: response.data.user,
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "刷新令牌失败",
      }
    }
  },

  // Intent recognition and execution APIs
  async interpret(transcript: string, sessionId?: string, userId?: number) {
    try {
      const { replaceContactsInText, getContacts } = await import("./address-book")
      const processedTranscript = replaceContactsInText(transcript)
      const contacts = getContacts()

      // 构建包含地址簿信息的查询
      let enhancedQuery = processedTranscript
      if (Object.keys(contacts).length > 0) {
        const addressBookInfo = Object.entries(contacts)
          .map(([name, address]) => `${name}: ${address}`)
          .join(", ")
        
        enhancedQuery = `${processedTranscript}

可用地址簿信息：
${addressBookInfo}

注意：你可以使用上述地址簿中的联系人名称来引用对应的地址，这样用户就不需要手动输入完整的地址。`
      }

      const requestData: any = {
        query: enhancedQuery,
        session_id: sessionId || null,
      }

      if (userId != null) {
        requestData.user_id = Number(userId)
      }

      const response = await api.post("/api/v1/intent/interpret", requestData)

      return {
        sessionId: response.data.session_id || sessionId,
        action: response.data.action,
        toolId: response.data.tool_id,
        params: response.data.params,
        confirmationText: response.data.confirmation_text || response.data.confirm_text,
        tts_message: response.data.tts_message,
        needsConfirmation: response.data.needs_confirmation,
        message: response.data.message,
        content: response.data.content,
        type: response.data.type,
        toolCalls: response.data.tool_calls,
      }
    } catch (error: any) {
      throw new Error(error.message || "意图解析失败")
    }
  },

  async confirm(sessionId: string, userInput: string, userId?: number) {
    try {
      if (!sessionId) {
        throw new Error("会话ID不能为空")
      }
      if (!userInput) {
        throw new Error("用户输入不能为空")
      }

      const requestData: any = {
        session_id: sessionId,
        user_input: userInput,
      }

      const userIdNum = userId != null ? Number(userId) : undefined
      if (userIdNum !== undefined && !Number.isNaN(userIdNum)) {
        requestData.user_id = userIdNum
      }

      const response = await api.post("/api/v1/intent/confirm", requestData)

      return {
        success: response.data.success !== false,
        sessionId: response.data.session_id || sessionId,
        data: response.data.data || response.data.result || response.data,
        content: response.data.content,
        error: response.data.error,
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || "执行失败",
        },
      }
    }
  },

  // Tools/Services management APIs
  async getTools() {
    try {
      const response = await api.get("/api/v1/tools")
      return response.data.tools || response.data || []
    } catch (error: any) {
      console.error("获取工具列表失败:", error)
      return []
    }
  },

  async getToolById(toolId: string) {
    try {
      const response = await api.get(`/api/v1/tools/${toolId}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.message || "获取工具详情失败")
    }
  },

  // Developer APIs
  async getDeveloperServices(params?: {
    page?: number
    page_size?: number
    status?: string
    is_public?: boolean
    search?: string
  }) {
    try {
      const response = await api.get("/api/v1/dev/tools", { params })
      return {
        tools: response.data.tools || response.data.items || [],
        total: response.data.total || 0,
        page: response.data.page || params?.page || 1,
        page_size: response.data.page_size || params?.page_size || 10,
      }
    } catch (error: any) {
      throw new Error(error.message || "获取开发者服务失败")
    }
  },

  async createDeveloperService(serviceData: {
    name: string
    description: string
    type: string
    provider?: string
    isDeveloperTool?: boolean
    endpoint: {
      url: string
      method: string
      platform_type: string
      api_key?: string
    }
    request_schema?: any
    response_schema?: any
    tags?: string[]
    is_public?: boolean
    status?: string
  }) {
    const response = await api.post("/api/v1/dev/tools", serviceData)
    return response
  },

  // New integration APIs for Dify/Coze
  async createIntegration(integrationData: {
    name: string
    type: string
    description: string
    endpoint: {
      platform: string
      api_key: string
      app_config?: any
    }
  }) {
    const response = await api.post("/api/v1/dev/integrations", integrationData)
    return response
  },

  async getIntegrations(params?: {
    page?: number
    page_size?: number
    status?: string
    search?: string
  }) {
    try {
      const response = await api.get("/api/v1/dev/integrations", { params })
      return {
        items: response.data.tools || response.data.items || [],
        total: response.data.total || 0,
        page: response.data.page || params?.page || 1,
        size: response.data.page_size || params?.page_size || 20,
      }
    } catch (error: any) {
      throw new Error(error.message || "获取集成列表失败")
    }
  },

  async testIntegration(integrationId: string, testData: any) {
    try {
      const response = await api.post(`/api/v1/dev/integrations/${integrationId}/validate-and-test`, {
        test_data: testData
      })
      return response
    } catch (error: any) {
      throw new Error(error.message || "测试集成失败")
    }
  },

  async testUnsavedIntegration(integrationConfig: any, testData: any) {
    try {
      const response = await api.post("/api/v1/dev/integrations/test", {
        integration_config: integrationConfig,
        test_data: testData
      })
      return response
    } catch (error: any) {
      throw new Error(error.message || "测试集成失败")
    }
  },

  async updateDeveloperService(toolId: string, updateData: any) {
    try {
      const response = await api.put(`/api/v1/dev/tools/${toolId}/`, updateData)
      return response
    } catch (error: any) {
      throw new Error(error.message || "更新服务失败")
    }
  },

  async deleteDeveloperService(toolId: string) {
    try {
      const response = await api.delete(`/api/v1/dev/tools/${toolId}/`)
      return response
    } catch (error: any) {
      throw new Error(error.message || "删除服务失败")
    }
  },

  async testDeveloperTool(toolId: string, testData: any, timeout?: number) {
    try {
      const response = await api.post(`/api/v1/dev/tools/${toolId}/test/`, {
        test_data: testData,
        timeout: timeout || 30,
      })
      return response
    } catch (error: any) {
      throw new Error(error.message || "测试工具失败")
    }
  },

  async testUnsavedDeveloperTool(toolConfiguration: {
    tool_config: any
    test_data: any
    timeout?: number
  }) {
    try {
      const response = await api.post("/api/v1/dev/tools/test", toolConfiguration)
      return response
    } catch (error: any) {
      throw new Error(error.message || "测试工具失败")
    }
  },

  async uploadApiPackage(formData: FormData) {
    try {
      const response = await api.post("/api/v1/dev/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.message || "上传API包失败")
    }
  },

  async getDeveloperApplications() {
    try {
      const response = await api.get("/api/v1/dev/apps")
      return response.data
    } catch (error: any) {
      throw new Error(error.message || "获取应用列表失败")
    }
  },

  async createDeveloperApplication(applicationData: {
    name: string
    description: string
    permissions?: string[]
  }) {
    try {
      const response = await api.post("/api/v1/dev/apps", applicationData)
      return response.data
    } catch (error: any) {
      throw new Error(error.message || "创建应用失败")
    }
  },

  // Health check API
  async getHealth() {
    try {
      const response = await api.get("/api/v1/mcp/health")
      return {
        success: true,
        data: response.data,
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "健康检查失败",
      }
    }
  },
}

export default apiClient
