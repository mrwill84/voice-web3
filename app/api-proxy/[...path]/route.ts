import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://implies-vista-highest-cabin.trycloudflare.com'
const TIMEOUT = 300000 // 5分钟

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'DELETE')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'PATCH')
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  const path = params.path.join('/')
  const url = `${API_BASE_URL}/${path}${request.nextUrl.search}`
  
  const headers: HeadersInit = {}
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'connection') {
      headers[key] = value
    }
  })

  let body: BodyInit | undefined
  if (method !== 'GET' && method !== 'DELETE') {
    try {
      body = await request.text()
    } catch (error) {
      // 如果没有 body，保持为 undefined
    }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const responseBody = await response.text()
    let parsedBody: any
    try {
      parsedBody = JSON.parse(responseBody)
    } catch {
      parsedBody = responseBody
    }

    return NextResponse.json(parsedBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    })
  } catch (error: any) {
    clearTimeout(timeoutId)
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: { message: `请求超时（${TIMEOUT / 1000}秒）` } },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: { message: error.message || '代理请求失败' } },
      { status: 500 }
    )
  }
}

