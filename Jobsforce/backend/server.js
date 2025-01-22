const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Set up multer for file uploads
const upload = multer({ dest: path.join(__dirname, "uploads/") });

// API endpoint for PDF extraction
app.post("/extract", upload.single("pdf"), (req, res) => {
    const pythonPath = "python3"; // Use the correct Python path
    const pythonProcess = spawn(pythonPath, [
        path.join(__dirname, "extract.py"),
        req.file.path,
    ]);

    pythonProcess.stdout.on("data", (data) => {
        try {
            const result = JSON.parse(data.toString());
            res.json(result);
        } catch (err) {
            console.error("Error parsing Python output:", err.message);
            res.status(500).send("Error processing PDF");
        }
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error("Python stderr:", data.toString());
        res.status(500).send("Error processing PDF");
    });

    pythonProcess.on("error", (err) => {
        console.error("Failed to start Python process:", err.message);
        res.status(500).send("Python execution error");
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
