var database;
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
if (!window.indexedDB) {
    alert("Sorry!Your browser doesn't support IndexedDB");
}
function init(){
var request = window.indexedDB.open("notepad",1);
request.onerror = function(event) {
console.log(event.target.errorCode);
};
request.onsuccess = function(event) {
  database=request.result;
  showNotes();
};
request.onupgradeneeded = function(event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("notes", { keyPath: "id",autoIncrement:true});
};
}
function createNote(id){
document.getElementById("editor").style.display="block";
document.getElementById("editor").focus();
document.getElementById("back").style.display="block";
document.getElementById("add").style.display="none";
document.getElementById("notes").style.display="none";
if(parseInt(id)!=0){
database.transaction("notes").objectStore("notes").get(parseInt(id)).onsuccess = function(event) {
  document.getElementById("editor").innerHTML=event.target.result.body;
  document.getElementById("flag").value=id;
};
}
}
function goBack(){
var note={};
note.body=document.getElementById("editor").innerHTML;
note.title=getTitle(note.body);
note.date=getDate();
var flag=parseInt(document.getElementById("flag").value);
if(flag!=0)
note.id=flag;
if(note.title.trim()==="")
window.location.href="index.html";
else
addNote(note);
}
function getDate(){
var date=new Date();
var month=parseInt(date.getMonth())+1;
return date.getDate()+"/"+month+"/"+date.getFullYear();
}
function getTitle(body){
var body = body.replace(/(<([^>]+)>)/ig,"");
if(body.length > 20) body = body.substring(0,20)+". . .";
return body;
}
function addNote(note){
var transaction = database.transaction(["notes"], "readwrite");
var objectStore = transaction.objectStore("notes");
var request=objectStore.put(note);
request.onsuccess = function(event) {
  document.getElementById("flag").value="0";
  window.location.href="index.html";
};
}
function showNotes(){
var notes="";
var objectStore = database.transaction("notes").objectStore("notes");
objectStore.openCursor().onsuccess = function(event) {
  var cursor = event.target.result;
  if (cursor) {
    var link="<a class=\"notelist\" id=\""+cursor.key+"\" href=\"#\">"+cursor.value.title+"</a>"+" <img class=\"delete\" src=\"images/delete.png\" height=\"30px\" id=\""+cursor.key+"\"/>";
    var listItem="<li>"+link+"</li>";
	notes=notes+listItem;
    cursor.continue();
  }
  else
  {
   document.getElementById("notes").innerHTML="<ul>"+notes+"</ul>";
   registerEdit();
   registerDelete();
  }
};
}
function deleteNote(id){
var request = database.transaction(["notes"], "readwrite")
                .objectStore("notes")
                .delete(id);
request.onsuccess = function(event) {
window.location.href="index.html";
};

}
function registerEdit(){
var elements = document.getElementsByClassName('notelist');
for(var i = 0, len = elements.length; i < len; i++) {
    elements[i].onclick = function (e) {
		createNote(this.id);
    }
}
}
function registerDelete(){
var deleteButtons = document.getElementsByClassName('delete');
  for(var i = 0, len = deleteButtons.length; i < len; i++){
    deleteButtons[i].onclick=function(e){
	deleteNote(parseInt(this.id));
	}
  }
}
window.addEventListener("DOMContentLoaded", init, false);