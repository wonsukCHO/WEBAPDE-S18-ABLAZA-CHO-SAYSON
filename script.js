<script src="jquery-3.3.1.min.js" type="text/javascript"></script>
$(document).ready(() => {
    $("#search_btn").click(function () {
        search();
    });
});


function search() {
    var result = document.getElementById("searchbar").value;
    result = result.toLowerCase().trim();
    console.log(result);

    if (result == "normie") {
        //go to tags-normie
        window.location.href = "tags-normie.html"
    } else if (result == "justright") {
        //go to tags-justright
        window.location.href = "tags-justright.html"

    } else if (result == "dank") {
        //go dank
        window.location.href = "tags-dank.html"

    } else {
        alert("No matches returned");
    }
}

$(document).ready(() => {
    $("#post_btn").click(function () {
        post();
    });
});
