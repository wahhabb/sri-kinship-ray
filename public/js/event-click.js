    $(document).ready(function() {
        $('#choose button').click( (function() {
            if ($(this).hasClass('delete')) {
                if (confirm("Do you really want to delete this event? This cannot be undone")) {
                    $('#deleteevent').prop('checked', true).val($(this).val());
                    $("#choose").submit();
                }
            } else {
                $('#editevent').val($(this).val());
                $("#choose").submit();
            }
        })
    )});