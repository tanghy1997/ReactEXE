require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// 获取图片的相关的数据
var imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
    for (let i = 0,j = imageDatasArr.length; i< j; i++) {
        var singleImageData = imageDatasArr[i];

        singleImageData.imgaeURL = require('../images/' + singleImageData.fileName);
        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
})(imageDatas)

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
          <section className="img-sec">

          </section>
          <section className="controller-nav">

          </section>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
