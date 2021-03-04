const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const https = require('https');

const app = express();

//set static folder
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('public'));

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public'));
});

app.post('/', (req, res) => { 
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var email = req.body.email;

    // console.log(firstName,lastName,email);

    var data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME:lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = 'https://us1.api.mailchimp.com/3.0/lists/9309e796db';

    const options = {
        method: 'POST',
        auth:'bettercallkyaw:b19f1826fc1b64117239a723d5365a03-us1'
    }

    const request = https.request(url, options, (response) => { 
        // response.on('data', (data) => { 
        //     console.log(JSON.parse(data));
        // });

        if (response.statusCode === 200) {
            res.sendFile(path.join(__dirname, 'public', 'success.html'));
        } else {
            res.sendFile(path.join(__dirname, 'public', 'fail.html'));
        }
    });

    request.write(jsonData);
    request.end();
});

app.post('/failure', (req, res) => { 
    res.redirect('/');
});
const PORT = process.env.PORT || 8000;

app.listen(8000, () => console.log(`server listen on port ${PORT}`));

//API Key
//b19f1826fc1b64117239a723d5365a03-us1