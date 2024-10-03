# Project Management with Gist export

## Overview

This project allows users to manage multiple projects and their associated tasks. The application provides functionality for creating, updating, managing tasks, and exporting project summaries as secret gists on GitHub. It is built using Vue.js, Express.js, and MySQL.

Try out the app here:
https://gist-export-project-management.vercel.app/

Test Credentials:
Username: Alex
Password: Alex

## Features

1. **Project Management**:
   - Create new projects.
   - List all projects.
   - View project details (editable project title).

2. **Task Management**:
   - Add, Edit, Update, and Delete tasks within a project.
   - Mark tasks as pending or completed.

3. **Export Project Summary**:
   - Export the project summary as a GitHub secret gist in Markdown format.
   - The gist format includes:
     - Project title as the heading.
     - A summary of the number of completed vs total tasks.
     - A section for pending tasks with unchecked boxes.
     - A section for completed tasks with checked boxes.

4. **Authentication**:
   - Basic authentication for user login.

## Tech Stack

- **Frontend**: Vue.js, Vuex State Management, Vue Router
- **Backend**: Express.js (Node.js)
- **Database**: MySQL

## Setup Instructions

### Prerequisites
- Node.js (v12+)
- MySQL Server
- Git
- A GitHub personal access token for exporting gists.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/project-management-app.git
   ```

2. Install dependencies:
   ```bash
   cd project-management-app
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:3000`.

### Configuration

1. Create a `.env` file in the root directory.
2. Add the following environment variables:
   ```bash
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=project_management
   ```

### GitHub Gist Configuration

1. Generate a GitHub personal access token with the necessary permissions.
2. Store the token in the `.env` file:
   ```bash
   GITHUB_TOKEN=your_github_token
   ```

### Running the Application

1. Start the backend server:
   ```bash
   node app.js
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:port`.
