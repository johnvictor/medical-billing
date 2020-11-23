const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/patient-details', (req, res) => {
    fs.readFile("mock.json", 'utf-8', function(err, data) {
        if (err) {
            res.json([]);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/patient-details', (req, res) => {
    let data, jsonData;
    try {
        data = fs.readFileSync("mock.json", 'utf-8');
    } catch(e) {
        data = '[]';
    }

    jsonData = JSON.parse(data);
    jsonData.push({...req.body, uuid: uuidv4()});

    fs.writeFile("mock.json", JSON.stringify(jsonData), (err) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json({
                count:  jsonData.length
            });
        }
    });
});

app.post('/payment-details', (req, res) => {
    let data, jsonData;
    data = fs.readFileSync("mock.json", 'utf-8');

    jsonData = JSON.parse(data);
    const patient = jsonData.find(patient => patient.uuid === req.body.uuid);

    const paymentDetails = {...req.body.paymentDetail, paidDate: new Date()}

    if (patient.paymentDetails && patient.paymentDetails.length) {
        patient.paymentDetails.push(paymentDetails);
    } else {
        patient['paymentDetails'] = [paymentDetails]
    }

    fs.writeFile("mock.json", JSON.stringify(jsonData), (err) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(patient);
        }
    });
});

app.listen(PORT, () => {
    console.log('Server running in ' + PORT);
});