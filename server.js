const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const filePath = 'data.json';

const app = express();
const port = 5050;

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());

//Development build
// app.get('/', (req, res) => {
//     res.status(200).send({ express: 'EXPRES BACKEND CONNECTED TO REACT' });
// });

//Productoin build
app.use(express.static(path.join(__dirname, './demoapp-toddle/build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './demoapp-toddle/build/index.html'));
});

app.post('/writejson', async (req, res, next) => {
    try {
        const content = JSON.stringify(req.body);
        // console.log('received data :', content);
        fs.writeFile(filePath, content, function (err, result) {
            if (err) console.log('fs writing error :', err);
        });
        return res.status(200).send({
            message: 'File written successfully!',
        });
    } catch (err) {
        throw new Error(`File writing failed because of ${err}`);
    }
});

app.get('/readjson', async (req, res, next) => {
    try {
        fs.readFile(filePath, (err, data) => {
            if (err) throw new Error(`error readFile : {err}`);
            let dataJson = JSON.parse(data);
            // console.log('read data : ', dataJson);
            return res.send(dataJson);
        });
    } catch (err) {
        throw new Error(`File reading failed because of ${err}`);
    }
});

app.use((req, res, next) => {
    res.status(404).send({ message: 'Could not find the specified route you requested!' });
});

app.listen(port, () => console.log(`listening on port ${port}`));
