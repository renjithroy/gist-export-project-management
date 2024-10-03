const express = require("express");
const router = express.Router();

const todo = require("../controllers/todo");

router.route("/")
    .post(todo.createTodo)
    .get(todo.getTodosByProject)

router.route("/:id")
    .put(todo.updateTodo)
    .patch(todo.updateTodoStatus)
    .delete(todo.deleteTodo)
    
    
module.exports = router;