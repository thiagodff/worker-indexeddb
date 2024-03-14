import { db } from "../database/events"

onmessage = () => {
  console.log("Worker: Message received from main script")

  let sum = 0
  for (let i = 0; i < 5000000000; i++) {
    sum += i
  }

  const store = db.transaction('events', "readwrite").objectStore('events');
  store.getAll().onsuccess = (event) => {
    console.log({ event_db_from_worker: (event.target as IDBOpenDBRequest).result })
  }

  postMessage(41 + sum ** 0)
}
