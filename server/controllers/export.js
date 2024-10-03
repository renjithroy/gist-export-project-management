const db = require("../config/db");
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

exports.exportProject = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const projectId = req.params.id;

        // Step 1: Fetch the project
        const [project] = await connection.execute('SELECT * FROM projects WHERE id = ?', [projectId]);
        if (project.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Step 2: Fetch todos related to the project
        const [todos] = await connection.execute('SELECT * FROM todos WHERE project_id = ?', [projectId]);
        if (!todos.length) {
            return res.status(404).json({ error: 'No todos found for this project' });
        }

        const projectTitle = project[0].title;

        // Step 3: Generate the markdown content
        const completedTodos = todos.filter(todo => todo.status === 'complete');
        const pendingTodos = todos.filter(todo => todo.status === 'pending');
        const summary = `${completedTodos.length} / ${todos.length} completed`;

        let pendingSectionMarkdown = "";
        let completedSectionMarkdown = "";
        pendingTodos.forEach(todo => {
            pendingSectionMarkdown += `- [ ] ${todo.description}\n`;
        });
        console.log(`Pending Todo: ${pendingSectionMarkdown}`);

        completedTodos.forEach(todo => {
            completedSectionMarkdown += `- [x] ${todo.description}\n`;
        });
        console.log(`Completed Todo: ${completedSectionMarkdown}`);


        const markdownContent = `# ${projectTitle}

#### Summary:
${summary}

### Pending:
${pendingSectionMarkdown || 'No pending todos'}

### Completed:
${completedSectionMarkdown || 'No completed todos'}
`;

        const gistUrl = await createGithubGist(markdownContent, projectTitle);
        res.status(200).json({ gistUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to export project as Gist' });
    } finally {
        connection.release();
    }
};

const createGithubGist = async (markdownContent, projectTitle) => {

    const githubToken = process.env.GITHUB_TOKEN;
    const gistData = {
        description: `Project summary for ${projectTitle}`,
        public: false,
        files: {
            [`${projectTitle}.md`]: {
                content: markdownContent
            }
        }
    };

    const gistResponse = await axios.post('https://api.github.com/gists', gistData, {
        headers: {
            Authorization: `token ${githubToken}`
        }
    });

    const gistUrl = gistResponse.data.html_url;
    console.log(`Gist Response: ${gistResponse.data}`);
    return gistUrl;
};
