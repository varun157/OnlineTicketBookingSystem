var idata;
var locations;
var cinemas;
var selectedCinema;
var slots;
var SelectedMovie;
var searchParams;
var imovies;

$(document).ready(function () {
		
	SelectedMovie = localStorage.getItem('movie');

	if(SelectedMovie != undefined){
		$("#movieHeading").html(SelectedMovie);
	} else{
		$("#movieHeading").html(localStorage.getItem('movie'));
	}	

	poster = localStorage.getItem('poster');
	$("#poster").attr('src', poster);

	$.getJSON({
		url: 'movies.json',
		dataType: 'json',
		success: function (data) {  
			imovies =  data;  
			loadMovieCarousel();
			showMovieThumbs();                
		},
		error: function (jqXHR, textStatus, errorThrown) {
		  alert('Error: ' + textStatus + ' - ' + errorThrown);
		},
	});

	$.getJSON({
		url: 'TbData.json',
		dataType: 'json',
		success: function (data) {
			idata = data;
			loadCityList();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('Error: ' + textStatus + ' - ' + errorThrown);
		},
	});


});


function loadCityList() {
	var ddCity = "<select style='width:250px; height:40px' name='cityList' id='cityList' onchange='showCinemas(this)'><option>---Select---</option>";
	for (var i = 0; i < idata.locations.length; i++) {
		var row = "<option>" + idata.locations[i].city + "</option>";
		ddCity = ddCity + row;
	}
	ddCity = ddCity + '</select>'
	$("#cities").append(ddCity);
}

function showCinemas(x) {
	document.getElementById("cinemas").style.visibility = 'visible';
	console.log("Selected city - " + x.value);
	for (var i = 0; i < idata.locations.length; i++) {
		if (idata.locations[i].city === x.value) {
			cinemas = idata.locations[i];
			var ddCinema = "<select style='width:250px; height:40px' name='cinemaList' id='cinemaList' onchange='showSlots(this)'><option>---Select---</option>"
			for (var i = 0; i < cinemas.cinemas.length; i++) {
				var optn = "<option>" + cinemas.cinemas[i].name + "</option>";
				ddCinema = ddCinema + optn;
			}
			ddCinema = ddCinema + '</select>'
			if ($("#cinemaList")) {
				$("#cinemaList").remove();
			}

			$("#cinemas").append(ddCinema);
		}
	}
}

function showSlots(y) {
	document.getElementById("slots").style.visibility = 'visible';
	console.log("Selected cinema - " + y.value);
	for (var i = 0; i < cinemas.cinemas.length; i++) {
		if (cinemas.cinemas[i].name === y.value) {
			selectedCinema = cinemas.cinemas[i];
			GetMovieSlots();
			$("#timings").empty();
			for (var i = 0; i < slots.length; i++) {
				console.log(slots[i].slot);
				$("#timings").append("<input type='radio' name='movieSlots' id='movieSlots'+i value='" + slots[i].slot + "' onchange='showButton()'> " + slots[i].slot + " ");
			}
		}
	}
}

function GetMovieSlots() {
	SelectedMovie = localStorage.getItem('movie');;
	for (var i = 0; i < selectedCinema.movies.length; i++) {
		if (selectedCinema.movies[i].name.replace(':', '') == SelectedMovie) {
			slots = selectedCinema.movies[i].timings;
		}
	}
}
function showButton() {
	document.getElementById("button").style.visibility = 'visible';
}

function setData() {
	var city = document.getElementById('cityList').value;
	var cinema = document.getElementById('cinemaList').value;
	var slot = document.getElementById('movieSlots').value;

	localStorage.setItem('movie', SelectedMovie);
	localStorage.setItem('city', city);
	localStorage.setItem('cinema', cinema);
	localStorage.setItem('slot', slot);

	window.location = 'SelectionPage2.html';
}

function getData() {
	var movie = localStorage.getItem('movie');
	var city = localStorage.getItem('city');
	var cinema = localStorage.getItem('cinema');
	var slot = localStorage.getItem('slot');

	document.getElementById('movie').innerHTML = movie;
	document.getElementById('selectionInfo').innerHTML = "City : " + city + ", Cinema : " + cinema + ", Show Time : " + slot;

}

function selectSeats(z) {
	document.getElementById("arrangement").style.display = 'block';
	console.log("Number of Seats - " + z.value)

	var limit = z.value;
	$("input:checkbox").click(function () {
		var check = $("input:checkbox:checked").length >= limit;
		$("input:checkbox").not(":checked").attr("disabled", check);
	});
	showNextButton();
}

function showNextButton() {
	document.getElementById("proceed").style.visibility = 'visible';
}

function openPage(id){
	
	for(i=0; i < imovies.movies.length; i++){
		if(imovies.movies[i].id === id){
			localStorage.setItem('movie', imovies.movies[i].id);
			localStorage.setItem('movie', imovies.movies[i].name);
			localStorage.setItem('poster', imovies.movies[i].poster);
			localStorage.setItem('thumbnail', imovies.movies[i].thumbnail);
		}
	}
	window.location = 'SelectionPage.html';
}

function showTickets(){
	var checkedValue = $('.seatSelection:checked').val();
	console.log("Seats - " + checkedValue)

	document.getElementById("selectionInfo").style.display='none';
	document.getElementById("proceed").style.display='none';
	document.getElementById("seats").style.display='none';
	document.getElementById("arrangement").style.display='none';
	document.getElementById("ticketPrint").style.display='block';

	var movie = localStorage.getItem('movie');
	var cinema = localStorage.getItem('cinema');
	var city = localStorage.getItem('city');
	var slot = localStorage.getItem('slot');
	thumb = localStorage.getItem('thumbnail');
	
	
	document.getElementById('tkt').innerHTML = '<h2>' + movie + '</h2><p>' + cinema + ', ' + city + ', ' + slot + '</br></br>Selected Seats: ' + checkedValue + ' </p>';
	
	var imgThumb = document.createElement("Img"); 	
	imgThumb.id = "thumb";	
	document.getElementById('tkt').append(imgThumb)

	$("#thumb").attr({'src': thumb, 'height': '180px'});


}

function loadMovieCarousel() {	
	for (var i = 0; i < imovies.movies.length; i++) {
		if(i == 0){
		var carousel = '<div class="carousel-item active">';
		}else {
		var carousel = '<div class="carousel-item">';
		}        
		carousel = carousel + '<img src="' + imovies.movies[i].poster + '" height="450" style="width:72%"></div>';        
		$("#posterCarousel").append(carousel);
	}                     
}
   
function showMovieThumbs(){
	
	$("#movieList").append('<h2 style="text-align:center; margin:25px 0">Now Playing</h2>');
	$("#movieList").append('<div class="row"></div>');
	for (var i = 0; i < imovies.movies.length; i++) {
		var thumb = '<div class="col-md-4 moviethumb">';
		thumb += '<img src="' + imovies.movies[i].thumbnail + '" width="210" height="300">';
		thumb += '<h5>' +  imovies.movies[i].name + '</h5>';
		thumb += '<button type="button" class="btn btn-primary" onclick="javascript:openPage('+ imovies.movies[i].id + ')">Book Now</button></div>';
		$("#movieList .row").append(thumb);
	} 	
}