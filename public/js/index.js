let passWidth;

$(document).ready(function(){
    passWidth = $(window).width() < 416 ? -$(window).width() : -415;
    if ($(window).width() <= 416) {
        const elements = $('.item_list .item');
            for(const e of elements) {
                $(e).attr('style', `width: ${$(window).width() - 25}px`)
            }
    }
    $(window).resize(function() {
        passWidth = $(window).width() < 416 ? -$(window).width() : -415;
        if ($(window).width() <= 416) {
            const elements = $('.item_list .item');
            for(const e of elements) {
                $(e).attr('style', `width: ${$(window).width() - 25}px`)
            }
        }
    });

    let idx = 0;
    let flag = 1;
    setInterval(()=>{
        const max = $('.slider_item_wrapper .item').length;
        
        if (idx === max - 1) flag = -1;
        if (idx === 0) flag = 1;
        $('.slider_item_wrapper').css({
            'transition':'all 0.25s ease-out 0s',
            'height':'248px',
            'top':`${(idx) * -37}px`});
        idx += flag;
    },2000);


    $('.item_list .item').hover(function(){
        $(this).find('.main').addClass('hover');
        $(this).find('.overlay').addClass('hover');
    }, function(){
        $(this).find('.main').removeClass('hover');
        $(this).find('.overlay').removeClass('hover');
    });


    $('.button.left').on('click', function(){
        changeItemListStyle($(this).parents('.item_section').find('.item_list'), 'left');
        // $(this).parents('.item_section').find('.item_list').attr('style','width: 830px; left: 0px;');
    });


    $('.button.right').on('click', function(){
        changeItemListStyle($(this).parents('.item_section').find('.item_list'), 'right');
        // $(this).parents('.item_section').find('.item_list').attr('style','width: 830px; left: -415px;');
    });

    let scroll = 0;
    $(window).scroll(function () { 
        let current = $(document).scrollTop(); 
        if (current <= 0) {
            $('header').addClass('active');
            return;
        }
        scroll > current ? $('header').addClass('active') : $('header').removeClass('active');
        scroll = current;
    });

    $(document).on('click', '.detail_simple .left', function(){
        window.open($('.detail_simple .left').attr('data-link'));
    });
    

    
});


const changeItemListStyle = (element, direction) => {
    const itemSize = passWidth !== -415 ? $(element).find('.item').length : parseInt($(element).find('.item').length/4 + 1);
    let leftSize = $(element).css('left');
    leftSize = Number(leftSize.substring(0, leftSize.indexOf('px')));
    const maxSize = itemSize * -passWidth;

    if (direction === 'left' && leftSize >= 0 ) {
        $(element).attr('style', `width: ${maxSize}px; left: 0px`);
        return;
    }
    if (direction === 'right' && Math.abs(leftSize+passWidth) >= maxSize ) {
        $(element).attr('style', `width: ${maxSize}px; left: ${passWidth*(itemSize-1)}px`);
        return;
    }

    $(element).attr('style', `width: ${maxSize}px; left: ${direction === 'left' ?  leftSize - passWidth : leftSize + passWidth}px`);
}

const activeTagging = () => {
    const target = $('#tagging_detail');
    moveTargetSlide(target);
    target.css('height','936px');
    target.css('transition','all 1.5s ease-in-out');
    setTimeout(()=>{
        $('.btn_start').text('분석중');
        $('.btn_start').css('background-color', '#0a4623');
        $('#loading-text').text('분석중');
        $('.tagging_url').prop('readonly', true);
        },500);
    
    setTimeout(()=>{
        const timer = `<div class="detail_timer animated fadeIn">
                        <p id="detail_time" data-time="0">00:00</p>
                        <p>해당 링크분석 완료까지 약간의 시간이 소요됩니다.</p>
                    </div>`;
        $('#tagging_detail > .container').append(timer);
        setInterval(()=>{
            const timerElement = $('#detail_time');
            const sec = parseInt(timerElement.attr('data-time'));
            timerElement.attr('data-time',sec+1);
            timerElement.text(drawTime(sec));
        },1000)
    },1800);

    setTimeout(()=>{
        const simple = `<div class="detail_simple">
                            <div class="left animated fadeIn d-none" data-link="https://www.youtube.com/watch?v=UknkihjVwWw">
                                <img class="ico_youtube" src="/images/tagging/youtube.png">
                                <img class="img_youtube" src="/images/tagging/cogi.png">
                            </div>
                            <div class="right animated fadeIn d-none">
                                <p>아리가 코기 천국에 상륙했습니다. ㅣ 8마리 웰시코기와 끝내주는 여름나기</p>
                                <p>조회수 759,319회•2019. 6. 5.</p>
                                <p>아리둥절 Ari the Corgi</p>
                                <p>얼마전 8코기네에 소풍다녀왔어요~ :)</p>
                            </div>
                        </div>`;
        $('#tagging_detail > .container').append(simple);
        const simpleElement = $('.detail_simple');
        setTimeout(()=>{
            simpleElement.css('height','460px');
            simpleElement.css('transition','all 2s ease-in-out');
        },2000)
        setTimeout(()=>{
            simpleElement.css('padding','121px');
            $('.detail_simple .left').removeClass('d-none');
            $('.detail_simple .right').removeClass('d-none');
        },4000);
    }, 2500);
}

const moveTargetSlide = (target) => {
    const targetOffset = $(target).offset();
    $('html, body').animate({scrollTop : targetOffset.top}, 1000);
}

const drawTime = (second) => {
    if (typeof second === "string") second = parseInt(second);
    const min = parseInt(second / 60);
    const sec = second % 60;
    const calcStr = (n) => n < 10 ? `0${n}` : `${n}`;
    return `${calcStr(min)}:${calcStr(sec)}`;
}