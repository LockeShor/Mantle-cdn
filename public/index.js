function addVideo() {
    section = document.getElementById("container")
    console.log(section);

    newVideo = document.createElement("video");
    newVideo.setAttribute("loop", "")
    newVideo.setAttribute("autoplay", "")
    //newVideo.setAttribute("controls", "")
    //newVideo.setAttribute("muted", "")
    newVideo.setAttribute("src", "http://localhost:3000/example.mp4");
    newVideo.setAttribute("type", "video/mp4");
    newVideo.setAttribute("preload", "none");
    newVideo.onclick = function() {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    newDiv = document.createElement("div");
    newDiv.setAttribute("class", "video-box");

    newDiv.appendChild(newVideo);
    section.appendChild(newDiv);
}


var carouselPositions;
var halfContainer;
var currentItem;

function getCarouselPositions() {
  carouselPositions = [];
  document.querySelectorAll('#container div').forEach(function(div) {
    carouselPositions.push([div.offsetTop, div.offsetTop + div.offsetHeight]); // add to array the positions information
  })
  halfContainer = document.querySelector('#container').offsetHeight/2;
}

getCarouselPositions(); // call it once

function goCarousel(direction) {
  
  var currentScrollTop = document.querySelector('#container').scrollTop;
  var currentScrollBottom = currentScrollTop + document.querySelector('#container').offsetHeight;
  
  if (currentScrollTop === 0 && direction === 'next') {
      currentItem = 1;
  } else if (currentScrollBottom === document.querySelector('#container').scrollHeight && direction === 'previous') {
      console.log('here')
      currentItem = carouselPositions.length - 2;
  } else {
      var currentMiddlePosition = currentScrollTop + halfContainer;
      for (var i = 0; i < carouselPositions.length; i++) {
        if (currentMiddlePosition > carouselPositions[i][0] && currentMiddlePosition < carouselPositions[i][1]) {
          currentItem = i;
          if (direction === 'next') {
              currentItem++;
          } else if (direction === 'previous') {
              currentItem--    
          }
        }
      }
  } 
  
  document.getElementById('container').scrollTo({
    top: carouselPositions[currentItem][0],
    behavior: 'smooth' 
  });
  
}
window.addEventListener('resize', getCarouselPositions);
