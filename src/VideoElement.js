import { useEffect, useRef, useState } from 'react'
import flvjs from 'flv.js'

function VideoElement({ url }) {
  const videoRef = useRef(null)
  const [refVisible, setRefVisible] = useState(false)

  useEffect(() => {
    let flvPlayer
    if (flvjs.isSupported() && refVisible && url) {
      const videoElement = videoRef.current
      // console.log('createPlayer', createPlayer)

      flvPlayer = flvjs.createPlayer(
        {
          type: 'flv',
          url,
          hasAudio: false,
          isLive: true,
        },
        {
          enableWorker: true,
          enableStashBuffer: false,
          stashInitialSize: 128,
        }
      )

      flvPlayer.attachMediaElement(videoElement)
      flvPlayer.load()
      flvPlayer.play()
    }

    return () => {
      if (flvPlayer && flvPlayer.destroy) {
        flvPlayer.destroy()
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
      width="500px"
    ></video>
  )
}

export default VideoElement
