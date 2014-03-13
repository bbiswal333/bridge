var http = require('http'),
    nodeURL = require("url"),
    querystring = require('querystring'),
    WireAuthenticator = require("./WireAuthenticator"),
    Logger = require('./Logger').init('sapwire');
    Administrator = require('./main.js');

var URL = "https://testwire.hana.ondemand.com/api/1";

var chatRoomArray = [];
var availableChatRoomIDArray = [];
var roomConfigurationArray = [];
var roomIDMappingToBotID = [];
//var wildCardAnswersForGroupChat = ["Sorry, I am getting old. Please repeat it for old Alice!", "Could you repeat that, please?", "La la la la...Uh, sorry. Did you say something?","Next question!"];

//getmessages, postmessages and getrooms are wire api methods used for api calls to wire
var GET_ROOMS = {
    "function": "getchatrooms",
    "randomId": "",
    "source": "web"
};

var SapWire = function (){
    var self = this;

    var callback = function(loginCookie){

        console.log("LoginCookie: " + loginCookie);

        var isBotAdressed = function(message){
            if(message.indexOf('@Alice') > -1 || message.indexOf('@alice') > -1){
                return true;
            }
            else{
                return false;
            }
        };

        var removeBotNameAdressing = function(text){
            var modifiedText = text.replace('@Alice ', '');
            modifiedText = modifiedText.replace('@alice', '');

            return modifiedText;
        };

        var sendMessage = function (botID, text, cb) {
            var chatroomID = roomConfigurationArray[botID].roomID;

            var json = {
                "function": "postmessage",
                "type": "text",
                "randomId": "bot",
                "source": "web"
            };


            json.chatroom = chatroomID;
            json.msg = text;


            post(URL, json, function (data) {
                if (cb){
                    cb(data);
                }
            });
        };

        var getRooms = function (cb) {
            post(URL, GET_ROOMS, function (data) {
                cb(data);
            });
        };

        var getMessages = function (chatroom, lastmessageid, cb) {
            var json = {
                "function": "getmessages",
                "limit": "15",
                "previous": "false",
                "randomId": "",
                "source": "web"
            };

            json.chatroom = chatroom;
            json.lastmessageid = lastmessageid;

            post(URL, json, function (data) {

                cb(data);
            });
        };

        var post = function (url, json, cb) {
            var parsedURL = nodeURL.parse(URL);

            var post_data = querystring.stringify({'json': JSON.stringify(json)});

            var post_options_proxy = {
                host: "proxy",
                port: 8080,
                path: URL,
                method: "POST",
                connection: 'keep-alive',
                headers: {
                    'Host': parsedURL.host,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': loginCookie,
                    'Content-Length': post_data.length
                }
            };

            var request = http.request(post_options_proxy, function (res) {
                var data = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    cb(data);
                });
                res.on('err', function (err) {

                    Logger.log("post", err);
                });
            });
            request.write(post_data);
            request.end();
        };

        //used to get new messages and pass them to the bot to process them
        function pollMessage(botID, chatRoomID, lastMessageID, roomConfiguration) {
            getMessages(chatRoomID, lastMessageID, function (data) {
                var lastMessageID = roomConfiguration.messageID;
                try {
                    var json = JSON.parse(data);
                    if (json.messages) {
                        for (var i = 0; i < json.messages.length; i++) {

                            var username = json.messages[i].username;
                            var content = querystring.unescape(json.messages[i].content);
                            if (lastMessageID !== 0 && username.indexOf("Alice the Bot") == -1){
                                if(roomConfiguration.roomType != 'single'){
                                    if(isBotAdressed(content)){
                                        content = removeBotNameAdressing(content);
                                        Administrator.passMessageToBot(botID, content);
                                    }
                                }
                                else{
                                    Administrator.passMessageToBot(botID, content);
                                }
                            }
                        }

                        if (json.messages.length > 0){
                            //set the lastMessageID for current room to a new value, to only receive the new messages
                            roomConfiguration.messageID = json.messages[json.messages.length - 1].messageid;
                        }
                    }
                }
                catch (e) {
                    Logger.log("pollMessage", e);
                }
            });
        }

        //used to poll all rooms that the bot has. So everyone can open a chat with the bot like he wants to. (even group chats)
        function pollRooms(pollRoomTimeout){
            getRooms(function(data){
                try{
                    var json = JSON.parse(data);
                    if(json.chatrooms){
                        chatRoomArray = json.chatrooms;
                    }
                    for(var i = 0; i < chatRoomArray.length; i++){
                        var roomID = chatRoomArray[i].id;
                        var roomType = chatRoomArray[i].type;
                        var lastMessagePreview = chatRoomArray[i].lastMessagePreview;
                        if(availableChatRoomIDArray.indexOf(roomID) === -1){  //push each NEW room into the roomid-array
                            availableChatRoomIDArray.push(roomID);
                            roomID =  ""+ roomID;
                            var service = "Wire";
                            var userInfo = chatRoomArray[i].name;
                            var botID = Administrator.createBotInstance(sendMessage, service, userInfo);

                            var roomConfiguration = {};
//                            roomConfiguration.bot = bot;
                            roomConfiguration.botID = botID;
                            roomConfiguration.roomID = roomID;
                            roomConfiguration.messageID = 0;
                            roomConfiguration.roomType = roomType;

                            roomConfigurationArray[botID] = roomConfiguration;
                            roomIDMappingToBotID[roomID] = botID;
                            console.log(botID);
                            Administrator.runBot(botID);

                            //write welcome message
                            if(roomType == 'single'){
                                //for single chats just say welcome message the first time the room was created and not on every bot-server-restart
                                if(lastMessagePreview == ''){
                                    sendMessage(botID, "Hello, I am Alice. It's nice to meet you. We can have a little small talk, but I do also have great knowledge about SAP. If you need any information about an employee, if you need detailed information about a building or if you want to know what two employees have in common, feel free to ask me.", function(){});
                                }
                            }
                            else{
                                sendMessage(botID, "Hello everyone, I am Alice, the new one. It's nice to meet all of you. We can have a little small talk, but I also have great knowledge about SAP. If you need any information about an employee, if you need detailed information about a building or if you want to know what two employees have in common, feel free to ask me. Actually, I am always very busy and can't read every single post in this chat, so it would be nice if you could refer to me directly by using @Alice. I would really appreciate that!", function(){});
                            }

                            //poll the messages for this room
                            pollMessage(botID, roomID, 0, roomConfiguration);
                        }
                        else{
                            //if the room already existed, check if new messages are available and if yes, get them
                            if(chatRoomArray[i].unreadmessages > 0){
                                roomID = "" + roomID;  //roomid has to be a string

                                var botID = roomIDMappingToBotID[roomID];
                                var messageID = roomConfigurationArray[botID].messageID;
                                var roomConfiguration = roomConfigurationArray[botID];

                                //call pollMessage with the bot that belongs to the room(ID) and pass the lastMessageID to get only new messages. Also pass the whole roomConfiguration to reset the messageID in the called function
                                pollMessage(botID, roomID, messageID, roomConfiguration);
                            }
                        }
                    }

                    //check the rooms every <pollRoomTimeout>-seconds
                    setTimeout(function () {
                        pollRooms(pollRoomTimeout);
                    }, pollRoomTimeout);
                }
                catch(e){
                    Logger.log("pollRooms", e);
                    setTimeout(function () {
                        pollRooms(pollRoomTimeout);
                    }, pollRoomTimeout);
                }

            });

        }
        pollRooms(1000);
    }
    new WireAuthenticator(URL, callback);
}

module.exports = SapWire;

