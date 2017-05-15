import React, { Component } from 'react'
import { SlideUp } from 'onscreen-effects'
import { render } from 'react-dom'
import { TweenMax } from 'gsap';
import '../css/value.scss'
import snoise from '../glsl/simplex_noise';
import vertexShader from '../glsl/glitch.vert';
import fragmentShader from '../glsl/glitch.frag';
import { Clock, Scene, PerspectiveCamera, WebGLRenderer, Vector2, Vector3, TextureLoader, ShaderMaterial, PlaneBufferGeometry, Mesh, LinearFilter } from 'three';

const ANIMATION_DURATION = 1;

class Value extends Component {

  constructor(props) {
    super(props);
    this.state = { brightness: 1 };
    this.animateBrightness = (e) => this._animateBrightness(e);
    this.animateGlitchedValue = () => this._animateGlitchedValue();
  }

  componentDidMount() {
    this.animateGlitchedValue();
    window.box = this.refs.box;
  }

  _animateBrightness(e) {
    const box = this.refs.box;
    if(parseFloat(box.style.opacity) < 0.25) return;
    const boxWidth = box.getBoundingClientRect().width;
    const offsetX = e.pageX - box.offsetLeft;
    const brightness = ((offsetX/boxWidth) * 1.75) + 0.25;
    this.setState({ brightness });
    TweenMax.to(this.refs.canvas, ANIMATION_DURATION, {
      filter: `brightness(${brightness})`
    });
  }

  _animateGlitchedValue() {
    let offsetX, offsetY;
    const { canvas, container } = this.refs;
    const clock = new Clock();
    const scene = new Scene();
    const texture = new TextureLoader().setCrossOrigin('').load('./images/glitched_value.png');
    let imageHeight = 575;
    let imageWidth = 575;
    const aspectRatio = imageWidth/imageHeight;
    const mouse = new Vector2();
    const camera = new PerspectiveCamera(45, (imageWidth/imageHeight), 1, 10);
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

    const resize = () => {
      const box = this.refs.box;
      imageWidth = Math.min(575, container.getBoundingClientRect().width * 0.5);
      if(window.innerWidth <= 600) imageWidth = window.innerWidth - 40;
      imageHeight = imageWidth * (1/aspectRatio);
      box.style.height = `${imageWidth * 0.8}px`;
      box.style.width = `${imageWidth * 0.8}px`;
      renderer.setSize(imageWidth, imageWidth * (1/aspectRatio));
      camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', resize);

    function animate() {
      setMousePosition();
      const time = clock.getElapsedTime();
      const amplitude = 3.0;
      const offset = 0.0;
      const periodLength = 3;
      const periodLength2 = 15;
      mesh.material.uniforms.mouse.value = mouse;
      mesh.material.uniforms.delta.value = amplitude * (Math.sin(time * 1/periodLength) +  Math.cos(time * 1/periodLength2)) + offset;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    resize();
    animate();

  }

  render() {
    return (
      <div className='value-container container' ref='container'>
        <div className='padding-bottom-50 mandy-color right-align'>
          <SlideUp runMoreThanOnce duration={1000} delay={500}>
            <h2>Value</h2>
          </SlideUp>

          <SlideUp runMoreThanOnce duration={1000} delay={650}>
            <h6 className='med-text italic'>a.k.a Brightness</h6>
          </SlideUp>
        </div>

        <SlideUp runMoreThanOnce duration={1000} delay={800}>
          <h3 className='wewak-color padding-bottom-50 right-align thin'>Value is the lightness or darkness of a hue.</h3>
        </SlideUp>

        <div className='flex justify-space-between sm-flex-col align-items-center padding-bottom-50'>
          <canvas ref='canvas' className='no-cursor border-radius-5' />
          <div
            ref='box'
            className='value-box sm-margin-top-50 sm-width-100-pct border-box hoverable'
            onMouseMove={this.animateBrightness}
            onMouseLeave={this.resetBrightness}
          >
            <SlideUp runMoreThanOnce duration={1000} delay={500} className='brightness white-color'>
              <h3>Brightness</h3>
              <h4 className='padding-top-15 width-150 align-items-center center-align flex justify-space-between'><span className='brace'>[</span>{`${parseInt(this.state.brightness * 100)}%`}<span className='brace'>]</span></h4>
            </SlideUp>
          </div>
        </div>

        <SlideUp runMoreThanOnce duration={1000} delay={500}>
          <h4 className='wewak-color line-height-60 center-align'>
            <span className='brace'>[</span>A value scale is like a gray scale for a hue.<span className='brace'>]</span>
          </h4>
        </SlideUp>
      </div>
    );
  }
}

(() => render(<Value/>, document.querySelector('#value')))()
