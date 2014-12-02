#cdown

JavaScript倒计时小工具

Demo地址：http://sternzhang.github.io/cdown, 或者扫描二维码在手机浏览器里查看：


### 安装


```js


<script src="src/cdown.js"></script>


```

### 使用

对外只提供一个调用接口--render方法：

```

var cd = new Cdown(option);

cd.render()

```

`option`是配置参数的对象，你可以针对以下几个属性进行自定义。

```js

{

	sdate: 开始时间（Date类型，默认是当前时间）

	edate: 结束时间(Date类型)

	unit: 计时间隔(Cdown.SECOND, Cdown.MINUTE, Cdown.HOUR, Cdown.DAY)

	pattern: 模式字符串

	finish: 倒计时结束后触发的函数

}


```

`pattern`是一个占位符的字符串，可用的占位符有：

* s
* ss
* m
* mm
* h
* hh
* d
* dd
* M
* MM

`s`表示秒，`m`是分钟，`h`是小时，`d`是天，`M`是月。`ss`表示两位数表示的秒，如果不足两位，前面补0，其他的也是一个意思。**占位符必须使用大括号包裹**。

`pattern: '<span>{hh}:{mm}:{ss}</span>'`最后渲染出来的字符串就会是 `<span>03:12:08</span>`
