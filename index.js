// const fs = require("fs");
import fs from 'fs'
import express from 'express';
import { fileURLToPath } from 'url';

/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

async function fetchData(num) {
    return new Promise((res, rej) => {
        setTimeout(() => { res(`data for ${num}`) }, 0);
    })
}

async function dataToCatch() {
    for (let i = 0; i < 10; i++) {
        const data = await fetchData(i);
        console.log(data);
    }
}
/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
 * Print how long it took for all 3 promises to resolve.
 */
function fetchPromise() {

}

function waitForOneSecond() {
    return new Promise((res, rej) => {
        setTimeout(() => { res("Resolved") }, 1000);
    })
}
console.log(await waitForOneSecond());

function waitForTwoSecond() {
    return new Promise((res, rej) => {
        setTimeout(() => { res("Resolved") }, 2000);
    })
}

function waitForThreeSecond() {
    return new Promise((res, rej) => {
        setTimeout(() => { res("Resolved") }, 3000);
    })
}
let startTime = 0;
let endTime = 0;

async function checkAllPromises() {
    const date = new Date();
    startTime = date.getTime();
    const firstPromise = waitForOneSecond();
    const secondPromise = waitForTwoSecond();
    const threePromise = waitForThreeSecond();
    const data = await Promise.all([firstPromise, secondPromise, threePromise]);
    const newDate = new Date();
    endTime = newDate.getTime();
    console.log(data);
    calculateTime();
}

// checkAllPromises();
function calculateTime() {
    console.log("startTime ", startTime);
    console.log(endTime - startTime, "time taken")
}

/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Print out the time it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */
async function sequentiallyCallForPromise() {
    const date = new Date();
    const startTime = date.getTime();
    const firstPromise = new Promise((res, rej) => {
        setTimeout(() => { res("resolved using insider") }, 1000);
    });
    await firstPromise;
    const secondPromise = await waitForTwoSecond();
    const threePromise = await waitForThreeSecond();

    const newDate = new Date();
    const endTime = newDate.getTime();
    const data = Promise.all([firstPromise, secondPromise, threePromise]);
    console.log(data);
    console.log(endTime - startTime, " Time taken");

}
// sequentiallyCallForPromise();

/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files

  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */
const app = express();
app.use(express.json());
// dataToCatch();
function fetchDataFromFile(filename) {
    return new Promise((res, rej) => {
        fs.readFile(`./files/${filename}`, "utf-8", (err, data) => {
            if (err) {
                return err;
            }
            res(data);
        })
    })
}

function toGetAllFilesName() {
    return new Promise((res, rej) => {
        fs.readdir("./files", (err, files) => {
            if (err) {
                console.log("Error reading directory: ", err);
                return;
            }
            res(files)
        })
    })
}

app.get('/files', async (req, res) => {
    let newdata;
    newdata = await toGetAllFilesName();
    res.json({
        filesName: newdata
    })
})

app.get("/files/:filename", async (req, res) => {
    const filename = req.params.filename;
    const data = await fetchDataFromFile(filename);
    res.json({
        data: data
    })
})

app.listen(3000, () => {
    console.log("listening to the port", 3000);
})
// Filter function
let arr = [1, 2, 3, 4, 5];
const newArr = arr.filter((i, index) => {
    if (index != 3)
        return i;
})
console.log(newArr);

/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
class Todo {
    todoArr
    constructor(todoArr) {
        this.todoArr = todoArr;
    }
    getAllTodoList() {
        return this.todoArr;
    }
    getTodoById(index) {
        if (index >= this.todoArr.length) {
            return -1;
        }
        return this.todoArr[index]
    }
    addTodoItem(obj) {
        this.todoArr.push(obj);
    }
    updateExistingTodo(index, obj) {
        if (index >= this.todoArr.length) {
            return -1;
        }
        return this.todoArr[index] = obj
    }
    deleteTodoItem(deleteIndex) {
        if (deleteIndex >= this.todoArr.length) {
            return -1;
        }
        this.todoArr = this.todoArr.filter((value, index) => {
            if (index != deleteIndex)
                return value;
        })
        return this.todoArr
    }
}

const obj = new Todo([]);
app.get("/todos", (req, res) => {
    const todoArra = obj.getAllTodoList();
    res.json({
        items: todoArra
    })
})

app.post("/addTodo", (req, res) => {
    obj.addTodoItem(req.body);
    res.json({
        obj: req.body
    })
})

app.get("/todo/:id", (req, res) => {
    const index = req.params.id;
    const data = obj.getTodoById(index);
    if(data == -1){
        res.status(411).json({
            msg:"enter correct index"
        })
    }
    res.json({
        item: data
    })
})

app.delete("/todo/:id", (req, res) => {
    const index = req.params.id;
    const data = obj.deleteTodoItem(index);
    if(data == -1){
        res.status(411).json({
            msg:"enter correct index"
        })
    }
    res.json({
        item: data
    })
})

app.put("/todo/:id", (req, res) => {
    const index = req.params.id;
    const updatedData = req.body;
    const data = obj.updateExistingTodo(index, updatedData)
    if(data == -1){
        res.status(411).json({
            msg:"enter correct index"
        })
    }
    res.json({
        updatedData: data
    })
})