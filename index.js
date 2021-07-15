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
    db = request.result;
    displayData();
  }

  request.onupgradeneeded = function(e) {
    db = e.target.result;

  }
};

