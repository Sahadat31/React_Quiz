export default function ProgressBar ({index, numOfQuestions, points, maxPoints,answer}) {
    return <header className="progress">
        <progress value={index+Number(answer!==null)} max={numOfQuestions}></progress>
        <p>Question: <strong>{index}</strong>/{numOfQuestions}</p>
        <p>Points: <strong>{points}</strong>/{maxPoints}</p>
    </header>
}