import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import React from "react"
import * as $ from "jquery";

export default function Player({ accessToken, trackUri, duration, trackQueue, parentCallback, songIndex}) {


  const [play, setPlay] = useState(false)
  const [gotPlay, setGotPlay] = useState(false)
  const [ind, setInd] = useState(0)

  useEffect(() => setPlay(true), [trackUri])

  function getCurrentlyPlaying() {
    
    // Make a call using the token  
    //console.log("running.....")  
    //console.log("Passed value: ", trackQueue[0])
    //console.log("Current Queue: ", trackQueue)
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
      },
      success: (data) => {
        //console.log("data - data: ", data)
        if (data){
          console.log("data: ", data)
          console.log("Current index: ", songIndex)

          if(data.progress_ms > 100 && songIndex === ind) {
            console.log("song: ", data.item.name, "is playing")
            setGotPlay(true)
            setInd(ind + 1)
          }
          if  (data.progress_ms === 0 && !data.is_playing && trackQueue[0].uri === data.item.uri) {
            console.log("uri: ", data.progress_ms, "duration: ", duration, "is_playing: ", data.is_playing)
            var temp = [...trackQueue]
            temp.splice(0, 1)
            console.log("Song is over: ", trackQueue)
            console.log("Next song on the queue: ", trackQueue[songIndex + 1])
            //setTimeout(function () {
            if(gotPlay) parentCallback(temp)
            //}, 5000);
          }
        }  
      }
    });
  }
  
  useEffect(() =>{
    if (trackUri === undefined || trackUri === trackQueue[0]) return
  })
  if (!accessToken) return null
  
  getCurrentlyPlaying();

  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={trackUri}
    />
    
  )
}
