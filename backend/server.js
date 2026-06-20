const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 5000;
const SECRET_KEY = "my_fakestore_secret_key";

app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, "users.json");

function getUsers() {
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, "[]");
    }

    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data);
}

function saveUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    const users = getUsers();

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: Date.now(),
        name,
        email,
        password: hashedPassword
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({
        message: "Registration successful"
    });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const users = getUsers();

    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email
        },
        SECRET_KEY,
        {
            expiresIn: "1h"
        }
    );

    res.json({
        message: "Login successful",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied. Please login."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const verifiedUser = jwt.verify(token, SECRET_KEY);

        req.user = verifiedUser;

        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token. Please login again."
        });
    }
}

app.get("/products", verifyToken, async (req, res) => {
    try {
        const response = await axios.get(
            "https://fakestoreapi.com/products"
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            message: "Could not get products from Fake Store API"
        });
    }
});

app.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Protected profile route",
        user: req.user
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});