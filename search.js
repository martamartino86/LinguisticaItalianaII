var indexes = [];
var result;
var file = "songs.xml";

// function fillIndexes() {
// 	Papa.parse(file, {
// 		complete: function(results) {
// 			indexes = results;
// 		}
// 	});

// }

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
   result = caricaXML(file);
   console.log(result);
	$("#searchbtn").click(function(){
		console.log("CLICK")
	});
});