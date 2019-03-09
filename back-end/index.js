const express = require('express');
const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');

const moderator_routes = require('./routes/moderators_routes');
const user_routes = require('./routes/user_routes');
const booking_routes = require('./routes/booking_routes');
const offers_routes = require('./routes/offers_routes');
const price_routes = require('./routes/price_routes');

const auth = require('./utilities/auth');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use('/users', user_routes);
app.use('/bookings',booking_routes);
app.use('/moderators', moderator_routes);
app.use('/offers', offers_routes);
app.use('/price',price_routes);




app.get('/', function(req, res) {
    res.send('hello');
})

app.get('/checkAuth', auth, (req, res) => {

    return res.status(200);
});

app.listen(5005, () => {
    console.log("Server for venue-finder is get activated");
})
