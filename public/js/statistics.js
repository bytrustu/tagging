const showStatisticsBox = (target) => {
    const backdropHeight = $(document).height();
    $('#backdrop').css('height', backdropHeight);
    const code = `<div class="statistics_box">
                            <div class="dot"></div>
                            <div class="dot two"></div>
                            <div class="button-box" onclick="closeStatisticsBox();"><span>확인</span></div>
                        </div>`
    $('body').append(code);
    $('#backdrop').fadeIn(100, function() {
        $('.statistics_box').fadeIn(300);
    });
}

const closeStatisticsBox = () => {
    $('.statistics_box').remove();
    $('#backdrop').css('display', 'none');
}