const bodyParser = require("body-parser");
const express = require("express");
const https = require("https");
const { post } = require("request");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/b65ae5b013";
    const option = {
        method: "post",
        auth: "franzo1:d295f535bab4c3b77d869d6993d528c9-us14"
    };

    const request = https.request(url, option, function(respond){
        
        if(respond.statusCode === 200){
            res.sendFile(__dirname+ "/success.html")
        }else{
            res.sendFile(__dirname+ "/failure.html")
        }

        respond.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("App is starting on port 3000");
})

// b65ae5b013
// 5555b8b84950fbf99b5055c4426c9059-us14