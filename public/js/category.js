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
        showCategoryList(cat_id);
    });
});
