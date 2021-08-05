import { useEffect, useState } from 'react'
import VideoElement from './VideoElement'
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
    }, 100)

    return () => {
      clearInterval(internalId)
    }
  }, [])

  return (
    <div className="video-demo-container">
      <div>当前时间：{currentTime}</div>
      <ul className="ul-container">
        <li className="li-wrapper">
          <VideoElement url={`http://allapis.cn/live?port=1935&app=testapp&stream=teststream1`} />
        </li>
        {/* <li className="li-wrapper">
          <VideoElement url="http://1011.hlsplay.aodianyun.com/demo/game.flv" />
        </li>
        <li className="li-wrapper">
          <VideoElement url="http://1011.hlsplay.aodianyun.com/demo/game.flv" />
        </li>
        <li className="li-wrapper">
          <VideoElement url="http://1011.hlsplay.aodianyun.com/demo/game.flv" />
        </li>
        <li className="li-wrapper">
          <VideoElement url="http://1011.hlsplay.aodianyun.com/demo/game.flv" />
        </li>
        <li className="li-wrapper">
          <VideoElement url="http://1011.hlsplay.aodianyun.com/demo/game.flv" />
        </li> */}
      </ul>
    </div>
  )
}

export default VideoDemo
