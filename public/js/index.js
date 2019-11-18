let passWidth;
let timerInterval;
let mainDic = {};

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


    $('#analysis .button.left').on('click', function(){
        changeItemListStyle($(this).parents('.item_section').find('.item_list'), 'left');
    });


    $('#analysis .button.right').on('click', function(){
        changeItemListStyle($(this).parents('.item_section').find('.item_list'), 'right');
    });

    showMainCategoryList();

    

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
    const url = $('.tagging_url').val();
    console.log(url);
    $.ajax({
        type:'POST',
        url:'/rest/active_tagging',
        data:{
            url
        },
        success:data => {
            console.log(data);
        },
        error:e => {
            console.log(e);
        },
        complete:data =>{
        }
    })

    return;
    const link = $('.tagging_url').val();
    if (!isYoutubeLink(link)) {
        const backdropHeight = $(document).height();
        $('#backdrop').css('height', backdropHeight);
        $('#backdrop').fadeIn(100, function() {
            showErrorBox('유튜브 링크가 올바르지 않습니다.');
            $('.error_box').fadeIn(300);
        });
        return;
    }

    const target = $('#tagging_detail');
    showTimer(target);
    showSimple();
}

const getParameter = (url) => {
    if (!url.includes('?')) return false;
    if(!url) url = location.search;
    const query = url.split('?')[1];
    if (!query) return false;
    const result = {};
    query.split('&').forEach((part) => {
        const item = part.split('=');
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}

const isYoutubeLink = (link) => {
    const linkRange = ["youtube.com", "youtu.be"];
    return linkRange.map(r => link.includes(r)).some(v => v);
}

const showErrorBox = (comment) => {
    const code = `<div class="error_box">
                            <div class="dot"></div>
                            <div class="dot two"></div>
                            <div class="emoji">🙅‍♀️</div>
                            <div class="message"><span class="alert">에러!</span><p>${comment}</p></div>
                            <div class="button-box" onclick="closeErrorBox();"><span>확인</span></div>
                        </div>`
    $('body').append(code);
}

const closeErrorBox = () => {
    $('.error_box').remove();
    $('#backdrop').css('display', 'none');
}

const showTimer = (target) => {
    moveTargetSlide(target);
    target.css('height','936px');
    target.css('transition','all 1.2s ease-in-out');
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
        $('#tagging_detail .container').append(timer);
        timerInterval = setInterval(()=>{
            const timerElement = $('#detail_time');
            const sec = parseInt(timerElement.attr('data-time'));
            timerElement.attr('data-time',sec+1);
            timerElement.text(drawTime(sec));
            if (sec === 10) {
                timerOut();
            }
        },1000);
    },1800);
}

