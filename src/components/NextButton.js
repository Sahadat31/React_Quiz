export default function NextButton ({dispatch,lastQuestion}) {
    return <button className="btn btn-ui" onClick={()=> lastQuestion ? dispatch({type: 'finished'}) : dispatch({type: 'nextQuestion'})}>
        {lastQuestion ? 'Finish' : 'Next'}
    </button>
}