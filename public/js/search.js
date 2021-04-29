var selected = null;
$(document).ready(function () {
  $('#criteria input[name="pshow').click(function (e) {
    if (selected != $(this)) {
      $("#criteria .hideable").hide(300);
      $(this).parent().next().show(600);
      selected = $(this);
    }
  });
  // TODO: Ensure at least one checkbox checked or one field filled
  $("#criteria").on("submit", function (e) {
    if ($("#pbytext:checked").val()) {
      var lengthsum = 0;
      const inputs = $("#bytextlist input");
      for (var i = 0; i < inputs.length; ++i)
        lengthsum += inputs[i].value.length;
      if (lengthsum === 0) {
        e.preventDefault();
        alert("Please enter at least one search field");
      }
    } else {
      if ($("#pbyissue:checked").val()) {
        if ($("#byissuelist input:checked").length === 0) {
          e.preventDefault();
          alert("Please check at least one issue to search for.");
        }
      }
    }
  });
});
