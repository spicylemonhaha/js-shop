yx.public.navFn();
yx.public.backUpFn();

let params = yx.parseUrl(window.location.href);


let pageId = params.id;
let curData = productList[pageId];

if(!pageId || !curData) {
    window.location.href = '404.html';
}

//面包屑功能
let positionFn = yx.g('#position');
positionFn.innerHTML = '<a href="#">首页</a> >';
for(let i = 0; i < curData.categoryList.length; i++) {
    positionFn.innerHTML += `<a href="#">${curData.categoryList[i].name}</a> >`
}
positionFn.innerHTML += curData.name;


(function() {
    let bigImg = yx.g('#productImg .left img');
    let smallImgs = yx.ga('#productImg .smallImg img');

    bigImg.src = smallImgs[0].src = curData.primaryPicUrl;

    let last = smallImgs[0];

    for(let i = 0; i < smallImgs.length; i++) {
        if(i) {
            smallImgs[i].src = curData.itemDetail['picUrl' + i];
        }

        smallImgs[i].index = i;
        smallImgs[i].onmouseover = function() {
            bigImg.src = this.src;
            last.className = '';
            this.className = 'active';
            last = this;
        };
    }

    yx.g('#productImg .info h2').innerHTML = curData.name;
    yx.g('#productImg .info p').innerHTML = curData.simpleDesc;  
    yx.g('#productImg .info .price').innerHTML = 
    `
    <div><span>售价</span><strong>￥${curData.retailPrice}</strong></div>
    <div><span>促销</span><a href="#" class="tag">${curData.hdrkDetailVOList[0].activityType}</a><a href="#" class="discount">领全场满减卷，额外机会包裹翻倍</a></div>
    <div><span>服务</span><a href="#" class="service"><i></i>三十天无忧退货<i></i>48小时快速退款<i></i>满88免邮费</a></div>
    `;


    //产品规格
    let format = yx.g('#productImg .fomat');
    let dds = [];
    for(let i = 0; i < curData.skuSpecList.length; i++) {
        let dl = document.createElement('dl');
        let dt = document.createElement('dt');
        dt.innerHTML = curData.skuSpecList[i].name;
        dl.appendChild(dt);
		
		for(var j=0;j<curData.skuSpecList[i].skuSpecValueList.length;j++){
			var dd=document.createElement("dd");
			dd.innerHTML=curData.skuSpecList[i].skuSpecValueList[j].value;
			dd.setAttribute('data-id',curData.skuSpecList[i].skuSpecValueList[j].id)
			
			dd.onclick=function(){
				changeProduct.call(this);
			};
			
			dds.push(dd);
			dl.appendChild(dd);
		}
		
		format.appendChild(dl);
	
        function changeProduct() {
            if(this.className.indexOf('noclick') != -1) {
                return;
            }
            
            let curId = this.getAttribute('data-id');
            let othersDd = [];
            let mergeId = [];

            for(let attr in curData.skuMap) {
                if(attr.indexOf(curId) != -1) {
                    let otherId = attr.replace(curId,'').replace(';','');

                    for(let i = 0; i < dds.length; i++) {
                        if(dds[i].getAttribute('data-id') == otherId) {
                            othersDd.push(dds[i]);
                        }
                    }

                    mergeId.push(attr);
                }
            }

            //点击的功能
		/*
		 * 点击的时候判断
		 * 	1、自己是末选中状态
		 * 		1、兄弟节点
		 * 			有选中的话要取消选中，有不能点击的不用处理
		 * 		2、自己选中
		 * 		3、对方节点
		 * 			先去掉有noclick的class的元素，再给不能点击的加上noclick
		 * 		
		 * 	2、自己是选中状态
		 * 		1、取消自己选中
		 * 			（兄弟节点不用处理）
		 * 		2、对方节点
		 * 			如果有不能点击的要去掉noclick的class
		 */

        let brothers=this.parentNode.querySelectorAll('dd');
            
            //选中状态
            if(this.className == 'active') {
                this.className = '';
                for(let i = 0; i < othersDd.length; i++) {
                   if(othersDd[i].className == 'noclick') {
                        othersDd[i].className = '';
                   } 
                }
            
            }else {//非选中状态
                for(let i = 0; i < brothers.length; i++) {
                    if(brothers[i].className == 'active') {
                        brothers[i].className = '';
                    }
                }
                this.className='active';
                
                for(var i=0;i<othersDd.length;i++){
                    if(othersDd[i].className=='noclick'){
                        othersDd[i].className='';
                    }
                    if(curData.skuMap[mergeId[i]].sellVolume==0){
                        othersDd[i].className='noclick';
                    }
                }
            }
            addNum();
        }

    }

    function addNum() {
        let actives = yx.ga('#productImg .fomat .active');
        let btnParent = yx.g('#productImg .number div');
        let btns = btnParent.children;

        let ln = curData.skuSpecList.length;

        if(actives.length == ln) {
            btnParent.className = '';
        } else {
            btnParent.className = 'noClick';
        }

        btns[0].onclick = function() {
            if(btnParent.className) {
                return;
            }
            btns[1].value--;
            if(btns[1].value < 0) {
                btns[1].value = 0;
            }
        };

        btns[1].onfocus = function() {
            if(btnParent.className) {
                this.blur();
            }
        };

        btns[2].onclick = function() {
            if(btnParent.className) {
                return;
            }
            btns[1].value++;
        };
    }
})();

