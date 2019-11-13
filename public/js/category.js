$(document).ready(function(){
    showCategoryList('all');

    $('.category_btn').on('click', function(){
        if ($(this).hasClass('active')) return;
        const categoryElements = $('.category_btn');
        for (const element of categoryElements) {
            const isActvie = $(element).hasClass('active');
            if (isActvie) $(element).removeClass('active');
        }
        $(this).addClass('active');
        const cat_id = $(this).attr('data-id');
        console.log(cat_id);
        showCategoryList(cat_id);
    });
});

const showCategoryList = (cat_id) => {
    getCategoryList(cat_id, data => {
        if (data.length == 0) $('.main_warp').empty();
        $.each(data, (i, v) => {
            const title = substringStr(v.title, 12);
            const text = substringStr(v.text, 30);
            const code = `<div class="item">
                                    <div class="main">
                                        <img class="image" src="${v.thumbnail}">
                                        <div class="column">
                                            <h5 class="title">${title}</h5>
                                            <p class="content">${text}</p>
                                            <div class="progress"><div class="progress_bar charging"></div></div>
                                            <span class="finish_date">#${v.cat_name}</span>
                                        </div>
                                    </div>
                                    <div class="overlay">
                                        <div class="image"><span>${title}</span></div>
                                        <div class="column">
                                            <a href="/category/detail/${v.data_id}" target="_blank"><div class="button detail">자세히 보기</div></a>
                                        </div>
                                    </div>
                                </div>
                                `;
                $('.main_warp').html(code);
        });

        $('.item').hover(function(){
        $(this).find('.main').addClass('hover');
        $(this).find('.overlay').addClass('hover');
    }, function(){
        $(this).find('.main').removeClass('hover');
        $(this).find('.overlay').removeClass('hover');
    });

    });
}

const getCategoryList = (cat_id, callback) => {
    $.ajax({
        type:'GET',
        url:`/rest/category_list/${cat_id}`,
        success: data => {
            callback(data);
        },
        error : e => {
        },
        complete: data => {
        }
    });
}