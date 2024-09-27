$(window).on('load', function () {
    /*----------------------------------------------------- */
    /* * */
    /*----------------------------------------------------- */
    $('[data-grade-choice]').on('click', function () {
        $('[data-grade-id]').addClass('filled');

        var id = $(this).closest('[data-grade-id]').attr('data-grade-id'),
            action = $(this).attr('data-grade-choice');
        grade(id, action);
    });
    function grade(id, action) {
        var dataGrade = new FormData();
        dataGrade.append('id', id);
        dataGrade.append('action', action);
        $.ajax({
            type: 'POST',
            url: '/class/grade.php',
            cache: false,
            dataType: 'json',
            data: dataGrade,
            processData: false,
            contentType: false,
            success: function(data) {
                if (data && data.code == 200) {
                    var count = $('[data-grade-choice="'+action+'"]').find('[data-grade-count]').text();
                        count = Number(count) + 1;
                    $('[data-grade-choice="'+action+'"]').find('[data-grade-count]').text(count);
                    setTimeout(function() { 
                        $('[data-grade-id]').removeAttr('data-grade-id');
                        $('[data-grade-choice]').removeAttr('data-grade-choice');
                    }, 200);
                } else {
                    console.log(data);
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log("Ошибка '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
            },
            complete: function() {}
        });
    }
}(jQuery));