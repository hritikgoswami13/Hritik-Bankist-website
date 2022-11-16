'use strict';

// selecting elements
const header = document.querySelector(".header");
const btnScroll = document.querySelector(".btn--scroll-to");
const section1 =document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent =document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");



///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn =>btn.addEventListener("click",openModal));


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////

// creating and inserting elements

//.InsertAdajacentHTML 

const message = document.createElement("div"); // div tag
message.classList.add("cookie-message");
message.textContent ="we use cookies for improve functionality and analytics";
message.innerHTML=
'We use cookies for improve functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

header.append(message);

// deleting the elements

document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function() {
  message.remove();
 
});


// event deligation
//1. Add event listener to common parent elements
//2. Determine what element originated the events

document.querySelector(".nav__links").addEventListener("click", function(e){
  e.preventDefault();
 
  //matching strategy
  if(e.target.classList.contains("nav__link")){
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({behavior:"smooth"});
};
  
});

// tabbed component
 
 // adding event-delegation to its parent to make efficent
 tabsContainer.addEventListener("click", function(e){
  const clicked = e.target.closest(".operations__tab");
  console.log(clicked);

  // guard close
  if(!clicked) return;
// Remove active tab
  tabs.forEach(t =>t.classList.remove("operations__tab--active"));

  tabsContent.forEach(c =>c.classList.remove("operations__content--active"));

  
  //active tab
    console.log((`operations__content--${clicked.dataset.tab}`))
    clicked.classList.add("operations__tab--active");
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");
 });

 
///////////////////////////////////////

// Menu fade animation
const handleHover = function(e){

  if(e.target.classList.contains("nav__link")){
    const link =e.target;
    const sibligs =link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img")

    sibligs.forEach(el => {
      if(el !==link) el.style.opacity =this;
    });
      logo.style.opacity =this;
    
  };
};
// pasiing an 'argument" into handler;
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

///////////////////////////////////////

// button scrolling
btnScroll.addEventListener("click", function(){

    section1.scrollIntoView({behavior:"smooth"});
});

// here is no need to pass observer in obscallback function

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries){
  const [entry] = entries;
  if(!entry.isIntersecting) nav.classList.add("sticky")
  else nav.classList.remove("sticky");
};

const observer = new IntersectionObserver(stickyNav,{
  root :null,
  threshold :0,
  rootMargin:`-${navHeight}px`,
});
observer.observe(header);


///--->>> Reveal sections


const allSections =document.querySelectorAll(".section")
const revelSection = function(entries,observer){
  const [entry] = entries;
  // console.log(entry);

  if(!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revelSection, {
  root:null,
  threshold:0.15,
});
allSections.forEach(function (section){
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});


//--->>. lazy loading
const imgTargets = document.querySelectorAll("img[data-src]");
// console.log(imgTargets)

const loadImg = function(entries, observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;
  // //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function(){
    entry.target.classList.remove("lazy-img");
  });
 observer.unobserve(entry.target);
};


const imgObserver = new IntersectionObserver(loadImg, {
  root:null,
  threshold: 0,
  rootMargin: "200px"
});
imgTargets.forEach(img=> imgObserver.observe(img));


// sliders
const sliders = function(){
const slides = document.querySelectorAll(".slide")
const btnleft =document.querySelector(".slider__btn--left");
const btnright =document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots")

let curentSlide =0;
const maxSlide = slides.length;


//functions

const createDots = function(){
  slides.forEach(function(_, i){
    dotContainer.insertAdjacentHTML("beforeend", `<button class="dots__dot" data-slide="${i}"></button>`)
  })
}
const activatedot = function(slide){
  document.querySelectorAll(".dots__dot").forEach(dot =>{
    dot.classList.remove("dots__dot--active");
  });
  document.querySelector(`.dots__dot[data-slide="${slide}"`).classList.add("dots__dot--active");
}

const goToSlide = function(slide){
  slides.forEach((s,i) => s.style.transform= `translateX(${100 * (i-slide)}%)`)
}

slides.forEach((s,i) => s.style.transform= `translateX(${100 * i}%)`)

//next slide

const nextSlide = function(){
  if ( curentSlide === (maxSlide - 1)){
    curentSlide=0;
  }
  else{
    curentSlide++;
  }
  goToSlide(curentSlide);
  activatedot(curentSlide)
};

const previousSldie = function(){
    if( curentSlide === 0){
      curentSlide=(maxSlide - 1)
    }
    else{
      curentSlide--;
    }
    goToSlide(curentSlide);
    activatedot(curentSlide);
};
const init = function(){
  goToSlide(0);
  createDots();
  activatedot(0);
}
init();

// Event handlers
btnright.addEventListener("click",nextSlide);
btnleft.addEventListener("click", previousSldie);
document.addEventListener("keydown", function(e){
  if( e.key === "ArrowLeft") previousSldie();
  e.key === "ArrowRight" && nextSlide();
});
dotContainer.addEventListener("click", function(e){
  if (e.target.classList.contains("dots__dot")){
    // const slide = e.target.dataset.slide;
    const{slide} = e.target.dataset;
    goToSlide(slide);
    activatedot(slide);
  };

});
};
sliders();

// css style property

message.style.backgroundColor ="#37383d";
message.style.width ="120%";

message.style.height = parseFloat(getComputedStyle(message).height,10) + 30 +'px';
