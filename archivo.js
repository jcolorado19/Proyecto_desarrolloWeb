(function(){
	
	var API_WEATHER_KEY = "61f2494115b891c86ecb5c03b8a502a8";
	var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&";
	var API_NEWS_URL = "https://ajax.googleapis.com/ajax/services/search/news?v=1.0&";

	$("#buscando").html("Buscando por favor espere .....");
	var busqueda;
	var nameCity = $("[data-input='searchCity']");
	var buttonCyti = $("[data-button='buscar']");
	var cityWeather = {};
	cityWeather.zone;

	var newsCurrent = {};
	newsCurrent.titulo;
	newsCurrent.descrip;
	newsCurrent.url;

	$( buttonCyti ).on("click", searchCity);

	$( nameCity ).on("keypress", function(event){
		if(event.which == 13){
			searchCity(event);
		}
	});

	

	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(getCoords, errorFound);
	}
	else{
		alert("Tu navegador no soporta geolocation");
	}

	function errorFound(error){
		alert("Ocurrio un error " + error.code);
	}

	function getCoords(position){
		var latitud = position.coords.latitude;
		var longitud = position.coords.longitude;

		console.log("Tu posicion es " + latitud + ", " + longitud);

		$.getJSON(API_WEATHER_URL + "lat=" + latitud + "&lon=" + longitud, getCurrentWeather);

	}

	function searchCity(event){
		event.preventDefault();
		busqueda = $( nameCity ).val().toUpperCase();

		$("#name-city").html( busqueda );
		noticias(busqueda);
	}

	function getCurrentWeather(data){

		console.log(data)
		cityWeather.zone = data.name;

		busqueda = data.name;

		$("#buscando").hide();
		$("#name-city").html( cityWeather.zone);

		noticias(busqueda);
	}

	
	function noticias(busqueda){

		//(nombreCityNew ).val("");
		$( nameCity ).val("");
		$.getJSON(API_NEWS_URL+ "q=" + busqueda+ "&RSZ=4&callback=?", getCurrentNews);

	}

	function getCurrentNews(data){

		console.log(data);
		var i = -1;
		$( "[data-title]").empty();
		$( ".news__title").css("padding-bottom", "0%");
		$( "[data-contenido]").empty();


		for (var i = 0; i <= 3; i++){

			newsCurrent.titulo = data.responseData.results[i].titleNoFormatting;
			newsCurrent.descrip = data.responseData.results[i].content;
			newsCurrent.url = data.responseData.results[i].unescapedUrl;

			renderTemplate();

			function activeTemplate(id){
				var t = document.querySelector(id);
				return document.importNode(t.content, true);
				
			}

			function renderTemplate(){

				var clone = activeTemplate("#templateNews");

				clone.querySelector("[data-title]").innerHTML = "<a href='" + newsCurrent.url + "' target='_blank'>"+newsCurrent.titulo+ "</a>";
				clone.querySelector("[data-contenido]").innerHTML = newsCurrent.descrip+"<br><br><br>";

				$("body").append(clone);
			}


		}
				
	}

	


})();