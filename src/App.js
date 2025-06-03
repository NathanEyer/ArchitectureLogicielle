import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const GAME_ID = 'acb3d101-814c-456c-8643-dc1ee8443905'

export default function App() {
  const [game, setGame] = useState(null)


  const fetchGame = async () => {
    const { data } = await supabase.from('games').select('*').eq('id', GAME_ID).single()
    setGame(data)
  }

  useEffect(()=>{
    fetchGame()
  },[])
  

  if(!game){return(<div>Chargement</div>)}

  return (
    <div>
      CONNECTED
    </div>
  )
}

