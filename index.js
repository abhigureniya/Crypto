var express = require('express');
var app = express();
var axios = require('axios');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/crypto/:country/:currency', function (req, res) {
    //res.send('Hello World ' + req.params.country + " - " + req.params.currency);
    getBitcoinApisData(res);
    //console.log(req.params);
 });
 
 var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 });

 var indian_bitcoin = [];

function getBitcoinApisData(res){
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
        indian_bitcoin = [];
        indian_bitcoin.push({"exchange" : "Zebpay", "currency": response1.data.currency,"buy":response1.data.buy,"sell":response1.data.sell});
        indian_bitcoin.push({"exchange" : "Coindelta", "currency": "inr","buy":response2.data[0].Ask,"sell":response2.data[0].Bid});
        indian_bitcoin.push({"exchange" : "Koinex", "currency": "inr","buy":response3.data.stats.inr.BTC.lowest_ask,"sell":response3.data.stats.inr.BTC.highest_bid});
        indian_bitcoin.push({"exchange" : "Buyucoin", "currency": "inr","buy":response4.data.data.ask,"sell":response4.data.data.bid});
        //console.log(new Date());
        res.send(indian_bitcoin);
      })).catch(error => {
        //console.log(error);
      });

}