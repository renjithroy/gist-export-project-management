const express = require('express');
const cors = require('cors');
const app = express();
// Enable CORS for all origins
app.use(cors());
const port = 3000;
const projectRoutes = require("./routes/project");
const todoRoutes  = require("./routes/todo");
const authRoutes  = require("./routes/auth");
const exportRoutes  = require("./routes/export");
const auth = require("./middleware/auth");

// Middleware to parse JSON requests
app.use(express.json());

app.use("/api/projects", auth, projectRoutes);
app.use("/api/todos", auth, todoRoutes);
app.use("/api/export", auth, exportRoutes);
app.use("/api/auth", authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});