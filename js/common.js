window.yx = {
    g: function(name) {
        return document.querySelector(name);
    },
    ga: function(name) {
        return document.querySelectorAll(name);
    },
    addEvent:function(obj, event, fn) {
        if(obj.addEventListener) {
            obj.addEventListener(event, fn);
        } else {
            obj.attachEvent('on' + event, fn);
        }

    },
    removeEvent:function(obj, event, fn) {
        if(obj.removeEventListener) {
            obj.removeEventListener(event, fn);
        } else {
            obj.detachEvent('on' + event, fn);
        }
    },
    getTopValue:function(obj) {    //获取元素距离html文档的距离    
        let top = 0;
        while(obj.offsetParent) {
            top += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return top;
    },
    cutTime:function(target){	//倒计时
		var currentDate=new Date();
		var v=Math.abs(target-currentDate);
		
		return {
			d:parseInt(v/(24*3600000)),
			h:parseInt(v%(24*3600000)/3600000),
			m:parseInt(v%(24*3600000)%3600000/60000),
			s:parseInt(v%(24*3600000)%3600000%60000/1000)
		};
	},
    formatDate:function(time) {
        let d = new Date(time);
        return d.getFullYear() + '-' + yx.format(d.getMonth() + 1) + '-' + yx.format(d.getDate());
    },
    format:function(v){		//给时间补0
		return v<10?'0'+v:v;
	},
    parseUrl:function(url){		//把url后面的参数解析成对象
		//id=1143021
		var reg=/(\w+)=(\w+)/ig;
		var result={};
		
		url.replace(reg,function(a,b,c){
			result[b]=c;
		});
		
		return result;
	},
    public: {
        navFn:function() {
            let nav = yx.g('.nav');
            let lis = yx.ga('.navBar li');
            let subNav = yx.g('.subNav');
            let uls = yx.ga('.subNav ul');
            let newLis = [];         //存储实际有用的li

            //首页没有hover状态，要从一开始循环，且最后三个也没有hover状态
            for(let i = 1; i < lis.length - 3; i++) {
                newLis.push(lis[i]);
            }

            for(let i = 0; i < newLis.length; i++) {
                newLis[i].index = uls[i].index = i
                newLis[i].onmouseenter = uls[i].onmouseenter = function() {
                    newLis[this.index].classname = 'active';
                    subNav.style.opacity = 1;
                    uls[this.index].style.display = 'block';   
                };
                newLis[i].onmouseleave = uls[i].onmouseleave = function() {
                    newLis[this.index].classname = '';
                    subNav.style.opacity = 0;
                    uls[this.index].style.display = 'none';   
                };
            }
            
            yx.addEvent(window, 'scroll', setNavPos);

            setNavPos();
            function setNavPos() {
                if(window.pageYOffset > nav.offsetTop) {
                    nav.id = 'navFix';
                } else {
                    nav.id = '';
                }
            }
        },
        // 图片的src先放一张空图片的地址，当这张图片出现在可视区时，再将真实地址赋给img
        // 一定要给一个地址，否则img标签会有一个边框
        shopFn: function() {
            
            let productNum = 0;
            (function(local) {
                let totalPrice = 0;
                let ul = yx.g('.cart ul');
                let li = '';
                ul.innerHTML = '';
                console.log(1);
                for(let i = 0; i < local.length; i++) {
                    let attr = local.key(i);
                    console.log(local[attr]);
                    let value = JSON.parse(local[attr]);

                    if(value && value.sign == 'productLocal') {
                        li += '<li data-id="'+value.id+'">'+
                        '<a href="#" class="img"><img src="'+value.img+'"/></a>'+
                        '<div class="message">'+
                            '<p><a href="#">'+value.name+'</a></p>'+
                            '<p>'+value.spec.join(' ')+' x '+value.num+'</p>'+
                        '</div>'+
                        '<div class="price">¥'+value.price+'.00</div>'+
                        '<div class="close">X</div>'+
                    '</li>';

                    totalPrice += parseFloat(value.price) * Number(value.num);
                    }
                }
                ul.innerHTML = li;

                productNum = ul.children.length;
                yx.g('.cartWrap i').innerHTML = productNum;
                yx.g('.cartWrap .total span').innerHTML = '￥' + totalPrice + '.00';

                let colseBtns = yx.ga('.cart .close');
                
                for(let i = 0; i < colseBtns.length; i++) {
                    colseBtns[i].onclick = function() {
                        localStorage.removeItem(this.parentNode.getAttribute('data-id'));

                        yx.public.shopFn();
                        console.log(1);
                        if(ul.children.length == 0) {
                            yx.g('.cart').style.display = 'none';
                        }
                    };
                }
                

                let cartWrap = yx.g('.cartWrap');
                let timer;

                cartWrap.onmouseenter = function() {
                    clearTimeout(timer);
                    yx.g('.cart').style.display = 'block';
                    scrollFn();
                };

                cartWrap.onmouseleave = function() {
                    timer = setTimeout(function() {
                        yx.g('.cart').style.display = 'none';
                    }, 200);
                }
            })(localStorage);
 
            function scrollFn(){
				var contentWrap = yx.g('.cart .list');
				var content = yx.g('.cart .list ul');
				var scrollBar = yx.g('.cart .scrollBar');
				var slide = yx.g('.cart .slide');
				var slideWrap = yx.g('.cart .slideWrap');
				var btns = yx.ga('.scrollBar span');
				var timer;
				
				//倍数（用来设置滚动条的高度）
				var beishu=content.offsetHeight/contentWrap.offsetHeight;
				//设置滚动条显示与否
				scrollBar.style.display=beishu<=1?'none':'block';
				
				//给倍数一下最大值
				if(beishu > 20){
					beishu = 20;
				}
				
				//内容与内容的父级的倍数与滑块与滑块父级的倍数是相等的
				slide.style.height = slideWrap.offsetHeight/beishu+'px';
				
                let scrollTop = 0;
                let maxHeight = slideWrap.offsetHeight - slide.offsetHeight;

                slide.onmousedown = function(ev) {
                    let disY = ev.clientY - slide.offsetTop;
        

                    document.onmousemove = function(ev) {
                        scrollTop = ev.clientY - disY;
                        scroll();
                    };

                    document.onmouseup = function() {
                        this.onmousemove = null;
                    };

                    ev.cancelBubble = true;

                    return false;
                };

                myScroll(contentWrap, function() {
                    scrollTop -= 10;
                    scroll();
                    clearInterval(timer)
                }, function() {
                    scrollTop+=10;
					scroll();
					clearInterval(timer);
                });

                for(let i = 0; i < btns.length; i++) {
                    btns[i].index = i;
                    btns[i].onmousedown = function() {
                        let n = this.index;
                        timer = setInterval(function() {
                            scrollTop = n ? scrollTop + 5 : scrollTop - 5;
                            scroll();
                        }, 16)

                    };

                    btns[i].onmouseup = function() {
                        clearInterval(timer);
                    };
                }

                slideWrap.onmousedown = function(ev) {
                    timer = setInterval(function() {
                        var slideTop=slide.getBoundingClientRect().top+slide.offsetHeight/2;
						if(ev.clientY<slideTop){
							//这个条件成立说明现在鼠标在滑块的上面，滚动条应该往上走
							scrollTop-=5;
						}else{
							scrollTop+=5;
						}
						
						//如果他们俩的差的绝对值小于5了，我就认为到达了终点，这个时候清除掉定时器就能够解决闪动的问题
						if(Math.abs(ev.clientY-slideTop)<=5){
							clearInterval(timer);
						}
						
						scroll();
                    },16)
                }

                function scroll() {
                    if(scrollTop < 0) {
                        scrollTop = 0;
                    } else if(scrollTop > maxHeight) {
                        scrollTop = maxHeight;
                    }

                    let scaleY = scrollTop / maxHeight;

                    slide.style.top = scrollTop + 'px';
                    content.style.top = -(content.offsetHeight - contentWrap.offsetHeight) * scaleY + 'px';
                }

                function myScroll(obj, fnUp, fnDown) {
                    obj.onmousewheel = fn;
                    obj.addEventListener('DOMMouseScroll', fn);

                    function fn(ev) {
                        if(ev.wheelDelta > 0 || ev.detail < 0) {
                            fnUp.call(obj);
                        } else {
                            fnDown.call(obj);
                        }

                        ev.preventDefault();
                        return false;
                    }
                }
            }
        },
        lazyImgFn:function() {  //图片懒加载功能
            yx.addEvent(window, 'scroll', delayImg);
            function delayImg() {
                let originals = yx.ga('.original');//所有要懒加载的图片
                let scrollTop = window.innerHeight + window.pageYOffset;//可视区的高度与滚动条的距离
                
                for(let i = 0; i < originals.length; i++) {
                    if(yx.getTopValue(originals[i]) < scrollTop) {
                        originals[i].src = originals[i].getAttribute('data-original');
                        originals[i].removeAttribute('class');//如果这个图片的地址已经变成真实的地址了，那么就把他的class去掉
                    }

                }

                if(originals[originals.length - 1].getAttribute('src') != 'images/empty.gif') {
                    yx.removeEvent(window, 'scroll', delayImg);//如果已经到最后一张图片了，那么就不要取消事件绑定；
                }
            }

        },
        backUpFn:function() {   //回到顶部功能
            let back = yx.g('.back');
            let timer;
            
            back.onclick = function() {
                let top = window.pageYOffset;
                timer = setInterval(function() {
                    window.scrollTo(0, top);

                    if(top <= 0) {
                        top = 0;
                        clearInterval(timer);
                    }

                    top -= 150;
                },16)
            };
        }
    }
}