//  function getstoredtasks() {
//     const tasks = localStorage.getItem('tasks')
//     return tasks ? JSON.parse(tasks) : [];
// } 
// function saveTaskToStorage(tasks) {
//     localStorage.setItem('tasks', JSON.stringify(tasks))
//     console.log(tasks)
const todoform = document.getElementById("todo-form")
const listinput = document.getElementById("listitem");
const btn = document.getElementById('addbtn')
const itemlist = document.getElementById('todolist')


const STORAGE_KEY = "todos";

function getInitialTodos() {
    const temp = localStorage.getItem(STORAGE_KEY);
    const savedTodos = JSON.parse(temp);
    return savedTodos || [];
}

let todos = getInitialTodos();
let editingid = null

function savedTodos() {
    const temp = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, temp); 
}

function generateid(){
    if(typeof crypto !== "undefined" && crypto.randomUUID){
        return crypto.randomUUID()
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}


function additems(title) {
    const newtodo = {
        id: generateid(),
        title,
        completed: false
    } 
    todos = [...todos, newtodo]
    console.log(todos)
    savedTodos()
    render()
}

function handlechange(id) {
    todos = todos.map((todo) => (todo.id === id ? {
        ...todo, completed: !todo.completed
    } : todo));
    savedTodos();
    render();
}

function delTodo(id) {
   console.log(id)
   todos = todos.filter((todo) => todo.id !== id);
   savedTodos()
   render()
}

function setupdate(updatedTitle, id){
    todos = todos.map((todo) => (todo.id === id ? {...todo, title: updatedTitle} : todo));
    savedTodos()
}

function render() {
    itemlist.innerHTML = todos
    .map((todo) => {
        const { id, title, completed } = todo
        const isEditing = editingid === id;

        const completedStyle = completed ? 'style="font-style: italic; color: #595959; opacity: 0.4; text-decoration: line-through;"'
        : "";

        return `
        <li class="item" data-id="${id}" style="margin-bottom: 10px;">
           <div class="view-mode" style="${editingid === id ? "display:none;" : ""} display:flex; justify-content: space-between; align-items:center;">
             <div style="display:flex; gap: 15px;">
               <input type="checkbox" class="checkbox" ${completed ? "checked" : ""} />
               <span ${completedStyle}>${escapeHTML(title)}</span>
             </div>

            <div>
                <button type="button" class="delete-btn" aria-label="Delete todo"><i class="fa-solid fa-trash faTrash"></i>
                </button>
              </div>

            </div>
          
          
            <input
              type="text"
              class="text-input edit-input" 
              style = "${isEditing ? "" : "display:none;"}"
              value="${escapeHTML(title)}"
              />
          </div>
        </li>`;
    })
    .join("");

    if (editingid) {
        const activeLi = itemlist.querySelector(`li[data-id="${editingid}"]`);
        const input = activeLi && activeLi.querySelector(".edit-input");
        if (input) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        }
    }
}


todoform.addEventListener("submit", (e) => {
    e.preventDefault()
    const title = listinput.value.trim()
    if(title){
        console.log(title)
        additems(title)
        listinput.value = ""; 
    }else{
        alert("please enter an item")
    }
})

itemlist.addEventListener("click", (e) => {
    const li = e.target.closest(".item");
    if (!li) return;
    const id = li.dataset.id;

    if (e.target.matches(".checkbox")) {
        handlechange(id);
    }

    if (e.target.closest(".delete-btn")) {
        delTodo(id);
    }
});

itemlist.addEventListener("dblclick", (e) => {
    const li = e.target.closest(".item");
    if (!li) return;
    if (!e.target.closest(".view-mode")) return;

    editingid = li.dataset.id
    render()
})  

itemlist.addEventListener("input", (e) => {
    if (!e.target.matches(".edit-input")) return;
    const li = e.target.closest(".item");
    if (!li) return;
    setupdate(e.target.value, li.dataset.id);
})

itemlist.addEventListener("keydown", (e) => {
    if (!e.target.matches('.edit-input')) return;
    if (e.key === "Enter") {
        editingid = null;
        render()
    }
})

  render()



// function addTask() {
//     const taskText = listinput.value.trim(); 
//      console.log('clicked')
//     // Prevent adding empty tasks        validation
//     if (taskText === "") {                    
//         alert("Please enter a task!");
//         return;
//     }
//     // const newtask = {id: Date.now(), text: taskText};
//     // // const tasks = getstoredtasks();
//     // const localstore = tasks.push(newtask)
//     // saveTaskToStorage(localstore)
//     // Create the HTML elements for the new item
//     const li = document.createElement('li');
//     const checkbox = document.createElement('input');
//     checkbox.type = 'checkbox';
    
//     const taskTextSpan = document.createElement("span");
//     taskTextSpan.textContent = taskText

//     checkbox.addEventListener('change', function(){
//         if (checkbox.checked) {
//             taskTextSpan.style.textDecoration = 'line-through';
//         }else{
//             taskTextSpan.classList.remove('line-through', 'text-grey-400')
//         }
        
//     })
//     // Create text node for the task description
//     const textNode = document.createTextNode(taskText);
//     li.appendChild(textNode)

//     // Create a delete button for the task
//     const deleteBtn = document.createElement('deletebtn');
//     deleteBtn.innerHTML  = '<i class="fa-solid fa-trash"></i>';
//     deleteBtn.classList.add('delete-btn');
    
//     // Add delete functionality to the button
//     deleteBtn.addEventListener('click', function() {
//         todolist.removeChild(li);
//     });

//     // Append delete button to list item, and item to the container
//     li.appendChild(checkbox); 
//     li.appendChild(textNode);
//     li.appendChild(deleteBtn);
   
//     todolist.appendChild(li);
//     // Clear input field for the next task
//     listinput.value = "";
// } 

// // 3. Trigger addTask on button click
// addbtn.addEventListener('click', addTask);

// // 4. Allow pressing "Enter" key to add a task as well
// listinput.addEventListener('keypress', function(e) {
//     if (e.key === 'Enter') {
//         addTask();
//     }
// });