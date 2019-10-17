var API_KEY = 'a0f89cba2c69ec7665661065801a7850';
var base_url = 'https://api.themoviedb.org/3/';
var page = 1;

$(function() {
    nowShowing()
    $('#query').keypress(function(e) {
        if (e.keyCode === 13) {
            var query = $('#query').val();
            searchMovie(query);
        }
    });
    $('#search').on('click', function() {
        var query = $('#query').val();
        searchMovie(query).done(() => {
            console.log('DONE!');
        }).fail(() => {
            console.log('Error');
        }).always(() => {
            console.log('Action Completed.');
        });
    });
});

function nowShowing() {
    var url = 'https://api.themoviedb.org/3/movie/now_playing?api_key='+ API_KEY + '&page=' + page;
    $.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        async: false,
        dataType: 'json',
        success: handleNowShowingSuccess
    });
};

function handleNowShowingSuccess(data) {
    var mov = data.results;
    $('#top').html();
    for (var i = 0; i < 6; i++) {
        var img_base = 'http://image.tmdb.org/t/p/';
        var path = img_base + 'original/' + mov[i].backdrop_path;
        var vid_path = base_url + 'movie/' + mov[i].id + '/videos?api_key=' + API_KEY;
        var vidLink = vidCall(vid_path);
        var genre = getGenre(mov[i].genre_ids[0]);
        var status = 'Click for video';
        if (vidLink == null) {
            status = 'No video available';
        }
        if(mov[i].backdrop_path == null){
            path = 'img/notfound.jpg';
        }
        $('#top').append('<div><div class="top">' + '<table class="top_card"><td><a href='
            + vidLink + '><h2>' + mov[i].title + '</h2><img src=' + path + '></img><h3>'
            + status + '</h3><br><p>' + mov[i].overview + '<div><br><h4>' + 'Date Released: '
            + mov[i].release_date +  '<t><t><t><t> Vote Count: ' + mov[i].vote_count + '  Genre: '
            + genre + '</h4>' + '</p></a></td></table></div></div></div>');
    };
};

function searchMovie(query){
    var url = 'https://api.themoviedb.org/3/search/movie?api_key='+ API_KEY + '&query=' + query + '&page=' + page;
    $.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        async: false,
        dataType: 'json',
        success: handleSearchMovieSuccess
    });
};

function handleSearchMovieSuccess(data) {
    var mov = data.results;
    $('.label').remove();
    $('.top').remove();
    $('.result').remove();
    if (mov.length == 0) {
        alert(' Sorry! No match found. ');
    }
    $('#result').html();
    $('#result').append('<h2 class="result">Top Results</h2><br>');
    for (var i = 0; i < mov.length; i++) {
        var img_base = 'http://image.tmdb.org/t/p/';
        var path =   img_base + 'original/' + mov[i].backdrop_path;
        var vid_path = base_url + 'movie/' + mov[i].id + '/videos?api_key=' + API_KEY;
        var vidLink = vidCall(vid_path);
        var genre = getGenre(mov[i].genre_ids[0]);
        var status = 'Click for video';
        if (vidLink == null) {
            status = 'No video available';
        }
        if (mov[i].backdrop_path == null) {
            path = 'img/notfound.jpg';
        }
        $('#result').append('<div><div class="result">' + '<table class="card"><td><a href='
            + vidLink + '><h2>' + mov[i].title + '</h2><img src=' + path + '></img><h3>'
            + status + '</h3><br><p>' + mov[i].overview + '<div><br><h4>' + 'Date Released: '
            + mov[i].release_date +  '<t><t><t><t> Vote Count: ' + mov[i].vote_count + '  Genre: '
            + genre + '</h4>' + '</p></a></td></table></div></div></div>');
    };
};

function vidCall(url) {
    var yt = 'https://www.youtube.com/watch?v=';
    var vid_path = url;
    var key;
    var link;
    $.ajax({
        url: vid_path,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        async: false,
        dataType: 'json',
        success: function(vid) {
            if (vid.results.length == 0){
                link = null;
            } else {
                key = vid.results[0].key;
                link = yt + key;
            }
        }
    });
    console.log(link);
    return link;
};

function getGenre(id) {
    var url = base_url + 'genre/movie/list?api_key=' + API_KEY + '&language=en-US';
    var genre;
    $.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        async: false,
        dataType: 'json',
        success: function(data) {
            for (i = 0; i != data.genres.length; i++) {
                if (id == data.genres[i].id) {
                    genre = data.genres[i].name;
                }
            }
        }
    })
    return genre;
};
