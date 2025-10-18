"use client"

import { useState } from "react"
import { useTTS } from "@/hooks/use-tts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const VolumeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M6.343 6.343a1 1 0 011.414 0L9 7.586l1.243-1.243a1 1 0 011.414 1.414L10.414 9l1.243 1.243a1 1 0 01-1.414 1.414L9 10.414l-1.243 1.243a1 1 0 01-1.414-1.414L7.586 9 6.343 7.757a1 1 0 010-1.414z"
    />
  </svg>
)

const VolumeXIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
  </svg>
)

export default function TTSTestPage() {
  const [testText, setTestText] = useState("你好，这是一个TTS测试")
  const { speak, stop, pause, resume, isPlaying, isSupported, getVoices } = useTTS()
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  const handleTestSpeak = () => {
    console.log('[TTS Test] 开始测试播报:', testText)
    speak(testText).catch(error => {
      console.error('[TTS Test] 播报失败:', error)
    })
  }

  const loadVoices = () => {
    const availableVoices = getVoices()
    setVoices(availableVoices)
    console.log('[TTS Test] 可用语音:', availableVoices)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <VolumeIcon className="w-5 h-5" />
              TTS 测试页面
            </CardTitle>
            <CardDescription>
              测试浏览器的文本转语音功能
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant={isSupported ? "default" : "destructive"}>
                {isSupported ? "TTS 支持" : "TTS 不支持"}
              </Badge>
              <Badge variant={isPlaying ? "default" : "secondary"}>
                {isPlaying ? "正在播放" : "未播放"}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">测试文本:</label>
                <Input
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="输入要播报的文本"
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTestSpeak} disabled={!isSupported}>
                  <VolumeIcon className="w-4 h-4 mr-2" />
                  播报测试
                </Button>
                <Button onClick={stop} disabled={!isPlaying} variant="outline">
                  <VolumeXIcon className="w-4 h-4 mr-2" />
                  停止
                </Button>
                <Button onClick={pause} disabled={!isPlaying} variant="outline">
                  暂停
                </Button>
                <Button onClick={resume} disabled={isPlaying} variant="outline">
                  恢复
                </Button>
              </div>

              <div>
                <Button onClick={loadVoices} variant="outline" size="sm">
                  加载语音列表
                </Button>
                {voices.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">可用语音 ({voices.length}):</p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {voices.map((voice, index) => (
                        <div key={index} className="text-xs p-2 bg-muted rounded">
                          <div className="font-medium">{voice.name}</div>
                          <div className="text-muted-foreground">
                            {voice.lang} - {voice.default ? "默认" : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>调试信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>speechSynthesis 支持:</strong> {typeof speechSynthesis !== 'undefined' ? '是' : '否'}
              </div>
              <div>
                <strong>当前状态:</strong> {isPlaying ? '播放中' : '未播放'}
              </div>
              <div>
                <strong>语音数量:</strong> {voices.length}
              </div>
              <div>
                <strong>用户代理:</strong> {navigator.userAgent}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
