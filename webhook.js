const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const apiaiApp = require('apiai')('75e0eff5013249f69e55f079f62de263');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'nav bot cool') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

function sendMessage(event) {
    let sender = event.sender.id;
  let text = event.message.text;

  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'tabby_cat' // use any arbitrary id
  });

  apiai.on('response', (response) => {
    // Got a response from api.ai. Let's POST to Facebook Messenger
  });

  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
    

    
apiai.on('response', (response) => {
  let aiText = response.result.fulfillment.speech;

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: 'EAADXvR3gS8UBAGnFyw0f4awTpdJk8vLTFNaXr5tHtqYZC0ZAk8FpTsfONntTkHmkbDo8W55zO05PtGFvR9ZBSCOAtIjg8ZBD57ZBbLYSPC9hBEgH5IccbharM1cZCuyicuu79ID88dJu5H1yIPdv0nVVPZA9X2ngQboHLGrqXHx2QZDZD'},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: {text: aiText}
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
    });
 });
//  let sender = event.sender.id;
//  let text = event.message.text;
//  let text = 'Hold on, i am working on it.';
//
//  request({
//    url: 'https://graph.facebook.com/v2.6/me/messages',
//    qs: {access_token: 'EAADXvR3gS8UBAGnFyw0f4awTpdJk8vLTFNaXr5tHtqYZC0ZAk8FpTsfONntTkHmkbDo8W55zO05PtGFvR9ZBSCOAtIjg8ZBD57ZBbLYSPC9hBEgH5IccbharM1cZCuyicuu79ID88dJu5H1yIPdv0nVVPZA9X2ngQboHLGrqXHx2QZDZD'},
//    method: 'POST',
//    json: {
//      recipient: {id: sender},
//      message: {text: text}
//    }
//  }, function (error, response) {
//    if (error) {
//        console.log('Error sending message: ', error);
//    } else if (response.body.error) {
//        console.log('Error: ', response.body.error);
//    }
//  });
}

