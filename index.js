const main = document.querySelector('main');
const notes = document.querySelector('.notes');
const lists = document.querySelector('ul');

const enterNote = document.querySelector('.enterNote');
const form = document.querySelector('form');
const title = document.querySelector('#title');
const text = document.querySelector('#text');
const btn = document.querySelector('button');

//database initialization
//db is an instance of object to store our database
let db;

window.onload = function() {

  //request opening a connetion to a database, open version 1 of a database called notes_db
  //then we need handlers for our opening result
  let request = window.indexedDB.open('notes_db', 1);

  request.onerror = function() {
    console.log('Database failed to open');
  }

  request.onsuccess = function() {
    console.log('Database opened successfully');

    //IDBRequest.result- returns the result of the request
    db = request.result;
    displayData();
  }

  //run if the database has not already been set up,or if the database is opened with a bigger version
  request.onupgradeneeded = function(e) {
    db = e.target.result;

    //create an objectStore to store our notes, store note_os inside db(our opened database)
    //objectSotre is basically like a single table
    //we can use keyPath property to uniquely identify individual records in the store, such as deleting or displaying a record
    let objectStore = db.createObjectStore('notes_os', {keyPath: 'id', autoIncreament:true});
    
    //IDBObjectStore.createIndex()- return a new IDBIndex object in the connected database
    //simple words: creates a new field/column(index) defining a new data point for each database record to contain
    //An index is kind of objectStore for looking up records in another objectStore
    objectStore.createIndex('title', 'title', {unique: false});
    objectStore.createIndex('body', 'body', {unique: false});

    console.log('Data setup complete');


  }
};

