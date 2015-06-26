var radice;
var songstruct = [];
var file = "songs.xml";

// DEBUG
var debug;

function containsKey(k) {
   for (var i = 0; i < songstruct.length; i++) {
      if (songstruct[i].key === k) {
         console.log("key trovata")
         return i;
      }
   }
   console.log("key non trovata")
   return -1;
}

// costruttore oggetto Song
function Song() {
   this.artist;
   this.title;
   this.keys = [];
   this.text;

   this.inizializza = function(xmlsong) {
      this.artist = xmlsong.getElementsByTagName("artist")[0].firstChild.nodeValue;
      this.title  = xmlsong.getElementsByTagName("title")[0].firstChild.nodeValue;
      this.text   = xmlsong.getElementsByTagName("text")[0].firstChild.nodeValue;
      var chiavi  = xmlsong.getElementsByTagName("key");
      for (var i = 0; i < chiavi.length; i++) {
         this.keys[i] = chiavi[i].firstChild.nodeValue;
      }
      // per ogni chiave della canzone, devo controllare se esiste già in songstruct ed inserirla dove serve
      for (var i = 0; i < this.keys.length; i++) {
         console.log(this.keys[i]);
         var pos = (containsKey(this.keys[i]));
         if (pos == -1) {
            console.log("aggiungo chiave e primo elemento")
            var elem = {key: this.keys[i], songs: new Array(this)};
            songstruct.push(elem);
         }
         else {
            console.log("esiste già")
            songstruct[pos].songs.push(this);
         }
      }
      
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

$("document").ready(function(){
   var songs = [];
   radice = caricaXML(file);
   songs = radice.getElementsByTagName("song");
   for (var i = 0; i < songs.length; i++) {
      var s = new Song();
      s.inizializza(songs[i]);
   }
   
   console.log("uscito dal for")

	$("#searchbtn").click(function(){
	});
});