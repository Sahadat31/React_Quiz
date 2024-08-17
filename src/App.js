import { useEffect, useReducer } from 'react'
import Header from './components/Header'
import Main from './components/Main'
import Loader from './reusables/Loader'
import Error from './reusables/Error'
import StartScreen from './components/StartScreen'
import Question from './components/Question'
import NextButton from './components/NextButton'
import ProgressBar from './components/ProgressBar'
import FinishedScreen from './components/FinishedScreen'
import Footer from './components/Footer'
import Timer from './reusables/Timer'

const initialState = {
  questions: [],
  // status -> loading / active / error / ready / finished
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highestScore: 0,
  secondsRemaining: null
}

const SEC_PER_QUES = 30
const reducer = (state, action) => {
  switch(action.type) {
    case 'dataReceived':
      return {...state, questions: action.payload, status: 'ready'}
    case 'dataFailed':
      return {...state, status: 'error'}
    case 'start':
      return {...state, status: 'active', secondsRemaining: state.questions.length*SEC_PER_QUES}
    case 'newAnswer':
      const question = state.questions.at(state.index)
      return {...state, 
        answer: action.payload,
        points: question.correctOption === action.payload ? state.points + question.points : state.points 
      }
    case 'nextQuestion':
      return {...state, index: state.index+1, answer: null}
    case 'finished':
      return {...state, answer: null, status: 'finished', highestScore: state.points > state.highestScore ? state.points : state.highestScore}
    case 'restart':
      return {...initialState, questions: state.questions, status: 'ready'}
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining -1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
        highestScore: state.secondsRemaining === 0 ? (state.points > state.highestScore ? state.points : state.highestScore) : state.highestScore
      }
    default:
      throw new Error('Unknown action type')
  }
}
export default function App() {

  const [{questions, status, index, answer, points, highestScore, secondsRemaining}, dispatch] = useReducer(reducer, initialState)

  useEffect(function(){
    const fetchQuestion = async () => {
      try {
        const res = await fetch('http://localhost:8000/questions')
        const data = await res.json()
        dispatch({type: 'dataReceived', payload: data})
      } catch {
        dispatch({type: 'dataFailed'})
      }
    }
    fetchQuestion()
  },[])

  const numOfQuestions = questions.length
  const maxPoints = questions.reduce((prev,curr)=> prev+curr.points,0)

  return <div className="app">
    <Header/>
    <Main>
      {status==='loading' && <Loader/>}
      {status==='error' && <Error/>}
      {status==='ready' && <StartScreen num={numOfQuestions} dispatch={dispatch}/>}
      {status === 'active' && 
        <>
          <ProgressBar index={index+1} numOfQuestions={questions.length} points={points} maxPoints={maxPoints} answer={answer}/>
          <Question question={questions[index]} dispatch={dispatch} answer={answer}/>
          <Footer>
            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
            {(answer !== null) && <NextButton lastQuestion={index===questions.length-1} dispatch={dispatch}/>}  
          </Footer>
        </>
      }
      {status === 'finished' && <FinishedScreen points={points} maxPoints={maxPoints} highestScore={highestScore} dispatch={dispatch}/>}
    </Main>
  </div>
}