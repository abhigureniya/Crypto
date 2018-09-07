var express = require('express');
var app = express();
var axios = require('axios');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const myInterceptor = axios.interceptors.response.use(function(response){
  return response;
}, function(error){
  return error;
});

//axios.interceptors.response.eject(myInterceptor);

app.get('/crypto/:country/:currency', function (req, res) {
    //res.send('Hello World ' + req.params.country + " - " + req.params.currency);
    //getIndianBitcoinData(res);
    //getIndianEthereumData(res);
    switch(req.params.country){

      case 'inr': 
      console.log("Fetching INR");
        switch(req.params.currency){
          case 'eth':
            console.log("Fetching eth");
            getIndianData(res, req.params.currency, 1);
            break;
          case 'eos':
            console.log("Fetching eth");
            getIndianData(res, req.params.currency, 6);
            break;
          case 'trx':
            console.log("Fetching eth");
            getIndianData(res, req.params.currency, 7);
            break;
          case 'btc':
          console.log("Fetching btc");
            getIndianData(res, req.params.currency, 0);
            break;
          case 'ltc':
            console.log("Fetching XRP");
            getIndianData(res, req.params.currency, 11);
            break;
          case 'xrp':
            console.log("Fetching XRP");
            getIndianData(res, req.params.currency, 2);
            break;
          default:
            break;
        }
        break;
      case 'won': 
        console.log("Fetching WON");
        getKoreanData(res, req.params.currency);
        
      break;
      case 'usd': 
        console.log("Fetching usd");
        getAmericanData(res, req.params.currency);
        
      break;
        default: res.send('Hello World ' + req.params.country + " - " + req.params.currency);

    }
    //getIndianRippleData(res);
    //console.log(req.params);
 });
 
 var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 });

 var indian_bitcoin = [];
 var korean_bitcoin = [];
 var american_bitcoin = [];


 function getKoreanData(res, commodity){
  var apis = [
      'https://api.bithumb.com/public/ticker/'+commodity,
      'https://api.korbit.co.kr/v1/ticker/detailed?currency_pair='+commodity+'_krw'
  ];

  //console.log(new Date());
  axios.all([
      axios.get(apis[0]),
      axios.get(apis[1])
    ]).then(axios.spread((response1, response2) => {
      console.log("Didn't got called");
      korean_bitcoin = [];
      korean_bitcoin.push({"exchange" : "BitThumb", "currency": "₩(KRW)","buy":response1.data.data.buy_price,"sell":response1.data.data.sell_price});
      if(commodity!='trx' && commodity!='eos'){
        korean_bitcoin.push({"exchange" : "Korbit", "currency": "₩(KRW)","buy":response2.data.ask,"sell":response2.data.bid});
        //console.log(response2);
      }
      //console.log(response1.data);
      res.send(korean_bitcoin);
    })).catch(error => {
      //console.log(error);
      res.send(korean_bitcoin);
    });

}

function getAmericanData(res, commodity){
  var apis = [
      'https://api.bitfinex.com/v2/tickers?symbols=t'+commodity.toUpperCase()+'USD'
  ];

  //console.log(new Date());
  axios.all([
      axios.get(apis[0])
    ]).then(axios.spread((response1) => {
      american_bitcoin = [];
      american_bitcoin.push({"exchange" : "Bitfinex", "currency": "USD","buy":response1.data[0][3],"sell":response1.data[0][1]});
      console.log(response1.data[0]);
      res.send(american_bitcoin);
    })).catch(error => {
      console.log(error);
    });

}


function getIndianData(res, commodity, index){
  var apis = [
      "https://www.zebapi.com/api/v1/market/ticker-new/"+commodity+"/inr",
      "https://coindelta.com/api/v1/public/getticker/",
      "https://koinex.in/api/ticker",
      "https://www.buyucoin.com/api/v1.2/currency/"+commodity
  ];

  //console.log(new Date());
  axios.all([
      axios.get(apis[0]),
      axios.get(apis[1]),
      axios.get(apis[2]),
      axios.get(apis[3])
    ]).then(axios.spread((response1, response2, response3, response4) => {
      indian_bitcoin = [];
      indian_bitcoin.push({"exchange" : "Zebpay", "currency": response1.data.currency,"buy":response1.data.buy,"sell":response1.data.sell});
      
      if(commodity == 'ltc'){
        indian_bitcoin.push({"exchange" : "Coindelta", "currency": "usdt","buy":response2.data[index].Ask+"","sell":response2.data[index].Bid+""});
      }else{
        indian_bitcoin.push({"exchange" : "Coindelta", "currency": "inr","buy":response2.data[index].Ask+"","sell":response2.data[index].Bid+""});
      }
      
      switch(commodity){

        case 'btc':
          indian_bitcoin.push({"exchange" : "Koinex", "currency": "inr","buy":response3.data.stats.inr.BTC.lowest_ask,"sell":response3.data.stats.inr.BTC.highest_bid});
          break;
        case 'eth':
          indian_bitcoin.push({"exchange" : "Koinex", "currency": "inr","buy":response3.data.stats.inr.ETH.lowest_ask,"sell":response3.data.stats.inr.ETH.highest_bid});
          break;
        case 'xrp':
          indian_bitcoin.push({"exchange" : "Koinex", "currency": "inr","buy":response3.data.stats.inr.XRP.lowest_ask,"sell":response3.data.stats.inr.XRP.highest_bid});
          break;
        case 'ltc':
          indian_bitcoin.push({"exchange" : "Koinex", "currency": "inr","buy":response3.data.stats.inr.LTC.lowest_ask,"sell":response3.data.stats.inr.LTC.highest_bid});
          break;

      }

      if(response4.data.success == 'True'){
        indian_bitcoin.push({"exchange" : "Buyucoin", "currency": "inr","buy":response4.data.data.ask+"","sell":response4.data.data.bid+""});
      }

      //console.log(new Date());
      res.send(indian_bitcoin);
    })).catch(error => {
      //console.log(error);
    });

}