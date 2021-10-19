//公用方法调用
yx.public.navFn();
yx.public.lazyImgFn();
yx.public.backUpFn();
yx.public.shopFn();

//banner图轮播
var bannerPic=new Carousel();
bannerPic.init({
	id:'bannerPic',
	autoplay:true,
	intervalTime:3000,
	loop:true,
	totalNum:5,
	moveNum:1,
	circle:true,
	moveWay:'opacity'
});

//新品首发轮播图
var newProduct=new Carousel();
newProduct.init({
	id:'newProduct',
	autoplay:false,
	intervalTime:3000,
	loop:false,
	totalNum:8,
	moveNum:4,
	circle:false,
	moveWay:'position'
});

newProduct.on('rightEnd',function(){
	//alert('右边到头了');
	this.nextBtn.style.background='#E7E2D7';
});
newProduct.on('leftEnd',function(){
	//alert('左边到头了');
	this.prevBtn.style.background='#E7E2D7';
});
newProduct.on('leftClick',function(){
	//alert('左边点击了');
	this.nextBtn.style.background='#D0C4AF';
});
newProduct.on('rightClick',function(){
	//alert('右边点击了');
	this.prevBtn.style.background='#D0C4AF';
});
//大家都在说轮播图
var say=new Carousel();
say.init({
	id:'sayPic',
	autoplay:true,
	intervalTime:3000,
	loop:true,
	totalNum:3,
	moveNum:1,
	circle:false,
	moveWay:'position'
});


//人气推荐选项卡
(function() {
    let titles = yx.ga('#recommend header li');
    let contents = yx.ga('#recommend .content');

    for(let i = 0; i < titles.length; i++) {
        titles[i].index = i;
        titles[i].onclick = function() {
            for(let i = 0; i < titles.length; i++) {
                titles[i].className = '';
                contents[i].style.display = 'none'
            }
            titles[this.index].className = 'active';
            contents[this.index].style.display = 'block';
        };
    }
})();

//限时购
(function() {
    let timeBox = yx.g('#limit .timeBox');
    let spans = yx.ga('#limit .timeBox span');
    let timer = setInterval(showTime,1000);
    //倒计时
    function showTime() {

        let endTime = new Date(2021,7,31,24);//月份是从零开始的

        if(new Date() < endTime) {  
            // 如果当前的时间没有超过结束的时间才去做倒计时
            let overTime = yx.cutTime(endTime);
            spans[0].innerHTML = yx.format(overTime.h);
            spans[1].innerHTML = yx.format(overTime.m);
            spans[2].innerHTML = yx.format(overTime.s);
        } else {
            clearInterval(timer);
        }
    };

    //商品数据
    let boxWrap = yx.g('#limit .boxWrap');
    let str = '';
    let item = json_promotion.itemList;

    for(let i = 0; i < item.length; i++) {
        str += '<div class="limitBox">'+
        '<a href="#" class="left scaleTmg"><img class="original" src="images/empty.gif" data-original="'+item[i].primaryPicUrl+'"/></a>'+
        '<div class="right">'+
            '<a href="#" class="title">'+item[i].itemName+'</a>'+
            '<p>'+item[i].simpleDesc+'</p>'+
            '<div class="numBar clearfix">'+
               '<div class="numCon"><span style = "width' +Number(item[i].currentSellVolume)/Number(item[i].totalSellVolume)+ '%"></span></div>'+
                '<span class="numTips">'+item[i].currentSellVolume+'</span>'+
            '</div>'+
            '<div>'+
                '<span class="xianshi">限时价<span class="fuhao">¥</span><strong>'+item[i].actualPrice+'</strong></span>'+
                '<span class="yuan">原价 ¥'+item[i].retailPrice+'</span>'+
            '</div>'+
            '<a href="#" class="qianggou">立即抢购</a>'+
        '</div>'+
    '</div>'
    }

    boxWrap.innerHTML = str;
})();
