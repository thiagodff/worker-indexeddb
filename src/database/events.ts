const eventData = [
  { ssn: '0', name: 'Bill', age: 35, email: 'bill@company.com' },
];

export let db: IDBDatabase;
const request = indexedDB.open('event_database', 1);

request.onerror = () => {
  console.error(`Database error: ${request.error}`);
};

request.onsuccess = (event) => {
  console.log('Success to create database')
  db = (event.target as IDBOpenDBRequest).result;
};

request.onupgradeneeded = (event) => {
  const db = (event.target as IDBOpenDBRequest).result;

  const objectStore = db.createObjectStore('events', { keyPath: 'ssn' });

  objectStore.createIndex('name', 'name', { unique: false });
  objectStore.createIndex('email', 'email', { unique: true });

  objectStore.transaction.oncomplete = () => {
    const customerObjectStore = db
      .transaction('events', 'readwrite')
      .objectStore('events');

      eventData.forEach((event) => {
        customerObjectStore.add(event);
      });
  };

  objectStore.getAll().onsuccess = (event) => {
    console.log({ event })
  }
};
