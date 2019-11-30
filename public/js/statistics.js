let dataDic = {};

$(document).ready(function(){

    showCategoryList();


    $('.button.left').on('click', function(){
        const type = $(this).parents('.buttons').attr('data-id');
        const no = $(`#main_${type}`).attr('data-no');
        if (no == 0) return;
        const nextNo = parseInt(no)-3;
        if (!dataDic[type][nextNo]) return;
        $(`#main_${type}`).attr('data-no', nextNo);

        const currentList = $(`#main_${type}`).find('.item');
        for(const element of currentList) {
            $(element).addClass('fadeOutRight');
        }
        setTimeout(()=>{
            const code = getItemCode(true, type, nextNo);
            $(`#main_${type}`).html(code);
        },100);

    });


    $('.button.right').on('click', function(){
        const type = $(this).parents('.buttons').attr('data-id');
        const no = $(`#main_${type}`).attr('data-no');
        const nextNo = parseInt(no)+3;
        if (!dataDic[type][nextNo]) return;
        $(`#main_${type}`).attr('data-no', nextNo);

        const currentList = $(`#main_${type}`).find('.item');
        for(const element of currentList) {
            $(element).addClass('fadeOutLeft');
        }
        setTimeout(()=>{
            
            const code = getItemCode(false, type, nextNo);
            $(`#main_${type}`).html(code);
        },100);

    });
});

const getItemCode = (isLeft, type, no) => {
    let code = '';
    for(let i=no; i<no+3; i++) {
        if (!dataDic[type][i]) break;
        const data = dataDic[type][i];
        code += `<div class="item animated faster ${isLeft ? 'fadeInLeft' : 'fadeInRight'}" data-no="${data.data_id}" onclick="moveItemLink(this)">
                    <div class="main">
                        <img class="image" src="${data.thumbnail}">
                        <div class="column">
                            <h5 class="title">${substringStr(data.title, 10)}</h5>
                            <p class="content">${substringStr(data.text, 30)}</p>
                            <div class="progress"><div class="progress_bar charging"></div></div>
                            <span class="finish_date">#${data.cat_name}</span>
                        </div>
                    </div>
                </div>`;
    }
    return code;
}

const drawItemList = (type,index) => {
    let code = '';
    for(let i=index; i<index+3; i++) {
        if (!dataDic[type][i]) break;
        const data = dataDic[type][i];
        code += `<div class="item animated faster" data-no="${data.data_id}" onclick="moveItemLink(this)">
                    <div class="main">
                        <img class="image" src="${data.thumbnail}">
                        <div class="column">
                            <h5 class="title">${substringStr(data.title, 10)}</h5>
                            <p class="content">${substringStr(data.text, 30)}</p>
                            <div class="progress"><div class="progress_bar charging"></div></div>
                            <span class="finish_date">#${data.cat_name}</span>
                        </div>
                    </div>
                </div>`;
    }
    $(`#main_${type}`).html(code);
}

const moveItemLink = (target) => {
    const no = $(target).attr('data-no');
    window.open(`/category/detail/${no}`);
}

const getCategoryResult = (category, callback) => {
    $.ajax({
        type:'GET',
        url:`/rest/get_category_result/${category}`,
        success:data => {
            callback(data);
        },
        error : e => {},
        complete : data => {}
    })
}



const showStatisticsBox = (category) => {
    getCategoryResult(category, data => {
        console.log(data);
        const backdropHeight = $(document).height();
        $('#backdrop').css('height', backdropHeight);
        const left_data = data.info.filter((v,i) => i<10);
        const right_data = data.info.filter((v,i) => i>=10);
        const dataSet = data.info.map(v => {return {name:v.word, data:v.score}});
        const category_icon = category == '스포츠' ? '⚽️' : category == '동물' ? '🐈' : category == '게임' ? '🎮' : '🍛'; 
        const code = `<div class="statistics_box">
                        <div class="dot"></div>
                        <div class="dot two"></div>
                        <div class="button-box" onclick="closeStatisticsBox();"><span>확인</span></div>
                        <div class="top">
                            <div class="statistics_category">
                                <div class="tag">${category_icon} ${category} 카테고리 분석</div>
                            </div>
                            <div class="statistics_detail">
                                <p>🔎 분석한 링크수 : ${data.category[0].cat_count}개</p>
                                <p>🔖 분석한 키워드수 : ${data.word[0].word_count}개</p>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="left">
                                <div id="chart-area"></div>
                            </div>
                            <div class="right">
                                <div class="left_warp">
                                    ${left_data.map((v,i) => `<p><span class="num">${i+1}</span><span class="text">${v.word}</span></p>`)
                                                .reduce((a,b)=>a+b)}
                                </div>
                                <div class="right_warp">
                                    ${right_data.map((v,i) => `<p><span class="num">${i+10}</span><span class="text">${v.word}</span></p>`)
                                                .reduce((a,b)=>a+b)}
                                </div>
                            </div>
                        </div>
                    </div>`
        $('body').append(code);


        
        var container = document.getElementById('chart-area');
        var data = {
            categories: category,
            series: dataSet
        };
        var options = {
            chart: {
                width: 400,
                height: 400,
            },
            chartExportMenu: {
                visible: false,
            },
            series: {
                showLegend: true,
                showLabel: true,
                labelAlign: 'outer'
            },
            legend: {
                visible: false
            }
        };
        var theme = {
            chart : {
                background : 'transparent'
            },
            series: {
                label: {
                    color: '#fff',
                    fontFamily: 'overwatch'
                },
                backgroundColor : '#e2e2e2'
            },
            legend: {
                label: {
                color: '#ffffff'
                }
            }
        };
        tui.chart.registerTheme('myTheme', theme);
        options.theme = 'myTheme';
        tui.chart.pieChart(container, data, options);

        $('#backdrop').fadeIn(100, function() {
            $('.statistics_box').fadeIn(300);
        });


    });
}

const closeStatisticsBox = () => {
    $('.statistics_box').remove();
    $('#backdrop').css('display', 'none');
}



const showCategoryList = () => {
    getCategoryList(data => {
        dataDic = data;
        Object.keys(dataDic).map(v => {drawItemList(v, 0)});

        $('.item').hover(function(){
            $(this).find('.main').addClass('hover');
        }, function(){
            $(this).find('.main').removeClass('hover');
        });

    });
}

const getCategoryList = (callback) => {
    $.ajax({
        type:'GET',
        url:`/rest/category_list`,
        success: data => {
            callback(data);
        },
        error : e => {
        },
        complete: data => {
        }
    });
}