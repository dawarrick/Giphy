//Javascript for the Giphy

//array of objects to provide starting topics
var topics = ["TV 1940s", "TV 1950s", "TV 1960s", "TV 1970s", "TV 1980s", "TV 1990s", "TV 2000s", "TV 2010s"];

var queryURL = "https://api.giphy.com/v1/gifs/search?q=";
//going to limit it to 10
var apiKey = "&api_key=vgOEml4vuRJzWg2AyhodhFKVjc8AEayP&limit=10";
//this will store an array of user entered search items in localstorage
var topicsUser=[];
var userCnt = 0;    //initialize variable to see if there are any initially in storage

//loop through the topics array and display as buttons
function createButtons() {
  $("#buttonarea").empty();
  //display buttons
  for (var i = 0; i < topics.length; i++) {

    //var optionBtn='<button type="button" class="btn btn-info">';
    var optionBtn = $("<button>");
    optionBtn.attr('type', 'button');
    optionBtn.addClass("btn btn-info");
    optionBtn.text(topics[i]);
    $("#buttonarea").append(optionBtn);
  }
}


//display the still images
function displayGifs(gifobject) {
  var response = "";

  //clear the area and display the result
  $("#gifarea").empty();
  console.log(gifobject);

  for (var i = 0; i < gifobject.data.length; i++) {

    //get the rating for the image
    var rating = gifobject.data[i].rating;
    //get the URL of a still image  
    var imgURL = getImage("still", i, gifobject);
    //get the URL for the action version of the image 
    var imgActionURL = getImage("active", i, gifobject);

    //only display if both a still and action url are available
    if (imgURL !== "null" && imgActionURL !== "null") {

      //create a card for each image
      var card = createElement("<div>", "card", "", "#gifarea", "img-" + i);
      var cardTitle = createElement("<div>", "card-title", "Rating: " + rating, "#img-" + i, "");

      //card image 
      var image = $("<img>").attr("src", imgURL);
      image.addClass("gif");
      image.addClass("card-img-top");

      //the "still" attribute will maintain which url is currently active
      image.attr("still", "yes");
      //add the urls as attributes to the image for easy retrieval
      image.attr("stillURL", imgURL);
      image.attr("actionURL", imgActionURL);
      $("#img-" + i).append(image);

    }
  }
}

//function will create an element based on parameters passed
function createElement(type, addclass, text, location, attrId) {
  var addOne = $(type);

  if (addclass !== "") {
    addOne.addClass(addclass);
  }
  if (text !== "") {
    addOne.text(text);
  }
  if (attrId !== "") {
    addOne.attr('id', attrId);
  }
  $(location).append(addOne);
}

//get the image based on the type.  Not all images available, so have two options for each
function getImage(imgType, i, gifobject) {
  var returnURL = "null";
  if (imgType == "still") {
    //see if the images has the property for the particular image
    if (gifobject.data[i].images.hasOwnProperty("downsized_still")) {
      if (gifobject.data[i].images.downsized_still.url !== "null") {
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

function initialize() {
  //see if they have previously been here and added items.
  var topicsUserA = JSON.parse(localStorage.getItem('topicsLS'));
  if (topicsUserA) {
    topicsUser = topicsUserA;
    //add any local store topics to the main array
    for (var i = 0; i < topicsUser.length; i++) {
      topics[topics.length] = topicsUser[i];
    }
    UserCnt = i;
  }
  //display the buttons from the array
  console.log(userCnt);
  createButtons();
}


//waiting for everything to be ready
$(document).ready(function () {

  //start
  initialize();

  //if they enter in a new search criteri, add to array and populate
  $("#search-button").on('click', function () {

    //don't want the submit default refresh screen to trigger
    event.preventDefault();

    var search = $("#search-criteria").val().trim();

    if (search === "") {
      alert("Please enter search criteria, then hit submit.");
    }
    //see if it's already in the array.  This method should be case insensitive
    else if (topics.findIndex(item => search.toLowerCase() === item.toLowerCase()) >= 0) {
      alert("That subject is already in the list.");
    }
    else {
      $.ajax({ url: queryURL + search + apiKey, method: 'GET', contentType: 'nosniff', responseType: 'nosniff' })
        .done(function (giflist) {

          if (giflist.data.length == 0) {
            alert("Sorry, no results for that search");
          }
          else {
            //add it to the array
            topics[topics.length] = search;
            //add it to the local array 
            topicsUser[topicsUser.length] = search;
            //and save to storage
            localStorage.setItem("topicsLS", JSON.stringify(topicsUser));
            //clear the entry field
            $("#search-criteria").val("");
            //redisplay the button
            createButtons();
            //display the gifs
            displayGifs(giflist);
          }
        });
    }
  });


  //populate the gifs when the click on a category button
  $("#buttonarea").on('click', '.btn-info', function () {

    var search = $(this).text();

    //I put in the nosniff because I was having lots of security issues at one time.
    $.ajax({ url: queryURL + search + apiKey, method: 'GET', contentType: 'nosniff', responseType: 'nosniff' })
      .done(function (giflist) {
        // console.log(giflist);
        if (giflist.data.length === 0) {
          alert("Sorry, no results for that search");
        }
        else {
          displayGifs(giflist);
        }
      });
  });

  //when gif is clicked on, change from still to animate or vice-versa
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
