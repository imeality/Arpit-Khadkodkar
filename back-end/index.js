const express = require('express');
const app = express();

const cors = require('cors');
var moment = require('moment');

const bodyParser = require('body-parser');

const moderator_routes = require('./routes/moderators_routes');
const user_routes = require('./routes/user_routes');
const booking_routes = require('./routes/booking_routes');
const offers_routes = require('./routes/offers_routes');
const price_routes = require('./routes/price_routes');
const admin_routes = require('./routes/admin_routes');
const payment_routes = require('./routes/payment_routes');
const enquiries_routes = require('./routes/enquiries_routes');
const venues_routes = require('./routes/venue_routes');

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
app.use('/admin',admin_routes);
app.use('/payments',payment_routes);
app.use('/enquiries',enquiries_routes);
app.use('/venues',venues_routes);
 
var date = require('./utilities/date');

// function print() {
//     var date = moment().format('L');
//     date = date.split("/");

//     var str = ""+date[2]+"-"+date[0]+"-"+date[1];
//     console.log(str);
// }
// print();

app.get('/', function(req, res) {
    res.send('hello');
})

app.get('/checkAuth', auth, (req, res) => {
     //console.log(" ========================================================================== =============================================================");
    return res.end();
});

app.listen(5005, () => {
    console.log("Server for venue-finder is get activated");
})
 