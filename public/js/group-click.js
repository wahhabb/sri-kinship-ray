    $(document).ready(function() {
        $('#choose button').click( (function() {
            if ($(this).hasClass('delete')) {
                if (confirm("Do you really want to delete this group? This cannot be undone")) {
                    $('#deletegroup').prop('checked', true).val($(this).val());
                    $("#choose").submit();
                }
            } else {
                $('#editgroup').val($(this).val());
                $("#choose").submit();
            }
        })
    )});