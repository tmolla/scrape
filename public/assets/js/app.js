
function displayNotes(articleID){
  //Get all notes associated with the given article id
  $.ajax({
    method: "get",
    url: "/articles/" + articleID
  }).then(function(data) {
    //clear the note area
    $("#exampleModalScrollable .noteContainer").empty();
    $("#exampleModalScrollable").attr("data-id", articleID);

    //if there are notes, loop and display them in the modal card
    if (data.notes) {
      for(var i=0; i < data.notes.length; i++){
        var content = "<div class='card m-1'><div class='card-body'>" + 
        "<p>" + data.notes[i]+ "</p><span class='removeNote' data-id='" + i + "'> 𝘅 </span></div></div>"
        $(".noteContainer").append($(content));          
      }
    }
    //display modal
    $('#exampleModalScrollable').modal('show');
  });
}
$(document).on("click", ".btn-outline-success", function(event) {
  event.preventDefault();
  const pattern = $(".search").val();
  if (pattern) {
    $.ajax({
      method: "get",
      url: "/search/" + pattern
    });
  }
});

$(document).on("click", "#note", function() {
  //display all notes for the given article
  const thisId = $(this).attr("data-id");
  displayNotes(thisId)
});

// When you click the savenote button
$(document).on("click", ".saveNote", function(event) {
  event.preventDefault();
  // Grab the article id and note text
  var thisId = $("#exampleModalScrollable").attr("data-id");
  var thisNote = $("#exampleFormControlTextarea1").val();

  // Run a POST request to save the note
  $.ajax({
    method: "POST",
    url: "/note/" + thisId,
    data: {
      text: thisNote,
    }
  })
    .then(function() { //display the notes and cleanup the textarea;
      displayNotes(thisId)
      $("#exampleFormControlTextarea1").val("");
    });
});

$(document).on("click", "#deleteArticle", function() {
  var article_id = $(this).attr("data-id");
  // Run a POST request to delete article
  $.ajax({
    method: "delete",
    url: "/articles/" + article_id,
  }).then(function(data) {
      //remove the card for deleted article form the array
      $("[data-id=" + article_id + "]").remove();
    }
  );
});

$(document).on("click", ".removeNote", function() {
  const noteIndex = $(this).attr("data-id");
  const articleId = $("#exampleModalScrollable").attr("data-id")
  console.log(noteIndex)
  console.log(articleId)
  // Run a POST request to change the note
  var id = {
              "articleId": articleId, 
              "noteIndex":noteIndex 
            }
  $.ajax({
     method: "delete",
     url: "/note/" + JSON.stringify(id),
    }).then(function() {
      displayNotes(articleId)
    }
  );
});


// When you click the save button
$(document).on("click", "#saveArticle", function() {
  // Grab the id associated with the article from the submit button
  const link = $(this).attr("data-link");
  const title = $(this).attr("data-title");
  const id = ($(this).attr("data-id"));

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/save",
    data: {
      title: title,
      link: link
    }
  }).then(function(data) {
      // Remove the saved card from the scraped card list
      $("[data-id=" + id + "]").remove();
    }
  );
});
