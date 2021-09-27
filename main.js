var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

currDateTag = document.getElementById("currDate"); 
var today = document.createTextNode(mm + '/' + dd + '/' + yyyy);

currDateTag.appendChild(today);

function validateTextInput(input){
    if (input == "" || input.length > 100){ 
        return false; 
    }  	
    return true; 
}


var app = new Vue ({
    el: '#todos',
    data: {
        todos: [],
        done: [],
        todoText: "",
        currentToDo: "",
        todosSize: 0,
        doneSize: 0,
        modalIsActive: false
    },
    methods: {
        addTodo() {
            if(validateTextInput(this.todoText)){
                this.todos = [...this.todos, this.todoText];
                //this.todos.push();
                localStorage.setItem('todos', JSON.stringify(this.todos));

                this.todoText = "";
            }else{
                alert("Escreva algo.");
            }
            
        },
        checked(event, todo){
            conf = confirm("Mark as done?");
            if (conf){
                //colocar isto em um método separado
                var getLocalStorage = JSON.parse(localStorage.getItem("todos"));
                var index = this.todos.indexOf(todo);

                //remove from localStorage
                getLocalStorage.splice(index, 1);
                localStorage.setItem('todos', JSON.stringify(getLocalStorage));

                //manda para a lista de done
                this.done = [...this.done, todo];
                localStorage.setItem('done', JSON.stringify(this.done));
            }else{
                event.target.checked = false;
            }
        },
        editToDo(todo){
            this.modalIsActive = true;
            this.currentToDo = todo;

            document.getElementById("editTodoInput").value = this.currentToDo;
        },
        saveChanges(){
            const editedTodo = document.getElementById("editTodoInput").value;
            if(this.currentToDo === editedTodo){
                alert("No changes needed.");
                this.modalIsActive = false;
            }else{
                var getLocalStorage = JSON.parse(localStorage.getItem("todos"));
                var index = this.todos.indexOf(this.currentToDo);

                this.todos.splice(index, 1);
                this.todoText = editedTodo;
                this.addTodo();
                this.modalIsActive = false;
            }
        },
        deleteTodo(todo){
            var conf = confirm("Tem certeza que deseja deletar? Ação irreverssível.");
            if (conf){
                var getLocalStorage = JSON.parse(localStorage.getItem("todos"));
                var index = this.todos.indexOf(todo);

                //remove from localStorage
                getLocalStorage.splice(index, 1);
                localStorage.setItem('todos', JSON.stringify(getLocalStorage));
            }
        },
        unMarkUndone(done){
            var conf = confirm("Marcar como undone?");
            if (conf){
                var getLocalStorage = JSON.parse(localStorage.getItem("done"));
                var index = this.done.indexOf(done);

                //remove from localStorage
                getLocalStorage.splice(index, 1);
                localStorage.setItem('done', JSON.stringify(getLocalStorage));

                this.todoText = done;
                this.addTodo();
                this.todoText = "";
            }
        },
        removeModal($event){
            if ($event.target.classList.contains('edit-todo-div')) {
                this.modalIsActive = false;
                /*setStatusMessage(
                    {id: "error-modal", message: ""},
                    {id: "success-modal", message: ""}
                );*/
            }
        },
        clearDone(){
            this.done = [];
            localStorage.setItem('done', JSON.stringify(this.done));
        }
    },
    mounted () {
        setInterval(() => {
            const existingTodos = localStorage.getItem('todos');
            this.todos = JSON.parse(existingTodos) || [];
            this.todosSize = this.todos.length;

            const existingDone = localStorage.getItem('done');
            this.done = JSON.parse(existingDone) || [];

            this.doneSize = this.done.length;
        }, 1000);  
    }
  });