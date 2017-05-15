import React, { Component } from 'react'
import { render } from 'react-dom'
import { SlideUp } from 'onscreen-effects'

class Verbs extends Component {

  render() {
    return (
      <div className='verbs-container container'>
        <div className='relative height-300 width-300 sm-width-100-pct flex justify-center align-items-center'>
          <img src='./images/verbs.jpg' alt='Verbs' className='absolute margin-center top-0 left-0 right-0 object-fit-contain width-300 height-300' />
          <SlideUp runMoreThanOnce duration={1000} delay={500}>
            <h2 className='white-color z-index-1'>Verbs</h2>
          </SlideUp>
        </div>

        <h3 className='perfume-color padding-top-50'>
          <SlideUp runMoreThanOnce duration={1000} delay={750} className='padding-bottom-25'>
            Tinting — Adding white to a hue.
          </SlideUp>
          <SlideUp runMoreThanOnce duration={1000} delay={875} className='padding-bottom-25'>
            Toning — Adding gray to a hue.
          </SlideUp>
          <SlideUp runMoreThanOnce duration={1000} delay={1000} className='padding-bottom-25'>
            Shading — Adding black to a hue.
          </SlideUp>
        </h3>
      </div>
    );
  }

}

(() => render(<Verbs/>, document.querySelector('#verbs')))()
