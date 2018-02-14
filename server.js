const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const port = 8000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'tata',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

mongoose.connect("mongodb://localhost/QuotingDojo");
mongoose.Promise = global.Promise;

let QuoteSchema = new mongoose.Schema({
    name: {
        type: String,
        requited: [true, "Name cannot be blank or less than three letters"],
        minlength: [3, "Name must have more than three letters"]
    },
    quote: {
        type: String,
        maxlength: 255
    }
}, { timestamps: true });

mongoose.model('Quote', QuoteSchema);

let Quote = mongoose.model('Quote');


app.get('/', (req, res) => {
    res.render('home');
});
app.get('/show', (req, res) => {
    Quote.find({}, (err, results) => {
        if (err) { console.log(err); }
        res.render('quotes', { quotes: results });
    })
});

app.post('/quotes', (req, res) => {
    console.log("Post Data", req.body);
    var quote = new Quote({ name: req.body.name, quote: req.body.quote });
    quote.save(function (err) {
        if (err) {
            console.log('Something Went Wrong');
        } else {
            console.log('Successfully added Quote');
            res.redirect('/show')
        }
    })
});

app.listen( port, () => console.log(`Running on ${port}.....`));