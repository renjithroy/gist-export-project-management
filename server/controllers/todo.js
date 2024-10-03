const db = require("../config/db");

exports.createTodo = async (req, res) => {
    const { description, projectId } = req.body;
    try {
        const [result] = await db.query('INSERT INTO todos (description, project_id) VALUES (?, ?)', [description, projectId]);
        res.status(201).json({ id: result.insertId, description, status: 'pending' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create todo' });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { description, status } = req.body;
        await db.query('UPDATE todos SET description = ?, status = ? WHERE id = ?', [description, status, req.params.id]);
        res.json({ message: 'Todo updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
};

exports.updateTodoStatus = async (req, res) => {
    try {
        const { status } = req.body;
        console.log("status",status)
        console.log("req.params.todoId",req.params)
        // let status = isCompleted ? 'complete' : 'pending';
        await db.query('UPDATE todos SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Todo updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        console.log("req.query.id" , req.params.id);
        await db.query('DELETE FROM todos WHERE id = ?', [req.params.id]);
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
};

exports.getTodosByProject = async (req, res) => {
    try {
        // console.log("req.params.project_id" , req.query);
        const [todos] = await db.query('SELECT * FROM todos WHERE project_id = ?', [req.query.projectId]);
        return res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
};
