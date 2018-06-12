require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';//一定要记得引入因为目前的获取DOM改成了ReactDOM来操作

// 获取图片的相关的数据
var imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片名信息转成图片URL路径信息
// imageDatas = (function genImageURL(imageDatasArr) {
//     for (let i = 0,j = imageDatasArr.length; i< j; i++) {
//         var singleImageData = imageDatasArr[i];

//         singleImageData.imageURL = require('../images/' + singleImageData.fileName);
//         imageDatasArr[i] = singleImageData;
//     }

//     return imageDatasArr;
// })(imageDatas)
/*
 *将图片名信息转化为URL路径信息
 *@param imageDatasArr 传入数据
 */
function genImageURL(imageDatasArr) {
  for (var i = 0; i < imageDatasArr.length; i++) {
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
}
imageDatas = genImageURL(imageDatas);

// 获取区间内的随机值
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

// 获取0~30度之间的任意正负值
function get30DegRandom() {
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

// 生成单幅的图片
class ImgFigure extends React.Component {
    constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    /**
     * imgFigure的点击处理函数
     */
    handleClick(e) {
      // 判断是否是居中的如果是就执行翻转函数，否执行居中方法
      if(this.props.arrange.isCenter) {
        this.props.inverse();
      } else {
        this.props.center();
      }
      e.stopPropagation();
      e.preventDefault();
    }

    render() {
      var styleObj = {};

      // 如果props属性中指定了这张图片的位置则使用

      if(this.props.arrange.pos) {
        styleObj = this.props.arrange.pos;
      }

      // 如果图片的旋转角度有值且不为0，添加旋转角度

      if(this.props.arrange.rotate) {
        (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(value){
          styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        }.bind(this))

      }

      // 因为中心图片有可能被遮住所以需要提高层级
      if(this.props.arrange.isCenter) {
        styleObj.zIndex = 11;
      }

      // 图片的正反切换 PS：由于图片的翻转[rotateY]和旋转[rotateX]都在一个div上操作，所以只有居中元素才可以翻转
      var imgFigureClassName = 'img-figure';
          imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

      return (
        <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
            <img src={this.props.data.imageURL}
                alt={this.props.data.title} />
            <figcaption>
                <h2 className="img-title">{this.props.data.title}</h2>
                <div className="img-back" onClick={this.handleClick}>
                  <p>
                    {this.props.data.desc}
                  </p>
                </div>
            </figcaption>
        </figure>
      )
    }
}

// 控制组件
class ControllerUnit extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    // 如果点击的是当前正在选中态的按钮则翻转图片，否则将图片居中
    if(this.props.arrange.isCenter) {
      this.props.inverse();
    }else {
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  }
  render() {
    var controllerUnitClassName = 'controller-unit';

    // 如果对应的是居中的图片，显示控制按钮的居中态
    if(this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center';

      // 如果同时对应的是翻转的图片，显示控制按钮的翻转态
      if(this.props.arrange.isInverse) {
        controllerUnitClassName +=  ' is-inverse';
      }
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    )
  }
}

// 主组件
class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        // 初始化数据
        this.state = {
          imgsArrangeArr: [
            // {
            //   pos: {
            //     left: '0',
            //     top: '0'
            //   },
            // ratate: 0   //旋转角度
            // isInverse: false  //图片正反面
            // isCenter: false  //图片是否居中
            // }
          ]
        };
        this.Constant = {
          centerPos:{
            left: 0,
            right: 0
          },
          hPosRange: { //水平方向取值范围
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
          },
          vPosRange: { //垂直方向的取值范围
            x: [0, 0],
            topY: [0, 0]
          }
        };

        this.rearrange = this.rearrange.bind(this);
    }

    /**
     * 翻转图片
     * @param index 输入当前被执行的Inverse操作的图片对应的图片信息数组的index值
     * @return {Function} 这是一个闭包函数， 其内return一个真正的待被执行的函数
     */
    inverse(index) {
      return function() {
        var imgsArrangeArr = this.state.imgsArrangeArr;

        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
      }.bind(this)
    }

    /**
     * 利用rearrange函数， 居中对应的index的图片
     * @param index,需要被居中的图片对应的图片信息的数组的index的值
     * @param {Function}
    */
    center(index) {
      return function() {
        this.rearrange(index);
      }.bind(this);
    }


    /**
     * 重新布局所有图片
     * @param centerIndex 指定居中排布的哪个图片
     */
    rearrange(centerIndex) {
      var imgsArrangeArr = this.state.imgsArrangeArr,
          Constant = this.Constant,
          centerPos = Constant.centerPos,
          hPosRange = Constant.hPosRange,
          vPosRange = Constant.vPosRange,
          hPosRangeLeftSecX = hPosRange.leftSecX,
          hPosRangeRightSecX = hPosRange.rightSecX,
          hPosRangeY = hPosRange.y,
          vPosRangeTopY = vPosRange.topY,
          vPosRangeX = vPosRange.x,


          imgsArrangeTopArr = [],
          topImgNum = Math.floor(Math.random() * 2), //取一个或者不取因为是向下取整所以不能用ceil
          topImgSpliceIndex = 0,
          imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

          // 首先居中 centerIndex 的图片  居中的centerIndex的图片不需要旋转
          imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
          }

          // 取出要布局的上侧的图片信息
          topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
          imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

          // 布局位于上侧的图片
          imgsArrangeTopArr.forEach(function(value, index) {
            imgsArrangeTopArr[index] = {
              pos: {
                top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
              },
              rotate: get30DegRandom(),
              isCenter: false
            };
          })

          // 布局左右两侧的图片信息
          for(let i = 0,j = imgsArrangeArr.length, k = j/ 2; i < j; i++){
            var hPosRangeLORX = null;

            // 前半部分布局左边，右半部分布局右边
            if(i < k) {
              hPosRangeLORX = hPosRangeLeftSecX;
            } else {
              hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i]={
              pos: {
                top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
              },
              rotate: get30DegRandom(),
              isCenter: false
            };
          }
          // debugger;
          //重新填充
          if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
          }

          imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

          this.setState({
            imgsArrangeArr: imgsArrangeArr
          });

    }

    // 组件加载后，为每张图片计算其位置的范围
    componentDidMount() {
      //首先获取舞台大小
      var stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,//clientHeight无法获取
        halfStageW = Math.floor(stageW / 2),
        halfStageH = Math.floor(stageH / 2);

      //获得imageFigure的大小
      var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,//clientHeight无法获取
        halfImgW = Math.floor(imgW / 2),
        halfImgH = Math.floor(imgH / 2);

      this.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
      }

      //计算左侧右侧区域图片排布位置的取值范围
      this.Constant.hPosRange.leftSecX[0] = -halfImgW;
      this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
      this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
      this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
      this.Constant.hPosRange.y[0] = -halfImgH;
      this.Constant.hPosRange.y[1] = stageH - halfImgH;
      //alert(stageH);

      //计算上侧区域图片排布位置的取值范围
      this.Constant.vPosRange.topY[0] = -halfImgH;
      this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
      this.Constant.vPosRange.x[0] = halfStageW - imgW;
      this.Constant.vPosRange.x[1] = halfStageW;

      this.rearrange(0);
    }

    render() {

      const controllerUnits = [];
      const imgFigures = [];
      //图片信息数据循环
      imageDatas.forEach(function (val, index) {
        if(!this.state.imgsArrangeArr[index]) {
          this.state.imgsArrangeArr[index] = {
            pos: {
              left: 0,
              top: 0
            },
            rotate : 0,
            isInverse: false,
            isCenter: false
          }
        }
        imgFigures.push(<ImgFigure data={val} key={val.id} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
          center={this.center(index)} />);

        controllerUnits.push(<ControllerUnit key={val.id} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
      }.bind(this))

      return (
        <section className="stage" ref="stage">
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
