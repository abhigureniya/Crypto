var express = require('express');
var app = express();
var axios = require('axios');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/crypto/:country/:currency', function (req, res) {
    res.send('Hello World ' + req.params.country + " - " + req.params.currency);
    getBitcoinApisData();
    //console.log(req.params);
 });
 
 var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 });

function getBitcoinApisData(){
    var apis = [
        "https://www.zebapi.com/api/v1/market/ticker-new/btc/inr",
        "https://coindelta.com/api/v1/public/getticker/",
        "https://koinex.in/api/ticker",
        "https://www.buyucoin.com/api/v1.2/currency/btc"
    ];

    console.log(new Date());
    axios.all([
        axios.get(apis[0]),
        axios.get(apis[1]),
        axios.get(apis[2]),
        axios.get(apis[3])
      ]).then(axios.spread((response1, response2, response3, response4) => {
        console.log(response1.data);
        console.log(response2.data);
        console.log(response3.data);
        console.log(response4.data);
        console.log(new Date());
      })).catch(error => {
        //console.log(error);
      });

}