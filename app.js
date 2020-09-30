// ****** SELECT ITEMS **********
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const groceryField = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********

//submit form
form.addEventListener("submit", addItem);
//clear items
clearBtn.addEventListener("click", clearItems);
// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ****** FUNCTIONS **********

function addItem(e){
    e.preventDefault();
    const inputValue = groceryField.value;
    const id = new Date().getTime().toString();
    if(inputValue && !editFlag){
        createListItem(id, inputValue);
        //display alert
        displayAlert("Item added to the list", "success");
        //show container
        container.classList.add("show-container");
        //add to local storage
        addToLocalStorage(id, inputValue);
        //set back to default
        setBackToDefault();
    }else if(inputValue && editFlag){
        editElement.innerHTML = inputValue;
        displayAlert("Value changed", "success");
        //edit local storage
        editLocalStorage(editID, inputValue);
        setBackToDefault();
    }else{
        displayAlert("please enter value", "danger");
    }
}

// display Alert
function displayAlert(text,action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    //remove alert
    setTimeout(function(){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 2500);
}

//clear items
function clearItems(){
    const clearListItems = document.querySelectorAll(".grocery-item");
    console.log(clearListItems);
    if (clearListItems.length > 0){
        clearListItems.forEach(function(listItems){
            console.log(listItems);
            list.removeChild(listItems);
        });
    }
    container.classList.remove("show-container");
    displayAlert("Your To-Do list is empty", "danger");
    setBackToDefault();
    localStorage.removeItem("todolist");
}

//delete function
function deleteItem(e){
    const delCurrentItem = e.currentTarget.parentElement.parentElement;
    const id = delCurrentItem.dataset.id;
    list.removeChild(delCurrentItem);
    if(list.children.length == 0){
        container.classList.remove("show-container");
    }
    displayAlert("Item removed", "danger");
    setBackToDefault();
    //remove from local storage
    removeFromLocalStorage(id);
}

//edit function
function editItem(e){
    const editCurrentItem = e.currentTarget.parentElement.parentElement;
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    //set form value
    groceryField.value = editElement.innerHTML;
    editFlag = true;
    editID = editCurrentItem.dataset.id;
    submitBtn.textContent = "edit";
}

// Set back to default
function setBackToDefault(){
    groceryField.value = "";
    editFlag = false; 
    editID = "";
    submitBtn.textContent = "submit";
};

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, inputValue){
    const grocery = {id, inputValue};
    let localItems = getLocalStorage();
    console.log(localItems);
    localItems.push(grocery);
    localStorage.setItem("todolist", JSON.stringify(localItems));
}
function removeFromLocalStorage(id){
    let localItems = getLocalStorage();
    localItems = localItems.filter(function(items){
        console.log(items);
        if (items.id !== id){
            return items;
        }
    });
    localStorage.setItem("todolist", JSON.stringify(localItems));
}
function editLocalStorage(id, inputValue){
    let localItems = getLocalStorage();
    localItems = localItems.map(function(item){
        console.log(item);
        if(item.id === id){
            item.inputValue = inputValue;
        }
        return item;
    });
    localStorage.setItem("todolist", JSON.stringify(localItems));
}
function getLocalStorage(){
    //todolist is a key name we can keep any name as we want
    return localStorage.getItem("todolist") ? JSON.parse(localStorage.getItem("todolist")) : [];
} 

// localStorage API
// setItem
// getItem
// removeItem
// save as strings
// localStorage.setItem("orange", JSON.stringify(["item", "item2"]));
// const oranges = JSON.parse(localStorage.getItem("oranges"));
// console.log(oranges);
// localStorage.removeItem("orange");

// ****** SETUP ITEMS **********
function setupItems() {
    let items = getLocalStorage();
  
    if (items.length > 0) {
      items.forEach(function (item) {
        createListItem(item.id, item.inputValue);
      });
      container.classList.add("show-container");
    }
  }
  
  function createListItem(id, inputValue) {
    const element = document.createElement("article");
    //add class
    element.classList.add("grocery-item");
    //add id
    const attr = document.createAttribute("data-id");
    attr.value = id;
    //console.log(attr.value);
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${inputValue}</p>
        <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
        </div>`;

    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);

    //append child
    list.appendChild(element);
  }