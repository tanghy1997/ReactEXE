require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// 获取图片的相关的数据
var imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
    for (let i = 0,j = imageDatasArr.length; i< j; i++) {
        var singleImageData = imageDatasArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
})(imageDatas)

class ImgFigure extends React.Component {
  render() {
    return (
      <figure className="img-figure">
          <img src={this.props.data.imageURL}
               alt={this.props.data.title} />
          <figcaption>
              <h2 className="img-title">{this.props.data.title}</h2>
          </figcaption>
      </figure>
    )
  }
}

class AppComponent extends React.Component {
  render() {

    const controllerUnits = [];
    const imgFigures = [];

    imageDatas.forEach(function (val) {
      imgFigures.push(<ImgFigure data={val} key={val.id}/>);
    })

    return (
      <section className="stage">
          <section className="img-sec">
              {imgFigures}
          </section>
          <section className="controller-nav">
              {controllerUnits}
          </section>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
