const db = require("../config/db");

exports.createProject = async (req, res) => {
    try {
        const { title } = req.body;
        console.log("req.user.id" , req.user.id);
        const [result] = await db.execute('INSERT INTO projects (title, user_id) VALUES (?, ?)', [title, req.user.id]);
        const [createdProject] = await db.execute('SELECT * FROM projects WHERE id = ?', [result.insertId]);
        res.status(201).json(createdProject[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create project' });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const userId = req.user.id;
        // console.log("userId" , req.user.id);
        const [projects] = await db.execute('SELECT * FROM projects WHERE user_id = ? ORDER BY created_date DESC', [userId]);
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

exports.getProject = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("userId" , userId);
        const [project] = await db.execute('SELECT * FROM projects WHERE id = ? AND user_id = ?', [req.params.id, userId]);
        res.status(200).json(project[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { title } = req.body;
        await db.execute('UPDATE projects SET title = ? WHERE id = ?', [title, req.params.id]);
        res.json({ message: 'Project updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update project' });
    }
};

exports.deleteProject = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const projectId = req.params.id; // localhost:8008/api/todo/:id
        await connection.beginTransaction();
        await connection.execute('DELETE FROM todos WHERE project_id = ?', [projectId]);
        await connection.execute('DELETE FROM projects WHERE id = ?', [projectId]);
        await connection.commit();
        res.json({ message: 'Project deleted' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Failed to delete project' });
    } finally {
        connection.release();
    }
};