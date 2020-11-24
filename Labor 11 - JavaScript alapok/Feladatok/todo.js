function Todo(name, state, idx) {
    this.name = name;
    this.state = state;
    this.idx = idx;
}

var todos = [];
var states = ["active", "inactive", "done"];
var tabs = ["all"].concat(states);
var currentIdx = 0;

var form = document.getElementById("new-todo-form");
var input = document.getElementById("new-todo-title");

function saveTodos() {
    var jsonItem = JSON.stringify(todos);
    localStorage.setItem("todos", jsonItem);
    console.log("saved: \n");
    console.log(jsonItem);
}

function loadTodos() {
    var jsonItem = localStorage.getItem("todos");
    todos = JSON.parse(jsonItem);
    console.log("loaded: \n");
    console.log(jsonItem);
}

if ("todos" in localStorage) {
    loadTodos();
    console.log("van todo");
}

form.onsubmit = function (event) {
    event.preventDefault(); // meggátoljuk az alapértelmezett működést, ami frissítené az oldalt
    if (input.value && input.value.length) { // ha érvényes érték van benne
        todos.push(new Todo(input.value, "active", currentIdx)); // új to-do-t aktív állapotban hozunk létre
        input.value = ""; // kiürítjük az inputot
        currentIdx++;
        renderTodos();
    }
}

function Button(action, icon, type, title) {
    this.action = action; // a művelet, amit a gomb végez
    this.icon = icon; // a FontAwesome ikon neve (class="fas fa-*")
    this.type = type; // a gomb Bootstrapbeni típusa ("secondary", "danger" stb.)
    this.title = title; // a gomb tooltip szövege
}

var buttons = [ // a gombokat reprezentáló modell objektumok tömbje
    new Button("done", "check", "success", "Mark as done"),
    new Button("active", "plus", "secondary", "Mark as active"),
    // az objektumot dinamikusan is kezelhetjük, ekkor nem a konstruktorral példányosítjuk:
    { action: "inactive", icon: "minus", type: "secondary", title: "Mark as inactive" },
    new Button("remove", "trash", "danger", "Remove"),
    new Button("up", "arrow-up", "secondary", "Move todo up"),
    new Button("down", "arrow-down", "secondary", "Move todo down"),
];

function renderTodos() {
    saveTodos();
    var todoList = document.getElementById("todo-list"); // megkeressük a konténert, ahová az elemeket tesszük
    todoList.innerHTML = ""; // a jelenleg a DOM-ban levő to-do elemeket töröljük

    var filtered = todos.filter(function (todo) { return todo.state === currentTab || currentTab === "all"; });
    filtered.forEach(function (todo) { // bejárjuk a jelenlegi todo elemeket (alternatív, funkcionális bejárással)
        var item = document.createElement("a"); // az elemet tároló <a>
        item.className = "list-group-item col";
        item.href = "#";
        item.innerHTML = todo.name;

        var buttonContainer = document.createElement("div"); // a gombok tárolója
        buttonContainer.className = "btn-group";

        buttons.forEach(function (button) { // a gomb modellek alapján legyártjuk a DOM gombokat
            if (currentTab === "all") {
                var btn = document.createElement("button"); // <button>
                btn.className = "btn btn-outline-" + button.type + " fas fa-" + button.icon;
                btn.title = button.title;
                if (todo.state === button.action) // azt a gombot letiljuk, amilyen állapotban van egy elem
                    btn.disabled = true;
                if (todo.idx == 0 && button.action === "up")
                    btn.disabled = true;
                if (todo.idx == (todos.length - 1) && button.action === "down")
                    btn.disabled = true;

                btn.onclick = button.action === "remove"
                    ? function () { // klikk eseményre megerősítés után eltávolítjuk a to-do-t
                        if (confirm("Are you sure you want to delete the todo titled '" + todo.name + "'?")) {
                            todos.splice(todos.indexOf(todo), 1); // kiveszünk a 'todo'-adik elemtől 1 elemet a todos tömbből
                            renderTodos();
                        }
                    }
                    : function () { // klikk eseményre beállítjuk a to-do állapotát a gomb által reprezentált állapotra
                        if (button.action === "done" || button.action === "active" || button.action === "inactive") {
                            todo.state = button.action;
                            renderTodos();
                        } else if (currentTab === "all") {
                            if (button.action === "up") {
                                var todoidx = todo.idx
                                var swap = todos[todoidx];
                                todos[todoidx] = todos[todoidx - 1];
                                todos[todoidx - 1] = swap;
                                todos[todoidx - 1].idx--;
                                todos[todoidx].idx++;
                            } else if (button.action === "down") {
                                var todoidx = todo.idx
                                var swap = todos[todoidx];
                                todos[todoidx] = todos[todoidx + 1];
                                todos[todoidx + 1] = swap;
                                todos[todoidx + 1].idx++;
                                todos[todoidx].idx--;
                            }
                            renderTodos();
                        }
                    }

                buttonContainer.appendChild(btn); // a <div>-be tesszük a gombot
            } else {
                if (button.action === "remove" || button.action === "done" || button.action === "active" || button.action === "inactive") {

                    var btn = document.createElement("button"); // <button>
                    btn.className = "btn btn-outline-" + button.type + " fas fa-" + button.icon;
                    btn.title = button.title;
                    if (todo.state === button.action) // azt a gombot letiljuk, amilyen állapotban van egy elem
                        btn.disabled = true;

                    btn.onclick = button.action === "remove"
                        ? function () { // klikk eseményre megerősítés után eltávolítjuk a to-do-t
                            if (confirm("Are you sure you want to delete the todo titled '" + todo.name + "'?")) {
                                todos.splice(todos.indexOf(todo), 1); // kiveszünk a 'todo'-adik elemtől 1 elemet a todos tömbből
                                renderTodos();
                            }
                        }
                        : function () { // klikk eseményre beállítjuk a to-do állapotát a gomb által reprezentált állapotra
                            if (button.action === "done" || button.action === "active" || button.action === "inactive") {
                                todo.state = button.action;
                                renderTodos();
                            }
                        }

                    buttonContainer.appendChild(btn); // a <div>-be tesszük a gombot
                }
            }
        });

        var row = document.createElement("div"); // a külső konténer <div>, amibe összefogjuk az elemet és a műveletek gombjait
        row.className = "row";
        row.appendChild(item); // a sorhoz hozzáadjuk az <a>-t
        row.appendChild(buttonContainer); // és a gombokat tartalmazó <div>-et

        todoList.appendChild(row); // az összeállított HTML-t a DOM-ban levő #todo-list elemhez fűzzük
    });

    document.querySelector(".todo-tab[data-tab-name='all'] .badge").innerHTML = todos.length || "";

    for (var state of states)
        document.querySelector(".todo-tab[data-tab-name='" + state + "'] .badge").innerHTML = todos.filter(function (t) { return t.state === state; }).length || "";
}

renderTodos(); // kezdeti állapot kirajzolása

var currentTab; // a jelenleg kiválasztott fül

function selectTab(type) {
    currentTab = type; // eltároljuk a jelenlegi fül értéket
    for (var tab of document.getElementsByClassName("todo-tab")) {
        tab.classList.remove("active");// az összes fülről levesszük az .active osztályt
        if (tab.getAttribute("data-tab-name") == type)
            tab.classList.add("active");
    }

    renderTodos();
}

selectTab("all");