(function() {
    let ul = yx.g('#look ul');
    let str = '';

    for(let i = 0; i < recommendData.length; i++) {
        str += '<li>'+
        '<a href="#"><img src="'+recommendData[i].listPicUrl+'"/></a>'+
        '<a href="#">'+recommendData[i].name+'</a>'+
        '<span>¥'+recommendData[i].retailPrice+'</span>'+
        '</li>';
    }
    ul.innerHTML = str;

    var say=new Carousel();
say.init({
	id:'allLook',
	autoplay:false,
	intervalTime:3000,
	loop:false,
	totalNum:8,
	moveNum:4,
	circle:false,
	moveWay:'position'
});

})();

(function() {
    let as = yx.ga('#bottom .title a');
    let tabs = yx.ga('#bottom .content>div');
    let ln = 0;

    for(let i = 0; i < as.length; i++) {
        as[i].index = i;
        as[i].onclick = function() {
                as[ln].className = '';
                tabs[ln].style.display = 'none';

                this.className = 'active';
                tabs[this.index].style.display = 'block';

                ln = this.index;
        };
    }

    let tbody = yx.g('.details tbody');
    for(let i = 0; i < curData.attrList.length; i++) {
        if(i % 2 == 0) {
            var tr = document.createElement('tr'); //这里有一个作用域的问题
        }

        let td1 = document.createElement('td');
        td1.innerHTML = curData.attrList[i].attrName;
        let td2 = document.createElement('td');
        td2.innerHTML = curData.attrList[i].attrValue;

        tr.appendChild(td1);
        tr.appendChild(td2);

        tbody.appendChild(tr); //这里为什么？

        let img = yx.g('.details .img');
        img.innerHTML = curData.itemDetail.detailHtml;
    }
})();

