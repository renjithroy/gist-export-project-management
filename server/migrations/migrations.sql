CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    description TEXT NOT NULL,
    status ENUM('pending', 'complete') DEFAULT 'pending',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Insert data into 'users' table
INSERT INTO users (username, password) VALUES 
('johndoe', 'password123'),
('janedoe', 'securepass'),
('admin', 'adminpass');

-- Insert data into 'projects' table
INSERT INTO projects (title, user_id) VALUES
('Personal ToDo List', 1),   -- Project created by 'johndoe'
('Work Tasks', 2),           -- Project created by 'janedoe'
('Household Chores', 1),     -- Another project by 'johndoe'
('Team Project', 3);         -- Project created by 'admin'

-- Insert data into 'todos' table
INSERT INTO todos (project_id, description, status) VALUES
(1, 'Buy groceries', 'pending'),                   -- Pending task in 'Personal ToDo List'
(1, 'Finish reading a book', 'complete'),          -- Completed task in 'Personal ToDo List'
(1, 'Plan weekend trip', 'pending'),               -- Another pending task for 'Personal ToDo List'

(2, 'Complete project report', 'pending'),         -- Task for 'Work Tasks'
(2, 'Send email to client', 'complete'),           -- Completed task in 'Work Tasks'
(2, 'Prepare for meeting', 'pending'),             -- Another task in 'Work Tasks'

(3, 'Clean the kitchen', 'complete'),              -- Completed task in 'Household Chores'
(3, 'Do laundry', 'pending'),                      -- Pending task in 'Household Chores'
(3, 'Water the plants', 'complete'),               -- Another completed task in 'Household Chores'

(4, 'Assign team roles', 'complete'),              -- Completed task in 'Team Project'
(4, 'Schedule weekly meeting', 'pending'),         -- Pending task in 'Team Project'
(4, 'Prepare project presentation', 'pending');    -- Another pending task in 'Team Project'
