import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.set("view engine", "ejs"); // Set EJS as the template engine

let posts = []; // Array to store blog posts

// Home Page
app.get("/", (req, res) => {
    res.render("home", { posts });
});

// Create Post Page
app.get("/create", (req, res) => {
    res.render("create");
});

// Handle Create Post
app.post("/create", (req, res) => {
    const { title, content } = req.body;
    posts.push({
        id: Date.now().toString(),
        title,
        content
    });
    res.redirect("/");
});

// Edit Post Page
app.get("/edit/:id", (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).send("Post not found.");
    res.render("edit", { post });
});

// Handle Edit Post
app.post("/edit/:id", (req, res) => {
    const { title, content } = req.body;
    const postIndex = posts.findIndex(p => p.id === req.params.id);
    if (postIndex !== -1) {
        posts[postIndex] = { ...posts[postIndex], title, content };
    }
    res.redirect("/");
});

// Delete Post
app.post("/delete/:id", (req, res) => {
    posts = posts.filter(p => p.id !== req.params.id);
    res.redirect("/");
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
