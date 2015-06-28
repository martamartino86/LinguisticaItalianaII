var radice;
var songstruct = [];
//var keysPositions = []; // HA SENSO? PENSACI...
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
   this.id;
   this.artist;
   this.title;
   this.keys = [];
   this.text;

   this.inizializza = function(xmlsong) {
      this.id = generateId();
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
            console.log("aggiungo chiave "+this.keys[i]+" e primo elemento")
            var elem = {key: this.keys[i], songs: new Array(this)};
            songstruct.push(elem);
            // la aggiungo anche al dizionario delle chiavi
            // var keypos =  {key: this.keys[i], pos_songstruct: i}
            // keysPositions.push(keypos);
         }
         else {
            console.log(this.keys[i]+" esiste già")
            songstruct[pos].songs.push(this);
         }
      }
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

$("document").ready(function(){
   // radice del file xml
   var songs = [];

   radice = caricaXML(file);
   songs = radice.getElementsByTagName("song");
   for (var i = 0; i < songs.length; i++) {
      var s = new Song();
      s.inizializza(songs[i]);
   }
   
   console.log("uscito dal for.")

   // EVENT HANDLERS
	$("#searchbtn").click(function() {
      console.log("searchbtn event handler");
      searchbtn_pressed();
   });
   $('form').on("keypress", function(e) {
         if (e.keyCode == 13) {
            console.log("* * * * Enter pressed");
            searchbtn_pressed();
            return false; // prevent the button click from happening
         }
   });

   function searchbtn_pressed() {
      // array di oggetti trovati nella ricerca (per evitare di ripetere lo stesso risultato nella stessa ricerca)
      var foundSongs = [];

      var userinput = ((document.getElementById("textinput").value).toLowerCase()).split(",");
      // tolgo gli spazi laterali da tutte le stringhe
      for (u in userinput)
         userinput[u] = userinput[u].trim();

      var s = "";
      // ripulisci il text del div
      // $("#results").contents().filter(function(){
      //    return this.nodeType === 3;
      // }).remove();
      $("#results").empty();

      if (userinput.length != 0) {
         console.log(userinput);
         for (k in userinput) {
            var key = userinput[k];
            var pos = containsKey(key);
            console.log("posizione trovata: "+pos);
            if (pos != -1) {
               for (var i = 0; i < songstruct[pos].songs.length; i++) {
                  // lo devo mostrare nel div solo se non l'ho ancora mostrato nei risultati
                  if ($.inArray(songstruct[pos].songs[i].id, foundSongs) == -1) {
                     foundSongs.push(songstruct[pos].songs[i].id);
                     var artist = songstruct[pos].songs[i].artist;
                     var title  = songstruct[pos].songs[i].title;
                     s = artist + " - " + title + " <br> " ;
                     //var pagelink = "<a href=\"" + (artist.replace(/ /g,'')) + (title.replace(/ /g,'')) + ".html\">" + s + "</a>";
                     var pagelink = "<a href=\"searchresults.html?artist=" + (artist.replace(/ /g,'_')) + "&title=" +  (title.replace(/ /g,'_')) + "\">" + s + "</a>";
                     $("#results").append(pagelink);
                  }
               }
            }
            else 
               $("#results").append("Nessun risultato trovato.");
         }
         $("#results").css("visibility","visible");
         
         //window.location.href = "searchresults.html";
         return false;
      }
      return false; // prevent the button click from happening
   }

});