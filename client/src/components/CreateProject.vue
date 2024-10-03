<template>
  <modal name="create-project" height="auto" width="400">
    <div class="modal-overlay">
      <div class="modal-content" @click.stop>
        <h2 v-if="projectToEdit.id">Edit Project</h2>
        <h2 v-else>Create Project</h2>
        <form @submit.prevent="submitProject" class="form-container">
          <div class="form-group">
            <label for="title">Project Title:</label>
            <input placeholder="Medical Pharma Application" v-model="newProject.title" type="text" id="title" required
              class="form-control" />
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button v-if="projectToEdit.id" type="submit" class="btn btn-primary">Save</button>
            <button v-else type="submit" class="btn btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  </modal>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CreateProject',
  data() {
    return {
      newProject: {
        title: '',
      }
    }
  },
  props: {
    projectToEdit: {
      type: Object,
      default: Object
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    submitProject() {
      const token = this.$store.state.token;
      if (!token) return;

      if (this.projectToEdit.id) {
        this.updateProject();
      } else {
        this.createProject();
      }

    },
    updateProject() {
      const token = this.$store.state.token;
      axios.put(`https://gist-export-project-management.onrender.com/api/projects/${this.projectToEdit.id}`, this.newProject, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          this.$emit('project-updated', this.newProject.title);
          this.$toast.success('Project updated successfully!');
          this.closeModal();
        })
        .catch((error) => {
          console.error(error);
          this.$toast.error('Error updating project:', error);
        });
    },
    createProject() {
      const token = this.$store.state.token;
      axios.post('https://gist-export-project-management.onrender.com/api/projects', this.newProject, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          // emit details to update projec list
          console.log("project added", response);
          this.$emit('project-added', response.data);
          this.$toast.success('Project created successfully!');
          // reset fields on next opening
          this.newProject = {
            title: ''
          };
          this.closeModal();
        })
        .catch((error) => {
          console.error(error);
          this.$toast.error('Error creating project:', error);
        });
    }
  },
  watch: {
    projectToEdit() {
      this.newProject = {
        title: this.projectToEdit.title
      };
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.modal-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-family: "Montserrat", sans-serif;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
}

.form-container {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.form-group {
  margin-bottom: 45px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  /* font-weight: bold; */
}

.form-control {
  width: 70%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-primary:hover {
  background-color: #38a169;
}

.btn-secondary {
  background-color: #ccc;
  color: black;
}

.btn-secondary:hover {
  background-color: #bbb;
}
</style>