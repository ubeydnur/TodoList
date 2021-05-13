const form = document.querySelector('#todo-form')
const todoInput = document.querySelector('#todo')
const todoList = document.querySelector('#todo-list')
const firstCardBody = document.querySelector('#first-card-body')
const secondCardBody = document.querySelector('#second-card-body')
const filter = document.querySelector('#filter')
const clearBtn = document.querySelector('#clear-todos')

eventListeners()

function eventListeners() {
    form.addEventListener('submit', addTodo)
    document.addEventListener('DOMContentLoaded', loadAllTodosToUI)
    secondCardBody.addEventListener('click', deleteTodo)
    filter.addEventListener('keyup', filterTodos)
    clearBtn.addEventListener('click', clearAllTodos)
}

function addTodo(e) {
    const newTodo = todoInput.value.trim()

    if (newTodo == "") {
        showAlert("danger", "Please enter a new todo !!")
    } else {
        addTodoToUI(newTodo)
        addTodoToStorage(newTodo)
        showAlert("success", "Added a new todo")
    }

    e.preventDefault()
}

function deleteTodo(e) {
    if (e.target.className === 'fa fa-remove') {
        e.target.parentElement.parentElement.remove()

        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent)

        showAlert("warning", "Deleted todo")
    }
}

function deleteTodoFromStorage(deletetodo) {
    let todos = getTodosFromStorage()

    todos.forEach(function (todo, index) {
        if (todo === deletetodo) {
            todos.splice(index, 1)//Arrayden degeri silebiliriz
        }
    })

    localStorage.setItem("todos", JSON.stringify(todos))
}

function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase()
    const listItems = document.querySelectorAll('.list-group-item')

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase()

        if (text.indexOf(filterValue) == -1) {
            // listItem.classList.add('d-none')
            listItem.setAttribute("style", 'display : none !important')
        } else {
            // listItem.classList.add('d-block')
            listItem.setAttribute("style", 'display : block !important')
        }
    })
}

function clearAllTodos() {
    if (confirm("Are you sure you want to clear all")) {
        //Arayüzden todoları temizleme
        // todoList.innerHTML = "" //Yavaş yöntem

        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild)
        }
        localStorage.removeItem("todos")
    }
}

function loadAllTodosToUI() {//Sayfa yenilendiğinde localStorage deki veriler listelere ekleniyor
    let todos = getTodosFromStorage()

    todos.forEach(function (todo) {
        addTodoToUI(todo);
    })
}

function addTodoToUI(newTodo) {//Aldığı String degerini list item olarak UI'ya ekleyecek

    const listItem = document.createElement('li');
    const link = document.createElement('a');

    link.href = '#'
    link.className = 'delete-item'
    link.innerHTML = `<i class="fa fa-remove"></i>`

    listItem.className = 'list-group-item d-flex justify-content-between'
    listItem.appendChild(document.createTextNode(newTodo))

    listItem.appendChild(link)
    todoList.appendChild(listItem)

    todoInput.value = ""
}

function addTodoToStorage(newTodo) {//Aldığı String degeri localStorage a ekliyor
    let todos = getTodosFromStorage()

    todos.push(newTodo)

    localStorage.setItem('todos', JSON.stringify(todos))
}

function getTodosFromStorage() {//localStorageden tüm Todoları alacak
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"))
    }

    return todos;
}

function showAlert(type, message) {//alert messages
    const alert = document.createElement("div")

    alert.className = `alert alert-${type} text-center`
    alert.textContent = message

    firstCardBody.appendChild(alert)

    setTimeout(function () {
        alert.remove();
    }, 2000)
}
