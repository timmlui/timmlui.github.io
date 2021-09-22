/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useRef } from 'react';

import Slide from './components/Slide';

import { sortColors } from './sortColors';

import './App.scss';

function App() {
  const [data, setData] = useState({});
  const [svgs, setSvgs] = useState({});
  const [intersect, setIntersect] = useState(false);
  const pathEl = useRef(null);
  const cursor = useRef(null);
  const findMe = useRef(null);
  
  useEffect(() => {
    const data = require('./data.json');
    setData(data);
    const svgs = require('./svg.json');
    setSvgs(svgs);

    _handleAnimation();

    // Event Listeners

    document.body.onmousemove = function(e) {
      document.documentElement.style.setProperty('--x', (e.clientX+window.scrollX) + 'px');
      document.documentElement.style.setProperty('--y', (e.clientY+window.scrollY) + 'px');
    }

    document.addEventListener('mousemove', _showSpotlight);

    document.documentElement.style.setProperty('--scale', 0);
  }, []);

  useEffect(() => {
    if (intersect) {
      console.log('is intersectping')
      // Needed to prevent the shrink animation on refresh.
      document.documentElement.style.setProperty('--scale', 150);
      cursor.current.classList.remove('inverted-inactive');
      cursor.current.classList.add('inverted-active');
    } else {
      console.log('NOT intersectping')
      cursor.current.classList.remove('inverted-active');
      cursor.current.classList.add('inverted-inactive');
    }
  }, [intersect])

  const _showSpotlight = () => {
    const el1 = findMe.current.getBoundingClientRect();
    const el2 = cursor.current.getBoundingClientRect();

    const _elementIntersect = (el1, el2) => {
      return !(el1.right < el2.left || 
        el1.left > el2.right || 
        el1.bottom < el2.top || 
        el1.top > el2.bottom);
    }

    const isIntersect = _elementIntersect(el1, el2);

    if (isIntersect && !intersect) {
      setIntersect(true);
    } else if (!isIntersect && !intersect) {
      setIntersect(false);
    }
  }

  const _renderSlides = () => {
    const { skills = [] } = svgs;

    // Sort the colors of the icons by HUE.
    if (skills.length > 0) {
      sortColors(skills);
    }

    const slides = skills.map((svg) => (
      <Slide {...svg} />
    ));

    // Needed for the illusion of an infinite scroll
    const duplicated = [...slides, ...slides];

    return (
      <React.Fragment>
        {duplicated}
      </React.Fragment>
    )
  }

  const _handleAnimation = () => {
    const path = pathEl.current;
    const length = path.getTotalLength();

    // Clear any previous transition
    path.style.transition = path.style.WebkitTransition = 'none';
    // Set up the starting positions
    path.style.strokeDasharray = length + ' ' + length;
    path.style.strokeDashoffset = length;
    // Trigger a layout so styles are calculated & the browser
    // picks up the starting position before animating
    path.getBoundingClientRect();
    // Define our transition
    path.style.transition = path.style.WebkitTransition =
      'stroke-dashoffset 2s ease-in-out';
    // Go!
    path.style.strokeDashoffset = '0';
  }

  return (
    <div class="container">
      <div class="header-nav">
        <a class="logo" href="/#">TL.</a>
        <a class="resume-link" href="/resume">Resume</a>
      </div>
      <div class="name-plate">
        <svg id="name-svg" width="200" height="100" viewBox="0 0 600 100" overflow="visible">
        <path
          stroke="#000"
          stroke-width="10"
          fill="none"
          stroke-dasharray="988.00 988.00"
          stroke-dashoffset="0.00"
          d="M62.9 14.9c-25-7.74-56.6 4.8-60.4 24.3-3.73 19.6 21.6 35 39.6 37.6 42.8 6.2 72.9-53.4 116-58.9 65-18.2 191 101 215 28.8 5-16.7-7-49.1-34-44-34 11.5-31 46.5-14 69.3 9.38 12.6 24.2 20.6 39.8 22.9 91.4 9.05 102-98.9 176-86.7 18.8 3.81 33 17.3 36.7 34.6 2.01 10.2.124 21.1-5.18 30.1"
          ref={pathEl}
        />
        </svg>
      </div>
      <div class="technicals">
        <span>github link</span>
        <div class="slider">
          <div class="slider-track">
            {_renderSlides()}
          </div>
        </div>
      </div>
      <div class="cursor" ref={cursor}></div>
      <div class="find-me" ref={findMe}>
        <span class="find-me_title">
          FIND ME
        </span>
        <span class="find-me_details">
          <a href="lui.timm@gmail.com">lui.timm@gmail.com</a>
          <span>github link</span>
          <span>phone num</span>
        </span>
      </div>
    </div>
  )
}

export default App;
