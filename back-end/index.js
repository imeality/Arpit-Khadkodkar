const express = require('express');
const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');

//const admin_routes = require('./routes/admin_routes');
const moderator_routes = require('./routes/moderators_routes');
const user_routes = require('./routes/user_routes');
const booking_routes = require('./routes/booking_routes');
const offers_routes = require('./routes/offers_routes');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/users', user_routes);
app.use('/bookings',booking_routes);
// app.use('/admin', admin_routes);
app.use('/moderators', moderator_routes);
app.use('/offers', offers_routes);

app.use(cors());



app.get('/', function(req, res) {
    res.send('hello');
})


app.listen(5000, () => {
    console.log("Server for venue-finder is get activated");
})
