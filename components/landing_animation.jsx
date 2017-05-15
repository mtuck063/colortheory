import React, { Component } from 'react'
import { render } from 'react-dom'
import '../css/base/index.scss'
import '../css/landing_animation.scss'
import { ShrinkIn, SlideDown } from 'onscreen-effects'
import snoise from '../glsl/simplex_noise';
import vertexShader from '../glsl/landing_animation.vert';
import fragmentShader from '../glsl/landing_animation.frag';
import { Clock, Scene, PerspectiveCamera, WebGLRenderer, Vector2, TextureLoader, ShaderMaterial, PlaneBufferGeometry, Mesh, LinearFilter } from 'three'

class LandingAnimation extends Component {

  componentDidMount() {
    this.refs.container.style.height = '70px';
    this.refs.canvas.style.opacity = 0;
    this.refs.header.style.opacity = 0;

    window.addEventListener('custom:page-load', (e) => {
      Velocity(this.refs.container, { height: '100vh' }, { duration: 500, easing: 'easeOutQuart', complete: () => document.body.removeChild(e.detail) })
      Velocity(this.refs.canvas, 'transition.expandIn', { duration: 1500, delay: 500, easing: 'easeOutQuart' });
      Velocity(this.refs.header, 'transition.shrinkIn', { duration: 1500, delay: 500, easing: 'easeOutQuart' });
    });

    const clock = new Clock();
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, ((window.innerWidth - 40) / window.innerHeight), 1, 10);
    const renderer = new WebGLRenderer({ canvas: this.refs.canvas, alpha: true, antialias: true });
    const mouse = new Vector2();
    const texture = new TextureLoader().setCrossOrigin('').load('./images/purp.jpg');
    const material = new ShaderMaterial({
      uniforms: {
        delta: { value: 0.0 },
        texture: { value: texture },
        mouse: { value: mouse },
      },
      vertexShader: snoise + vertexShader,
      fragmentShader: fragmentShader,
    });
    const geometry = new PlaneBufferGeometry(7.5, 5, 500, 500)
    const mesh = new Mesh(geometry, material);

    texture.anisotropy = renderer.getMaxAnisotropy();
    texture.generateMipmaps = false;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    camera.position.set(0,0,5);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth - 40, window.innerHeight);
    scene.add(mesh);

    function setMousePosition() {
      mouse.x = (window.mousePosition.pageX / (window.innerWidth - 40)) * 2 - 1;
      mouse.y = - (window.mousePosition.pageY / window.innerHeight) * 2 + 1;
    }

    window.addEventListener('resize', () => {
      camera.aspect = (window.innerWidth - 40) / window.innerHeight;
      renderer.setSize(window.innerWidth - 40, window.innerHeight);
      camera.updateProjectionMatrix();
    });

    function animate() {
      setMousePosition();
      const time = clock.getElapsedTime();
      const amplitude = 2.0;
      const offset = 0.0;
      const periodLength = 3;
      const periodLength2 = 5;
      mesh.material.uniforms.delta.value = amplitude * (Math.sin(time * 1/periodLength) +  Math.cos(time * 1/periodLength2))+ offset;
      camera.position.x += ((mouse.x * 2.5) - camera.position.x) * .05;
      camera.position.y += ((mouse.y * 2.5) - camera.position.y) * .05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();
  }

  render() {
    return (
      <div ref='container' className='landing-animation-container'>
        <canvas ref='canvas' className='absolute top-0' style={{left: 20}} />
        <h1 ref='header'>Color Theory</h1>
      </div>
    );
  }

}

(() => render(<LandingAnimation/>, document.querySelector('#landing-animation')))()
