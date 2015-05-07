/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
 var GLat = null;
 var GLng = null;
 var pushNotification;

window.alert = function(){
	 return navigator.notification.alert( arguments[0], null, "Bakkaldan Uyarı", "OK");
}


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		document.addEventListener("backbutton", function(e) {}, false);
        try {
            pushNotification = window.plugins.pushNotification;
            if (device.platform == 'android' || device.platform == 'Android' || device.platform ==
                'amazon-fireos') {
                pushNotification.register(successHandler, errorHandler, {
                    "senderID": "balmy-component-93808",
                    "ecb": "onNotification"
                }); // required!
            } else {
                pushNotification.register(tokenHandler, errorHandler, {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true",
                    "ecb": "onNotificationAPN"
                }); // required!
            }
        } catch (err) {
            txt = "There was an error on this page.\n\n";
            txt += "Error description: " + err.message + "\n\n";
            alert(txt);
        }
		

		if(window.localStorage.getItem("email")!=null && window.localStorage.getItem("password")!=null){
			var email = window.localStorage.getItem("email");
			var password = window.localStorage.getItem("password");
			
			uyeKayit(email,password);
		}
		else{
			$(".loginSections").show();
		}
    }
};

function onNotificationAPN(e) {
        if (e.alert) {
            // showing an alert also requires the org.apache.cordova.dialogs plugin
            navigator.notification.alert(e.alert);
        }
        if (e.sound) {
            // playing a sound also requires the org.apache.cordova.media plugin
            var snd = new Media(e.sound);
            snd.play();
        }
        if (e.badge) {
            pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
        }
    }
    // handle GCM notifications for Android
 
function onNotification(e) {
    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                alert("regID = " + e.regid);
            }
            break;
        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground) {
                // on Android soundname is outside the payload.
                // On Amazon FireOS all custom attributes are contained within payload
                var soundfile = e.soundname || e.payload.sound;
                // if the notification contains a soundname, play it.
                // playing a sound also requires the org.apache.cordova.media plugin
                var my_media = new Media("/android_asset/www/" + soundfile);
                my_media.play();
            }
            break;
        case 'error':
            break;
        default:
            break;
    }
}
 
function tokenHandler(result) {
    alert('device token = ' + result);
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}
 
 
function successHandler(result) {}
 
function errorHandler(error) {}

function uyeKayit(email,password){

	var email = (email===undefined) ? document.getElementById("regEmail").value : email;
	var password = (password===undefined) ? document.getElementById("regPassword").value : password;
	var deviceModel = device.model;
	var deviceCordova = device.cordova;
	var devicePlatform = device.platform;
	var deviceId = device.uuid;
	var deviceVersion = device.version;

	var postData = '{"aksiyon":"uyeKayit","data":{"memberType":"operator","email":"'+email+'","password":"'+password+'","deviceModel":"'+deviceModel+'","deviceCordova":"'+deviceCordova+'","devicePlatform":"'+devicePlatform+'","deviceId":"'+deviceId+'","deviceVersion":"'+deviceVersion+'"}}';


	$.post("http://www.sagclick.com/BAKKALDAN/com/bakkaldan/DEBUG/debugger.php", { bilgi: postData}).done(
	function(data){
		var sonuc = JSON.parse(data);
		if(sonuc.response==true){
			$(".loginSections").hide();
			window.localStorage.setItem("email", email);
			window.localStorage.setItem("password", password);
			profilBilgilerim();
			
		}
		else{
			window.localStorage.removeItem("email");
			window.localStorage.removeItem("password");
			alert("Hesap bilgilerin hatalı.");
			$(".loginSections").show();
		}
	}
	);
}



function sifremiUnuttum(){

	var email = document.getElementById("forgotEmail").value;

	var postData = '{"aksiyon":"sifremiUnuttum","data":{"memberType":"operator","email":"'+email+'"}}';

	
	$.post("http://www.sagclick.com/BAKKALDAN/com/bakkaldan/DEBUG/debugger.php", { bilgi: postData}).done(
	function(data){
	
		var sonuc = JSON.parse(data);
		if(sonuc.response==true){
			alert("Şifreni e-posta adresine gönderdik.");
		}
		else{
			alert("Bir hata oluştu, lütfen tekrar dene.");
		}
	}
	);
}
function cikisYap(){


	var postData = '{"aksiyon":"guvenliCikis","data":{"":""}}';

	
	$.post("http://www.sagclick.com/BAKKALDAN/com/bakkaldan/DEBUG/debugger.php", { bilgi: postData}).done(
	function(data){
		
		var sonuc = JSON.parse(data);
		if(sonuc.response==true){
			window.localStorage.removeItem("email");
			window.localStorage.removeItem("password");
			document.location = "index.html";
		}
		else{
			//	alert("Bir hata oluştu, lütfen tekrar dene.");

		}
	}
	);
}
function profilBilgilerim(){


	var postData = '{"aksiyon":"profilBilgilerim","data":{"":""}}';

	
	$.post("http://www.sagclick.com/BAKKALDAN/com/bakkaldan/DEBUG/debugger.php", { bilgi: postData}).done(
		function(data){
			
			var sonuc = JSON.parse(data);
			if(sonuc.response==true){
				$("#profilAdSoyad").html(sonuc.data.firstName+" "+sonuc.data.lastName);
				$("#profilTelefon").html(sonuc.data.phone);
				if(sonuc.data.state=="aktif"){
			
					$(".inAppSection").fadeToggle(0);
					$("#proDukkanId").html("BKL"+sonuc.data.userId);
					$("#proDukkanAdi").html(sonuc.data.firstName+" "+sonuc.data.lastName);
					$("#proYetkiliAdi").html(sonuc.data.personnel);
					$("#proTelefon").html(sonuc.data.phone);
					$("#proEmail").html(sonuc.data.email);
					GLat = sonuc.data.shopLat;
					GLng = sonuc.data.shopLng;
					
					
					
					
				}
				else $(".loginSections").show();
			}
			else{
				$(".loginSections").show();
			}
		}
	);
}

function SorunBildir(){
	var sorun = $("#sorunFormu").val();
	var postData = '{"aksiyon":"sorunBildir","data":{"message":"'+sorun+'"}}';

	
	$.post("http://www.sagclick.com/BAKKALDAN/com/bakkaldan/DEBUG/debugger.php", { bilgi: postData}).done(
		function(data){
			var sonuc = JSON.parse(data);
			if(sonuc.response==true){
				alert("Sorununuz başarıyla iletildi.");
				$("#sorunFormu").val('');
			}
			else{
				alert("Bir problem oluştu. Lütfen daha sonra tekrar deneyiniz.");
			}
		}
	);
	
}
