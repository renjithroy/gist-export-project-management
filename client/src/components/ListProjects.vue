<template>
    <div class="projects-container">
        <div class="project-header">
            <h1>Project Dashboard</h1>
            <button v-if="isAuthenticated" class="create-project-button" @click="openCreateProjectModal">
                <font-awesome-icon :icon="['fas', 'folder-plus']" /> Create Project
            </button>
        </div>
        <div v-if="projects.length && isAuthenticated">
            <div v-for="project in projects" :key="project.id + project.title" class="project-card">
                <h2 @click="toggleTodoMode(project)" style="cursor: pointer;">{{ project.title }}</h2>
                <font-awesome-icon :icon="['fas', 'tasks']" @click="toggleTodoMode(project)" style="cursor: pointer; margin-left: auto;" />
                <font-awesome-icon :icon="['fas', 'pen-to-square']" @click="editProject(project.id)" style="cursor: pointer; margin-left: 2rem;" />
                <font-awesome-icon :icon="['fas', 'trash-can']" @click="deleteProject(project.id)" style="cursor: pointer; margin-left: 2rem; color: #e53e3e;" />
            </div>
        </div>
        <div v-else-if="isAuthenticated" style="text-align: center;">
            <p>No projects available.</p>
        </div>
        <div v-else-if="!isAuthenticated" style="text-align: center;">
            <p>Please login to view your projects.</p>
        </div>
        <create-project @close="closeModal" @project-added="addProject" @project-updated="updateProjectList"
            :projectToEdit="projectToEdit" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CreateProject from './CreateProject.vue';

export default {
    name: 'ListProjects',
    components: {
        FontAwesomeIcon,
        CreateProject
    },
    data() {
        return {
            projects: [],
            projectToEdit: {},
            projectForTodo: {}
        }
    },
    computed: {
        ...mapGetters(['isAuthenticated']),
    },
    methods: {
        fetchProjects() {
            const token = this.$store.state.token;

            if (!token) return;

            axios.get('https://gist-export-project-management.onrender.com/api/projects', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    this.projects = response.data;
                })
                .catch((error) => {
                    this.$toast.error('Sorry, could not fetch projects:', error);
                })
        },
        addProject(newProject) {
            this.projects.unshift(newProject);
        },
        editProject(projectId) {
            console.log("edit ",projectId);
            this.projectToEdit = this.projects.find(project => project.id == projectId);
            console.log("projecttoedit ",this.projectToEdit);
            this.openCreateProjectModal();
        },
        openCreateProjectModal() {
            // this.projectToEdit = {};
            this.$modal.show('create-project');
        },
        closeModal() {
            this.$modal.hide('create-project');
            this.projectToEdit = {};
        },
        updateProjectList(updatedProject) {
            const index = this.projects.findIndex(project => project.id == this.projectToEdit.id);
            this.projects[index].title = updatedProject;
        },
        toggleTodoMode(project) {
            this.projectForTodo = project;
            // console.log(this.projectForTodo);
            // base64 projectForTodo
            const base64ProjectForTodo = btoa(JSON.stringify(this.projectForTodo));
            this.$router.push(`/manage-todo?project=${base64ProjectForTodo}`);
        },
        deleteProject(projectId) {
            if (confirm('Are you sure you want to delete this project and associated todos?')) {
                axios.delete(`https://gist-export-project-management.onrender.com/api/projects/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`
                    }
                })
                .then((response) => {
                    console.log('Project deleted:', response.data);
                    this.projects = this.projects.filter(project => project.id !== projectId);
                    this.$toast.success('Project deleted successfully!');
                })
                .catch((error) => {
                    console.error('Error deleting project:', error);
                })
            }
        }
    },
    mounted() {
        this.fetchProjects();
    },
    watch: {
        isAuthenticated() {
            this.fetchProjects();
        }
    }
}
</script>

<style scoped>

.project-header {
    display: flex;
    justify-content: center;
    /* text-align: center; */
    align-items: center;
    position: relative;
    margin-bottom: 1rem;
}

.project-header button {
    position: absolute;
    right: 0;
}

.create-project-button {
    padding: 0.5rem 1rem;
    background-color: #42b983;  
    font-weight: 500;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.create-project-button .fa-folder-plus {
    margin-right: 0.3rem;
}

.create-project-button:hover {
    background-color: #38a169;
}

.projects-container {
    max-width: 800px;
    margin: auto;
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    /* margin-bottom: 2rem; */
    font-size: 1.8rem;
    color: #333;
}

.project-card {
    background-color: #fff;
    padding: 1.5rem;
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    margin-bottom: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.project-card h2 {
    /* margin: 0 0 1rem; */
    font-size: 1.2rem;
    font-weight: 400;
    color: #42b983;
}

.project-card p {
    margin: 0;
    font-size: 1rem;
    color: #666;
}
</style>