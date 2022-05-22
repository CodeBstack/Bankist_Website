'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');

//Learn More Selections
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener
  ('click', openModal))

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//Implementing smooth scrolling
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  // //getting coordinates
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console(e.target.getBoundingClientRect());

  // //current scroll position
  // console.log('Current Scroll (X/Y)', window.pageXOffset, window.pageYOffset)

  // //getting height and width
  // console.log(document.documentElement.clientHeight,
  //   document.documentElement.clientWidth);

  //Scrolling - old way
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset, 
  //   s1coords.top + window.pageYOffset);

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset, 
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });


  //Scrolling - new way
  section1.scrollIntoView({ behavior: 'smooth' })
})



//Page Navigation

// //without event delegation  -- the function is added to each of the el which in casee of many elements, it will affect the performance
// document.querySelectorAll('.nav__link').forEach
//   (function (el) {
//     el.addEventListener('click', function (e) {
//       e.preventDefault(); //prevents the anchor tags in this case.

//         //getting the href attribute
//       const id = this.getAttribute('href');

//       document.querySelector(id).scrollIntoView({
//         behavior: 'smooth'});
//     });
//   });



//With Event Delegation 
//Steps;
//1. Add event listener to common parent element
//2. Determine what element originated the event.

document.querySelector('.nav__links').addEventListener
  ('click', function (e) {
    e.preventDefault(); //prevents the anchor tags in this case.

    //Matching Strategy
    if (e.target.classList.contains('nav__link')) {

      //getting the href attribute
      const id = e.target.getAttribute('href');

      document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });

// //Sticky Navigation -- old way
// const initialcoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {

//   if (window.scrollY > initialcoords.top) nav.
//     classList.add('sticky');

//   else nav.classList.remove('sticky');
// });


//Sticky Navigation - Intersection Observer API - intersect another element or the viewport
//New way
// const obsCallback = function(entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// };

// const obsOptions = {
//   root: null,   //--root in this case is the viewport
//   threshold: [0, 0.2], //---when the section1 intersects the viewport at 0% & 20% - then obsCallback will get called
// };

// const observer = new IntersectionObserver
// (obsCallback, obsOptions);

// observer.observe(section1);  

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries; //same as entries[0];
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');

  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver
  (stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px` //a margin of 90px that will be added outside our target
  });

headerObserver.observe(header);


//Reveal sections as you approach
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver
  (revealSection, {
    root: null,
    threshold: 0.15
  });

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})


//Lazy loading images
const imgTargets = document.querySelectorAll
  ('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  // entry.target.classList.remove('lazy-img'); //this will happen so fast and make us not notice issues

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '+200px'  //the images are completely loaded 200px before we reach them
})

imgTargets.forEach(img => imgObserver.observe(img));

//SLIDER
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');


  let curSlide = 0;
  const maxSlide = slides.length;


  //to see visualise other slides
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX (-800px)';
  // slider.style.overflow = 'visible';

  // slides.forEach((s, i) => (s.style.transform =
  //   `translateX(${100 * i}%)`));   //replaced with goToSlide(0)
  //0%, 100%, 200%,300%

  //Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend',
        `<button class = "dots__dot" data-slide="${i}"></
     button>`
      );
    });
  };

  //Activate dot
  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove
        ('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]
  `)
      .classList.add('dots__dot--active');
  };


  const goToSlide = function (slide) {
    slides.forEach((s, i) => (s.style.transform =
      `translateX(${100 * (i - slide)}%)`));
  }


  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    // curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  }

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1
    }
    else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide)
  }

  const init = function () {
    goToSlide(0);
    createDots(0);
    activateDot(0); //makes the dot active at position 0
  }
  init();

  //Next slide -- Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  })


  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide)
    }
  });
};
slider();




