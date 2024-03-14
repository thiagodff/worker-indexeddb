import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Worker from './workers/worker?worker'
import { db } from './database/events'

const myWorker = new Worker();

function App() {
  const [count, setCount] = useState(1)
  const [process, setProcess] = useState(0)

  function handleSaveEvent() {
    const store = db.transaction('events', 'readwrite').objectStore('events');

    store.getAll().onsuccess = (event) => {
      console.log({ event_db_from_main_thread: (event.target as IDBOpenDBRequest).result })
    }

    setCount((count) => count + 1)
  }

  function handleHardProcess() {
    console.log('start hard process')

    myWorker.postMessage('start')

    myWorker.onmessage = (e) => {
      console.log({ eventResponse: e })
      setProcess(e.data)
      console.log('Message received from worker')
    }
  }

  return (
    <>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Count = {count}</h1>
      <div className='card'>
        <button onClick={handleSaveEvent}>
          count
        </button>
      </div>
      <h1>Hard process = {process}</h1>
      <div className='card'>
        <button onClick={handleHardProcess}>
          Make a hard process
        </button>
      </div>
    </>
  )
}

export default App
