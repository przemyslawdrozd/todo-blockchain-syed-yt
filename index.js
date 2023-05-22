require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.static(__dirname));
const fileUpload = require('express-fileupload');
app.use(fileUpload({extended: true}))
app.use(express.json());
const path = require('path');
const ethers = require('ethers');
const port = 3000;

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const { abi } = require('./artifacts/contracts/TaskToDo.sol/TaskToDo.json')

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
 
app.get('/', (res, req) => {
    res.sendFile(path.join(__dirname), "index.html");
})

app.get('/index.html', (res, req) => {
    res.sendFile(path.join(__dirname), "index.html");
})

app.post('/addTask', async (req, res) => {
    console.log('addTask', req.body)
    const task = req.body.task;

    if(!task) return res.send('Empty body task!')

    async function storeDataInBlockchain(task)  {
        console.log('addtask..', task);
        const tx = await contractInstance.addTask(task);
        await tx.wait();
    }
    await storeDataInBlockchain(task);
    res.send('Task has been registered in the smart contract');
});

app.post('/changeStatus', async (req, res) => {
    const id = req.body.id;

    async function storeDataInBlockchain(id)  {
        console.log('change task status..', id);
        const tx = await contractInstance.markAsFinished(id);
        await tx.wait();
    }
    await storeDataInBlockchain(id);
    res.send('Status has been changed in the smart contract');
});

app.listen(port, function() {
    console.log('App is running..', port);
})
