const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const rp = require('request-promise');

let options, db, collection;

app.use(bodyParser.json())

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
  init();
})

app.get('/', function (req, res) {
  res.send('Hello World!')
  console.log(options);
  rp(options).
    then((repos)=>{
      console.log(repos);
    });
})

app.post('/repos/add', (req,res) => {
  // add a repo

  let body = req.body;
  let owner = body.owner;
  let repo = body.repo;
  let token = body.token; 
  console.log(owner,repo);  

  let options = setupWebHookOptions(owner,repo);
  console.log("firing http request",options);

  // rp(options)
  //   .then((response)=> {
  //     if (response.status === 201){
  //       console.log("Created hook!");
  //       console.log(response.body);
  //       res.send("success");
  //     }else{
  //       console.log("something happend!!");
  //       console.log(response.body);
  //       res.send("unsuccessful");
  //     }
  //   })
  //   .catch((err)=> {
  //     console.log("Error!!");
  //     console.log(err);
  //     res.send("Error!  ");
  //   })
})

setupWebHookOptions = (owner, repo, OAUTH) => {
  // set up options/config for creating webhook
  options = {
    method: 'POST',
    uri: 'https://api.github.com/repos/'+owner+'/'+repo+'/hooks',
    body: {
      name:'web',
      config: {
        url:  "https://pcmhkw1ned.execute-api.us-east-1.amazonaws.com/prod/WebHookEventCaller",
        content_type: "json"
      },
      events: [
        "push"
      ]
    },
    headers:{
      'User-Agent': 'HackUTAGitWatcher',
      'Authorization': "token "+OAUTH
    },
    json:true,
    active: true
  }
  return options;
}

init = () => {
  // set up request options
  options = {
    uri: 'https://api.github.com/users/kevin-chung/repos',
    qs: {
      // access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  // setup mongodb
  MongoClient.connect('mongodb://root:root@ds147034.mlab.com:47034/hackuta', function (err, database) {
    if (err) throw err
    console.log("connected");
    db = database;
    collection = db.collection('GitUsers');
  })

  options2 = {
    uri: 'https://api.github.com/repos/kevin-chung/HackUTAGitWatcher',

  }

}