  import React, { Component } from 'react'
  import { SlideUp } from 'onscreen-effects'
  import { render } from 'react-dom'
  import { TweenMax, TimelineMax } from 'gsap';
  import '../css/saturation.scss'
  import snoise from '../glsl/simplex_noise';
  import vertexShader from '../glsl/glitch.vert';
  import fragmentShader from '../glsl/glitch.frag';
  import { Clock, Scene, PerspectiveCamera, WebGLRenderer, Vector2, Vector3, TextureLoader, ShaderMaterial, PlaneBufferGeometry, Mesh, LinearFilter } from 'three';

  const ANIMATION_DURATION = 2;

  class Saturation extends Component {

    constructor(props) {
      super(props)
      this.animateSaturation = (e) => this._animateSaturation(e);
      this.animateGlitchedSaturation = () => this._animateGlitchedSaturation();
    }

    componentDidMount() {
      this.animateGlitchedSaturation();
    }

    _animateGlitchedSaturation() {
      let offsetX, offsetY;
      const { canvas, container } = this.refs;
      const clock = new Clock();
      const scene = new Scene();
      const texture = new TextureLoader().setCrossOrigin('').load('./images/glitched_saturation.jpg');
      let imageHeight = 1349;
      let imageWidth = 1080;
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

      function resize() {
        imageWidth = Math.min(575, container.getBoundingClientRect().width * 0.6);
        if(window.innerWidth <= 600) imageWidth = window.innerWidth - 40;
        imageHeight = imageWidth * (1/aspectRatio);
        renderer.setSize(imageWidth, imageWidth * (1/aspectRatio));
        camera.updateProjectionMatrix();
      }

      resize();

      window.addEventListener('resize', resize);

      (function animate() {
        setMousePosition();
        const time = clock.getElapsedTime();
        const amplitude = 3.0;
        const offset = 0.0;
        const periodLength = 4;
        const periodLength2 = 16;
        mesh.material.uniforms.mouse.value = mouse;
        mesh.material.uniforms.delta.value = amplitude * (Math.sin(time * 1/periodLength) +  Math.cos(time * 1/periodLength2)) + offset;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      })()
    }

    _animateSaturation(e) {
      e.persist();
      const nextSaturation = parseFloat(e.currentTarget.dataset.saturation);
      TweenMax.to(this.refs.canvas, ANIMATION_DURATION, {
        filter: `saturate(${nextSaturation})`
      });

      Array
        .from(e.currentTarget.parentNode.childNodes)
        .filter(n => n != e.currentTarget)
        .forEach(n => n.blur());
    }

    render() {
      return (
        <div className='saturation-container container' ref='container'>
          <div className='padding-bottom-50 sm-padding-bottom-30 atomic-tangerine-color center-align'>
            <SlideUp runMoreThanOnce duration={1000} delay={500}>
              <h2>Saturation</h2>
            </SlideUp>
            <SlideUp runMoreThanOnce duration={1000} delay={650}>
              <h6 className='med-text italic'>a.k.a Chroma</h6>
            </SlideUp>
          </div>

          <SlideUp runMoreThanOnce duration={1000} delay={800}>
            <h3 className='mona-lisa-color padding-bottom-50 sm-padding-bottom-30 center-align thin'>The colorfulness of a hue.</h3>
          </SlideUp>

          <div className='flex sm-flex-col justify-space-between'>
            <canvas ref='canvas' className='no-cursor border-radius-5' />
            <div className='padding-left-50 border-box justify-center sm-padding-left-0 width-50-pct sm-width-100-pct flex flex-col sm-center-align'>
              <SlideUp runMoreThanOnce duration={1000} delay={800}>
                <h4 className='light-mona-lisa-color line-height-60 sm-padding-top-50'>
                  <span className='brace'>[</span>Desaturated hues are grayed out. Desaturate a hue by adding complementary colors.<span className='brace'>]</span>
                </h4>
              </SlideUp>
              <div className='flex justify-center flex-wrap margin-top-100 sm-margin-top-50'>
                <div
                  tabIndex='1'
                  className='box saturated hoverable'
                  data-saturation='2.5'
                  onMouseEnter={this.animateSaturation}
                  onFocus={this.animateSaturation}>
                  <SlideUp runMoreThanOnce duration={1000} delay={800}>
                    Saturate
                  </SlideUp>
                </div>
                <div
                  tabIndex='1'
                  className='box hue hoverable'
                  data-saturation='1'
                  onMouseEnter={this.animateSaturation}
                  onFocus={this.animateSaturation}>
                  <SlideUp runMoreThanOnce duration={1000} delay={950}>
                    Hue
                  </SlideUp>
                </div>
                <div
                  tabIndex='1'
                  className='box desaturated hoverable'
                  data-saturation='0.25'
                  onMouseEnter={this.animateSaturation}
                  onFocus={this.animateSaturation}>
                  <SlideUp runMoreThanOnce duration={1000} delay={1100}>
                    Desaturate
                  </SlideUp>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

}

(() => render(<Saturation/>, document.querySelector('#saturation')))()
