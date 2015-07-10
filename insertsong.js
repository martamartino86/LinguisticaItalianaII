var filename = "songs.xml";

function loadXMLDoc(filename)
{
if (window.XMLHttpRequest)
  {
  xhttp=new XMLHttpRequest();
  }
else // code for IE5 and IE6
  {
  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xhttp.open("GET",filename,false);
xhttp.send();
return xhttp.responseXML;
}

$("document").ready(function() {
	$("#addSong").click(function() {
		//create new instance of XmlDocument
		var doc = loadXMLDoc(filename);

		//var node = doc.CreateNode(XmlNodeType.Element, "song", null);
		var node = doc.createElement("song");

		var title   = doc.createAttribute("title");
		title.nodeValue = $("#title")[0].value;

		var artist   = doc.createAttribute("artist");
		artist.nodeValue = $("#artist")[0].value;
		
		var video   = doc.createAttribute("video");
		video.nodeValue = $("#video")[0].value;

		var keys   = doc.createAttribute("keys");
		keys.nodeValue = $("#keys")[0].value;

		var text   = doc.createAttribute("text");
		text.nodeValue = $("#text")[0].value;

		node[0].setAttributeNode(title);
//		node.appendChild(title);
		node.appendChild(artist);
		node.appendChild(video);
		node.appendChild(keys);
		node.appendChild(text);
	});
});