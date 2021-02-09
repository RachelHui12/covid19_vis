$(function () {
    Date.prototype.Format = function (fmt) { //author: meizz   
        var o = {  
            "M+": this.getMonth() + 1, //月份   
            "d+": this.getDate(), //日   
            "H+": this.getHours(), //小时   
            "m+": this.getMinutes(), //分   
            "s+": this.getSeconds(), //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds() //毫秒   
        };  
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
        for (var k in o)  
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
        return fmt;  
    }  
    var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");  
    echart_map();
    echart_map2();
    confirm_countries();
    nowconfirm();
    dead();
    deadrate();
    heal();
    healrate();
    continent();
    
    heal_dead();
    
    // echart_map
    function echart_map() {
        // 基于准备好的dom，初始化echarts实例
        $.get("https://lab.isaaclin.cn/nCoV/api/area?latest=1",
        function (data, status) {
            var arr = [];
            // 处理数据，成地图需要的数据结构
            data.results.forEach(item => {
                // 循环的过程中，向空数组中加入所需的内容
                if(item.countryName==item.provinceName){  
                //这个判断是因为，这个数据还统计了中国省份和城市的数据，所以这个条件用于判断这个元组是否为国家的数据                  
                arr.push({
                    name: item.countryEnglishName, // name固定
                    value: item.confirmedCount, // value固定
                    nowconfirm: item.currentConfirmedCount, // 当前确诊
                    heal: item.curedCount,//治愈数
                    dead: item.deadCount,//死亡数
                    CName:item.countryName//国家的中文名字
                });
            }  
            });
            //统一替换名称不匹配的问题
            arr.forEach(item => {
                if(item.name=='United States of America'){
                    item.name='United States'
                }
                else if(item.name=='The Islamic Republic of Mauritania'){
                    item.name='Mauritania'
                }
                else if(item.name=='Kazakstan'){
                    item.name='Kazakhstan'
                }
                else if(item.name=='Somali'){
                    item.name='Somalia'
                }
                else if(item.name=='Central African Republic'){
                    item.name='Central African Rep.'
                }
                else if(item.name=='Papua New Cuinea'){
                    item.name='Papua New Guinea'
                }
                else if(item.name=='Burma'){
                    item.name='Myanmar'
                }
                else if(item.name=='Kampuchea (Cambodia )'){
                    item.name='Cambodia'
                }
                else if(item.name=='Laos'){
                    item.name='Lao PDR'
                }
                else if(item.name=='SriLanka'){
                    item.name='Sri Lanka'
                }
                else if(item.name=='Kingdom of Bhutan'){
                    item.name='Bhutan'
                }
                else if(item.name=='Republic of Serbia'){
                    item.name='Serbia'
                }
                else if(item.name=='Bosnia and Herzegovina'){
                    item.name='Bosnia and Herz.'
                }
                else if(item.name=='Democratic Republic of the Congo'){
                    item.name='Dem. Rep. Congo'
                }
                else if(item.name=='North Macedonia'){
                    item.name='Macedonia'
                }
                else if(item.name=='Ivory Coast'){
                    item.name='Côte d\'Ivoire'
                }
                else if(item.CName=='赞比亚共和国'){
                    item.name='Zambia'
                }
                else if(item.CName=='几内亚比绍'){
                    item.name='Guinea-Bissau'
                }
                else if(item.CName=='刚果（布）'){
                    
                    item.name='Congo'
                }
                else if(item.CName=='厄立特里亚'){
                    
                    item.name='Eritrea'
                }
                else if(item.CName=='黑山'){
                    
                    item.name='Montenegro'
                }
                else if(item.CName=='吉尔吉斯斯坦'){
                    
                    item.name='Kyrgyzstan'
                }
            });
            console.log(arr);
            // 循环结束之后，我们就得到了地图需要的数据了。数据是arr，但是还稍微有点问题
            
            // 到此为止，所有的数据全部处理好了。

            // 下面开始做地图
            // 1. 初始化
            var myChart = echarts.init(document.getElementById('confirm'));

            // 2. 配置
            var option = {
                // 标题部分
                title: {
                    
                    textStyle: {
                        fontSize: 28
                    },
                    
                    subtext: '数据更新于'+time2,
                    subtextStyle: {
                        fontSize: 14,
                        top: '10px'
                    }
                },
                // 设置地图及数据
                series: [
                    
                    {
                    type: 'map',
                    map: 'world', // 指定是世界地图
                    data: arr, // 设置地图中的数据
                    label: { 
                        show: false
                    },
                    showLegendSymbol: false
                },
            ],
                tooltip: { // 鼠标悬浮提示
                    formatter: function (params) { // 允许我们自定义悬浮提示的内容
                        // return 你需要提示的内容
                        return `国家：${params.data.CName}<br/>
                        累计确诊：${params.data.value}<br/>
                        当前确诊：${params.data.nowconfirm}<br/>
                        治愈：${params.data.heal}<br/>
                        死亡：${params.data.dead}<br/>
                        `;
                    }
                },

                visualMap:[ {
                    type: 'piecewise',
                    seriesIndex:0,
                    pieces: [
                        { gt: 10000 }, // 大于10000
                        { gt: 5000, lte: 10000 },
                        { gt: 1000, lte: 5000 },
                        { gt: 500, lte: 1000 },  
                        { gt: 100, lte: 500 },  
                        { gt: 10, lte: 100 },   // (200, 300]
                        { gt: 0, lte: 10 },       
                    ],
                    inRange: {
                        color: ['#ffcfc3', '#eda595', '#d27b64', '#d5462a', '#a8352e', '#6a211d', '#562a2a']
                    },
                    left:10,
                    bottom:20,
                    textStyle:{
                        color:'white'
                    }
                }
               ]
            };

            // 3. 生成地图
            myChart.setOption(option);
        });

    }
    function confirm_countries(){
        $.get("https://lab.isaaclin.cn/nCoV/api/area?latest=1",
        function (data, status) {
            var arr = [];
            var name=[];
            // 处理数据，成地图需要的数据结构
            data.results.forEach(item => {
                // 循环的过程中，向空数组中加入所需的内容
                if(item.provinceEnglishName==item.countryEnglishName){
                if(item.confirmedCount>1000){
                    // name.push(item.countryEnglishName)
                    
                arr.push({
                    name: item.countryName, // name固定
                    value: item.confirmedCount, // value固定
                });

            }}
            }); 
            function sortIdDesc(a,b){  
            return -a.value+b.value
            }
            arr.sort(sortIdDesc)//降序排序
            
            // console.log(arr);
            arr=arr.slice(0,20);
            arr.forEach(item =>{
                name.push(item.name)
            })
            // 下面开始画柱状图
            // 1. 初始化
            var myChart = echarts.init(document.getElementById('statistics1'));
            // 2. 配置
            var option = {
                // 标题部分
                title: {
                    // text: '海外03.28累计确诊示意图',
                    textStyle: {
                        fontSize: 28
                    },
                    left: 'left', // 左右居中
                    subtext: '选取了累计确诊超过1000人的国家 数据来源：丁香园',
                    subtextStyle: {
                        fontSize: 14,
                        color:'white'
                    }
                },
                tooltip: { // 鼠标悬浮提示
                    trigger: 'axis',
                        axisPointer: {
                                 type: 'shadow'
                        }
                },
                xAxis: {
                    type: 'value',
                    axisLine:{
                        lineStyle:{color:'white'}
                    }
                    },
                yAxis: {
                    type: 'category',
                    data:name,
                    nameTextStyle:{
                        color:'white'
                    },                   
                axisLine:{
                    lineStyle:{color:'white'}
                }
                },
                grid: {
                    right: 50
                },
                series: [
                {
                    type: 'bar',
                    data: arr
                }
            ]
            };

            // 3. 生成地图
            myChart.setOption(option);
        });

    }

    function echart_map2() {
        // 基于准备好的dom，初始化echarts实例
        $.get("https://lab.isaaclin.cn/nCoV/api/area?latest=1",
        function (data, status) {
            var arr = [];
            // 处理数据，成地图需要的数据结构
            data.results.forEach(item => {
                // 循环的过程中，向空数组中加入所需的内容
                if(item.countryName==item.provinceName){                    
                arr.push({
                    name: item.countryEnglishName, // name固定
                    confirm: item.confirmedCount, // value固定
                    value: item.currentConfirmedCount, // 当前确诊
                    heal: item.curedCount,
                    dead: item.deadCount,
                    CName:item.countryName
                });
            }  
            });
            //统一替换名称不匹配的问题
            arr.forEach(item => {
                if(item.name=='United States of America'){
                    item.name='United States'
                }
                else if(item.name=='The Islamic Republic of Mauritania'){
                    item.name='Mauritania'
                }
                else if(item.name=='Kazakstan'){
                    item.name='Kazakhstan'
                }
                else if(item.name=='Somali'){
                    item.name='Somalia'
                }
                else if(item.name=='Central African Republic'){
                    item.name='Central African Rep.'
                }
                else if(item.name=='Papua New Cuinea'){
                    item.name='Papua New Guinea'
                }
                else if(item.name=='Burma'){
                    item.name='Myanmar'
                }
                else if(item.name=='Kampuchea (Cambodia )'){
                    item.name='Cambodia'
                }
                else if(item.name=='Laos'){
                    item.name='Lao PDR'
                }
                else if(item.name=='SriLanka'){
                    item.name='Sri Lanka'
                }
                else if(item.name=='Kingdom of Bhutan'){
                    item.name='Bhutan'
                }
                else if(item.name=='Republic of Serbia'){
                    item.name='Serbia'
                }
                else if(item.name=='Bosnia and Herzegovina'){
                    item.name='Bosnia and Herz.'
                }
                else if(item.name=='Democratic Republic of the Congo'){
                    item.name='Dem. Rep. Congo'
                }
                else if(item.name=='North Macedonia'){
                    item.name='Macedonia'
                }
                else if(item.name=='Ivory Coast'){
                    item.name='Côte d\'Ivoire'
                }
                else if(item.CName=='赞比亚共和国'){
                    
                    item.name='Zambia'
                }
                else if(item.CName=='几内亚比绍'){
                    
                    item.name='Guinea-Bissau'
                }
                else if(item.CName=='刚果（布）'){
                    
                    item.name='Congo'
                }
                else if(item.CName=='厄立特里亚'){
                    
                    item.name='Eritrea'
                }
                else if(item.CName=='黑山'){
                    
                    item.name='Montenegro'
                }
                else if(item.CName=='吉尔吉斯斯坦'){
                    
                    item.name='Kyrgyzstan'
                }
            });
            // 循环结束之后，我们就得到了地图需要的数据了。数据是arr，但是还稍微有点问题
            
            // 到此为止，所有的数据全部处理好了。

            // 下面开始做地图
            // 1. 初始化
            var myChart = echarts.init(document.getElementById('nowconfirm'));

            // 2. 配置
            var option = {
                // 标题部分
                title: {
                    
                    textStyle: {
                        fontSize: 28
                    },
                    
                    subtext: '数据更新于'+time2,
                    subtextStyle: {
                        fontSize: 14,
                        top: '10px'
                    }
                },
                // 设置地图及数据
                series: [
                    
                    {
                    type: 'map',
                    map: 'world', // 指定是世界地图
                    data: arr, // 设置地图中的数据
                    label: { 
                        show: true
                    },
                    showLegendSymbol: false
                },
            ],
                tooltip: { // 鼠标悬浮提示
                    formatter: function (params) { // 允许我们自定义悬浮提示的内容
                        // return 你需要提示的内容
                        return `国家：${params.data.CName}<br/>
                        当前确诊：${params.data.value}<br/>
                        累计确诊：${params.data.confirm}<br/>
                        治愈：${params.data.heal}<br/>
                        死亡：${params.data.dead}<br/>
                        `;
                    }
                },

                visualMap:[ {
                    type: 'piecewise',
                    seriesIndex:0,
                    pieces: [
                        
                        { gt: 5000 },
                        { gt: 1000, lte: 5000 },
                        { gt: 500, lte: 1000 },  
                        { gt: 100, lte: 500 },  
                        { gt: 0, lte: 100 },       
                    ],
                    inRange: {
                        color: ['rgb(223,184,230)', 'rgb(178,111,237)', 'rgb(148,67,240)', 'rgb(130,44,242)', 'rgb(93,44,112)']
                    },
                    left:10,
                    bottom:20,
                    textStyle:{
                        color:'white'
                    }
                }
               ]
            };

            // 3. 生成地图
            myChart.setOption(option);
        });

    }
    function nowconfirm(){
        $.ajax({
            url:"https://view.inews.qq.com/g2/getOnsInfo?name=disease_foreign",
            dataType: "jsonp",
            success: function (data) {
                var res = data.data || "";
                res = JSON.parse(res);
                var newArr = [];
                var name = [];
                res.countryAddConfirmRankList.forEach(item => {  
                    newArr.push({
                        name: item.nation,
                        value:item.addConfirm
                    });
                });
                newArr.forEach(item =>{
                    name.push(item.name)
                });
                var myChart = echarts.init(document.getElementById('addconfirm'));
                // 2. 配置
                var option = {
                    // 标题部分
                    title: {
                        textStyle: {
                            fontSize: 28
                        },
                        left: 'left', // 左右居中
                        subtext: '选取了新增确诊前十的国家',
                        subtextStyle: {
                            fontSize: 14,
                            color:'white'
                        }
                    },
                    tooltip: { // 鼠标悬浮提示
                        trigger: 'axis',
                            axisPointer: {
                                     type: 'shadow'
                            }
                    },
                    xAxis: {
                        type: 'value',
                        axisLine:{
                            lineStyle:{color:'white'}
                        }
                        },
                    yAxis: {
                        type: 'category',
                        data:name,
                        nameTextStyle:{
                            color:'white'
                        },                   
                    axisLine:{
                        lineStyle:{color:'white'}
                    }
                    },
                    grid: {
                        right: 50
                    },
                    series: [
                    {
                        type: 'bar',
                        data: newArr
                    }
                ]
                };
                myChart.setOption(option);
            }
        });
    }
    function dead(){
        $.get("https://lab.isaaclin.cn/nCoV/api/area?latest=1",
        function (data, status) {
            var arr = [];
            // 处理数据，成地图需要的数据结构
            data.results.forEach(item => {
                // 循环的过程中，向空数组中加入所需的内容
                if(item.countryName==item.provinceName){                    
                arr.push({
                    name: item.countryEnglishName, // name固定
                    confirm: item.confirmedCount, // value固定
                    nowconfirm: item.currentConfirmedCount, // 当前确诊
                    heal: item.curedCount,
                    value: item.deadCount,
                    CName:item.countryName
                });
            }  
            });
            //统一替换名称不匹配的问题
            arr.forEach(item => {
                if(item.name=='United States of America'){
                    item.name='United States'
                }
                else if(item.name=='The Islamic Republic of Mauritania'){
                    item.name='Mauritania'
                }
                else if(item.name=='Kazakstan'){
                    item.name='Kazakhstan'
                }
                else if(item.name=='Somali'){
                    item.name='Somalia'
                }
                else if(item.name=='Central African Republic'){
                    item.name='Central African Rep.'
                }
                else if(item.name=='Papua New Cuinea'){
                    item.name='Papua New Guinea'
                }
                else if(item.name=='Burma'){
                    item.name='Myanmar'
                }
                else if(item.name=='Kampuchea (Cambodia )'){
                    item.name='Cambodia'
                }
                else if(item.name=='Laos'){
                    item.name='Lao PDR'
                }
                else if(item.name=='SriLanka'){
                    item.name='Sri Lanka'
                }
                else if(item.name=='Kingdom of Bhutan'){
                    item.name='Bhutan'
                }
                else if(item.name=='Republic of Serbia'){
                    item.name='Serbia'
                }
                else if(item.name=='Bosnia and Herzegovina'){
                    item.name='Bosnia and Herz.'
                }
                else if(item.name=='Democratic Republic of the Congo'){
                    item.name='Dem. Rep. Congo'
                }
                else if(item.name=='North Macedonia'){
                    item.name='Macedonia'
                }
                else if(item.name=='Ivory Coast'){
                    item.name='Côte d\'Ivoire'
                }
                else if(item.CName=='赞比亚共和国'){
                    item.name='Zambia'
                }
                else if(item.CName=='几内亚比绍'){
                    item.name='Guinea-Bissau'
                }
                else if(item.CName=='刚果（布）'){
                    
                    item.name='Congo'
                }
                else if(item.CName=='厄立特里亚'){
                    
                    item.name='Eritrea'
                }
                else if(item.CName=='黑山'){
                    
                    item.name='Montenegro'
                }
                else if(item.CName=='吉尔吉斯斯坦'){
                    
                    item.name='Kyrgyzstan'
                }
            });
            // 循环结束之后，我们就得到了地图需要的数据了。数据是arr，但是还稍微有点问题
            
            // 到此为止，所有的数据全部处理好了。

            // 下面开始做地图
            // 1. 初始化
            var myChart = echarts.init(document.getElementById('dead'));

            // 2. 配置
            var option = {
                // 标题部分
                title: {
                    
                    textStyle: {
                        fontSize: 28
                    },
                    
                    subtext: '数据更新于'+time2,
                    subtextStyle: {
                        fontSize: 14,
                        top: '10px'
                    }
                },
                // 设置地图及数据
                series: [
                    
                    {
                    type: 'map',
                    map: 'world', // 指定是世界地图
                    data: arr, // 设置地图中的数据
                    label: { 
                        show: false
                    },
                    showLegendSymbol: false
                },
            ],
                tooltip: { // 鼠标悬浮提示
                    formatter: function (params) { // 允许我们自定义悬浮提示的内容
                        // return 你需要提示的内容
                        return `国家：${params.data.CName}<br/>
                        死亡数${params.data.value}<br/>
                        累计确诊数：${params.data.confirm}<br/>
                        当前确诊：${params.data.nowconfirm}<br/>
                        治愈：${params.data.heal}<br/>
                        `;
                    }
                },

                visualMap:[ {
                    type: 'piecewise',
                    seriesIndex:0,
                    pieces: [
                        { gt: 5000},
                        { gt: 1000, lte: 5000 },
                        { gt: 500, lte: 1000 },  
                        { gt: 100, lte: 500 },  
                        { gt: 10, lte: 100 },   // (200, 300]
                        { gt: 0, lte: 10 },       
                    ],
                    inRange: {
                        color: ['rgb(219,219,219)', 'rgb(184,184,184)', 'rgb(150,150,150)', 'rgb(120,120,120)', 'rgb(94,94,94)', 'rgb(69,69,69)']
                    },
                    left:10,
                    bottom:20,
                    textStyle:{
                        color:'white'
                    }
                }
               ]
            };

            // 3. 生成地图
            myChart.setOption(option);
        });
    }
    function deadrate(){
        $.get("https://lab.isaaclin.cn/nCoV/api/area?latest=1",
        function (data, status) {
            var arr = [];
            // 处理数据，成地图需要的数据结构
            data.results.forEach(item => {
                // 循环的过程中，向空数组中加入所需的内容
                if(item.countryName==item.provinceName){                    
                arr.push({
                    name: item.countryEnglishName, // name固定
                    confirm: item.confirmedCount, 
                    nowconfirm: item.currentConfirmedCount, // 当前确诊
                    heal: item.curedCount,
                    value: item.deadCount/item.confirmedCount,
                    CName:item.countryName
                });
            }  
            });
            //统一替换名称不匹配的问题
            arr.forEach(item => {
                if(item.name=='United States of America'){
                    item.name='United States'
                }
                else if(item.name=='The Islamic Republic of Mauritania'){
                    item.name='Mauritania'
                }
                else if(item.name=='Kazakstan'){
                    item.name='Kazakhstan'
                }
                else if(item.name=='Somali'){
                    item.name='Somalia'
                }
                else if(item.name=='Central African Republic'){
                    item.name='Central African Rep.'
                }
                else if(item.name=='Papua New Cuinea'){
                    item.name='Papua New Guinea'
                }
                else if(item.name=='Burma'){
                    item.name='Myanmar'
                }
                else if(item.name=='Kampuchea (Cambodia )'){
                    item.name='Cambodia'
                }
                else if(item.name=='Laos'){
                    item.name='Lao PDR'
                }
                else if(item.name=='SriLanka'){
                    item.name='Sri Lanka'
                }
                else if(item.name=='Kingdom of Bhutan'){
                    item.name='Bhutan'
                }
                else if(item.name=='Republic of Serbia'){
                    item.name='Serbia'
                }
                else if(item.name=='Bosnia and Herzegovina'){
                    item.name='Bosnia and Herz.'
                }
                else if(item.name=='Democratic Republic of the Congo'){
                    item.name='Dem. Rep. Congo'
                }
                else if(item.name=='North Macedonia'){
                    item.name='Macedonia'
                }
                else if(item.name=='Ivory Coast'){
                    item.name='Côte d\'Ivoire'
                }
                else if(item.CName=='赞比亚共和国'){
                    item.name='Zambia'
                }
                else if(item.CName=='几内亚比绍'){
                    item.name='Guinea-Bissau'
                }
                else if(item.CName=='刚果（布）'){
                    
                    item.name='Congo'
                }
                else if(item.CName=='厄立特里亚'){
                    
                    item.name='Eritrea'
                }
                else if(item.CName=='黑山'){
                    
                    item.name='Montenegro'
                }
                else if(item.CName=='吉尔吉斯斯坦'){
                    
                    item.name='Kyrgyzstan'
                }
            });
            // 循环结束之后，我们就得到了地图需要的数据了。数据是arr，但是还稍微有点问题
            
            // 到此为止，所有的数据全部处理好了。

            // 下面开始做地图
            // 1. 初始化
            var myChart = echarts.init(document.getElementById('deadrate'));

            // 2. 配置
            var option = {
                // 标题部分
                title: {
                    
                    textStyle: {
                        fontSize: 28
                    },
                    
                    subtext: '数据更新于'+time2,
                    subtextStyle: {
                        fontSize: 14,
                        top: '10px'
                    }
                },
                // 设置地图及数据
                series: [
                    
                    {
                    type: 'map',
                    map: 'world', // 指定是世界地图
                    data: arr, // 设置地图中的数据
                    label: { 
                        show: false
                    },
                    showLegendSymbol: false
                },
            ],
                tooltip: { // 鼠标悬浮提示
                    formatter: function (params) { // 允许我们自定义悬浮提示的内容
                        //死亡率转为百分数
                        var deadpercent=(params.data.value*100).toFixed(2)+'%';
                        // return 你需要提示的内容
                        return `国家：${params.data.CName}<br/>
                        死亡率${deadpercent}<br/>
                        累计确诊数：${params.data.confirm}<br/>
                        当前确诊：${params.data.nowconfirm}<br/>
                        治愈：${params.data.heal}<br/>
                        `;
                    }
                },

                visualMap:[ {
                    type: 'piecewise',
                    seriesIndex:0,
                    //echarts中设置gt和lte时，小数会被四舍五入，因此要设置精度
                    precision:2,
                    pieces: [
                        { gt: 0.10}, 
                        { gt: 0.05, lte: 0.10 },  
                        { gt: 0.01, lte: 0.05 },  
                        { gt: 0, lte: 0.01 },    
                    ],
                    inRange: {
                        color: ['rgb(219,219,219)', 'rgb(150,150,150)',  'rgb(94,94,94)', 'rgb(69,69,69)']
                    },
                    left:10,
                    bottom:20,
                    textStyle:{
                        color:'white'
                    }
                }
               ]
            };

            // 3. 生成地图
            myChart.setOption(option);
        });
    }
    function heal(){
        $.get("https://lab.isaaclin.cn/nCoV/api/area?latest=1",
        function (data, status) {
            var arr = [];
            // 处理数据，成地图需要的数据结构
            data.results.forEach(item => {
                // 循环的过程中，向空数组中加入所需的内容
                if(item.countryName==item.provinceName){                    
                arr.push({
                    name: item.countryEnglishName, // name固定
                    confirm: item.confirmedCount, // value固定
                    nowconfirm: item.currentConfirmedCount, // 当前确诊
                    value: item.curedCount,
                    dead: item.deadCount,
                    CName:item.countryName
                });
            }  
            });
            //统一替换名称不匹配的问题
            arr.forEach(item => {
                if(item.name=='United States of America'){
                    item.name='United States'
                }
                else if(item.name=='The Islamic Republic of Mauritania'){
                    item.name='Mauritania'
                }
                else if(item.name=='Kazakstan'){
                    item.name='Kazakhstan'
                }
                else if(item.name=='Somali'){
                    item.name='Somalia'
                }
                else if(item.name=='Central African Republic'){
                    item.name='Central African Rep.'
                }
                else if(item.name=='Papua New Cuinea'){
                    item.name='Papua New Guinea'
                }
                else if(item.name=='Burma'){
                    item.name='Myanmar'
                }
                else if(item.name=='Kampuchea (Cambodia )'){
                    item.name='Cambodia'
                }
                else if(item.name=='Laos'){
                    item.name='Lao PDR'
                }
                else if(item.name=='SriLanka'){
                    item.name='Sri Lanka'
                }
                else if(item.name=='Kingdom of Bhutan'){
                    item.name='Bhutan'
                }
                else if(item.name=='Republic of Serbia'){
                    item.name='Serbia'
                }
                else if(item.name=='Bosnia and Herzegovina'){
                    item.name='Bosnia and Herz.'
                }
                else if(item.name=='Democratic Republic of the Congo'){
                    item.name='Dem. Rep. Congo'
                }
                else if(item.name=='North Macedonia'){
                    item.name='Macedonia'
                }
                else if(item.name=='Ivory Coast'){
                    item.name='Côte d\'Ivoire'
                }
                else if(item.CName=='赞比亚共和国'){
                    item.name='Zambia'
                }
                else if(item.CName=='几内亚比绍'){
                    item.name='Guinea-Bissau'
                }
                else if(item.CName=='刚果（布）'){
                    
                    item.name='Congo'
                }
                else if(item.CName=='厄立特里亚'){
                    
                    item.name='Eritrea'
                }
                else if(item.CName=='黑山'){
                    
                    item.name='Montenegro'
                }
                else if(item.CName=='吉尔吉斯斯坦'){
                    
                    item.name='Kyrgyzstan'
                }
            });
            // 循环结束之后，我们就得到了地图需要的数据了。数据是arr，但是还稍微有点问题
            
            // 到此为止，所有的数据全部处理好了。

            // 下面开始做地图
            // 1. 初始化
            var myChart = echarts.init(document.getElementById('heal'));

            // 2. 配置
            var option = {
                // 标题部分
                title: {
                    
                    textStyle: {
                        fontSize: 28
                    },
                    
                    subtext: '数据更新于'+time2,
                    subtextStyle: {
                        fontSize: 14,
                        top: '10px'
                    }
                },
                // 设置地图及数据
                series: [
                    
                    {
                    type: 'map',
                    map: 'world', // 指定是世界地图
                    data: arr, // 设置地图中的数据
                    label: { 
                        show: false
                    },
                    showLegendSymbol: false
                },
            ],
                tooltip: { // 鼠标悬浮提示
                    formatter: function (params) { // 允许我们自定义悬浮提示的内容
                        // return 你需要提示的内容
                        return `国家：${params.data.CName}<br/>
                        治愈数${params.data.value}<br/>
                        累计确诊数：${params.data.confirm}<br/>
                        当前确诊：${params.data.nowconfirm}<br/>
                        死亡数：${params.data.dead}<br/>
                        `;
                    }
                },

                visualMap:[ {
                    type: 'piecewise',
                    seriesIndex:0,
                    pieces: [
                        { gt: 10000},
                        { gt: 5000, lte: 10000 },
                        { gt: 1000, lte: 5000 },
                        { gt: 500, lte: 1000 },  
                        { gt: 100, lte: 500 },  
                        { gt: 0, lte: 100 },       
                    ],
                    inRange: {
                        color: ['rgb(236,252,204)', 'rgb(222,242,167)', 'rgb(207,232,130)', 'rgb(190,222,95)', 'rgb(176,214,60)', 'rgb(157,204,16)']
                    },
                    left:10,
                    bottom:20,
                    textStyle:{
                        color:'white'
                    }
                }
               ]
            };

            // 3. 生成地图
            myChart.setOption(option);
        });
    }
    function healrate(){
        $.get("https://lab.isaaclin.cn/nCoV/api/area?latest=1",
        function (data, status) {
            var arr = [];
            // 处理数据，成地图需要的数据结构
            data.results.forEach(item => {
                // 循环的过程中，向空数组中加入所需的内容
                if(item.countryName==item.provinceName){                    
                arr.push({
                    name: item.countryEnglishName, // name固定
                    confirm: item.confirmedCount, 
                    nowconfirm: item.currentConfirmedCount, // 当前确诊
                    dead: item.deadCount,
                    value: item.curedCount/item.confirmedCount,
                    CName:item.countryName
                });
            }  
            });
            //统一替换名称不匹配的问题
            arr.forEach(item => {
                if(item.name=='United States of America'){
                    item.name='United States'
                }
                else if(item.name=='The Islamic Republic of Mauritania'){
                    item.name='Mauritania'
                }
                else if(item.name=='Kazakstan'){
                    item.name='Kazakhstan'
                }
                else if(item.name=='Somali'){
                    item.name='Somalia'
                }
                else if(item.name=='Central African Republic'){
                    item.name='Central African Rep.'
                }
                else if(item.name=='Papua New Cuinea'){
                    item.name='Papua New Guinea'
                }
                else if(item.name=='Burma'){
                    item.name='Myanmar'
                }
                else if(item.name=='Kampuchea (Cambodia )'){
                    item.name='Cambodia'
                }
                else if(item.name=='Laos'){
                    item.name='Lao PDR'
                }
                else if(item.name=='SriLanka'){
                    item.name='Sri Lanka'
                }
                else if(item.name=='Kingdom of Bhutan'){
                    item.name='Bhutan'
                }
                else if(item.name=='Republic of Serbia'){
                    item.name='Serbia'
                }
                else if(item.name=='Bosnia and Herzegovina'){
                    item.name='Bosnia and Herz.'
                }
                else if(item.name=='Democratic Republic of the Congo'){
                    item.name='Dem. Rep. Congo'
                }
                else if(item.name=='North Macedonia'){
                    item.name='Macedonia'
                }
                else if(item.name=='Ivory Coast'){
                    item.name='Côte d\'Ivoire'
                }
                else if(item.CName=='赞比亚共和国'){
                    item.name='Zambia'
                }
                else if(item.CName=='几内亚比绍'){
                    item.name='Guinea-Bissau'
                }
                else if(item.CName=='刚果（布）'){
                    
                    item.name='Congo'
                }
                else if(item.CName=='厄立特里亚'){
                    
                    item.name='Eritrea'
                }
                else if(item.CName=='黑山'){
                    
                    item.name='Montenegro'
                }
                else if(item.CName=='吉尔吉斯斯坦'){
                    
                    item.name='Kyrgyzstan'
                }
            });
            // 循环结束之后，我们就得到了地图需要的数据了。数据是arr，但是还稍微有点问题
            
            // 到此为止，所有的数据全部处理好了。

            // 下面开始做地图
            // 1. 初始化
            var myChart = echarts.init(document.getElementById('healrate'));

            // 2. 配置
            var option = {
                // 标题部分
                title: {
                    
                    textStyle: {
                        fontSize: 28
                    },
                    
                    subtext: '数据更新于'+time2,
                    subtextStyle: {
                        fontSize: 14,
                        top: '10px'
                    }
                },
                // 设置地图及数据
                series: [
                    
                    {
                    type: 'map',
                    map: 'world', // 指定是世界地图
                    data: arr, // 设置地图中的数据
                    label: { 
                        show: false
                    },
                    showLegendSymbol: false
                },
            ],
                tooltip: { // 鼠标悬浮提示
                    formatter: function (params) { // 允许我们自定义悬浮提示的内容
                        //治愈率转为百分数
                        var healpercent=(params.data.value*100).toFixed(2)+'%';;
                        // return 你需要提示的内容
                        return `国家：${params.data.CName}<br/>
                        治愈率${healpercent}<br/>
                        累计确诊数：${params.data.confirm}<br/>
                        当前确诊：${params.data.nowconfirm}<br/>
                        死亡数：${params.data.dead}<br/>
                        `;
                    }
                },

                visualMap:[ {
                    type: 'piecewise',
                    seriesIndex:0,
                    //echarts中设置gt和lte时，小数会被四舍五入，因此要设置精度
                    precision:2,
                    pieces: [
                        { gt: 0.50}, 
                        { gt: 0.20, lte: 0.50 },  
                        { gt: 0.10, lte: 0.20 },  
                        { gt: 0, lte: 0.10 },    
                    ],
                    inRange: {
                        color: ['rgb(236,252,204)', 'rgb(207,232,130)', 'rgb(176,214,60)', 'rgb(157,204,16)']
                    },
                    left:10,
                    bottom:20,
                    textStyle:{
                        color:'white'
                    }
                }
               ]
            };

            // 3. 生成地图
            myChart.setOption(option);
        });
    };
    function continent(){
        $.ajax({
            url:"https://view.inews.qq.com/g2/getOnsInfo?name=disease_foreign",
            dataType: "jsonp",
            success: function (data) {
                var res = data.data || "";
                res = JSON.parse(res);
                var date=[];
                var Asia = [];
                var Europe = [];
                var Africa = [];
                var NorthAmerica = [];
                var SouthAmerica = [];
                var Oceania = [];
                var other=[];
                var name = [];
                res.continentStatis.forEach(item => { 
                    date.push(
                        item.date
                    );                     
                    Asia.push(
                        item.statis.亚洲
                    );
                    Europe.push(
                        item.statis.欧洲
                    );
                    Africa.push(
                        item.statis.非洲
                    );
                    NorthAmerica.push(
                        item.statis.北美洲
                    );
                    SouthAmerica.push(
                        item.statis.南美洲 || 0
                    );
                    Oceania.push(
                        item.statis.大洋洲 ||0
                    );
                    other.push(
                        item.statis.其他
                    );
                });
                var myChart = echarts.init(document.getElementById('timeline_continent'));
                // 2. 配置
                var option = {
                    // 标题部分
                    title: {
                        text:"世界各大洲确诊变化时序图",
                        textStyle: {
                            fontSize: 24,
                            color:'white'
                        },
                        left: 'left', // 左右居中
                        subtextStyle: {
                            fontSize: 14,
                            color:'white'
                        }
                    },
                    legend:{
                        data:['亚洲','欧洲','非洲','大洋洲','南美洲','北美洲','其他'],
                        left:'right',
                        top:'30',
                        right:'30',
                        textStyle: {
                            fontSize: 14,
                            color:'white'
                        },
                    },
                    tooltip: { // 鼠标悬浮提示
                        trigger: 'axis',
                            axisPointer: {
                                     type: 'shadow'
                            }
                    },
                    xAxis: {
                        type: 'category',
                        data:date,
                        axisLine:{
                            lineStyle:{color:'white'}
                        }
                        },
                    yAxis: {
                        type: 'value',
                        nameTextStyle:{
                            color:'white'
                        },                   
                    axisLine:{
                        lineStyle:{color:'white'}
                    }
                    },
                    grid: {
                        right: 50
                    },
                    series: [
                    {
                        name:'亚洲',
                        type: 'bar',
                        stack: 'continent',
                        data: Asia
                    },
                    {
                        name:'欧洲',
                        type: 'bar',
                        stack: 'continent',
                        data: Europe
                    },
                    {
                        name:'非洲',
                        type: 'bar',
                        stack: 'continent',
                        data: Africa
                    },
                    {
                        name:'南美洲',
                        type: 'bar',
                        stack: 'continent',
                        data: SouthAmerica
                    },
                    {
                        name:'北美洲',
                        type: 'bar',
                        stack: 'continent',
                        data: NorthAmerica
                    },
                    {
                        name:'大洋洲',
                        type: 'bar',
                        stack: 'continent',
                        data: Oceania
                    },
                    {
                        name:'其他',
                        type: 'bar',
                        stack: 'continent',
                        data: other
                    },
                ]
                };
                myChart.setOption(option);
            }
        });
    };
    function heal_dead(){
        var myChart = echarts.init(document.getElementById('healrate_deadrate'));
        var information=[];
        $.ajax({
            url:"https://view.inews.qq.com/g2/getOnsInfo?name=disease_foreign",
            dataType: "jsonp",
            success: function (data) {
                var res = data.data || "";
                res = JSON.parse(res);
                res.foreignList.forEach(item => {  
                    information.push(
                        [

                        item.heal/item.confirm,
                        item.dead/item.confirm,
                        item.confirm,
                        item.name,
                        item.dead,
                        item.heal
                    ]
                    );
                });
                console.log(information)
                option = {
                    title: {
                        text: '各国死亡率与治愈率',
                        textStyle: {
                            fontSize: 24,
                            color:'white'
                        },
                    },        
                    xAxis: {
                        name:'治愈率',
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        },
                        axisLine:{
                            lineStyle:{color:'white'}
                        }
                    },
                    yAxis: {
                        name:'死亡率',
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        },
                        scale: true,
                        axisLine:{
                            lineStyle:{color:'white'}
                        }
                    },
                    dataZoom: [{
                        start: 0,
                        end: 100,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '80%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                    series: [{
                        data: information ,
                        type: 'scatter',
                        label: {
                            normal: {
                                formatter: function (param) {
                                    return `${param.data[3]}`;
                                  },
                                backgroundColor:'#E5E5E5',//字会看不清楚，所以叠加一个底色
                                position: "top",
                                show: true, //小圈是否显示名字,
                                textStyle: {
                                    color:'#606060',
                                    // textBorderColor  :'black'
                                }
                            }
                        },
                        symbolSize: function (data) {
                            
                            return Math.sqrt(data[2]/40);
                        },
                        emphasis: {
                            label: {
                                show: true,
                                formatter: function (param) {
                                    var deadpercent=(param.data[1]*100).toFixed(2)+'%';
                                    var curepercent=(param.data[0]*100).toFixed(2)+'%';
                                    return `${param.data[3]} 治愈率${curepercent} 死亡率${deadpercent}`;
                                    // return `国家：${params.data[3]}<br/>
                                    // 治愈率${curepercent}<br/>
                                    // 死亡率${deadpercent}<br/>
                                    // `;
                                  }
                            }
                        }

                    }]
                };
                myChart.setOption(option);
            }


        });

    }
})
