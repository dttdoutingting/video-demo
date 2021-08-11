import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'videojs-contrib-hls'

function VideoElementHLS({ url }) {
  const videoRef = useRef(null)
  const [refVisible, setRefVisible] = useState(false)

  useEffect(() => {
    let player

    let intervalId = setInterval(() => {
      if (refVisible) {
        player = videojs('example-video', {
          bigPlayButton: false,
          textTrackDisplay: false,
          posterImage: true,
          errorDisplay: false,
          controlBar: true,
        })
      }
    }, 1000)

    return () => {
      clearInterval(intervalId)
      if (player?.dispose) {
        player.dispose()
      }
    }
  }, [url, refVisible])
  return (
    <video
      id="example-video"
      ref={(el) => {
        videoRef.current = el
        setRefVisible(true)
      }}
      className="video-js vjs-default-skin"
      controls
      preload="auto"
      width={500}
      autoPlay
      muted
      data-setup="{}"
    >
      <source src={url} type="application/x-mpegURL" />
    </video>
  )
}

export default VideoElementHLS
