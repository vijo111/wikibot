var express = require("express");
var trim = require("trim");
var app = express();
var port = 8881;



app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.render("page");
});

var io = require('socket.io').listen(app.listen(port));

var currentDate = new Date();
var dd = currentDate.getDate();
var mm = currentDate.getMonth() + 1; //January is 0!
var yyyy = currentDate.getFullYear();

if (dd < 10) {
    dd = '0' + dd
}

if (mm < 10) {
    mm = '0' + mm
}

var today = dd + '/' + mm + '/' + yyyy;

// Processing the Sentence
var userSentence;
var isResponseKeyProcessd = false;
var responseKey = '';
var tempResKey = '';
var entity1 = "Pizza";
var entity2 = "Mani";
var entity3 = "Chennai";
//var entity4 = // Should be System Time at DB level.
var category;
var userAction;

io.sockets.on('connection', function (socket) {


    socket.on('send', function (data) {

        io.sockets.emit('message', data);

        //Error detection in user's request
        var userSentence = trim(data.message);
        console.log('********* User Request [Actual]: ' + userSentence);
        const translate = require('google-translate-api');
        translate(userSentence, { to: 'en' }).then(res => {
            console.log(" ********* res.text:", res.text);
            userSentence = res.text;
            //=> I speak English 
            console.log(" ********* res.from.language.iso: ", res.from.language.iso);
            //=> nl 
        }).catch(err => {
            //console.log(" ----> err:",err);
            // console.log(" Error in sentence error detection.");
        });

        //console.log('********* User Request after applying -> google-translate-api:sent: '+sent);
        console.log('********* User Request after applying -> google-translate-api: ' + userSentence);


        // Open NLP Connectivity
        var openNLP = require("opennlp");

        console.log(' B4 calling sentenceDetector');

        var sentenceDetector = new openNLP().sentenceDetector;


        sentenceDetector.sentDetect(userSentence, function (err, results) {

            console.log(' -----> SentenceDetection: ', results);

            var sentenceDetected = results;


            if (sentenceDetected != '') {

                var strSentence = JSON.stringify(sentenceDetected);
                console.log(' -----> Sentences.length: ', strSentence.split(",").length);
                // For Short Conversation
                if (strSentence.split(",").length == 1) {
                    console.log(" -----------------> For Short Conversation <----------------- ");
                    // Process Tokenization
                    var tokenizer = new openNLP().tokenizer;
                    console.log(' -----> userSentence: ', userSentence);
                    var tempUserSentence = userSentence; // by default
                    if (userSentence.indexOf(".") > 0) {
                        tempUserSentence = userSentence.substring(0, userSentence.indexOf("."));
                    } else if (userSentence.indexOf("?") > 0) {
                        tempUserSentence = userSentence.substring(0, userSentence.indexOf("?"));
                    } else if (userSentence.indexOf("!") > 0) {
                        tempUserSentence = userSentence.substring(0, userSentence.indexOf("!"));
                    }
                    console.log(" tempUserSentence: " + tempUserSentence);
                    console.log(" B4 Processing tokenizing................ ");

                    tokenizer.tokenize(tempUserSentence, function (err, results) {

                        var sentenceTokenized = results;

                        console.log(' sentence After Tokenization ............ : ', sentenceTokenized);

                        if (sentenceTokenized != '') {

                            var strSentenceTokenized = JSON.stringify(sentenceTokenized);

                            var arrTokens = strSentenceTokenized.split(",");

                            console.log(' ----> arrOfTokens[Tokenized]: ', arrTokens);


                            // POS - Tagging
                            console.log(" B4 Processing POS Tagging ................ ");
                            var posTagger = new openNLP().posTagger;
                            posTagger.tag(tempUserSentence, function (err, arrTokens) {

                                console.log(' ----> POS Tags [Array Of Tokens]: ', arrTokens);
                                console.log(' ---POS--> POS Tags Length: ', arrTokens.length);

                                if (arrTokens != '') {

                                    tempResKey = tempUserSentence;

                                    console.log(" ===POS==== Sentence which does not contain -To- ");
                                    var arrResponseKey = tempUserSentence.split(" ");
                                    console.log(" arrResponseKey: " + arrResponseKey);
                                    console.log(' arrResponseKey.length: ', arrResponseKey.length);

                                    //Verbs
                                    var vbCount = 0;
                                    var vbdCount = 0;
                                    var vbgCount = 0;
                                    var vbnCount = 0;
                                    var vbpCount = 0;
                                    var vbzCount = 0;
                                    var vbIndex = [];
                                    var vbdIndex = [];
                                    var vbgIndex = [];
                                    var vbnIndex = [];
                                    var vbpIndex = [];
                                    var vbzIndex = [];

                                    //Personal Pronouns
                                    var possPRPCount = 0;
                                    var possPRPIndex = [];

                                    //Adjective
                                    var jjCount = 0;
                                    var jjIndex = [];

                                    //Nouns
                                    var nnCount = 0;
                                    var nnsCount = 0;
                                    var nnpCount = 0;
                                    var nnpsCount = 0;
                                    var nnIndex = [];
                                    var nnsIndex = [];
                                    var nnpIndex = [];
                                    var nnpsIndex = [];

                                    var index = 0;

                                    arrTokens.forEach(function (entry) {
                                        console.log(" each word in User's Request: " + entry);
                                        if (entry == 'VB') {
                                            vbCount++;
                                            if (vbIndex != '') {
                                                vbIndex[vbCount - 1] = index;
                                            } else {
                                                vbIndex[vbCount - 1] = index;
                                            }
                                        } else if (entry == 'VBD') {
                                            vbdCount++;
                                            if (vbdIndex != '') {
                                                vbdIndex[vbdCount - 1] = index;
                                            } else {
                                                vbdIndex[vbdCount - 1] = index;
                                            }
                                        } else if (entry == 'VBG') {
                                            vbgCount++;
                                            if (vbgIndex != '') {
                                                vbgIndex[vbgCount - 1] = index;
                                            } else {
                                                vbgIndex[vbgCount - 1] = index;
                                            }
                                        } else if (entry == 'VBN') {
                                            vbnCount++;
                                            if (vbnIndex != '') {
                                                vbnIndex[vbnCount - 1] = index;
                                            } else {
                                                vbnIndex[vbnCount - 1] = index;
                                            }
                                        } else if (entry == 'VBP') {
                                            vbpCount++;
                                            if (vbpIndex != '') {
                                                vbpIndex[vbpCount - 1] = index;
                                            } else {
                                                vbpIndex[vbpCount - 1] = index;
                                            }
                                        } else if (entry == 'VBZ') {
                                            vbzCount++;
                                            if (vbzIndex != '') {
                                                vbzIndex[vbzCount - 1] = index;
                                            } else {
                                                vbzIndex[vbzCount - 1] = index;
                                            }
                                        } else if (entry == 'JJ') {
                                            jjCount++;
                                            if (jjIndex != '') {
                                                jjIndex[jjCount - 1] = index;
                                            } else {
                                                jjIndex[jjCount - 1] = index;
                                            }
                                        } else if (entry == 'NN') {
                                            nnCount++;
                                            if (nnIndex != '') {
                                                nnIndex[nnCount - 1] = index;
                                            } else {
                                                nnIndex[nnCount - 1] = index;
                                            }
                                        } else if (entry == 'NNS') {
                                            nnsCount++;
                                            if (nnsIndex != '') {
                                                nnsIndex[nnsCount - 1] = index;
                                            } else {
                                                nnsIndex[nnsCount - 1] = index;
                                            }
                                        } else if (entry == 'NNP') {
                                            nnpCount++;
                                            if (nnpIndex != '') {
                                                nnpIndex[nnpCount - 1] = index;
                                            } else {
                                                nnpIndex[nnpCount - 1] = index;
                                            }
                                        } else if (entry == 'NNPS') {
                                            nnpsCount++;
                                            if (nnpCount != '') {
                                                nnpsIndex[nnpsCount - 1] = index;
                                            } else {
                                                nnpsIndex[nnpsCount - 1] = index;
                                            }
                                        } else if (entry == 'PRP$') {
                                            possPRPCount++;
                                            if (possPRPCount != '') {
                                                possPRPIndex[possPRPCount - 1] = index;
                                            } else {
                                                possPRPIndex[possPRPCount - 1] = index;
                                            }
                                        }

                                        index++;
                                    });

                                    console.log(" vbCount: ", vbCount);
                                    console.log(" vbdCount: ", vbdCount);
                                    console.log(" vbgCount: ", vbgCount);
                                    console.log(" vbnCount: ", vbnCount);
                                    console.log(" vbpCount: ", vbpCount);
                                    console.log(" vbzCount: ", vbzCount);

                                    console.log(" vbIndex: ", vbIndex);
                                    console.log(" vbdIndex: ", vbdIndex);
                                    console.log(" vbgIndex: ", vbgIndex);
                                    console.log(" vbnIndex: ", vbnIndex);
                                    console.log(" vbpIndex: ", vbpIndex);
                                    console.log(" vbzIndex: ", vbzIndex);

                                    console.log(" jjCount: ", jjCount);

                                    console.log(" nnCount: ", nnCount);
                                    console.log(" nnsCount: ", nnsCount);
                                    console.log(" nnpCount: ", nnpCount);
                                    console.log(" nnpsCount: ", nnpsCount);

                                    console.log(" nnIndex: ", nnIndex);
                                    console.log(" nnsIndex: ", nnsIndex);
                                    console.log(" nnpIndex: ", nnpIndex);
                                    console.log(" nnpsIndex: ", nnpsIndex);

                                    console.log(" jjIndex: ", jjIndex);

                                    console.log(" possPRPCount: ", possPRPCount);
                                    console.log(" possPRPIndex: ", possPRPIndex);


                                    if ((vbCount | vbdCount | vbgCount | vbnCount | vbpCount | vbzCount) == 1) {
                                        console.log(" There is atleast 1 VERB.");
                                        // Build the RES_KEY
                                        var ind = 0;
                                        arrResponseKey.forEach(function (entry) {
                                            // process VB words
                                            if (vbIndex.length == 1 & vbIndex == ind) { // for 1 VB
                                                if (responseKey != '') {
                                                    responseKey += " " + entry;
                                                } else {
                                                    responseKey = entry;
                                                }
                                            }

                                            /*
                                            if(vbdIndex.length == 1 & vbdIndex == ind){ // for 1 VBD
                                                if(responseKey !=''){
                                                    responseKey += " "+entry;  
                                                } else {
                                                    responseKey = entry;
                                                }
                                            } 
                                            
                                            if(vbgIndex.length == 1 & vbgIndex == ind){ // for 1 VBG
                                                if(responseKey !=''){
                                                    responseKey += " "+entry;  
                                                } else {
                                                    responseKey = entry;
                                                }
                                            } 
                                            
                                            if(vbnIndex.length == 1 & vbnIndex == ind){ // for 1 VBN
                                                if(responseKey !=''){
                                                    responseKey += " "+entry;  
                                                } else {
                                                    responseKey = entry;
                                                }
                                            } 
                                            
                                            if(vbpIndex.length == 1 & vbpIndex == ind){ // for 1 VBP
                                                if(responseKey !=''){
                                                    responseKey += " "+entry;  
                                                } else {
                                                    responseKey = entry;
                                                }
                                            } 
                                            
                                            if(vbzIndex.length == 1 & vbzIndex == ind){ // for 1 VBZ
                                                if(responseKey !=''){
                                                    responseKey += " "+entry;  
                                                } else {
                                                    responseKey = entry;
                                                }
                                            } */


                                            ind++;
                                        });
                                        console.log(" --AAA-> responseKey: " + responseKey);




                                        if ((nnCount | nnsCount | nnpCount | nnpsCount) == 1) {
                                            console.log(" There is atleast 1 NOUN.");

                                            // Build the RES_KEY
                                            var ind = 0;
                                            arrResponseKey.forEach(function (entry) {

                                                //PRP$
                                                if (possPRPIndex.length == 1 & possPRPIndex == ind) { // for 1 PRP$
                                                    if (responseKey != '') {
                                                        responseKey += " " + entry;
                                                    } else {
                                                        responseKey = entry;
                                                    }
                                                } else {
                                                    if (possPRPIndex.length > 0) { // for multiple PRP$
                                                        var index = 0;
                                                        possPRPIndex.forEach(function (possPRPPos) {
                                                            if (ind == possPRPPos) {
                                                                console.log(' PRP$ resKey: ', responseKey);
                                                                if (responseKey != '') {
                                                                    responseKey += " " + entry;
                                                                } else {
                                                                    responseKey = entry;
                                                                }
                                                            }
                                                            index++;
                                                        });
                                                    }
                                                }

                                                //JJ
                                                if (jjIndex.length == 1 & jjIndex == ind) { // for 1 JJ
                                                    if (responseKey != '') {
                                                        responseKey += " " + entry;
                                                    } else {
                                                        responseKey = entry;
                                                    }
                                                } else {
                                                    if (jjIndex.length > 0) { // for multiple PRP$
                                                        var index = 0;
                                                        jjIndex.forEach(function (jjPos) {
                                                            if (ind == jjPos) {
                                                                console.log(' JJ resKey: ', responseKey);
                                                                if (responseKey != '') {
                                                                    responseKey += " " + entry;
                                                                } else {
                                                                    responseKey = entry;
                                                                }
                                                            }
                                                            index++;
                                                        });
                                                    }
                                                }


                                                // process NN words
                                                console.log('nnIndex.length: ', nnIndex.length);
                                                if (nnIndex.length == 1 & nnIndex == ind) { // for 1 NN
                                                    console.log('nnIndex$Index: responseKey: ', responseKey);
                                                    if (responseKey != '') {
                                                        responseKey += " " + entry;
                                                    } else {
                                                        responseKey = entry;
                                                    }
                                                }

                                                if (nnsIndex.length == 1 & nnsIndex == ind) { // for 1 NNS
                                                    if (responseKey != '') {
                                                        responseKey += " " + entry;
                                                    } else {
                                                        responseKey = entry;
                                                    }
                                                }

                                                if (nnpIndex.length == 1 & nnpIndex == ind) { // for 1 NNP
                                                    if (responseKey != '') {
                                                        responseKey += " " + entry;
                                                    } else {
                                                        responseKey = entry;
                                                    }
                                                }

                                                if (nnpsIndex.length == 1 & nnpsIndex == ind) { // for 1 NNPS
                                                    if (responseKey != '') {
                                                        responseKey += " " + entry;
                                                    } else {
                                                        responseKey = entry;
                                                    }
                                                }


                                                ind++;
                                            });
                                            console.log(" --BBB-> responseKey: " + responseKey);
                                        } else {
                                            console.log(" There are more than 1 NOUNS.");
                                            // Build the RES_KEY
                                            var ind = 0;
                                            arrResponseKey.forEach(function (entry) {


                                                // process PRP$ words
                                                if (possPRPIndex.length > 0) { // for multiple PRP$
                                                    var index = 0;
                                                    possPRPIndex.forEach(function (possPRPPos) {
                                                        if (ind == possPRPPos) {
                                                            console.log(' PRP$ resKey: ', responseKey);
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }

                                                // process JJ words
                                                if (jjIndex.length > 0) { // for multiple PRP$
                                                    var index = 0;
                                                    jjIndex.forEach(function (jjPos) {
                                                        if (ind == jjPos) {
                                                            console.log(' JJ resKey: ', responseKey);
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }

                                                // process NN words
                                                if (nnIndex.length > 0) { // for multiple NN
                                                    var index = 0;
                                                    nnIndex.forEach(function (nnPos) {
                                                        if (ind == nnPos) {
                                                            console.log(' 00000 resKey: ', responseKey);
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }

                                                if (nnsIndex.length > 0) { // for multiple NNS
                                                    var index = 0;
                                                    nnsIndex.forEach(function (nnsPos) {
                                                        if (ind == nnsPos) {
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }

                                                if (nnpIndex.length > 0) { // for multiple NNP
                                                    var index = 0;
                                                    nnpIndex.forEach(function (nnpPos) {
                                                        if (ind == nnpPos) {
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }

                                                if (nnpsIndex.length > 0) { // for multiple NNPS
                                                    var index = 0;
                                                    nnpsIndex.forEach(function (nnpsPos) {
                                                        if (ind == nnpsPos) {
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }

                                                ind++;
                                            });
                                            console.log(" --CCC-> responseKey: " + responseKey);
                                        }

                                    } else if ((vbCount | vbdCount | vbgCount | vbnCount | vbpCount | vbzCount) > 1) {
                                        console.log(" There are more than 1 VERBS.");
                                        var ind = 0;
                                        arrResponseKey.forEach(function (entry) {

                                            if (vbIndex.length > 0) { // for multiple VB
                                                var index = 0;
                                                vbIndex.forEach(function (vbPos) {
                                                    if (ind == vbPos) {
                                                        if (responseKey != '') {
                                                            responseKey += " " + entry;
                                                        } else {
                                                            responseKey = entry;
                                                        }
                                                    }
                                                    index++;
                                                });
                                            }

                                            /*
                                            if(vbdIndex.length > 0){ // for multiple VBD
                                                var index = 0;
                                                vbdIndex.forEach(function(vbdPos) {
                                                    if(ind == vbdPos){
                                                        if(responseKey !=''){
                                                            responseKey += " "+entry;  
                                                        } else {
                                                            responseKey = entry;
                                                        }
                                                    }
                                                    index++;
                                                });    
                                            } 
                                            
                                            if(vbgIndex.length > 0){ // for multiple VBG
                                                var index = 0;
                                                vbgIndex.forEach(function(vbgPos) {
                                                    if(ind == vbgPos){
                                                        if(responseKey !=''){
                                                            responseKey += " "+entry;  
                                                        } else {
                                                            responseKey = entry;
                                                        }
                                                    }
                                                    index++;
                                                });    
                                            } 
                                            
                                            if(vbnIndex.length > 0){ // for multiple VBN
                                                var index = 0;
                                                vbnIndex.forEach(function(vbnPos) {
                                                    if(ind == vbnPos){
                                                        if(responseKey !=''){
                                                            responseKey += " "+entry;  
                                                        } else {
                                                            responseKey = entry;
                                                        }
                                                    }
                                                    index++;
                                                });    
                                            } 
                                            
                                            if(vbpIndex.length > 0){ // for multiple VBP
                                                var index = 0;
                                                vbpIndex.forEach(function(vbpPos) {
                                                    if(ind == vbpPos){
                                                        if(responseKey !=''){
                                                            responseKey += " "+entry;  
                                                        } else {
                                                            responseKey = entry;
                                                        }
                                                    }
                                                    index++;
                                                });    
                                            } 
                                            
                                            if(vbzIndex.length > 0){ // for multiple VBZ
                                                var index = 0;
                                                vbzIndex.forEach(function(vbzPos) {
                                                    if(ind == vbzPos){
                                                        if(responseKey !=''){
                                                            responseKey += " "+entry;  
                                                        } else {
                                                            responseKey = entry;
                                                        }
                                                    }
                                                    index++;
                                                });    
                                            } */

                                            ind++;
                                        });
                                        console.log(" 333 responseKey: ", responseKey);
                                    } else { //When there is no VERB at all.
                                        console.log(" There is no VERB at all.");

                                        if ((nnCount | nnsCount | nnpCount | nnpsCount) == 1) {
                                            console.log(" There is atleast 1 NOUN.");

                                            // Build the RES_KEY
                                            var ind = 0;
                                            arrResponseKey.forEach(function (entry) {

                                                //PRP$
                                                if (possPRPIndex.length == 1 & possPRPIndex == ind) { // for 1 PRP$
                                                    if (responseKey != '') {
                                                        responseKey += " " + entry;
                                                    } else {
                                                        responseKey = entry;
                                                    }
                                                } else {
                                                    if (possPRPIndex.length > 0) { // for multiple PRP$
                                                        var index = 0;
                                                        possPRPIndex.forEach(function (possPRPPos) {
                                                            if (ind == possPRPPos) {
                                                                console.log(' PRP$ resKey: ', responseKey);
                                                                if (responseKey != '') {
                                                                    responseKey += " " + entry;
                                                                } else {
                                                                    responseKey = entry;
                                                                }
                                                            }
                                                            index++;
                                                        });
                                                    }
                                                }

                                                //JJ
                                                if (jjIndex.length == 1 & jjIndex == ind) { // for 1 JJ
                                                    if (responseKey != '') {
                                                        responseKey += " " + entry;
                                                    } else {
                                                        responseKey = entry;
                                                    }
                                                } else {
                                                    if (jjIndex.length > 0) { // for multiple PRP$
                                                        var index = 0;
                                                        jjIndex.forEach(function (jjPos) {
                                                            if (ind == jjPos) {
                                                                console.log(' JJ resKey: ', responseKey);
                                                                if (responseKey != '') {
                                                                    responseKey += " " + entry;
                                                                } else {
                                                                    responseKey = entry;
                                                                }
                                                            }
                                                            index++;
                                                        });
                                                    }
                                                }

                                                // process NN words
                                                if (nnIndex.length == 1 & nnIndex == ind) { // for 1 NN
                                                    if (responseKey != '') {
                                                        responseKey += " " + entry;
                                                    } else {
                                                        responseKey = entry;
                                                    }
                                                }

                                                if (nnsIndex.length == 1 & nnsIndex == ind) { // for 1 NNS
                                                    if (responseKey != '') {
                                                        responseKey += " " + entry;
                                                    } else {
                                                        responseKey = entry;
                                                    }
                                                }

                                                if (nnpIndex.length == 1 & nnpIndex == ind) { // for 1 NNP
                                                    if (responseKey != '') {
                                                        responseKey += " " + entry;
                                                    } else {
                                                        responseKey = entry;
                                                    }
                                                }

                                                if (nnpsIndex.length == 1 & nnpsIndex == ind) { // for 1 NNPS
                                                    if (responseKey != '') {
                                                        responseKey += " " + entry;
                                                    } else {
                                                        responseKey = entry;
                                                    }
                                                }

                                                ind++;
                                            });
                                            console.log(" --BBB-> responseKey: " + responseKey);
                                        } else {
                                            console.log(" There are more than 1 NOUNS.");
                                            // Build the RES_KEY
                                            var ind = 0;
                                            arrResponseKey.forEach(function (entry) {


                                                // process PRP$ words
                                                if (possPRPIndex.length > 0) { // for multiple PRP$
                                                    var index = 0;
                                                    possPRPIndex.forEach(function (possPRPPos) {
                                                        if (ind == possPRPPos) {
                                                            console.log(' PRP$ resKey: ', responseKey);
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }

                                                // process JJ words
                                                if (jjIndex.length > 0) { // for multiple PRP$
                                                    var index = 0;
                                                    jjIndex.forEach(function (jjPos) {
                                                        if (ind == jjPos) {
                                                            console.log(' JJ resKey: ', responseKey);
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }

                                                // process NN words
                                                if (nnIndex.length > 0) { // for multiple NN
                                                    var index = 0;
                                                    nnIndex.forEach(function (nnPos) {
                                                        if (ind == nnPos) {
                                                            //console.log(' 00000 resKey: ',responseKey);
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }

                                                if (nnsIndex.length > 0) { // for multiple NNS
                                                    var index = 0;
                                                    nnsIndex.forEach(function (nnsPos) {
                                                        // console.log(' ind: ', ind);
                                                        //console.log(' nnsPos: ', nnsPos);
                                                        if (ind == nnsPos) {
                                                            // console.log(' 123 responseKey: ', responseKey);
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }

                                                if (nnpIndex.length > 0) { // for multiple NNP
                                                    var index = 0;
                                                    nnpIndex.forEach(function (nnpPos) {
                                                        if (ind == nnpPos) {
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }

                                                if (nnpsIndex.length > 0) { // for multiple NNPS
                                                    var index = 0;
                                                    nnpsIndex.forEach(function (nnpsPos) {
                                                        if (ind == nnpsPos) {
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }

                                                ind++;
                                            });
                                            console.log(" --CCC-> responseKey: " + responseKey);
                                        }

                                    }

                                    // Finally, if res_key is not constructed.
                                    if (responseKey == '') {
                                        //responseKey = tempUserSentence;
                                        if (tempResKey != '') {
                                            if (tempResKey.indexOf(".") >= 0) {
                                                responseKey = tempResKey.substring(0, tempResKey.indexOf("."));
                                            } else if (tempResKey.indexOf("?") >= 0) {
                                                responseKey = tempResKey.substring(0, tempResKey.indexOf("?"));
                                            } else if (tempResKey.indexOf('"') >= 0) { // No dot but ending with "
                                                responseKey = tempResKey.substring(0, tempResKey.indexOf('"'));
                                            } else { // No dot
                                                responseKey = tempResKey;
                                            }
                                        }
                                    }
                                    //}

                                    console.log(' --Finally--> tempResKey: ', tempResKey);
                                    console.log(' --Finally--> responseKey: ', responseKey);
                                    queryProcessor(responseKey, data, socket, tempUserSentence);

                                    // Clear old values.
                                    responseKey = "";
                                    tempResKey = "";
                                    tempUserSentence = "";


                                    var doccat = new openNLP().doccat;
                                    doccat.categorize(data.message, function (err, list) {
                                        //doccat.getAllResults(list, function(err, category) {
                                        //});
                                        //doccat.getBestCategory(list, function(err, category) {
                                        //});
                                    });
                                    doccat.scoreMap(data.message, function (err, category) {
                                    });
                                    doccat.sortedScoreMap(data.message, function (err, category) {
                                    });
                                    doccat.getCategory(1, function (err, category) {
                                    });

                                    doccat.getIndex('Happy', function (err, index) {
                                    });

                                    if (responseKey.indexOf('order')) {
                                        doccat.getIndex('order', function (err, index) {
                                            category = 'order';
                                        });
                                    } else if (responseKey.indexOf('payment')) {
                                        doccat.getIndex('payment', function (err, index) {
                                            category = 'payment';
                                        });
                                    } else if (responseKey.indexOf('delivery')) {
                                        doccat.getIndex('delivery', function (err, index) {
                                            category = 'delivery';
                                        });
                                    }

                                }
                                // console.log(err, arrTokens);
                            });

                        }

                    });

                } else { // For Long Conversation
                    console.log(" -----------------> For Long Conversation <----------------- ");
                    var multiSentences = strSentence.split(",");
                    console.log(' -----> multiSentences: ', multiSentences);
                    // Process Tokenization
                    var isResultAlreadyObtained = false;
                    var ind = 0;
                    // multiSentences.forEach(function(eachSentence) {\
                    // Process Tokenization
                    var tokenizer = new openNLP().tokenizer;

                    tokenizer.tokenize(userSentence, function (err, results) {

                        var sentenceTokenized = results;

                        console.log(' sentence After Tokenization ............ : ', sentenceTokenized);

                        if (sentenceTokenized != '') {

                            var strSentenceTokenized = JSON.stringify(sentenceTokenized);

                            var arrTokens = strSentenceTokenized.split(",");

                            console.log(' ----> arrOfTokens[Tokenized]: ', arrTokens);

                            // POS - Tagging
                            console.log(" B4 Processing POS Tagging ................ ");
                            var posTagger = new openNLP().posTagger;
                            posTagger.tag(userSentence, function (err, arrTokens) {

                                console.log(' ----> POS Tags [Array Of Tokens]: ', arrTokens);
                                console.log(' ---POS--> POS Tags Length: ', arrTokens.length);

                                if (arrTokens != '') {
                                    tempResKey = userSentence;

                                    var arrResponseKey = userSentence.split(" ");
                                    console.log(" arrResponseKey: " + arrResponseKey);
                                    console.log(' arrResponseKey.length: ', arrResponseKey.length);

                                    //Verbs
                                    var vbCount = 0;
                                    var vbdCount = 0;
                                    var vbgCount = 0;
                                    var vbnCount = 0;
                                    var vbpCount = 0;
                                    var vbzCount = 0;
                                    var vbIndex = [];
                                    var vbdIndex = [];
                                    var vbgIndex = [];
                                    var vbnIndex = [];
                                    var vbpIndex = [];
                                    var vbzIndex = [];

                                    //Personal Pronouns
                                    var possPRPCount = 0;
                                    var possPRPIndex = [];

                                    // Adjective
                                    var jjCount = 0;
                                    var jjIndex = [];

                                    //Nouns
                                    var nnCount = 0;
                                    var nnsCount = 0;
                                    var nnpCount = 0;
                                    var nnpsCount = 0;
                                    var nnIndex = [];
                                    var nnsIndex = [];
                                    var nnpIndex = [];
                                    var nnpsIndex = [];

                                    var index = 0;

                                    arrTokens.forEach(function (entry) {
                                        console.log(" each word in User's Request: " + entry);
                                        if (entry == 'VB') {
                                            vbCount++;
                                            if (vbIndex != '') {
                                                vbIndex[vbCount - 1] = index;
                                            } else {
                                                vbIndex[vbCount - 1] = index;
                                            }
                                        } else if (entry == 'VBD') {
                                            vbdCount++;
                                            if (vbdIndex != '') {
                                                vbdIndex[vbdCount - 1] = index;
                                            } else {
                                                vbdIndex[vbdCount - 1] = index;
                                            }
                                        } else if (entry == 'VBG') {
                                            vbgCount++;
                                            if (vbgIndex != '') {
                                                vbgIndex[vbgCount - 1] = index;
                                            } else {
                                                vbgIndex[vbgCount - 1] = index;
                                            }
                                        } else if (entry == 'VBN') {
                                            vbnCount++;
                                            if (vbnIndex != '') {
                                                vbnIndex[vbnCount - 1] = index;
                                            } else {
                                                vbnIndex[vbnCount - 1] = index;
                                            }
                                        } else if (entry == 'VBP') {
                                            vbpCount++;
                                            if (vbpIndex != '') {
                                                vbpIndex[vbpCount - 1] = index;
                                            } else {
                                                vbpIndex[vbpCount - 1] = index;
                                            }
                                        } else if (entry == 'VBZ') {
                                            vbzCount++;
                                            if (vbzIndex != '') {
                                                vbzIndex[vbzCount - 1] = index;
                                            } else {
                                                vbzIndex[vbzCount - 1] = index;
                                            }
                                        } else if (entry == 'JJ') {
                                            jjCount++;
                                            if (jjIndex != '') {
                                                jjIndex[jjCount - 1] = index;
                                            } else {
                                                jjIndex[jjCount - 1] = index;
                                            }
                                        } else if (entry == 'NN') {
                                            nnCount++;
                                            if (nnIndex != '') {
                                                nnIndex[nnCount - 1] = index;
                                            } else {
                                                nnIndex[nnCount - 1] = index;
                                            }
                                        } else if (entry == 'NNS') {
                                            nnsCount++;
                                            if (nnsIndex != '') {
                                                nnsIndex[nnsCount - 1] = index;
                                            } else {
                                                nnsIndex[nnsCount - 1] = index;
                                            }
                                        } else if (entry == 'NNP') {
                                            nnpCount++;
                                            if (nnpIndex != '') {
                                                nnpIndex[nnpCount - 1] = index;
                                            } else {
                                                nnpIndex[nnpCount - 1] = index;
                                            }
                                        } else if (entry == 'NNPS') {
                                            nnpsCount++;
                                            if (nnpCount != '') {
                                                nnpsIndex[nnpsCount - 1] = index;
                                            } else {
                                                nnpsIndex[nnpsCount - 1] = index;
                                            }
                                        } else if (entry == 'PRP$') {
                                            possPRPCount++;
                                            if (possPRPCount != '') {
                                                possPRPIndex[possPRPCount - 1] = index;
                                            } else {
                                                possPRPIndex[possPRPCount - 1] = index;
                                            }
                                        }

                                        index++;
                                    });

                                    console.log(" vbCount: ", vbCount);
                                    console.log(" vbdCount: ", vbdCount);
                                    console.log(" vbgCount: ", vbgCount);
                                    console.log(" vbnCount: ", vbnCount);
                                    console.log(" vbpCount: ", vbpCount);
                                    console.log(" vbzCount: ", vbzCount);

                                    console.log(" vbIndex: ", vbIndex);
                                    console.log(" vbdIndex: ", vbdIndex);
                                    console.log(" vbgIndex: ", vbgIndex);
                                    console.log(" vbnIndex: ", vbnIndex);
                                    console.log(" vbpIndex: ", vbpIndex);
                                    console.log(" vbzIndex: ", vbzIndex);

                                    console.log(" nnCount: ", nnCount);
                                    console.log(" nnsCount: ", nnsCount);
                                    console.log(" nnpCount: ", nnpCount);
                                    console.log(" nnpsCount: ", nnpsCount);

                                    console.log(" nnIndex: ", nnIndex);
                                    console.log(" nnsIndex: ", nnsIndex);
                                    console.log(" nnpIndex: ", nnpIndex);
                                    console.log(" nnpsIndex: ", nnpsIndex);

                                    console.log(" possPRPCount: ", possPRPCount);
                                    console.log(" possPRPIndex: ", possPRPIndex);

                                    console.log(" jjCount: ", jjCount);
                                    console.log(" jjIndex: ", jjIndex);


                                    // Build the RES_KEY
                                    if ((nnCount | nnsCount | nnpCount | nnpsCount) == 1) {
                                        console.log(" There is atleast 1 NOUN.");

                                        // Build the RES_KEY
                                        var ind = 0;
                                        multiSentences.forEach(function (entry) {

                                            //PRP$
                                            if (possPRPIndex.length == 1 & possPRPIndex == ind) { // for 1 PRP$
                                                if (responseKey != '') {
                                                    responseKey += " " + entry;
                                                } else {
                                                    responseKey = entry;
                                                }
                                            } else {
                                                if (possPRPIndex.length > 0) { // for multiple PRP$
                                                    var index = 0;
                                                    possPRPIndex.forEach(function (possPRPPos) {
                                                        if (ind == possPRPPos) {
                                                            console.log(' PRP$ resKey: ', responseKey);
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }
                                            }

                                            //JJ
                                            if (jjIndex.length == 1 & jjIndex == ind) { // for 1 JJ
                                                if (responseKey != '') {
                                                    responseKey += " " + entry;
                                                } else {
                                                    responseKey = entry;
                                                }
                                            } else {
                                                if (jjIndex.length > 0) { // for multiple PRP$
                                                    var index = 0;
                                                    jjIndex.forEach(function (jjPos) {
                                                        if (ind == jjPos) {
                                                            console.log(' JJ resKey: ', responseKey);
                                                            if (responseKey != '') {
                                                                responseKey += " " + entry;
                                                            } else {
                                                                responseKey = entry;
                                                            }
                                                        }
                                                        index++;
                                                    });
                                                }
                                            }

                                            // process NN words
                                            if (nnIndex.length == 1 & nnIndex == ind) { // for 1 NN
                                                if (responseKey != '') {
                                                    responseKey += " " + entry;
                                                } else {
                                                    responseKey = entry;
                                                }
                                            }

                                            if (nnsIndex.length == 1 & nnsIndex == ind) { // for 1 NNS
                                                if (responseKey != '') {
                                                    responseKey += " " + entry;
                                                } else {
                                                    responseKey = entry;
                                                }
                                            }

                                            if (nnpIndex.length == 1 & nnpIndex == ind) { // for 1 NNP
                                                if (responseKey != '') {
                                                    responseKey += " " + entry;
                                                } else {
                                                    responseKey = entry;
                                                }
                                            }

                                            if (nnpsIndex.length == 1 & nnpsIndex == ind) { // for 1 NNPS
                                                if (responseKey != '') {
                                                    responseKey += " " + entry;
                                                } else {
                                                    responseKey = entry;
                                                }
                                            }

                                            ind++;
                                        });
                                        console.log(" --BBB-> responseKey: " + responseKey);
                                    } else {
                                        console.log(" There are more than 1 NOUNS.");

                                        // Build the RES_KEY
                                        var ind = 0;
                                        multiSentences.forEach(function (entry) {

                                            // process PRP$ words
                                            if (possPRPIndex.length > 0) { // for multiple PRP$
                                                var index = 0;
                                                possPRPIndex.forEach(function (possPRPPos) {
                                                    if (ind == possPRPPos) {
                                                        console.log(' PRP$ resKey: ', responseKey);
                                                        if (responseKey != '') {
                                                            responseKey += " " + entry;
                                                        } else {
                                                            responseKey = entry;
                                                        }
                                                    }
                                                    index++;
                                                });
                                            }

                                            // process JJ words
                                            if (jjIndex.length > 0) { // for multiple PRP$
                                                var index = 0;
                                                jjIndex.forEach(function (jjPos) {
                                                    if (ind == jjPos) {
                                                        console.log(' JJ resKey: ', responseKey);
                                                        if (responseKey != '') {
                                                            responseKey += " " + entry;
                                                        } else {
                                                            responseKey = entry;
                                                        }
                                                    }
                                                    index++;
                                                });
                                            }


                                            // process NN words
                                            if (nnIndex.length > 0) { // for multiple NN
                                                var index = 0;
                                                nnIndex.forEach(function (nnPos) {
                                                    if (ind == nnPos) {
                                                        //console.log(' 00000 resKey: ',responseKey);
                                                        if (responseKey != '') {
                                                            responseKey += " " + entry;
                                                        } else {
                                                            responseKey = entry;
                                                        }
                                                    }
                                                    index++;
                                                });
                                            }

                                            if (nnsIndex.length > 0) { // for multiple NNS
                                                var index = 0;
                                                nnsIndex.forEach(function (nnsPos) {
                                                    // console.log(' ind: ', ind);
                                                    //console.log(' nnsPos: ', nnsPos);
                                                    if (ind == nnsPos) {
                                                        // console.log(' 123 responseKey: ', responseKey);
                                                        if (responseKey != '') {
                                                            responseKey += " " + entry;
                                                        } else {
                                                            responseKey = entry;
                                                        }
                                                    }
                                                    index++;
                                                });
                                            }

                                            if (nnpIndex.length > 0) { // for multiple NNP
                                                var index = 0;
                                                nnpIndex.forEach(function (nnpPos) {
                                                    if (ind == nnpPos) {
                                                        if (responseKey != '') {
                                                            responseKey += " " + entry;
                                                        } else {
                                                            responseKey = entry;
                                                        }
                                                    }
                                                    index++;
                                                });
                                            }

                                            if (nnpsIndex.length > 0) { // for multiple NNPS
                                                var index = 0;
                                                nnpsIndex.forEach(function (nnpsPos) {
                                                    if (ind == nnpsPos) {
                                                        if (responseKey != '') {
                                                            responseKey += " " + entry;
                                                        } else {
                                                            responseKey = entry;
                                                        }
                                                    }
                                                    index++;
                                                });
                                            }

                                            ind++;
                                        });

                                        console.log(" --CCC-> responseKey: " + responseKey);
                                    }

                                    if (responseKey == '') {
                                        responseKey = userSentence;
                                    }

                                    queryProcessor(responseKey, data, socket, userSentence);

                                    // Clear old values.
                                    responseKey = "";
                                    tempResKey = "";
                                    tempUserSentence = "";
                                }
                            });
                        }
                    });

                    ind++;

                    //});


                }

            } else {
                console.log(" Error while detecting sentence.");
                console.log(err, results);
            }


        }); //end of sentenceDetector.sentDetect



    });


});



function queryProcessor(resKey, data, socket, userSentence) {
    //  To make database connectivity
    console.log('\n\n $$$$$$$$$$$$ DB Code STARTS $$$$$$$$$$$$ ');

    var mysql = require('mysql');

    var connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'root',
        database: 'chatbot'
    });


    // Save User message into DB
    connection.query("Insert into conversation (from_user_id, to_user_id, message, time, entity_1, entity_2, entity_3, category, action) VALUES ('1','2',?,?,'PIZZA','Mani','Chennai','Order','')", [trim(data.message), data.time], function (err, result) {
        // Retrieve User message from DB
        var selQuery = "select message,time from conversation where from_user_id ='1' and to_user_id ='2' and time = ? and message = ?";
        //console.log('selQuery: ', selQuery);

        connection.query(selQuery, [data.time, trim(data.message)], function (err1, record, fields) {
            console.log('Conversation: record: ', record);
            if (err1) throw err1;
            socket.emit('userDBRecord', record);

            // To get response by passing RES_KEY built.
            var resCodeQuery = "select res_val_desc from knowledge_base kb , res_val_mapping rvm where kb.RES_CODE =  rvm.RES_VAL_CODE  and upper(kb.RES_KEY) like upper(?)";
            console.log('1st Level: resKey param: ', resKey, resCodeQuery);
            console.log('1st Level: resCodeQuery: ', resCodeQuery);
            connection.query(resCodeQuery, [trim(resKey)], function (err, rows, fields) {
                console.log('1st Level: rows: ', rows);
                if (rows != '') {
                    var string = JSON.stringify(rows);
                    console.log('$$$ string: ', string);
                    var json = JSON.parse(string);
                    console.log('$$$ res_val_desc: ', json[0].res_val_desc);

                    socket.emit('send', rows);
                    socket.emit('botTyping', "Pizza Bot");

                } else {
                    // To get response by passing whole user's request.
                    var resCodeQuery = "select res_val_desc from knowledge_base kb , res_val_mapping rvm where kb.RES_CODE =  rvm.RES_VAL_CODE  and upper(kb.RES_KEY) like upper(?)";
                    console.log('2nd Level: resKey param: ', userSentence);
                    console.log('2nd Level: resCodeQuery: ', resCodeQuery);
                    connection.query(resCodeQuery, [trim(userSentence)], function (err, rows, fields) {
                        console.log('2nd Level: rows: ', rows);

                        if (rows != '') {
                            var string = JSON.stringify(rows);
                            console.log('$$$ string: ', string);
                            var json = JSON.parse(string);
                            console.log('$$$ res_val_desc: ', json[0].res_val_desc);

                            socket.emit('send', rows);
                            socket.emit('botTyping', "Pizza Bot");

                        } else {
                            console.log("wikki---------------3");
                            var wikipedia = require("wikipedia-js");
                            var query = trim(userSentence);
                            var options = { query: query, format: "html", summaryOnly: true };
                            wikipedia.searchArticle(options, function (err, htmlWikiText) {
                                if (err) {
                                    console.log("wikki---------------3");
                                    console.log("An error occurred[query=%s, error=%s]", query, err);
                                    return;
                                }
                                console.log("Query successful[query=%s, html-formatted-wiki-text=%s]", query, htmlWikiText);
                                if (htmlWikiText != null && htmlWikiText != '') {
                                    //socket.emit('userDBRecord', data.message);
                                    socket.emit('send', htmlWikiText);
                                    socket.emit('botTyping', "Pizza Bot");
                                } else {
                                    console.log(' No RES_KEY is found in KB...............');
                                    // When no record is found, display Default Message.
                                    connection.query("SELECT res_val_desc FROM res_val_mapping where res_val_code = ?", [109], function (err, rows, fields) {
                                        if (!err) {
                                            socket.emit('send', rows);
                                            socket.emit('botTyping', "Pizza Bot");
                                        }
                                    });
                                }
                            });
                        } // else part
                    });
                }
            });
        });
    });
}

console.log("################################################################## \n----> App Listening on port: " + port + "\n" + "----> Current Time: " + today + " " + new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"));