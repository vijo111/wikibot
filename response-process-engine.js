        var userSentence = data.message;
        console.log(" ---> userSentence: ",userSentence);
		//Error detection in user's request
		const translate = require('google-translate-api');
		//console.log('translate obj: '+translate);
		translate(data.message, {to: 'en'}).then(res => {
			console.log(" *******>> res.text:",res.text);
            userSentence = res.text;
			//=> I speak English 
			console.log(" ---> res.from.language.iso: ",res.from.language.iso);
			//=> nl 
		}).catch(err => {
			//console.log(" ----> err:",err);
		});



    // Open NLP Connectivity
        var openNLP = require("opennlp");

        /*
        var sentence = 'Pierre Vinken , 61 years old , will join the board as a nonexecutive director Nov. 29 .';
        var nameFinder = new openNLP().nameFinder;
        console.log(" nameFinder: ",nameFinder);
        var result = nameFinder.find(sentence, function(err, results) {
            console.log(" results: ",results)
        });
        console.log(" nameFinder result: ",result);*/
       
        // Processing the Sentence
        var isResponseKeyProcessd = false;
        var responseKey = "Error";
        var resKey = '';
        var entity1 = "Pizza";
        var entity2 = "Mani";
        var entity3 = "Chennai";
        //var entity4 = // Should be System Time at DB level.
        var category;
        var userAction;
        
        
        var sentenceDetector = new openNLP().sentenceDetector;

        sentenceDetector.sentDetect(userSentence, function(err, results) {

        console.log(' -----> SentenceDetection: ', results);
        var sentenceDetected = results;


        if (sentenceDetected != '') {

                    var strSentence = JSON.stringify(sentenceDetected);
                   
                   // console.log(" ----> strSentence.split(,).Length: ",strSentence.split(",").length);
                    
                    // For Short Conversation
                    if(strSentence.split(",").length == 1){

                            // Process Tokenization
                            var tokenizer = new openNLP().tokenizer;

                            console.log(" Processing tokenizing................ ");

                            tokenizer.tokenize(userSentence, function(err, results) {
                                
                                var sentenceTokenized = results;
                                    console.log(' After Tokenized ............ : ', sentenceTokenized);
                                    
                                    if (sentenceTokenized != '') {
                                        
                                        var strSentenceTokenized = JSON.stringify(sentenceTokenized);
                                       
                                        var arrTokens = strSentenceTokenized.split(",");

                                        console.log(' ----> arrTokens: ', arrTokens);
                                        
                                        // POS - Tagging
                                        var posTagger = new openNLP().posTagger;
                                        posTagger.tag(userSentence, function(err, arrTokens) {
                                           
                                           console.log(' ----> POS Tags: ', arrTokens);

                                            if(arrTokens != ''){
                                                // If sentence contains 'To' key word
                                                console.log(' ----> TO index: ', arrTokens.indexOf('TO'));
                                                console.log(' ----> POS Tags Length: ', arrTokens.length);
                                                
                                                console.log(" Checking whether TO is there or not");

                                                if(arrTokens.indexOf('TO') >= 0){
                                                        console.log(" ===R==== userSentence: "+userSentence);
                                                        var afterToSentence = JSON.stringify(userSentence).split("to")[1];
                                                        console.log(" ===R==== afterToSentence: "+afterToSentence);
                                                        resKey = afterToSentence; // assign by default.

                                                        /*
                                                        var afterToSentence1 = JSON.stringify(afterToSentence).split(".")[0];
                                                        console.log(" ===R==== afterToSentence1: "+afterToSentence1);
                                                        
                                                        
                                                        tokenizer.tokenize(afterToSentence1, function(err, results) {
                                                                console.log(' --R--> results: ', results);
                                                                var arrTokens = results;
                                                        });*/
                                                        
                                                        var index = 0;
                                                        var verbAfterToCount = 0;
                                                        var nounAfterToCount = 0;
                                                        
                                                        // Process After 'To' keyword
                                                        arrTokens.forEach(function(entry) {
                                                            console.log(" entry: "+entry);
                                                            if(index > (arrTokens.indexOf('TO')-1)){
                                                                if(entry == 'VB'){
                                                                    verbAfterToCount++;
                                                                }   
                                                                if(entry == 'NN'){
                                                                    nounAfterToCount++;
                                                                }   
                                                            }
                                                            index++;
                                                        });
                                                        console.log(" verbAfterToCount: "+verbAfterToCount);
                                                        console.log(" nounAfterToCount: "+nounAfterToCount);
                                                        
                                                        // Make Decision based on count
                                                        var arrTokens = strSentenceTokenized.split(",");
                                                        console.log(' --1--> arrTokens: ', arrTokens);
                                                        console.log(' ----> verbAfterToCount: ', verbAfterToCount);
                                                        console.log(' ----> nounAfterToCount: ', nounAfterToCount);
                                                        
                                                        //Scenario 1
                                                        if(verbAfterToCount == 1){
                                                                //Sub scenario 1
                                                                if(nounAfterToCount == 1){
                                                                    /*
                                                                    var secondPart = strSentenceTokenized.split("to")[1];
                                                                    console.log(' ----> secondPart: ', secondPart.split(",")[1]);
                                                                    console.log(' ----> secondPart.length: ', secondPart.length);
                                                                    var simSecondPart = secondPart.split(",");
                                                                    console.log(' ----> simSecondPart: ', simSecondPart);
                                                                    resKey = secondPart.substring(3, (secondPart.length-1)).split(","); */
                                                                    console.log(' ----> resKey: ', resKey);
                                                                     // Final Processing of res_key
                                                                    
                                                                    //responseKey = resKey;
                                                                    console.log(' ----------->  resKey.indexOf("."): ', resKey.indexOf("."));
                                                                    console.log(' ----------->  resKey.substring: ',resKey.substring(1, resKey.indexOf(".")));
                                                                    if(resKey.indexOf(".") >= 0){
                                                                           responseKey = resKey.substring(1, resKey.indexOf("."));
                                                                           console.log(' ------1----->  responseKey: ', responseKey);
                                                                           isResponseKeyProcessd = true;
                                                                    }
                                                                    console.log(' -----2------>  responseKey: ', responseKey);

                                                                                
                                                                


                                                                } else if(nounAfterToCount > 1){ //Sub scenario 2
                                                                    //TODO
                                                                } else if(nounAfterToCount == 0){ //Sub scenario 3
                                                                    //TODO
                                                                } 
                                                        } else if(verbAfterToCount > 1){ //Scenario 2
                                                            //TODO
                                                        }
                                                        
                                                        // Process sentence Before 'To' keyword
                                                        // var afterToSentence = JSON.stringify(userSentence).split("to")[0];
                                                        // TODO


                                                } else { // when there is no 'To' keyword

                                                    
                                                    
                                            }
                                            

                                            // For Name Finder
                                            /*
                                            var nameFinder = new openNLP().nameFinder;
                                            console.log(" ******  nameFinder: ",nameFinder);
                                            var res =  nameFinder.find(data.message, function(err, strSentenceTokenized) {
                                                //console.log(error, response)
                                                console.log(" ****** strSentenceTokenized: ",strSentenceTokenized);
                                                nameFinder.probs(function(error, response) {
                                                    console.log(" ****** response: ",response);
                                                    //console.log(error, response);
                                                });
                                            });
                                            console.log(" ******  res: ",res); */

                                            var doccat = new openNLP().doccat;
                                            doccat.categorize(data.message, function(err, list) {
                                                //doccat.getAllResults(list, function(err, category) {
                                                //});
                                                //doccat.getBestCategory(list, function(err, category) {
                                                //});
                                            });
                                            doccat.scoreMap(data.message, function(err, category) {
                                            });
                                            doccat.sortedScoreMap(data.message, function(err, category) {
                                            });
                                            doccat.getCategory(1, function(err, category) {
                                            });
                                            
                                            doccat.getIndex('Happy', function(err, index) {
                                            });

                                            if(responseKey.indexOf('order')){
                                                doccat.getIndex('order', function(err, index) {
                                                    category = 'order';
                                                });
                                            } else if(responseKey.indexOf('payment')){
                                                doccat.getIndex('payment', function(err, index) {
                                                    category = 'payment';
                                                });
                                            } else if(responseKey.indexOf('delivery')){
                                                doccat.getIndex('delivery', function(err, index) {
                                                    category = 'delivery';
                                                });
                                            }

                                           



                                            }
                                           // console.log(err, arrTokens);
                                        });



                                    }

                                    console.log(' --Finally--> resKey: ', resKey);
                                    console.log(' --Finally--> responseKey: ', responseKey);


                            });

                            

                            

                    } else { // For Long Conversation


                    }



            } else {
                console.log(err, results);
            }

              
          
        });