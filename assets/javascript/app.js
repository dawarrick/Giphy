//Javascript for the Trivia game
//array of objects to provide questions and responses
var topics = ["dogs", "TV 1940s", "TV 1950s", "TV 1960s", "TV 1970s", "TV 1980s", "TV 1990s", "TV 2000s"];
var topics1 = ["dogs", "cats", "horses", "pigs"];

var queryURL = "https://api.giphy.com/v1/gifs/search?q=";
//var queryURL1 = "https://api.giphy.com/v1/gifs/search?q=dogs";
var apiKey = "&api_key=vgOEml4vuRJzWg2AyhodhFKVjc8AEayP";
var limit = 10;

//loop through the topics array and display as buttons
function createButtons() {
  $("#buttonarea").empty();
  //display buttons

  for (var i = 0; i < topics.length; i++) {

    //var optionBtn='<button type="button" class="btn btn-info">';
    var optionBtn = $("<button>");
    optionBtn.attr('type', 'button');
    optionBtn.attr("searchstr", topics[i]);
    optionBtn.addClass("btn btn-info");
    optionBtn.text(topics[i]);
    $("#buttonarea").append(optionBtn);
  }
}


//display the still images
function displayGifs(gifobject) {
  var response = "";

  //clear the question and display the result
  $("#gifarea").empty();

  for (var i = 0; i < limit; i++) {
    /*createElement("<div>", "response", response, "#displayarea");*/
    //downsized.url, fixed_width_small_still.url. dowsized_still.url, fixed_width_small_still.url
    //if (gifobject.data[i].images.downsized_still.url if !== "null") {
    var imgURL = getImage("still", i, gifobject);
    //console.log(imgURL);
    var imgActionURL = getImage("active", i, gifobject);
    //console.log(imgActionURL);
    //console.log((imgURL !== "" && imgActionURL !== ""));

    if (imgURL !== "null" && imgActionURL !== "null") {
      //     var imgURL = gifobject.data[i].images.downsized_still.url;
      //   var imgActionURL = gifobject.data[i].images.downsized.url;
      var image = $("<img>").attr("src", imgURL);
      image.addClass("gif");
      image.attr("still", "yes");
      image.attr("stillURL", imgURL);
      image.attr("actionURL", imgActionURL);
      $("#gifarea").append(image);
    }
  }
}

function getImage(imgType, i, gifobject) {
  var returnURL = "null";
  if (imgType == "still") {
    //console.log(gifobject.data[i].images.downsized_still.url);
    if (gifobject.data[i].images.hasOwnProperty("downsized_still")) {
      if (gifobject.data[i].images.downsized_still.url !== "null") {
        //console.log(gifobject.data[i].images.downsized_still.url);
        return gifobject.data[i].images.downsized_still.url;
      }
    }
    if (gifobject.data[i].images.hasOwnProperty("fixed_width_small_still")) {
      if (gifobject.data[i].images.fixed_width_small_still.url !== "null") {
        return gifobject.data[i].images.fixed_width_small_still.url;
      }
    }
  }
  else
    if (gifobject.data[i].images.hasOwnProperty("downsized")) {
      if (gifobject.data[i].images.downsized.url !== "null") {
        return gifobject.data[i].images.downsized.url;
      }
    }
  if (gifobject.data[i].images.hasOwnProperty("fixed_width_small")) {
    if (gifobject.data[i].images.fixed_width_small_still.url !== "null") {
      return gifobject.data[i].images.fixed_width_small_still.url;
    }
  }
  return returnURL;
}



//waiting on button clicks
$(document).ready(function () {

  createButtons();
  $("#search-value").on('click', function () {

    event.preventDefault();

    var search = $("#search-criteria").val().trim();
    if (search == "null") {
      alert("Please enter search criteria.");
    }
    else {
      $.ajax({ url: queryURL + search + apiKey, method: 'GET', contentType: 'nosniff', responseType: 'nosniff' })
        .done(function (giflist) {
          //       console.log(giflist);
          //       console.log(queryURL + $(this).attr("text") + apiKey);
          if (giflist.data.length == 0) {
            alert("Sorry, no results for that search");
          }
          else {
            topics[topics.length] = search;
            createButtons();
            displayGifs(giflist);
          }
        });
    }
  });



  //populate the gifs when the cilck on a category button
  $("#buttonarea").on('click', '.btn-info', function () {
    //displayGifs($(this).attr("text"));
    var search = $(this).attr("searchstr") + "&limit=10";
    $.ajax({ url: queryURL + search + apiKey, method: 'GET', contentType: 'nosniff', responseType: 'nosniff' })
      .done(function (giflist) {
        //       console.log(giflist);
        //       console.log(queryURL + $(this).attr("text") + apiKey);
        if (giflist.data.length == 0) {
          alert("Sorry, no results for that search");
        }
        else {
          displayGifs(giflist);
        }
      });
  });

  //when gif is clicked on, change from still to animate or vise-versa
  $("#gifarea").on('click', '.gif', function () {
    if ($(this).attr("still") === "yes") {
      $(this).attr("src", $(this).attr("actionURL"));
      $(this).attr("still", "no");
    }
    else {
      $(this).attr("src", $(this).attr("stillURL"));
      $(this).attr("still", "yes");
    }
  });

});
