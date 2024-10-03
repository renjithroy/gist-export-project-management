<!-- CREATE/UPDATE/DELETE TODO -->
<template>
    <div class="todo-container">
        <div class="todo-card">
            <button @click="$router.go(-1)" class="icon-button back-button">
                <i class="fas fa-arrow-left"></i>
            </button>
            <button @click="exportAsGist" class="btn export-button" id="export-gist">
                <i class="fas fa-file-export" style="padding-right: 7px;"></i> Export Summary
            </button>
            <h2 class="project-title">{{ project.title }}</h2>
            <h2 class="todo-title">Add New Task</h2>
            <!-- Add/Edit Todo Form -->
            <form @submit.prevent="handleSubmit" class="todo-form">
                <textarea v-model="todo.description" placeholder="What needs to be done?" class="todo-textarea"
                    required></textarea>
                <button type="submit" class="todo-button">
                    {{ isEditing ? 'Update Todo' : 'Add Todo' }}
                </button>
            </form>

            <!-- Todo List -->
            <ul class="todo-list">
                <li v-for="item in todos" :key="item.id" class="todo-item">
                    <div class="todo-item-content">
                        <input type="checkbox" :checked="item.status === 'complete'"
                            @change="updateTodoStatus(item.id, item.status)" style="display: inline-block;" />
                        <p :class="{ 'completed': item.status === 'complete' }" class="todo-item-description"
                            style="display: inline-block; padding-left: 10px;">
                            {{ item.description }}
                        </p>
                    </div>
                    <div class="todo-item-actions">
                        <button @click="editTodo(item)" class="todo-action-button edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button @click="deleteTodo(item.id)" class="todo-action-button delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            todos: [],
            todo: { id: null, description: '', status: 'pending' },
            isEditing: false,
            project: {}
        };
    },
    methods: {
        handleSubmit() {
            if (this.isEditing) {
                // UPDATE TODO
                axios.put(`https://gist-export-project-management.onrender.com/api/todos/${this.todo.id}`,
                    {
                        description: this.todo.description,
                        status: this.todo.status
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.token}`
                        }
                    })
                    .then((response) => {
                        console.log('Todo updated:', response.data);
                        const index = this.todos.findIndex(t => t.id === this.todo.id);
                        console.log('edit ', index)
                        if (index !== -1) {
                            this.todos[index] = { ...this.todo };
                        }
                    })
                    .catch((error) => {
                        console.error('Error updating todo:', error);
                    })
                    .finally(() => {
                        this.resetForm();
                    })
            } else {
                // CREATE NEW TODO
                axios.post('https://gist-export-project-management.onrender.com/api/todos',
                    {
                        description: this.todo.description,
                        status: this.todo.status,
                        projectId: this.project.id
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.token}`
                        }
                    })
                    .then((response) => {
                        console.log('Todo added:', response.data);
                        this.todos.push(response.data);
                    })
                    .catch((error) => {
                        console.error('Error adding todo:', error);
                    })
                    .finally(() => {
                        this.resetForm();
                    })
            }

        },
        fetchTodos() {
            axios.get(`https://gist-export-project-management.onrender.com/api/todos?projectId=${this.project.id}`, {
                headers: {
                    Authorization: `Bearer ${this.$store.state.token}`
                }
            })
                .then((response) => {
                    console.log(response.data)
                    this.todos = response.data;
                })
                .catch((error) => {
                    console.error('Error fetching todos:', error);
                })
        },
        editTodo(item) {
            Object.assign(this.todo, item);
            this.isEditing = true;
        },
        deleteTodo(id) {
            if (confirm('Are you sure you want to delete this todo?')) {
                axios.delete(`https://gist-export-project-management.onrender.com/api/todos/${id}`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`
                    }
                })
                    .then(() => {
                        this.todos = this.todos.filter(t => t.id !== id);
                    })
                    .catch((error) => {
                        console.error('Error deleting todo:', error);
                    });
            }
        },
        resetForm() {
            this.todo = { id: null, description: '', status: 'pending' };
            this.isEditing = false;
        },
        updateTodoStatus(todoId, currentStatus) {
            console.log("updateTodoStatus(todoId) ", todoId)
            const newStatus = currentStatus === 'complete' ? 'pending' : 'complete';
            axios.patch(`https://gist-export-project-management.onrender.com/api/todos/${todoId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`
                    }
                })
                .then((response) => {
                    console.log('Todo status updated:', response.data);
                    const index = this.todos.findIndex(t => t.id === todoId);
                    if (index !== -1) {
                        this.todos[index].status = newStatus;
                    }
                })
                .catch((error) => {
                    console.error('Error updating todo status:', error);
                });
        },
        exportAsGist() {
            axios.get(`https://gist-export-project-management.onrender.com/api/export/${this.project.id}`, {
                headers: {
                    Authorization: `Bearer ${this.$store.state.token}`
                }
            })
                .then((response) => {
                    console.log('Gist created:', response.data);
                    window.location.href = response.data.gistUrl;
                })
                .catch((error) => {
                    console.error('Error creating Gist:', error.response.data.error);
                    this.$toast.error(error.response.data.error);
                });
        }
    },
    mounted() {
        this.project = JSON.parse(atob(this.$route.query.project));
        console.log(this.project);
        this.fetchTodos();
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

  .todo-container {
    /* min-height: 100vh; */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    margin-top: 2rem;
    font-family: "Montserrat", sans-serif;
  }
  
  .todo-card {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    padding: 30px;
    width: 100%;
    max-width: 500px;
    position: relative;
  }

  .icon-button {
    position: absolute;
    top: 10px;
    background: #42b983;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }
  
  .icon-button:hover {
    background-color: #3aa876;
  }

  .back-button {
    left: 10px;
  }

.export-button {
    position: absolute; 
    top: 10px; 
    right: 10px; 
  }
  
  .export-button:hover {
    background-color: #3aa876;
  }

  .btn {
    background: #42b983;
    border: none;
    cursor: pointer;
    font-size: 13px;
    color: white;
    padding: 6px 12px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
  }

  .btn:hover {
    background-color: #3aa876;
  }

  .todo-title {
    font-size: 22px;
    font-weight: 500;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .todo-form {
    margin-bottom: 20px;
  }
  
  .todo-input,
  .todo-textarea {
    width: 95%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
  }
  
  .todo-textarea {
    height: 100px;
    resize: vertical;
  }
  
  .todo-button {
    width: 100%;
    padding: 12px;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.3s ease;
  }
  
  .todo-button:hover {
    opacity: 0.9;
  }
  
  .todo-list {
    list-style-type: none;
    padding: 0;
  }
  
  .todo-item {
    background-color: #f8f9fa;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .todo-item-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin: 0 0 5px 0;
  }
  
  .todo-item-description {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
  
  .todo-item-actions {
    display: flex;
    gap: 10px;
  }
  
  .todo-action-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    transition: color 0.3s ease;
  }
  
  .todo-action-button.edit {
    color: #4299e1;
  }
  
  .todo-action-button.edit:hover {
    color: #2b6cb0;
  }
  
  .todo-action-button.delete {
    color: #f56565;
  }
  
  .todo-action-button.delete:hover {
    color: #c53030;
  }

  .completed {
    text-decoration: line-through;
    color: #999;
  }
  
  .project-title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}
</style>