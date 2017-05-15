import React, { Component } from 'react';
import { render } from 'react-dom';
import { TweenMax } from 'gsap';
import { SlideUp } from 'onscreen-effects';
import snoise from '../glsl/simplex_noise';
import vertexShader from '../glsl/glitch.vert';
import fragmentShader from '../glsl/glitch.frag';
import { Clock, Scene, PerspectiveCamera, WebGLRenderer, Vector2, Vector3, TextureLoader, ShaderMaterial, PlaneBufferGeometry, Mesh, LinearFilter } from 'three'

const ANIMATION_DURATION = 6;

class Hue extends Component {

  constructor(props) {
    super(props)
    this.animateColorWheel = (e) => this._animateColorWheel(e);
    this.stopAnimatingColorWheel = (e) => this._stopAnimatingColorWheel(e);
    this.animateGlitchedHue = () => this._animateGlitchedHue();
  }

  componentDidMount() {
    this.animateGlitchedHue();
  }

  _animateGlitchedHue() {
    let offsetX, offsetY;
    const { canvas } = this.refs;
    const clock = new Clock();
    const scene = new Scene();
    const texture = new TextureLoader().setCrossOrigin('').load('./images/glitched_hue.jpg');
    let imageHeight = 623;
    let imageWidth = 778;
    const aspectRatio = imageWidth/imageHeight;
    const mouse = new Vector2();
    const camera = new PerspectiveCamera(45, aspectRatio, 1, 100);
    const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    const material = new ShaderMaterial({
      uniforms: {
        delta: { value: 0.0 },
        texture: { value: texture },
        mouse: { value: mouse },
      },
      vertexShader: snoise + vertexShader,
      fragmentShader: fragmentShader,
    });
    const geometry = new PlaneBufferGeometry(aspectRatio, 1, 300, 300)
    const mesh = new Mesh(geometry, material);

    texture.anisotropy = renderer.getMaxAnisotropy();
    texture.generateMipmaps = false;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    camera.position.set(0,0,1.5);
    renderer.setSize(imageWidth, imageHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    scene.add(mesh);

    function setMousePosition() {
      offsetX = window.mousePosition.pageX - canvas.offsetLeft;
      offsetY = window.mousePosition.pageY - canvas.offsetTop;
      mouse.x = (offsetX / imageWidth) * 2 - 1;
      mouse.y = - (offsetY / imageHeight) * 2 + 1;
    }

    function resize() {
      imageWidth = Math.min(window.innerWidth - 440, 1170 - 440);
      if(window.innerWidth <= 600) imageWidth = window.innerWidth - 40;
      imageHeight = imageWidth * (1/aspectRatio);
      renderer.setSize(imageWidth, imageHeight);
      camera.updateProjectionMatrix();
    }

    function animate() {
      setMousePosition();
      const time = clock.getElapsedTime();
      const amplitude = 1.5;
      const offset = 0.0;
      const periodLength = 1;
      const periodLength2 = 12;
      mesh.material.uniforms.delta.value = amplitude * (Math.sin(time * 1/periodLength) +  Math.tan(time * 1/periodLength2)) + offset;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);

    resize();
    animate();

  }

  _animateColorWheel(e) {
    if(!this.tween) {
      this.tween = TweenMax.to({}, ANIMATION_DURATION, {
        onUpdate: timeline => {
          const progress = timeline.progress() * 360;
          TweenMax.set([this.refs.canvas, this.refs.colorwheel], {
            'filter': `hue-rotate(${progress}deg)`
          });
        },
        onUpdateParams: ['{self}'],
        repeat: -1,
      });
    } else {
      this.tween.duration(ANIMATION_DURATION).repeat(-1).play();
    }
  }

  _stopAnimatingColorWheel(e) {
    if(e.type === 'mouseleave' && e.currentTarget === document.activeElement) return;
    this.tween.pause();
  }

  render() {
    return (
      <div ref='container' className='hue-container container sm-center-align'>
        <div className='flex sm-flex-col padding-bottom-50 justify-space-between align-items-center'>
          <SlideUp runMoreThanOnce duration={1000} delay={500}>
            <h2 className='camelot-color width-400 sm-width-100-pct min-width-100-pct sm-padding-bottom-30'>Hue</h2>
          </SlideUp>
          <SlideUp runMoreThanOnce duration={1000} delay={500} className='width-100-pct'>
            <img
              ref='colorwheel'
              onMouseEnter={this.animateColorWheel}
              onMouseLeave={this.stopAnimatingColorWheel}
              onFocus={this.animateColorWheel}
              onBlur={this.stopAnimatingColorWheel}
              onClick={this.stopAnimatingColorWheel}
              src='./images/colorwheel.png'
              alt='Color Wheel'
              height='70'
              className='hoverable width-100-pct'
              tabIndex='1'
            />
          </SlideUp>

        </div>

        <SlideUp runMoreThanOnce duration={1000} delay={650}>
          <h3 className='viola-color padding-bottom-50 sm-padding-bottom-10 thin'>Any color on the color wheel.</h3>
        </SlideUp>

        <div className='flex sm-flex-col align-items-center'>
          <SlideUp runMoreThanOnce duration={1000} delay={800}>
            <div className='flex flex-col width-400 border-box sm-padding-right-0 padding-right-50 sm-width-100-pct sm-padding-bottom-50'>
              <h4 className='viola-color line-height-60'>
                <span className='brace'>[</span>Representing a starting point, the most primitive version of a color.<span className='brace'>]</span>
              </h4>
            </div>
          </SlideUp>
          <canvas ref='canvas' className='no-cursor border-radius-5'/>
        </div>

      </div>
    );
  }

}

(() => render(<Hue/>, document.querySelector('#hue')))()
