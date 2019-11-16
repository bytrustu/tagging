$(document).ready(function(){
    $('.button.left').on('click', function(){
        const type = $(this).parents('.buttons').attr('data-id');
        const no = $(`#main_${type}`).attr('data-no');

        if (no == 0) return;
        $(`#main_${type}`).attr('data-no', (parseInt(no)-3));

        const currentList = $(`#main_${type}`).find('.item');
        for(const element of currentList) {
            $(element).addClass('fadeOutRight');
        }
        setTimeout(()=>{
            const code = getItemCode(true);
            $(`#main_${type}`).html(code);
        },100);

    });


    $('.button.right').on('click', function(){
        const type = $(this).parents('.buttons').attr('data-id');
        const no = $(`#main_${type}`).attr('data-no');
        console.log(type);
        // if (no == 0) return;
        $(`#main_${type}`).attr('data-no', (parseInt(no)+3));

        const currentList = $(`#main_${type}`).find('.item');
        for(const element of currentList) {
            $(element).addClass('fadeOutLeft');
        }
        setTimeout(()=>{
            const code = getItemCode(false);
            $(`#main_${type}`).html(code);
        },100);

    });
});

const getItemCode = (isLeft, type, no) => {
    const code = `<div class="item animated faster ${isLeft ? 'fadeInLeft' : 'fadeInRight'}">
                    <div class="main">
                        <img class="image" src="/images/index/test.png">
                        <div class="column">
                            <h5 class="title">스포츠 제목</h5>
                            <p class="content">스포츠 내용</p>
                            <div class="progress"><div class="progress_bar charging"></div></div>
                            <span class="finish_date">#</span>
                        </div>
                    </div>
                </div>`;
    return code + code + code;
}



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


