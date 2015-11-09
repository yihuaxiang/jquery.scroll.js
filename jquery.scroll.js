;(function($,window,undefined){

    String.prototype.toInt=function(){
        var string=this.toString();
        if(string.length == 0){
            return 0;
        }else{
            var length=string.length;
            var negtive=false;
            if(string.indexOf("-") == 0){
                negtive=true;
                string=string.substr(1);
                length -= 1;
            }else{

            }

            var end=0;
            var stringArr=string.split("");
            for(var i=0;i<length;i++){
                if(isNaN(Number(stringArr[i]))){
                    end=i;
                    break;
                }else{
                    continue;
                }
            }

            if(end == 0){
                return 0;
            }else{

                var num=string.substr(0,end);

                if(negtive==false){
                    return Number(num);
                }else{
                    return Number("-"+num);
                }

            }
        }
    }

    function chooseOne(one,base,type){
        if(type == "gt"){
            return one > base ? one : base;
        }else if(type == "lt"){
            return one < base ? one : base;
        }else{
            return 0;
        }
    }

    $.fn.scroll=function(options){

        var defaults={
            dom:"",
            domTransition:{
                "-prefix-transition": "all 0.5s ease"
            },
            scrollSpan:100,
            frontId:"",
            backId:"",
            frontCss:{
                "position": "absolute",
                "background-color": "rgba(0,0,0,0)",
                "-prefix-box-shadow":"0px 0px 0px rgba(0,0,0,0)",
                "width": "5px",
                "border-radius": "3px",
                "cursor": "move",
                "z-index": "100"
            },
            frontTrasition:{
                "-prefix-transition": "all 0.7s ease"
            },
            backCss:{
                "position": "absolute",

                "-prefix-transition": "all 0.7s ease",
                "width": "5px",
                "height": "100%",
                "z-index": "2",
                "border-radius": "5px"
            },
            frontHoverCss:{
                 "background-color": "#054b9b",

                "-prefix-box-shadow": "0px 0px 3px rgb(255, 94, 0),0px 0px 6px rgb(19, 226, 35)"
            },
            backHoverCss:{
                    "background-color": "rgba(6,13,255,0.14)"
            },
            noTransition:{
                "-prefix-transition": "none"
            },
            noSelect:{
                "cursor":"move",

                "-prefix-user-select":"none"

            },
            canSelect:{
                "cursor":"initial",

                "-prefix-user-select":"initial"
            }
        };

        var opts=$.extend(true,{},defaults,options);


        //替换-prefix-前缀
        var prefixes=["webkit","o","moz","ms"];
        var oneCss={};
        var oneProp={};
        var oneValue={};
        for(var key in opts){
            oneCss=opts[key];
            for(var key in oneCss){
                if(key.indexOf("-prefix-") == 0){
                    oneProp=key.substr(8);
                    oneValue=oneCss[key];

                    for(var i=0,length=prefixes.length;i<length;i++){
                        oneCss["-"+prefixes[i]+"-"+oneProp]=oneValue;

                    }
                    oneCss[oneProp]=oneValue;

                    delete oneCss[key];
                }else{

                }

                //delete oneCss[key];
            }
        }

        console.log(opts);

        var $ele=$(opts.dom,this);
        var eleHeight=1;
        var eleTop="1";
        var $this=$(this);
        var divHeight=$this.height();

        var $one;
        var $two;

        $this.css({
            "position":"relative",
            "overflow":"hidden",
        });
        $ele.css("position","absolute");


        if(opts.frontId == "" || opts.backId == ""){
            console.log("frontId of backId is null");
            return false;
        }else{
            var one='<span id="'+opts.frontId+'" style="height:100%;top:0px;right:2px;"></span>';
            var two='<span id="'+opts.backId+'" style="top:0px;right:2px;"></span>';
            $one=$(one);
            $two=$(two);
            $one.css(opts.frontCss);
            $one.css(opts.frontTrasition);
            $two.css(opts.backCss);
            $ele.css(opts.domTransition);

            $this.append($one).append($two);
        }

        $(this).on("mouseover",function(){
            $one.css(opts.frontHoverCss);
            $two.css(opts.backHoverCss);
        }).on("mouseout",function(){
            $one.css(opts.frontCss);
            $two.css(opts.backCss);
        })

        $one.on("mousedown",function(){
            var start=event.pageY;
            var stop="";

            $one.css(opts.noTransition);
            $ele.css(opts.noTransition);

            var top=$one.css("top");
            // top=Number(top.substr(0,top.length - 2));
            top=top.toInt();
            $("body").css(opts.noSelect);

            $(window.document).on("mousemove",function(event){
                stop=event.pageY;

                var newTop=top+(Number(stop- start));

                // newTop=newTop <=0?0:newTop;
                newTop = chooseOne(newTop,0,"gt");
                // newTop=newTop>=(divHeight - $one.height())?(divHeight - $one.height()):newTop;
                newTop=chooseOne( newTop , (divHeight - $one.height()) , "lt" );
                $one.css("top",newTop+"px");

                var percent=Math.floor(newTop / (divHeight -$one.height() ) *100)/100;
                divTop=percent*($ele.height()-divHeight);
                $ele.css("top","-"+divTop+"px");
            }).on("mouseup",function(){
                $(window.document).off("mousemove");
                $one.css(opts.frontTrasition);
                $ele.css(opts.domTransition);
                $("body").css(opts.canSelect);
            })
        })

        //设置scrollbar的高度
        eleHeight=$ele.height();
        var tmp=Math.floor((divHeight / eleHeight )*100)/100;
        // tmp=tmp>1 ? 1:tmp;
        tmp=chooseOne(tmp,1,"lt");
        $one.css("height",(tmp*divHeight)+"px");

        return this.each(function(){
            if(opts.dom == ""){
                console.log("sorry , dom can not be empty!");

            }else{

                var touchStartY="";
                var touchEndY="";
                var touching=false;
                $this.on("mousewheel",function(event,delta,deltaX,deltaY){
                    eleHeight=$ele.height();
                    eleTop=String($ele.css("top"));
                    // eleTop=Math.abs(Number(eleTop.substr(0,eleTop.length - 2)));
                    eleTop=Math.abs(eleTop.toInt());

                    // console.log(eleHeight);
                    // console.log(eleTop);

                    if(eleTop == 0 && deltaY > 0){
                        //console.log("up");
                    }else if(eleTop != 0 && deltaY > 0){
                        event.preventDefault();

                        // $ele.css("top","-" + (eleTop -opts.scrollSpan >= 0 ? eleTop -opts.scrollSpan : 0) +"px");
                        $ele.css("top","-"+chooseOne(eleTop -opts.scrollSpan,0,"gt")+"px");

                        //修改scrollbar位置
    //         ulNewTop=(top -scrollSpan >= 0 ? top -scrollSpan : 0)/(ulHeight - divHeight);
    //         ulNewTop=(Math.floor(ulNewTop*100))/100;
                        // var tmp=(eleTop -opts.scrollSpan >= 0 ? eleTop -opts.scrollSpan : 0)/(eleHeight - divHeight);
                        var tmp=chooseOne(eleTop-opts.scrollSpan,0,"gt")/(eleHeight - divHeight);
                        tmp=(Math.floor(tmp*100))/100;

                        $one.css("top",tmp*(divHeight - $one.height())+"px");

                    }else if(eleTop == (eleHeight - divHeight) && deltaY < 0){
                        //console.log("down");
                    }else if(eleTop != (eleHeight - divHeight) && deltaY < 0){
                        // console.log(eleTop);
                        // console.log("*");
                        // console.log(eleHeight - divHeight);
                        event.preventDefault();

                        // $ele.css("top","-" + (eleTop + opts.scrollSpan <= eleHeight - divHeight  ? eleTop+opts.scrollSpan :eleHeight- divHeight )+"px");
                        $ele.css("top","-" + chooseOne(eleTop+opts.scrollSpan,eleHeight - divHeight ,"lt")+"px");

                        //修改scrollbar位置
                        // var tmp=(eleTop + opts.scrollSpan <= eleHeight - divHeight  ? eleTop+opts.scrollSpan :eleHeight- divHeight )/(eleHeight - divHeight);
                        var tmp=( chooseOne(eleTop+opts.scrollSpan,eleHeight - divHeight,"lt") )/(eleHeight - divHeight);
                        $one.css("top",tmp*(divHeight - $one.height())+"px");
                    }
                })

                $this[0].addEventListener("touchstart",function(event){

                    //event.preventDefault();
                    console.log(event);
                    touchStartY=event.changedTouches[0].pageY;
                    touching=true;
                },false);
                $this[0].addEventListener("touchmove",function(event){


                    if(touching == true && touchStartY != ""){
                        touchEndY=event.targetTouches[0].pageY;

                        var diff=touchEndY- touchStartY;
                        console.log(diff+"****");

                        //准备滑动所需的参数
                        eleHeight=$ele.height();
                        eleTop=String($ele.css("top"));
                        // eleTop=Math.abs(Number(eleTop.substr(0,eleTop.length - 2)));
                        eleTop=Math.abs(eleTop.toInt());

                        if(diff > 0 && eleHeight != 0){
                            event.preventDefault();
                            $ele.css("top","-"+chooseOne(eleTop -opts.scrollSpan,0,"gt")+"px");

                            //修改scrollbar位置
        //         ulNewTop=(top -scrollSpan >= 0 ? top -scrollSpan : 0)/(ulHeight - divHeight);
        //         ulNewTop=(Math.floor(ulNewTop*100))/100;
                            // var tmp=(eleTop -opts.scrollSpan >= 0 ? eleTop -opts.scrollSpan : 0)/(eleHeight - divHeight);
                            var tmp=chooseOne(eleTop-opts.scrollSpan,0,"gt")/(eleHeight - divHeight);
                            tmp=(Math.floor(tmp*100))/100;

                            $one.css("top",tmp*(divHeight - $one.height())+"px");
                        }else if(diff < 0 && eleTop != (eleHeight - divHeight)){
                            event.preventDefault();

                            // $ele.css("top","-" + (eleTop + opts.scrollSpan <= eleHeight - divHeight  ? eleTop+opts.scrollSpan :eleHeight- divHeight )+"px");
                            $ele.css("top","-" + chooseOne(eleTop+opts.scrollSpan,eleHeight - divHeight ,"lt")+"px");

                            //修改scrollbar位置
                            // var tmp=(eleTop + opts.scrollSpan <= eleHeight - divHeight  ? eleTop+opts.scrollSpan :eleHeight- divHeight )/(eleHeight - divHeight);
                            var tmp=( chooseOne(eleTop+opts.scrollSpan,eleHeight - divHeight,"lt") )/(eleHeight - divHeight);
                            $one.css("top",tmp*(divHeight - $one.height())+"px");
                        }
                    }
                },false);
                $this[0].addEventListener("touchend",function(event){
                    touching=false;
                },false)
// .on("touchmove",function(event){
//                     console.log("start");
//                     event.preventDefault();
//                     touchStartY=event.originalEvent.changedTouches[0].pageY;
//                     touching=true;
//                 }).on("touchmove",function(event){

//                     if(touching == true && touchStartY != ""){
//                         touchEndY=event.originalEvent.changedTouches[0].pageY;
//                         touching=false;

//                         if(touchEndY - touchStartY> 0){
//                             alert(">0");
//                         }else if(touchEndY - touchStartY < 0){
//                             alert("<0");
//                         }
//                     }
//                 })
            }
        })

    }

})(jQuery,window)