const showSimple = () => {
    setTimeout(()=>{
        if ($(window).width() <= 416) {
            $('.detail_simple ')
        }
        const simple = `<div class="detail_simple">
                            <div class="left animated fadeIn d-none" data-link="https://www.youtube.com/watch?v=UknkihjVwWw">
                                <img class="ico_youtube" src="/images/tagging/youtube_1.png">
                                <img class="img_youtube" src="/images/tagging/cogi.png">
                            </div>
                            <div class="right animated fadeIn d-none">
                                <p>아리가 코기 천국에 상륙했습니다. ㅣ 8마리 웰시코기와 끝내주는 여름나기</p>
                                <p>조회수 759,319회•2019. 6. 5.</p>
                                <p>아리둥절 Ari the Corgi</p>
                                <p>얼마전 8코기네에 소풍다녀왔어요~ :)</p>
                            </div>
                        </div>`;
        $('#tagging_detail .container').append(simple);
        const simpleElement = $('.detail_simple');
        setTimeout(()=>{
            simpleElement.css('height','460px');
            simpleElement.css('transition','all 2s ease-in-out');
        },2000)
        setTimeout(()=>{
            if ($(window).width() <= 416) {
                simpleElement.addClass('mobile');
            }
            simpleElement.css('padding','121px');
            $('.detail_simple .left').removeClass('d-none');
            $('.detail_simple .right').removeClass('d-none');
        },4000);

        setTimeout(()=>{
            $('.detail_timer').append(`
                <p class="animated fadeIn">잠시만 기다려주세요 !</p>
                <p class="animated fadeIn">분석이 완료되면 자동으로 표시 됩니다. 😊</p>`)
        },5000);

        $('.detail_simple .left').hover(function(){
            $(this).find('.ico_youtube').attr('src','/images/tagging/youtube_2.png')
        },function(){
            $(this).find('.ico_youtube').attr('src','/images/tagging/youtube_1.png')
        });
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

const timerOut = () => {
    clearInterval(timerInterval);
    $('#loading-text').text('분석완료');
    let outInterval;
    let idx = 0;
    outInterval = setInterval(()=>{
        const timerElement = $('#detail_time');
        if (idx >= 7) clearInterval(outInterval);
        timerElement.css('color','#ff4444');
        idx % 2 === 0 ? timerElement.css('visibility', 'hidden') : timerElement.css('visibility', 'visible');
        idx++;
    },300);

    setTimeout(()=>{
        const subElement = $('#tagging_detail > .sub');
        subElement.removeClass('d-none');
        setTimeout(()=>{
            subElement.css('height','1000px');
            subElement.css('transition','all 2s ease-in-out');
        },500);
        setTimeout(()=>{
            subElement.css('background-color', '#0a4623');
            subElement.css('transition','all 1s ease-in-out');

            setTimeout(() => {
                const finalComment = `<div class="final_comment animated fadeIn" id="final_comment">
                                        결과 화면으로 전환 됩니다 👏
                                    </div>`;
                $('#tagging_detail .sub').html(finalComment);
                
                setTimeout(() => {
                    location.href="/category/detail/91";
                },1000);
            }, 1000);

        },2500)
        
    },2000)
}

const createWordCloud = () => {
    var width = 700,
    height = 354

    var svg = d3.select(".word_cloud").append("svg")
        .attr("width", width)
        .attr("height", height);
    d3.csv("/csv/worddata.csv", function (data) {
        showCloud(data)
        setInterval(function(){
            showCloud(data)
        },3000) 
    });
    wordScale = d3.scale.linear().domain([0, 100]).range([0, 150]).clamp(true);
    var keywords = ["자리야", "트레이서", "한조", "라인하르트"]
    var svg = d3.select("svg")
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    function showCloud(data) {
        d3.layout.cloud().size([width, height])
            .words(data)
            .rotate(function (d) {
                return d.text.length > 3 ? 0 : 90;
            })
            .fontSize(function (d) {
                return wordScale(d.frequency);
            })
            .on("end", draw)
            .start();

        function draw(words) { 
            var cloud = svg.selectAll("text").data(words)
            //Entering words
            cloud.enter()
                .append("text")
                .style("font-family", "overwatch")
                .style("fill", function (d) {
                    return (keywords.indexOf(d.text) > -1 ? "#ffffff" : "#e69999");
                })
                .style("fill-opacity", .5)
                .attr("text-anchor", "middle") 
                .attr('font-size', 1)
                .text(function (d) {
                    return d.text;
                }); 
            cloud
                .transition()
                .duration(600)
                .style("font-size", function (d) {
                    return d.size + "px";
                })
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1); 
        }
    }
}


const createKeywordChart = () => {
    
    var container = document.getElementById('chart-area');
    var data = {
        categories: ['Browser'],
        series: [
            {
                name: 'Chrome',
                data: 46.02
            },
            {
                name: 'IE',
                data: 20.47
            },
            {
                name: 'Firefox',
                data: 17.71
            },
            {
                name: 'Safari',
                data: 5.45
            },
            {
                name: 'Opera',
                data: 3.10
            },
            {
                name: 'Etc',
                data: 7.25
            }
        ]
    };
    var options = {
        chart: {
            width: 680,
            height: 250
            
        },
        chartExportMenu: {
            visible: false,
        },
        tooltip: {
            suffix: '%'
        },
        series: {
            startAngle: -90,
            endAngle: 90
        }
    };
    var theme = {
        chart : {
            background : 'transparent'
        },
        series: {
            label: {
	            color: '#fff',
	            fontFamily: 'sans-serif'
	        },
            backgroundColor : '#0a4623'
        },
        legend: {
            label: {
              color: '#ffffff'
            }
          }
    };

    // For apply theme

    tui.chart.registerTheme('myTheme', theme);
    options.theme = 'myTheme';

    tui.chart.pieChart(container, data, options);

}

const viewYoutube = (link) => {
    $('.youtubue iframe').attr('src','https://www.youtube.com/embed/UknkihjVwWw');
}

const makeAreaChart = (id, data1) => {
    var container = document.getElementById(id);
    var data = {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
            {
                name: 'Seoul',
                data: [20, 40, 25, 50, 15, 45, 33, 34, 20, 30, 22, 13]
            },
            {
                name: 'Sydney',
                data: [5, 30, 21, 18, 59, 50, 28, 33, 7, 20, 10, 30]
            },
            {
                name: 'Moskva',
                data: [30, 5, 18, 21, 33, 41, 29, 15, 30, 10, 33, 5]
            }
        ]
    };
    var options = {
        chart: {
            width: 680,
            height: 250,
        },
        series: {
            zoomable: true,
            showDot: false,
            areaOpacity: 1
        },
        yAxis: {
            title: 'Temperature (Celsius)',
            pointOnColumn: true
        },
        xAxis: {
            title: 'Month'
        },
        tooltip: {
            suffix: '°C'
        }
    };
    var theme = {
        series: {
            colors: [
                '#83b14e', '#458a3f', '#295ba0', '#2a4175', '#289399',
                '#289399', '#617178', '#8a9a9a', '#516f7d', '#dddddd'
            ]
        }
    };
    // For apply theme
    // tui.chart.registerTheme('myTheme', theme);
    // options.theme = 'myTheme';
    tui.chart.areaChart(container, data, options);
}

const makePieChart = (id) => {
    var container = document.getElementById(id);
    var data = {
        categories: ['Browser'],
        series: [
            {
                name: 'Chrome',
                data: 46.02
            },
            {
                name: 'IE',
                data: 20.47
            },
            {
                name: 'Firefox',
                data: 17.71
            },
            {
                name: 'Safari',
                data: 5.45
            },
            {
                name: 'Opera',
                data: 3.10
            },
            {
                name: 'Etc',
                data: 7.25
            }
        ]
    };
    var options = {
        chart: {
            width: 680,
            height: 250
            
        },
        chartExportMenu: {
            visible: false,
        },
        tooltip: {
            suffix: '%'
        },
        series: {
            startAngle: -90,
            endAngle: 90
        }
    };
    var theme = {
        chart : {
            background : 'transparent'
        },
        series: {
            label: {
	            color: '#fff',
	            fontFamily: 'sans-serif'
	        },
            backgroundColor : '#0a4623'
        },
        legend: {
            label: {
              color: '#ffffff'
            }
          }
    };

    // For apply theme

    tui.chart.registerTheme('myTheme', theme);
    options.theme = 'myTheme';

    tui.chart.pieChart(container, data, options);
}

const substringStr = (str, size) => {
    if (str.length <= size) return str;
    return `${str.substring(0, size)}...`;
}

const showLoading = () => {
    const code = `<div class="main loading_main">
                    <div class="container">
                        <div class="loading-container">
                            <div class="loading"></div>
                            <div id="loading-text">로딩중</div>
                        </div>
                    </div>
                </div>
                <div id="loading_back" class="animate fadeIn"></div>`;
    $('body').append(code);
}

const closeLoading = () => {
    $('.loading_main, #loading_back').remove();
}

const showMainCategoryList = () => {
    getMainCategoryList(data => {
        mainDic = data;
        Object.keys(mainDic).map(v => {drawMainItemList(v, 0)});

        let idx = 0;
        let flag = 1;
        setInterval(()=>{
            const max = $('.slider_item_wrapper .item').length;
            
            if (idx === max - 1) flag = -1;
            if (idx === 0) flag = 1;
            $('.slider_item_wrapper').css({
                'transition':'all 0.25s ease-out 0s',
                'height':'248px',
                'top':`${(idx) * -37}px`
            });
            idx += flag;
        },2000);


        $('.item').hover(function(){
            $(this).find('.main').addClass('hover');
            $(this).find('.overlay').addClass('hover');
        }, function(){
            $(this).find('.main').removeClass('hover');
            $(this).find('.overlay').removeClass('hover');
        });
    });
}

const getMainCategoryList = (callback) => {
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

const drawMainItemList = (type,index) => {
    let code = '';
    for(let i=index; i<index+6; i++) {
        if (!mainDic[type][i]) break;
        const data = mainDic[type][i];
        code += `<div class="item">
                    <div class="main">
                        <img class="image" src="${data.thumbnail}">
                        <div class="column">
                            <h5 class="title">${substringStr(data.title, 10)}</h5>
                            <p class="content">${substringStr(data.text, 30)}</p>
                            <div class="progress"><div class="progress_bar charging"></div></div>
                            <span class="finish_date">분류완료</span>
                        </div>
                    </div>
                    <div class="overlay">
                        <div class="image"><span>${substringStr(data.title, 10)}</span></div>
                        <div class="column">
                            <a href="/category/detail/${data.data_id}" target="_blank"><div class="button detail">자세히 보기</div></a>
                        </div>
                    </div>
                </div>`;
    }
    $(`#main_${type}`).html(code);
}