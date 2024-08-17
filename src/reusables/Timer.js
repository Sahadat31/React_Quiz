import { useEffect } from "react"

export default function Timer ({dispatch, secondsRemaining}) {
    useEffect(function(){
        const intervalId = setInterval(()=>dispatch({type:'tick'}),1000)
        return () => clearInterval(intervalId)
    },[dispatch])

    const mins = Math.floor(secondsRemaining/60)
    const sec = secondsRemaining%60
    return <div className="timer">{mins<10?'0'+mins:mins}:{sec<10?'0'+sec:sec}</div>
}