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
	    this.video  = (xmlsong.getElementsByTagName("video")[0].firstChild.nodeValue).replace("watch?v=", "v/");
	    this.text   = xmlsong.getElementsByTagName("text")[0].innerHTML;
	    var chiavi  = xmlsong.getElementsByTagName("keys");
	    for (var i = 0; i < chiavi.length; i++) {
	       this.keys[i] = chiavi[i].firstChild.nodeValue;
	    }
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
	var title   = address.substring(address.lastIndexOf('title=')+6);

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
			$("#wiki").append("<b>(Tratto da <a href\"=www.wikipedia.it\">Wikipedia</a>)</b> " + extractInfo);
	});

	// gestisci Youtube
	$("#player").append("<iframe width=\"420\" height=\"315\" src='"+chosenSong.video+"' frameborder=\"0\" allowfullscreen></iframe>");

	// gestisci esercizi
	$(".sceltaEser").append("<br>Scegli l'esercizio da mostrare in base alle attività di interesse:<br>");
	for (var i = 0; i < chosenSong.keys.length; i++) {
		var checkbox = document.createElement('input');
		checkbox.type = "radio";
		checkbox.name = "menuEserc";
		checkbox.id = chosenSong.keys[i];
		var label = document.createElement('label')
		label.htmlFor = "id";
		label.appendChild(document.createTextNode(chosenSong.keys[i]));
		$(".sceltaEser").append(checkbox);
		$(".sceltaEser").append(label);
	}
	$(".eser").append("<br><br><br>");

	// HANDLER RADIO BUTTONS
	$("input:radio[id='forme alterate']").change(function() {
		$(".eser").empty();
		$(".richiesta").empty();
		$(".richiesta").append("Riempi gli spazi bianchi: le parole mancanti sono tutti diminutivi o vezzeggiativi (le cosiddette forme alterate: bellino, piccolino, …).")
		var testoTemp = esercizioSostituzione("forme alterate");
		$(".eser").append(testoTemp);	
	})

	$("input:radio[id='comprensione']").change(function() {
		var file = "";
		var eserciziocomprensione;
		$(".richiesta").empty();
		$(".eser").empty();
		$(".richiesta").append("Rispondi alle domande.");
		var file = title;
		$(".eser").load(file+"-comprensione.html", function(data){
			eserciziocomprensione = data; 
		});
		$(".eser").append(eserciziocomprensione);
	})

	$("input:radio[id='aggettivi']").change(function() {
		$(".eser").empty();
		$(".richiesta").empty();
		$(".richiesta").append("Ascolta la canzone, e riempi gli spazi bianchi con gli aggettivi.")
		var testoTemp = esercizioSostituzione("aggettivi");
		$(".eser").append(testoTemp);	
	});

	$("input:radio[id='verbi']").change(function() {
		$(".eser").empty();
		$(".richiesta").empty();
		$(".richiesta").append("Ascolta la canzone, e riempi gli spazi bianchi con i verbi.")
		var testoTemp = esercizioSostituzione("verbi");
		$(".eser").append(testoTemp);	
	});

	$("input:radio[id='preposizioni']").change(function() {
		$(".eser").empty();
		$(".richiesta").empty();
		$(".richiesta").append("Ascolta la canzone, e riempi gli spazi bianchi con le preposizioni.")
		var testoTemp = esercizioSostituzione("preposizioni");
		$(".eser").append(testoTemp);
	});

	$("input:radio[id='lessico']").change(function() {
		$(".eser").empty();
		$(".richiesta").empty();
		$(".richiesta").append("Trova le parole anagrammate.");
		var testoTemp = esercizioLessico();
		$(".eser").append(testoTemp);
	});
});

function esercizioSostituzione(keyclass) {
	var startPos = 0;
	var endPos   = 0;
	console.log("<key class=\"" + keyclass + "\">")
	testoTemp = chosenSong.text;
	startPos = (testoTemp).indexOf("<key class=\"" + keyclass + "\">");
	while (startPos != -1) {
		var endPos   = (testoTemp).indexOf("</key>", startPos) + 6;
		var substr   = (testoTemp).substring(startPos, endPos);
		console.log(substr)
		testoTemp = (testoTemp).replace(substr, "____________");
		// ricomincio a cercare
		startPos = (testoTemp).indexOf("<key class=\"" + keyclass + "\">");
	}
	testoTemp = (testoTemp).replace(/(?:\r\n|\r|\n)/g, '<br />');
	return testoTemp;
}

function esercizioLessico() {
	var startPos = 0;
	var endPos   = 0;
	testoTemp = chosenSong.text;
	startPos = (testoTemp).indexOf("<key class=\"lessico\">");
	while (startPos != -1) {
		var endPos   = (testoTemp).indexOf("</key>", startPos) + 6;
		var substr   = (testoTemp).substring(startPos, endPos);
		console.log("substr prima: "+substr)
		var a = substr.substring(21, substr.length - 6);
		console.log("a: "+a)
		testoTemp = (testoTemp).replace(substr, "<b>" + a.shuffle() + "</b>");
		// ricomincio a cercare
		startPos = (testoTemp).indexOf("<key class=\"lessico\">");
	}
	testoTemp = (testoTemp).replace(/(?:\r\n|\r|\n)/g, '<br />');
	return testoTemp;
}

String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}