window.onload = function () {

	var div1Cnt = 0;
	var div2Cnt = 0;
	var messages = [];
	var socket = io.connect('http://' + location.host);
	var field = document.getElementById("field");
	var sendButton = document.getElementById("send");
	var content = document.getElementById("content");
	var typeIndicator = document.getElementById("typeIndicator");


	socket.on('message', function (data) {

		if(data.message) {

			messages.push(data);
			var html = '';
			
			//Finding Date
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

			//Finding Time only
			var weekday = new Array(7);
			weekday[0] = "Sunday";
			weekday[1] = "Monday";
			weekday[2] = "Tuesday";
			weekday[3] = "Wednesday";
			weekday[4] = "Thursday";
			weekday[5] = "Friday";
			weekday[6] = "Saturday";

			var days = weekday[currentDate.getDay()];

			var currentTime = currentDate.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");

			html += '<p style="width: 100%;text-align: center; border-bottom: 1px solid #CCCCFF;line-height: 0.1em; margin: 10px 0 20px;font-size: 12px"><span style="background-color:#EEEEEE;padding:0 10px;">' + days + ' ('+ today +')</span></p>';


			html +='<div id="content" style="align:center; width=100%;color: ##008080;font-size: 18px;"><b> Welcome to the wiki bot.. Call me Vicky !!!</b></div>';


			// This is the Area of User's message/request

			for (var i = 0; i < messages.length; i++) {
				//alert(' messages[i].username: '+messages[i].username);
				if (messages[i].username != '' && messages[i].username.indexOf("Mani") >= 0) {


				} else {
					//alert(' 22222222');
					html += '<link rel="stylesheet" type="text/css" href="style.css">';
					html += '<p style="width: 100%;text-align: left; margin: 10px 0 20px;font-size: 12px"><span style="color:#A21F4D;"><b>Vicky</b></span></p>';
				    html += '<div id="content" style="width: 65px;height: 65px;background: #ccc;border-radius: 50%;overflow: hidden;" class="bot-photo"><img  src="../../pizzaBot.jpg"/> </div>';
					html += '<div id="content" style="padding: 15px;margin: 5px 10px 0;border-radius: 10px;color: black;font-size: 12px;background: #92a8d1;"';
					html += 'talk-bubble2 tri-right left-in">';
					html += messages[i].message;
					html += '</div>';
					html += '<p style="color:#6B6B6B;font-size:12px;">' + data.time; +'</p>'

					//html += '';
					content.innerHTML = html;



				}

			} 

		} else {
			console.log("There is a problem:", data);
		}

		// This is the Area of Bot response handling
		//var isAdded = false;

		var isAdded = false;

		socket.on('send', function (data) {

		//var delayMillis = 2500; //2.5 seconds
				
				
				setTimeout(function() {
					
					//if(!isAdded){

					currentDate = new Date();
					var currentTime = currentDate.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");

					//isAdded = true;
						//	alert(data);
							if(data !== null && typeof data === 'object'){
								var string=JSON.stringify(data);
								var json =  JSON.parse(string);
								data = json[0].res_val_desc;
							}
							
						

						data.username = 'Pizza Bot';
						
						messages.push(data);
						html += '<link rel="stylesheet" type="text/css" href="style.css">';
						html += '<p style="width: 100%;text-align: left; margin: 10px 0 20px;font-size: 12px"><span style="color:#A21F4D;"><b>Vicky </b></span></p>';
						html += '<div id="content" style="width: 65px;height: 65px;background: #ccc;border-radius: 50%;overflow: hidden;" class="bot-photo"><img  src="../../pizzaBot.jpg"/> </div>';
						html += '<div id="content" style="padding: 15px;margin: 5px 10px 0;border-radius: 10px;color: #fff;font-size: 12px;background: #92a8d1;"';
						html += 'class="talk-bubble2 tri-right left-in">';

						html += data;

						html += '</div>';
						html += '<p style="color:#6B6B6B;font-size:12px;">' + currentTime; +'</p>'
						//html += '';
						content.innerHTML = html;
				
						// Clear - Bot is responding message
						var clearValue = '';
						clearValue += '<p><label style="width: 100%;text-align: left; font-size: 12px;"></label></p>';
						typeIndicator.innerHTML = clearValue;

						// Auto Scroll to down
						var div = document.getElementById("chatlogs");
   						div.scrollTop = div.scrollHeight - div.clientHeight;

					//}

				}, 3000);

		});

		
		
				socket.on('userDBRecord', function (record) {
					//alert('isAlreadyAdded : '+isAlreadyAdded);
					if (record != '') {
						//isAlreadyAdded = true;
					 //   alert('userDbRecord.....>'+record);
						var string = JSON.stringify(record);
						//alert('string: '+string);
						var json = JSON.parse(string);
						//alert('json: '+json);
						record.message = json[0].message;
						//alert('message from DB: '+record.message);
		
						record.time = json[0].time;
		
						//alert('time from Db: '+record.time);
					//	record.username = 'Mani';
		
						messages.push(record);

						// -- To display the User in Opposite Side.
						html += '<link rel="stylesheet" type="text/css" href="style.css">';
						html += '<p style="width: 100%;text-align: right; font-size: 12px"><span style="color:purple;"><b>Mani &nbsp; &nbsp;</b></span></p>';
						html += '<div style="width: 100%">';
						html += '<div id="content" style="float:right; width: 65px;height: 65px;background: #ccc;border-radius: 50%;overflow: hidden;" class="user-photo"><img align="right" src="user.png" /></div>';
						html += '<div id="content" style="float:right;text-align: right; padding: 15px;margin: 5px 10px 0;border-radius: 10px;color: #fff;font-size: 12px; background: #5AAAC6;" class="talk-bubble tri-right right-in"><span>'+record.message+'</span></div>';
						html += '<p style="float:right;color:#6B6B6B;font-size:12px;">' + record.time; +'</p>';						
						html += '</div>';		
						content.innerHTML = html;

					/*	html += '<link rel="stylesheet" type="text/css" href="stylee.css">';
						html += '<p style="width: 100%;text-align: left; margin: 10px 0 20px;font-size: 12px"><span style="color:#A21F4D;padding:0 10px;"><b>Pizza Bot</b></span></p>';
						html += '<div id="content" style="width: 80px;height: 60px;background: #ccc;border-radius: 50%;overflow: hidden;" class="bot-photo"><img  src="../../pizzaBot.png"/> </div>';
						html += '<div id="content" style="padding: 15px;margin: 5px 10px 0;border-radius: 10px;color: black;font-size: 12px;background: #E8E1E9;"';
						html += 'class="talk-bubble2 tri-right left-in">';
												
						html += json[0].res_val_desc;

						html += '</div>';
						html += '<p style="color:#6B6B6B;font-size:12px;">' + currentTime; +'</p>'
						//html += '';
						content.innerHTML = html; */

						// Auto Scroll to down
						var div = document.getElementById("chatlogs");
   						div.scrollTop = div.scrollHeight - div.clientHeight;
		
		
					}
				});
				//isAlreadyAdded = false;


		socket.on('botTyping', function (user) {

			var html = '';
			//field.text(user + ' is typing ...');
			html += '<p><label style="width: 100%; height: 10px;text-align: left; font-size: 12px; background-color:#B5B9C2; color:black;"><b>Pizza Bot is responding.............</b></label></p>';
			typeIndicator.innerHTML = html;

			setInterval(function () {
				typeIndicator.style.visibility = (typeIndicator.style.visibility == 'hidden' ? '' : 'hidden');
			}, 800);

		});

	});


	sendButton.onclick = sendMessage = function () {

			var currentDate = new Date();
			var currentTime = currentDate.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
		
			if(field.value == "") {
				alert("Please enter your message !");
				field.style.background = 'Yellow';
				field.focus().focus;
				return false;
			} else {
				field.style.background = 'White';
				//sending data to server
				socket.emit('send', { message: field.value, username: "Mani", time: currentTime });
				field.value = '';
				field.focus().focus;
			}
		
	};

	field.onkeypress = sendMessage = function (e) {

		var currentDate = new Date();
		var currentTime = currentDate.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");

		if (e.keyCode == 13) {
			if (field.value == "") {
				alert("Please enter your message !");
				field.style.background = 'Yellow';
				field.focus().focus;
				return false;
			} else {
				field.style.background = 'White';
				e.preventDefault();
				//sending data to server
				socket.emit('send', { message: field.value, username: "Mani", time: currentTime });
				field.value = '';
			}
		}

		return true;
	};


}
