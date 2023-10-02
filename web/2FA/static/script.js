//ELEMENTS
const sections = document.querySelectorAll('section');
const images = document.querySelectorAll('.image');
const navbar = document.querySelector('nav');

//VARIABLES
const navStick = navbar.offsetTop;

//EVENTLISTENERS
document.addEventListener('scroll', sectionOnScroll);
document.addEventListener('scroll', imageTranslate);
document.addEventListener('scroll', stickNavbar);
document.addEventListener('DOMContentLoaded', sectionOnScroll);
document.addEventListener('DOMContentLoaded', imageTranslate);

//FUNCTIONS

function imageTranslate() {
    
    images.forEach((image)=>{
        image.style.transform = `translateY(${window.scrollY / 6}px)`;
    })
}

function stickNavbar() {

    if(navStick <= window.scrollY) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
}

function sectionOnScroll(){

    //Gir animasjon til sections
    sections.forEach((section, index) => {

        //Animasjon på alle utenom første section
        if(index > 0){

            let data = section.getBoundingClientRect();
            if(data.y < (window.innerHeight - 150)) {
                section.classList.add('section-active');
                section.classList.remove('section-inactive');
            }
    
            if(data.y > (window.innerHeight - 150)) {
                section.classList.add('section-inactive');
                section.classList.remove('section-active');
            } 
        } 
    });

}