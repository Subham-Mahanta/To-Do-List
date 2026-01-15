        const todoInput = document.getElementById('todo-input');
        const addBtn = document.getElementById('add-btn');
        const todoList = document.getElementById('todo-list');

        let todos = {};

        function saveTodos() {
            const todosArray = [];
            for (const id in todos) {
                todosArray.push(todos[id]);
            }
            
            const todosJson = JSON.stringify(todosArray);
            const tempDiv = document.createElement('div');
            tempDiv.textContent = todosJson;
            window.todosData = tempDiv.textContent;
        }

        function loadTodos() {
            if (window.todosData) {
                try {
                    const todosArray = JSON.parse(window.todosData);
                    todos = {};
                    todosArray.forEach(todo => {
                        todos[todo.id] = todo;
                    });
                    renderTodos();
                } catch (e) {
                    console.error('Error loading todos');
                }
            }
        }

        function addTodo() {
            const text = todoInput.value.trim();
            if (text === '') return;

            const id = Date.now().toString();
            todos[id] = {
                id: id,
                text: text,
                completed: false
            };

            todoInput.value = '';
            saveTodos();
            renderTodos();
        }

        function deleteTodo(id) {
            delete todos[id];
            saveTodos();
            renderTodos();
        }

        function toggleTodo(id) {
            if (todos[id]) {
                todos[id].completed = !todos[id].completed;
                saveTodos();
                renderTodos();
            }
        }

        function editTodo(id, newText) {
            if (todos[id] && newText.trim() !== '') {
                todos[id].text = newText.trim();
                saveTodos();
                renderTodos();
            }
        }

        function renderTodos() {
            todoList.innerHTML = '';
            
            const todoArray = Object.values(todos);
            
            if (todoArray.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.textContent = 'No tasks yet. Add one to get started!';
                todoList.appendChild(emptyState);
                return;
            }

            todoArray.forEach(todo => {
                const li = document.createElement('li');
                li.className = 'todo-item' + (todo.completed ? ' completed' : '');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'todo-checkbox';
                checkbox.checked = todo.completed;
                checkbox.addEventListener('change', () => toggleTodo(todo.id));

                const span = document.createElement('span');
                span.className = 'todo-text';
                span.textContent = todo.text;
                
                span.addEventListener('dblclick', () => {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'todo-input-edit';
                    input.value = todo.text;
                    
                    const saveEdit = () => {
                        if (input.value.trim() !== '') {
                            editTodo(todo.id, input.value);
                        } else {
                            renderTodos();
                        }
                    };
                    
                    input.addEventListener('blur', saveEdit);
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            saveEdit();
                        }
                    });
                    
                    li.replaceChild(input, span);
                    input.focus();
                    input.select();
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(deleteBtn);
                todoList.appendChild(li);
            });
        }

        addBtn.addEventListener('click', addTodo);
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        loadTodos();