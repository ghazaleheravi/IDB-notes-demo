// refrences to our html elements

//const section = document.querySelector('.notes');
const lists = document.querySelector('ul');
const form = document.querySelector('form');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const btn = document.querySelector('form button');

// database initialization
// db is an instance of object to store our database
let db;

window.onload = function() {
  // request opening a connetion to a database, open version 1 of a database called notes_db
  // then we need handlers for our opening result
  let request = window.indexedDB.open('notes_db', 1);

  // onerror handler signifies that database didn't open
  request.onerror = function() {
    console.log('Database failed to open');
  };

  // onsuccess handler signifies that database opened successfully
  request.onsuccess = function() {
    console.log('Database opened successfully');

    // IDBRequest.result- returns the result of the request
    // store the opened database object in the db variable
    db = request.result;

    // this function display the notes already in the database
    displayData();
  };

  // run if the database has not already been set up,or if the database is opened with a bigger version
  request.onupgradeneeded = function(e) {
    let db = e.target.result;     //???? why already have db vaiable why new one?

    //create an objectStore to store our notes, store note_os inside db(our opened database)
    //objectSotre is basically like a single table
    //we can use keyPath property to uniquely identify individual records in the store, such as deleting or displaying a record
    let objectStore = db.createObjectStore('notes_os', {keyPath: 'id', autoIncrement:true});
    
    // IDBObjectStore.createIndex()- return a new IDBIndex object in the connected database
    // simple words: define what data items the objectStore will contain
    // An index is kind of objectStore for looking up records in another objectStore
    objectStore.createIndex('title', 'title', {unique: false});
    objectStore.createIndex('body', 'body', {unique: false});

    console.log('Data setup complete');
  };

    form.onsubmit = addData;

    function addData(e) {
      // we won't want the form to submit in the conventional
      e.preventDefault();

      var newItem = { title: titleInput.value,body: bodyInput.value };

      // all reading and writing of data is done within transactions
      // open a read/write db transaction, ready for adding the data
      // storeName declaration can be array of stings or just string or if you need all objectStores in DB-
      // IDBDatabase.objectStoreNames
      let transaction = db.transaction(['notes_os'], 'readwrite');

      // call an objectStore that's already been added to the database
      let objectStore = transaction.objectStore('notes_os');

      // make a request to add our newItem object to the objectStore
      var request = objectStore.add(newItem);

      request.onsuccess = function() {
        title.value = '';
        text.value = '';
      };

      transaction.oncomplete = function() {
        console.log('transaction completed: Database modification finished.');

        displayData();
      };

      transaction.onerror = function() {
        console.log('Transaction not opened due to error.');
      };
    }

    function displayData() {
      // Here we empty the contents of the list element each time the display is updated
      // If you ddn't do this, you'd get duplicates listed each time a new note is added
      while (lists.firstChild) {
        lists.removeChild(lists.firstChild);
      }

      // Open our object store and then get a cursor - which iterates through all the
      // different data items in the store
      let objectStore = db.transaction('notes_os').objectStore('notes_os');
      objectStore.openCursor().onsuccess = function(e) {
        let cursor = e.target.result;

        if (cursor) {
          const listItem = document.createElement('li');
          const h3 = document.createElement('h3');
          const para = document.createElement('p');

          listItem.appendChild(h3);
          listItem.appendChild(para);
          lists.appendChild(listItem);
          //section.appendChild(lists);
          //body.document.appendChild(section);
        
          h3.textContent = cursor.value.title;
          para.textConetent = cursor.value.body;

          listItem.setAttribute('data-note-id', cursor.value.id);

          const deleteBtn = document.createElement('button');
          listItem.appendChild(deleteBtn);
          deleteBtn.textConeten = 'Delete';

          deleteBtn.onclick = deleteItem;

          cursor.continue();
        } else {

          if (!lists.firstChild) {
            const listItem = document.createElement('li');
            listItem.textConeten = 'No notes stored.';
            lists.appendChild(listItem);
          }

          console.log('Notes all displayed');
        }
      };
    }

      function deleteItem(e) {
          let noteId = Number(e.target.parentNode.getAttribute('data-note-id'));

          let transaction = db.transaction(['notes_os'], 'readwrite');
          let objectStore = transaction.objectStore('notes_os');
          let request = objectStore.delete(noteId);

          transaction.oncomplete = function() {
            e.target.parentNode.removeChild(e.target.parentNode);
            console.log('Note' + noteId + 'deleted.');
            
            if (!lists.firstChild) {
              let listItem = document.createElement('li');
              listItem.textContent = 'No notes stored.';
              lists.appendChild(listItem);
            }
          };

        }


      };
 


