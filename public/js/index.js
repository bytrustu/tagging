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