用法

例如：有一个长度500像素的div#inner需要在一个高度100像素的div#outer中滚动

#outer{
    height:100px;
    position:realtive;
    overflow:hidden;
}


$("#outer").scroll({
    dom:"#inner",
    baseCss:{

    }
})
