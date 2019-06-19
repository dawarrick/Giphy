//Javascript for the Trivia game
//array of objects to provide questions and responses
var topics = ["dogs", "60s TV", "70s TV", "80s TV"];

var queryURL = "https://api.giphy.com/v1/gifs/search?q=";
var queryURL1 = "https://api.giphy.com/v1/gifs/search?q=dogs";
var apiKey = "&api_key=vgOEml4vuRJzWg2AyhodhFKVjc8AEayP&limit=10";


//loop through the topics array and display as buttons
function createButtons() {
  $("#buttonarea").empty();
  //display buttons

  for (var i = 0; i < topics.length; i++) {
    var optionBtn = $("<button>");
    optionBtn.addClass("option");
    optionBtn.attr("searchstr", topics[i]);
    optionBtn.text(topics[i]);
    $("#buttonarea").append(optionBtn);
    /*$("#displayarea").append("<br>");*/
  }
}



//display the still images
function displayGifs(gifobject) {
  var response = "";

  //clear the question and display the result
  $("#gifarea").empty();

  for (var i = 0; i < gifobject.data.length; i++) {

    /*createElement("<div>", "response", response, "#displayarea");*/

    //downsized.url, fixed_width_small_still.url. dowsized_still.url, fixed_width_small_still.url
    var imgURL = gifobject.data[i].images.downsized_still.url;
    var imgActionURL = gifobject.data[i].images.downsized.url;
    var image = $("<img>").attr("src", imgURL);
    image.addClass("gif");
    image.attr("still", "yes");
    image.attr("stillURL", imgURL);
    image.attr("actionURL", imgActionURL);
    $("#gifarea").append(image);
  }
}


//function will create an element based on parameters passed
function createElement(type, addclass, text, location) {
  var addOne = $(type);

  if (addclass !== "") {
    addOne.addClass(addclass);
  }
  if (text !== "") {
    addOne.text(text);
  }
  $(location).append(addOne);
}


//waiting on button clicks
$(document).ready(function () {

  createButtons();

  //popluate the gifs when the cilck on a category button
  $("#buttonarea").on('click', '.option', function () {
    //displayGifs($(this).attr("text"));
    $.ajax({ url: queryURL + $(this).attr("searchstr") + apiKey, method: 'GET' })
      .done(function (giflist) {
        console.log(giflist);
        console.log(queryURL + $(this).attr("text") + apiKey);
        displayGifs(giflist);
      });
  });

  //when gif is clicked on, change from still to animate or vise-versa
  $("#gifarea").on('click', '.gif', function () {
    if ($(this).attr("still") === "yes")
    {
      $(this).attr("src", $(this).attr("actionURL"));
      $(this).attr("still","no");
    }
    else
    {
      $(this).attr("src", $(this).attr("stillURL"));
      $(this).attr("still", "yes");
    }
  });

});
