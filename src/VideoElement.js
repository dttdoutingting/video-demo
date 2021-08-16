import { useEffect, useRef, useState } from 'react'
import flvjs from 'flv.js'

function VideoElement({ url }) {
  const videoRef = useRef(null)
  const [refVisible, setRefVisible] = useState(false)
  const flvPlayerRef = useRef(null)
  const lastDecodedFrame = useRef(0)

  const timerId = useRef(null)

  useEffect(() => {
    function createVideo() {
      if (flvjs.isSupported() && refVisible && url) {
        const videoElement = videoRef.current

        flvPlayerRef.current = flvjs.createPlayer(
          {
            type: 'flv',
            url,
            hasAudio: false,
          },
          { isLive: true, enableWorker: true, enableStashBuffer: false, stashInitialSize: 128 }
        )

        flvPlayerRef.current.attachMediaElement(videoElement)
        flvPlayerRef.current.load()
        flvPlayerRef.current.play()

        //视频流延迟
        timerId.current = setInterval(() => {
          // ->注意：这里的定时器，在中断视频时，要清理哦
          if (flvPlayerRef.current.buffered && flvPlayerRef.current.buffered.length) {
            let end = flvPlayerRef.current.buffered.end(0) //获取当前buffered值
            let diff = end - flvPlayerRef.current.currentTime //获取buffered与currentTime的差值
            if (diff >= 6) {
              //如果差值大于等于60s 手动跳帧 这里可根据自身需求来定
              //单个视频用
              // flvPlayer.currentTime = end;//手动跳帧
              // flvPlayer.currentTime = flvPlayer.buffered.end(0);//手动跳帧

              //多个视频用
              clearInterval(timerId.current)
              // 关闭视频流
              closeVideo()
              //重新加载当前停止的视频流，根据个人的方法来配置
              createVideo()

              console.log('视频流延迟==========')
            }
          }
        }, 2000) //2000毫秒执行一次

        //断流重连
        flvPlayerRef.current.on(flvjs.Events.ERROR, (errorType, errorDetail, errorInfo) => {
          // this.loadStatus=true
          // this.statusMsg="正在重连。。。"
          //视频出错后销毁重新创建
          console.log('断流重连================')

          closeVideo()
        })

        //画面卡顿
        flvPlayerRef.current.on('statistics_info', function (res) {
          if (lastDecodedFrame.current === 0) {
            lastDecodedFrame.current = res.decodedFrames
            return
          }
          if (lastDecodedFrame.current !== res.decodedFrames || res.decodedFrames - lastDecodedFrame.current <= 10) {
            lastDecodedFrame.current = res.decodedFrames
          } else {
            console.log('画面卡顿==============')

            lastDecodedFrame.current = 0

            closeVideo()
          }
        })
      }
    }

    function closeVideo() {
      if (flvPlayerRef.current) {
        flvPlayerRef.current.pause()
        flvPlayerRef.current.unload()
        flvPlayerRef.current.detachMediaElement()
        flvPlayerRef.current.destroy()
        flvPlayerRef.current = null
        createVideo()
      }
    }
    createVideo()

    return () => {
      if (timerId.current) {
        clearInterval(timerId.current)
      }
      closeVideo()
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
