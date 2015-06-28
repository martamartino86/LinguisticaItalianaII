var radice;
//var songstruct = []; //  NON E' DETTO CHE SERVA: PENSACI!
var chosenSong;
var file = "songs.xml";

// DEBUG
var debug;

// function containsKey(k) {
//    for (var i = 0; i < songstruct.length; i++) {
//       if (songstruct[i].key === k) {
//          console.log("key trovata")
//          return i;
//       }
//    }
//    console.log("key non trovata")
//    return -1;
// }

// costruttore oggetto Song
function Song() {
   this.id;
   this.artist;
   this.title;
   this.video;
   this.keys = [];
   this.text;

   this.inizializza = function(xmlsong) {
	    this.id = generateId();
	    this.artist = xmlsong.getElementsByTagName("artist")[0].firstChild.nodeValue;
	    this.title  = xmlsong.getElementsByTagName("title")[0].firstChild.nodeValue;
	    this.video  = xmlsong.getElementsByTagName("video")[0].firstChild.nodeValue;
	    this.text   = xmlsong.getElementsByTagName("text")[0].firstChild.nodeValue;
	    var chiavi  = xmlsong.getElementsByTagName("key");
	    for (var i = 0; i < chiavi.length; i++) {
	       this.keys[i] = chiavi[i].firstChild.nodeValue;
	    }
	      // per ogni chiave della canzone, devo controllare se esiste già in songstruct ed inserirla dove serve
	      // for (var i = 0; i < this.keys.length; i++) {
	      //    console.log(this.keys[i]);
	      //    var pos = (containsKey(this.keys[i]));
	      //    if (pos == -1) {
	      //       console.log("aggiungo chiave "+this.keys[i]+" e primo elemento")
	      //       var elem = {key: this.keys[i], songs: new Array(this)};
	      //       songstruct.push(elem);
	      //    }
	      //    else {
	      //       console.log(this.keys[i]+" esiste già")
	      //       songstruct[pos].songs.push(this);
	      //    }
	      // }
	    return this;
   }

   function generateId() {
      var date = new Date();
      var components = [
          date.getYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
          date.getMilliseconds()
      ];
      var id = components.join("");
      console.log("generated id: "+id);
      return id;
   }
}

function caricaXML(nomeFile) {
   var xmlhttp;
   if (window.XMLHttpRequest) {
      	// IE7+, Firefox, Chrome, Opera, Safari
      	xmlhttp = new XMLHttpRequest();
   } else {
      	// IE6, IE5
      	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }
   xmlhttp.open("GET", file, false);
   xmlhttp.send();
   return xmlhttp.responseXML;
}

$("document").ready(function (){
	var address = window.location.href;
	var id      = address.substring(address.lastIndexOf('id=')+3, address.lastIndexOf('&artist'));
	var artist  = address.substring(address.lastIndexOf('artist=')+7, address.lastIndexOf('&'));
	var title   = address.substring(address.lastIndexOf('title=')+6); //replace(/_/g,' ');

	// estrai dall'xml la canzone che interessa
	radice = caricaXML(file);
  	songs = radice.getElementsByTagName("song");

    var found = false;
    var i = 0;
    var artist_xml = artist.replace(/_/g,' ');
    var title_xml  = title.replace(/_/g,' ');
    while (found == false) {
    	var a = songs[i].getElementsByTagName("artist")[0].firstChild.nodeValue;
    	var t = songs[i].getElementsByTagName("title")[0].firstChild.nodeValue;
		if ((a === artist_xml) && (t === title_xml)) {
	   		var s = new Song();
	    	chosenSong = s.inizializza(songs[i]);
	    	found = true;
	    }
	    i++;
    }

    debug = chosenSong;

	// gestisci Wikipedia
	$.get("https://it.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=explaintest=&titles=" + artist,
		function(data, status) {
			var extractInfo;
			for (var i in data.query.pages)
				extractInfo = data.query.pages[i].extract;
			$("#wiki").append(extractInfo);
	});

	// gestisci Youtube
	$('video,audio').mediaelementplayer({
		success: function (mediaElement, domObject) {  
        // add event listener
	        mediaElement.addEventListener('timeupdate', function(e) {   
	            document.getElementById('current-time').innerHTML = mediaElement.currentTime;
	        }, false);
	        // call the play method
	        mediaElement.play();
	    }
    });
	$("embed").attr("src", chosenSong.video)
	$("source").attr("src", chosenSong.video)

	// $("#my-video").attr("src", chosenSong.video)

	// function playthevideo(){
	// 	var myPlayer = document.getElementById('my-video');
	// 	myPlayer.playVideo();
	// }
	// function stopthevideo(){
	// 	var myPlayer = document.getElementById('my-video');
	// 	myPlayer.stopVideo();
	// }

	// function pausethevideo(){
	// 	var myPlayer = document.getElementById('my-video'); 
	// 	myPlayer.pauseVideo();
	// }

 
});






// 2. This code loads the IFrame Player API code asynchronously.
 //    var tag = document.createElement('script');

 //    tag.src = "https://www.youtube.com/iframe_api";
 //    var firstScriptTag = document.getElementsByTagName('script')[0];
 // 	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 // 	// 3. This function creates an <iframe> (and YouTube player)
 //    //    after the API code downloads.
 //    var player;
 //    function onYouTubeIframeAPIReady() {
	//     player = new YT.Player('player', {
	//     	height: '390',
	//     	width: '640',
	//     	videoId: 'M7lc1UVf-VE',
	//     	events: {
	//     		'onReady': onPlayerReady,
	//         	'onStateChange': onPlayerStateChange
	//       	}
 //    	});
 //  	}

 //    // 4. The API will call this function when the video player is ready.
 //    function onPlayerReady(event) {
 //    	event.target.playVideo();
 //    }

 //    // 5. The API calls this function when the player's state changes.
 //    //    The function indicates that when playing a video (state=1),
 //    //    the player should play for six seconds and then stop.
 //    var done = false;
 //    function onPlayerStateChange(event) {
	//     if (event.data == YT.PlayerState.PLAYING && !done) {
	//     	setTimeout(stopVideo, 6000);
	//       	done = true;
 //   		}
 //  	}
 //  	function stopVideo() {
 //    	player.stopVideo();
 //    }
	
	// //meh
	// $.get(chosenSong.video, function(data, status) {
	// 	debug = data;
	// })