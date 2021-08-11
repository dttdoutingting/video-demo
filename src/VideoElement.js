import { useEffect, useRef, useState } from 'react'
import flvjs from 'flv.js'

function VideoElement({ url }) {
  const videoRef = useRef(null)
  const [refVisible, setRefVisible] = useState(false)
  const flvPlayerRef = useRef(null)

  useEffect(() => {
    function createVideo() {
      if (flvjs.isSupported() && refVisible && url) {
        const videoElement = videoRef.current

        flvPlayerRef.current = flvjs.createPlayer(
          {
            type: 'flv',
            url,
            hasAudio: false,
            isLive: true,
          },
          {
            enableWorker: true,
            // enableSstashBuffer: false,
            stashInitialSize: 128,
          }
        )

        flvPlayerRef.current.attachMediaElement(videoElement)
        flvPlayerRef.current.load()
        flvPlayerRef.current.play()

        let timer = setInterval(() => {
          // ->注意：这里的定时器，在中断视频时，要清理哦
          if (flvPlayerRef.current.buffered && flvPlayerRef.current.buffered.length) {
            let end = flvPlayerRef.current.buffered.end(0) //获取当前buffered值
            let diff = end - flvPlayerRef.current.currentTime //获取buffered与currentTime的差值
            if (diff >= 60) {
              //如果差值大于等于60s 手动跳帧 这里可根据自身需求来定
              //单个视频用
              // flvPlayer.currentTime = end;//手动跳帧
              // flvPlayer.currentTime = flvPlayer.buffered.end(0);//手动跳帧

              //多个视频用
              clearInterval(timer)
              flvPlayerRef.current.pause()
              flvPlayerRef.current.unload()
              flvPlayerRef.current.detachMediaElement()
              flvPlayerRef.current.destroy()
              flvPlayerRef.current = null
              //重新加载当前停止的视频流，根据个人的方法来配置
              createVideo()
            }
          }
        }, 2000) //2000毫秒执行一次

        flvPlayerRef.current.on(flvjs.Events.ERROR, (errorType, errorDetail, errorInfo) => {
          // this.loadStatus=true
          // this.statusMsg="正在重连。。。"
          //视频出错后销毁重新创建
          console.log('error================')

          if (flvPlayerRef.current) {
            flvPlayerRef.current.pause()
            flvPlayerRef.current.unload()
            flvPlayerRef.current.detachMediaElement()
            flvPlayerRef.current.destroy()
            flvPlayerRef.current = null
            createVideo()
          }
        })
      }
    }

    createVideo()

    return () => {
      if (flvPlayerRef.current && flvPlayerRef.current.destroy) {
        flvPlayerRef.current.destroy()
      }
    }
  }, [url, refVisible])
  return (
    <video
      ref={(el) => {
        videoRef.current = el
        setRefVisible(true)
      }}
      muted
      width={500}
      controls
    ></video>
  )
}

export default VideoElement
