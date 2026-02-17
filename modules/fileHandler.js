const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../employees.json");

// Read file
async function read() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Read error:", err.message);
    return [];
  }
}

// Write file
async function write(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Write error:", err.message);
  }
}

module.exports = { read, write };
