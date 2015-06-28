// DEBUG
var debug;

$("document").ready(function (){
	var address = window.location.href;
	console.log(address)
	var artist  = address.substring(address.lastIndexOf('artist=')+7, address.lastIndexOf('&')); //.replace(/_/g,' ');
	console.log(artist);
	var title   = address.substring(address.lastIndexOf('title=')+6); //replace(/_/g,' ');
	console.log(title);
	//var info = WIKIPEDIA.getData('http://it.wikipedia.org/wiki/' + artist);
	$.get("https://it.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=explaintest=&titles=" + artist,
		function(data, status) {
			var extractInfo;
			for (var i in data.query.pages)
				extractInfo = data.query.pages[i].extract;
			$("#wiki").append(extractInfo);
	})
});
