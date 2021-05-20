import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import Player from "./Player"
import TrackSearchResult from "./TrackSearchResult"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"


function Todo({todo, index, removeTodo}){
  return(
    <div 
    style={{textDecoration: todo.isCompleted ? 'line-through' : ''}}
    className="todo">
      {todo.text}
    </div>
  )
}

const spotifyApi = new SpotifyWebApi({
  clientId: "03a9ec47c0894de1be08bf80cc159110",
})

export default function Dashboard({ code }) {

  const [todos, setTodos] = useState([]);

  const addTodo = text => {
    const newTodos = [...todos, {text}];
    setTodos(newTodos);
  };

  const removeTodo = index => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const accessToken = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [queue, setQueue] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [lyrics, setLyrics] = useState("")
  const [updatedQue, setUpdatedQue] = useState(false)
  const [duration, setDuration] = useState(0)
  const [songIndex, setSongIndex] = useState(0)

  function chooseTrack(track) {
    console.log("Track: ", track)
    setPlayingTrack(track)
    setSearch("")
    setLyrics("")
  }

  useEffect(() => {
    if (!playingTrack) return

    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then(res => {
        setLyrics(res.data.lyrics)
        setQueue(queue.concat(playingTrack))
        setDuration(playingTrack.duration)
        addTodo(playingTrack.title)
      })
  }, [playingTrack])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            track.album.images[0]
          )

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            duration: track.duration_ms,
            albumUrl: smallestAlbumImage.url,
          }
        })
      )
    })

    return () => (cancel = true)
  }, [search, accessToken])

  const handleCallback = (childData) =>{
    //setTimeout(function () {
    console.log("final array:", childData)
    if(songIndex===queue.length - 1) return
    if(childData.length !== queue.length - 1) return
    setQueue(childData)
    setUpdatedQue(true)
    //setSongIndex(songIndex+1)
    removeTodo(0)
  //}, 1400);
    
  }

  useEffect(() =>{
    if(!updatedQue) return
    setUpdatedQue(false)

  },[updatedQue])

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map(track => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        
      </div>
      <div className="todo-list">
        {todos.map((todo, index) => (
          <Todo 
          key={index} 
          index={index} 
          todo={todo} 
          removeTodo={removeTodo}/>
        ))}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={queue[0]?.uri} duration={duration} trackQueue={queue} parentCallback={handleCallback} songIndex={songIndex}/>
      </div>
    </Container>
  )
        }