(function() {
    console.log(commentData);
    let evaluateNum = commentData[pageId].data.result.length
    let evaluateText = evaluateNum > 1000 ? '999+' : evaluateNum;

    yx.ga('#bottom .title a')[1].innerHTML = '评价<span>('+evaluateText+')</span>';

    let allData = [[],[]];

    for(let i = 0; i < evaluateNum; i++) {
        allData[0].push(commentData[pageId].data.result[i]);

        if(commentData[pageId].data.result[i].picList.length) {
            allData[1].push(commentData[pageId].data.result[i]);
        }        
    }
    yx.ga('#bottom .eTitle span')[0].innerHTML = '全部 ('+allData[0].length+') ';
    yx.ga('#bottom .eTitle span')[1].innerHTML = '有图 ('+allData[1].length+') ';

    let curData = allData[0];
    let btns = yx.ga('#bottom .eTitle div');
    let ln = 0;

    for(let i = 0; i < btns.length; i++) {
        btns[i].index = i;
        btns[i].onclick = function() {
            btns[ln].className = '';
            this.className = 'active';

            ln = this.index

            curData = allData[this.index];
            showComment(10, 0);

            createPage(10, curData.length);
        };
    }

    //显示评价数据
	showComment(10,0);
	function showComment(pn,cn){
		//pn			一页显示几条
		//cn			现在是哪页
		
		var ul=yx.g('#bottom .border>ul');
		var dataStart=pn*cn;			//数据起始的值
		var dataEnd=dataStart+pn;	//数据结束的值
		
		//如果结束的值大于了数据的总量，循环的时候就会报错，所以要把结束的值改成数量总量
		if(dataEnd>curData.length){
			dataEnd=curData.length;
		}
		
		//主体结构
		var str='';
		ul.innerHTML='';
		for(var i=dataStart;i<dataEnd;i++){
			var avatart=curData[i].frontUserAvatar?curData[i].frontUserAvatar:'images/avatar.png';				//头像地址
			
			var smallImg='';		//小图的父级，要放在if外面
			var dialog='';		//轮播图的父级，要放在if外面
			
			if(curData[i].picList.length){
				//这个条件满足的话，说明这条评论有小图以及轮播图
				var span='';			//小图片的父级是个span标签
				var li='';			//轮播图图片的父级是个li标签
				for(var j=0;j<curData[i].picList.length;j++){
					span+='<span><img src="'+curData[i].picList[j]+'" alt=""></span>';
					li+='<li><img src="'+curData[i].picList[j]+'" alt=""></li>';
				}
				
				smallImg='<div class="smallImg clearfix">'+span+'</div>';
				dialog='<div class="dialog" id="commmetImg'+i+'" data-imgnum="'+curData[i].picList.length+'"><div class="carouselImgCon"><ul>'+li+'</ul></div><div class="close">X</div></div>';
			}
			
			str+='<li>'+
					'<div class="avatar">'+
						'<img src="'+avatart+'" alt="">'+
						'<a href="#" class="vip1"></a><span>'+curData[i].frontUserName+'</span>'+
					'</div>'+
					'<div class="text">'+
						'<p>'+curData[i].content+'</p>'+smallImg+
						'<div class="color clearfix">'+
							'<span class="left">'+curData[i].skuInfo+'</span>'+
							'<span class="right">'+yx.formatDate(curData[i].createTime)+'</span>'+
						'</div>'+dialog+
					'</div>'+
				'</li>';
		}
		
		ul.innerHTML=str;
        showImg()
		
	}

    function showImg() {
        let spans = yx.ga('#bottom .smallImg span');
        for(let i = 0; i < spans.length; i++) {
            spans[i].onclick = function() {
                let dialog = this.parentNode.parentNode.lastElementChild;
                dialog.style.opacity = 1;
                dialog.style.height = '510px';
                
                let en = 0;
                dialog.addEventListener('transitionend', function() {
                     {
                        let id = this.id;
                        let commentImg = new Carousel();
                        commentImg.init({
							id:id,
							totalNum:dialog.getAttribute('data-imgnum'),
							autoplay:false,
							loop:false,
							moveNum:1,
							circle:false,
							moveWay:'position'
						});
                    }
                });

                let closeBtn = dialog.querySelector('.close');
                closeBtn.onclick = function() {
                    dialog.style.opacity = 0;
                    dialog.style.height = 0;
                }
            }
        }
    }

    createPage(10, curData.length);
    function createPage(pn, tn) {
        //pn    显示页码的数量
        //tn    数据的总量

        let page = yx.g('.page');
        let totalNum = Math.ceil(tn / pn);

        if(pn > totalNum) {
            pn = totalNum;
        }

        page.innerHTML = '';

        let cn = 0;
        let spans = [];
        let div = document.createElement('div');
        div.className = 'mainPage';

        //创建首页页码
        let indexpage = pageFn('首页', function() {
            for(let i = 0; i < pn; i++) {
                spans[i].innerHTML = i + 1;
            }
            cn = 0;

            showComment(10, 0);
            changePage();
        });
        indexpage.style.display = 'none';

        let prevpage = pageFn('<上一页', function() {
            if(cn > 0) {
                cn--;
            }

            showComment(10, spans[cn].innerHTML - 1);
            changePage();
        })
        prevpage.style.display = 'none';


        //创建数字页码
        for(let i = 0; i < pn; i++) {
            let span = document.createElement('span');
            span.index = i;
            span.innerHTML = i+1;
            spans.push(span);

            span.className = i ? '' : 'active';

            span.onclick = function() {
                cn = this.index;
                showComment(10, this.innerHTML - 1);
                changePage();
            };

            div.appendChild(span);
        }

        page.appendChild(div);

        let nextpage = pageFn('下一页>', function() {
            if(cn < spans.length - 1) {
                cn++;
            }

            showComment(10, spans[cn].innerHTML - 1);
            changePage();
        })
  

        

        let lastpage = pageFn('尾页', function() {
            let end = totalNum;
            for(let i = pn - 1; i >= 0; i--) {
                spans[i].innerHTML = end--;
            }
            cn = spans.length - 1;

            showComment(10, totalNum - 1);
            changePage();
        });
        


        function changePage() {
            let cur = spans[cn];
            let curInner = cur.innerHTML;

            let differ = spans[spans.length - 1].innerHTML - spans[0].innerHTML;
            
            if(cur.index == spans.length - 1) {
                if(Number(cur.innerHTML) + differ > totalNum) {
                    differ = totalNum - cur.innerHTML;
                }
            }

            if(cur.index == 0) {
                if(cur.innerHTML - differ < 1) {
                    differ = cur.innerHTML - 1;
                }
            }

            for(let i = 0; i < spans.length; i++) {
                if(cur.index == spans.length - 1) {
                    spans[i].innerHTML = Number(spans[i].innerHTML) + differ;
                }

                if(cur.index == 0) {
                    spans[i].innerHTML -= differ;
                }
                spans[i].className = '';
                if(spans[i].innerHTML == curInner) {
                    spans[i].className = 'active';
                    cn = spans[i].index;
                }
            }

            if(pn > 1) {
                let dis = curInner == 1 ? 'none' : 'inline-block';
                indexpage.style.display = prevpage.style.display = dis

                dis = curInner == totalNum ? 'none' : 'inline-block';
                nextpage.style.display = lastpage.style.display = dis
            }
            
        }

        function pageFn(inner, fn) {
            if(pn < 2) {
                return;
            }

            let span = document.createElement('span');
            span.innerHTML = inner;
            span.onclick = fn;
            page.appendChild(span);

            return span;        //把创建的标签返回出去
        }
    }
    
})();

(function() {
    yx.public.shopFn();

    let joinBtn = yx.g('#productImg .join');
    joinBtn.onclick = function() {
        let actives = yx.ga('#productImg .fomat .active');
        let selectNum = yx.g('#productImg .number input').value;

        if(actives.length < curData.skuSpecList.length) {
            alert('请选择正确的规格或者数量');
            return;
        }

        let id = '';
        let spec = [];

        for(let i = 0; i < actives.length; i++) {
            id += actives[i].getAttribute('data-id') + ';';
            spec.push(actives[i].innerHTML);
        }

        id = id.substring(0, id.length-1);

        let select = {
            "id": id,
            "name": curData.name,
            "price": curData.retailPrice,
            "num": selectNum,
            "spec": spec,
            "img": curData.skuMap[id].picUrl,
            "sign": "productLocal"
        };

        localStorage.setItem(id,JSON.stringify(select));
        yx.public.shopFn();

        let cartWrap = yx.g('.cartWrap');
        cartWrap.onmouseenter();
        setTimeout(function() {
            yx.g('.cart').style.display = 'none';
        }, 2000)
    }
    
})();