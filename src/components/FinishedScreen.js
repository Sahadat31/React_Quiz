export default function FinishedScreen ({points, maxPoints, highestScore, dispatch}) {
    const percent = (points/maxPoints) *100
    return(
        <>
            <p className="result">
                Congratulations! You have scored <strong>{points}</strong> out of {maxPoints} ({Math.ceil(percent)}%)
            </p>
            <p className="highscore">Highest Score : {highestScore}</p>
            <button className="btn btn-ui" onClick={()=> dispatch({type:'restart'})}>Restart Quiz</button>
        </>
    )
}