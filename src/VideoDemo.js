import { useEffect, useState } from 'react'
import VideoElement from './VideoElement'
import VideoElemengtHLS from './VideoElementHLS'
import './videodemo.css'

function getNowTime() {
  let date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  const milliSeconds = date.getMilliseconds()
  const currentTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + milliSeconds
  return currentTime
}

function VideoDemo() {
  const [currentTime, setCurrentTime] = useState()

  useEffect(() => {
    const internalId = setInterval(() => {
      setCurrentTime(getNowTime())
    }, 500)

    return () => {
      clearInterval(internalId)
    }
  }, [])

  return (
    <div className="video-demo-container">
      <div>当前时间：{currentTime}</div>
      <ul className="ul-container">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <li className="li-wrapper" key={item}>
            <div>FLV</div>
            <VideoElement url={`http://113.31.163.86:8080/live?app=myapp&stream=mystream`} />
          </li>
          // <li className="li-wrapper" key={item}>
          //   <div>HLS</div>
          //   <VideoElemengtHLS url={`http://113.31.163.86:8080/hls/mystream.m3u8`} />
          // </li>
        ))}
      </ul>
    </div>
  )
}

export default VideoDemo
