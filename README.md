# ReactEXE
react学习小项目，准备用于自己域名的首页

```
下载下来后安装依赖项 npm i
安装好后启动直接 npm start
打包 npm run dist
注意打包的时候要注意文件路径的问题
```

### 提交操作

```
git add dist
git commit -m  "提交到github.io页面"
git subtree push --prefix=dist origin gh-pages

如何访问  https://tanghy1997.github.io/ReactEXE/

github用户名.github.io/项目名/

```

### get到小技巧
屏幕渲染机制有两种：

- 灰阶渲染：控制边缘亮度，所耗内存相对较低，应用于手机
- 亚像素渲染：效果更好，所耗内存相对更高，应用于Mac等
Mac上有些浅色字体图片（在上面设置了白色，可以设置为深色进行测试）在浏览器上显得较粗 解决方案：在父元素上设置属性，修改浏览器的属性： 

```
-webkit-font-smoothing: antialiased; /* 开启chrome在Mac下字体渲染的灰阶平滑 */  <br />
-moz-osx-font-smoothing: grayscale; /* 开启firefox在Mac下字体渲染的灰阶平滑 */
```
