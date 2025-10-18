import { useCallback, useRef, useState, useEffect } from 'react'

interface TTSOptions {
  lang?: string
  rate?: number
  pitch?: number
  volume?: number
}

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  // 初始化时检查TTS支持
  useEffect(() => {
    checkSupport()
    
    // 等待语音列表加载完成
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      if (voices.length > 0) {
        console.log('[TTS] 语音列表已加载:', voices)
      } else {
        // 如果语音列表为空，等待一段时间后重试
        setTimeout(loadVoices, 100)
      }
    }
    
    // 监听语音列表变化
    speechSynthesis.addEventListener('voiceschanged', loadVoices)
    loadVoices()
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  // 检查浏览器是否支持语音合成
  const checkSupport = useCallback(() => {
    const supported = 'speechSynthesis' in window
    console.log('[TTS] 浏览器支持检查:', supported)
    console.log('[TTS] speechSynthesis 对象:', speechSynthesis)
    setIsSupported(supported)
    return supported
  }, [])

  // 播报文本
  const speak = useCallback((text: string, options: TTSOptions = {}) => {
    console.log('[TTS] 开始播报:', text)
    
    if (!checkSupport()) {
      console.warn('浏览器不支持语音合成')
      return Promise.reject(new Error('浏览器不支持语音合成'))
    }

    return new Promise<void>((resolve, reject) => {
      // 停止当前播放
      if (speechRef.current) {
        speechSynthesis.cancel()
      }

      const utterance = new SpeechSynthesisUtterance(text)
      console.log('[TTS] 创建 utterance:', utterance)
      
      // 设置语音参数
      utterance.lang = options.lang || 'zh-CN'
      utterance.rate = options.rate || 1
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1

      // 选择中文语音 - 使用延迟加载，因为某些浏览器需要用户交互后才能获取语音列表
      const selectVoice = () => {
        const voices = speechSynthesis.getVoices()
        console.log('[TTS] 可用语音列表:', voices)
        
        const chineseVoice = voices.find(voice => 
          voice.lang.startsWith('zh') || 
          voice.name.includes('Chinese') || 
          voice.name.includes('中文')
        )
        
        console.log('[TTS] 选择的中文语音:', chineseVoice)
        
        if (chineseVoice) {
          utterance.voice = chineseVoice
        }
        
        // 开始播报
        console.log('[TTS] 调用 speechSynthesis.speak')
        speechSynthesis.speak(utterance)
      }

      // 如果语音列表为空，等待一下再试
      if (speechSynthesis.getVoices().length === 0) {
        console.log('[TTS] 语音列表为空，等待加载...')
        setTimeout(selectVoice, 100)
      } else {
        selectVoice()
      }

      // 事件处理
      utterance.onstart = () => {
        console.log('[TTS] 开始播放')
        setIsPlaying(true)
        speechRef.current = utterance
      }

      utterance.onend = () => {
        console.log('[TTS] 播放结束')
        setIsPlaying(false)
        speechRef.current = null
        resolve()
      }

      utterance.onerror = (event) => {
        console.error('[TTS] 播放错误:', event)
        setIsPlaying(false)
        speechRef.current = null
        reject(new Error(`语音播报错误: ${event.error}`))
      }

      utterance.onpause = () => {
        console.log('[TTS] 播放暂停')
        setIsPlaying(false)
      }

      utterance.onresume = () => {
        console.log('[TTS] 播放恢复')
        setIsPlaying(true)
      }
    })
  }, [checkSupport])

  // 停止播报
  const stop = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      speechRef.current = null
    }
  }, [])

  // 暂停播报
  const pause = useCallback(() => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
      setIsPlaying(false)
    }
  }, [])

  // 恢复播报
  const resume = useCallback(() => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume()
      setIsPlaying(true)
    }
  }, [])

  // 获取可用的语音列表
  const getVoices = useCallback(() => {
    return speechSynthesis.getVoices()
  }, [])

  return {
    speak,
    stop,
    pause,
    resume,
    isPlaying,
    isSupported,
    getVoices,
  }
}
