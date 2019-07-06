var API_KEY = "api_key=a0f89cba2c69ec7665661065801a7850";
var base = "https://api.themoviedb.org/3/"

$(function() {
  // enter
    $("#query").keypress(function(e){
    	if(e.keyCode===13){
    	console.log("-------------")
    	var query = $("#query").val();
		searchMovie(query)	
    	}
    });
// click ajax call
    $("#search").on("click", function() {
    	var query = $("#query").val();
		searchMovie(query)
		
		.done(function() {
			console.log("DONE!");
		})
		.fail(function() {
			console.log("Error");
		})
		.always(function() {
			console.log("Action Completed");
		});
		
    });
});

function searchMovie(query){
	var url = "https://api.themoviedb.org/3/search/movie?"+ API_KEY + "&query=" + query;
	$.ajax({
		url: url,
		type: 'GET',
		contentType: "application/json; charset=utf-8",
		async: false,
		dataType: "json",
		success: function(data, status, jqXHR) {
			console.log(data);
			var mov = data.results
			if(mov.length == 0){
				alert(" No match found. ")
			}
			$("#result").html();
			for(var i=0; i < mov.length; i++){
				console.log("here")
				var img_base = "http://image.tmdb.org/t/p/"
				var path =   img_base + "original/"+ mov[i].backdrop_path 
				var vid_path = base + "movie/" + mov[i].id + "/videos?" + API_KEY
				var vidLink = vidCall(vid_path)
				var status = "Click for video.";
				// console.log(key)
				if(vidLink == null){
					status = "No video available."
				}
				if(mov[i].backdrop_path == null){
					path = "img/notfound.jpg"
				}
				$("#result").append("<div><div class='well'><table class='card'><td><a href="+ vidLink + "><h2>" + mov[i].title + "</h2><img src=" + path + "></img><h3>" +  status + "</h3><br><p>" + mov[i].overview + "<div><br><h4>" + "Date Released: " + mov[i].release_date +  "<t><t><t><t> Vote Count: " + mov[i].vote_count + "</h4>" + "</p></a></td></table></div></div></div>");
			}
		}
	})
}

function vidCall(url){
	var vid_path = url
	var yt = "https://www.youtube.com/watch?v="
	var key;
	var link;
	$.ajax({
		url: vid_path,
		type: 'GET',
		contentType: "application/json; charset=utf-8",
		async: false,
        dataType: "json",
		success: function(vid){
			key = vid.results[0].key
			if(vid.results.length == 0){
				link = null
			}
			link = yt + key
			console.log(vid)
		}
	})
	console.log(link)
	return link
}

function noVid(){
	alert("Sorry! No video available for this movie..")
	return
}