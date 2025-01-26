const axios = require('axios');

const url = 'https://your-app-name.onrender.com';

const keepAlive = () => {
    axios.get(url)
        .then(response => {
            console.log('App is alive', response.status);
        })
        .catch(error => {
            console.log('Error pinging the app', error.message);
        });
};

setInterval(keepAlive, 300000);
