const svg = document.getElementById('display');
window.addEventListener("resize", resizeSvg);

function resizeSvg(){
    let bbox = svg.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${bbox.width} ${bbox.height}`);

    for(let radialGradient of svg.children){
      radialGradient.setAttribute('cx',  Math.min(bbox.width, bbox.height) * 0.1);
      radialGradient.setAttribute('cy',  Math.min(bbox.width, bbox.height) * 0.1);
      radialGradient.setAttribute('r',  Math.min(bbox.width, bbox.height) * 0.1);
      radialGradient.setAttribute('fx',  Math.min(bbox.width, bbox.height) * 0.1);
      radialGradient.setAttribute('fy',  Math.min(bbox.width, bbox.height) * 0.1);
  }
}

let slimes = [];

const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
svg.appendChild(container);

  function createFood(x,y) {
    const food = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    food.setAttribute("cx",  x);
    food.setAttribute("cy",  y);
    food.setAttribute("r", 10);
    food.setAttribute('fill', 'blue');
    container.insertBefore(food, container.firstChild);

  setTimeout(() => {
    container.removeChild(food);
    for (const slime of slimes) {
      slime.targetFood = null;
    }
  }, 5000);

  return food;
}

svg.addEventListener('click', function(event) {
  const x = event.clientX;
  const y = event.clientY;

  const food = createFood(x, y);

  for (const slime of slimes) {
    slime.targetFood = food;
  }
});


function createSlime(x, y) {
  const slime = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  slime.setAttribute('cx', x);
  slime.setAttribute('cy', y);
  slime.setAttribute('r', '15');
  slime.setAttribute('fill', 'yellow');
  container.appendChild(slime); 

slime.setAttribute('fill', 'url(#gradient)');

  return {
    element: slime,
    targetFood: null,
    speed: Math.random() + 0.5,
    move: function() {
      if (this.targetFood) {
          const dx = this.targetFood.cx.baseVal.value - x;
          const dy = this.targetFood.cy.baseVal.value - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const speed = 0.1; 
        
          if (distance > speed) { 
            x += (dx / distance) * this.speed;
            y += (dy / distance) * this.speed;
          } else {
            this.targetFood = null;
          }
        } else {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1;
          const dx = Math.cos(angle) * speed;
          const dy = Math.sin(angle) * speed;
        
          x += dx;
          y += dy;
        }
      
        slime.setAttribute('cx', x);
        slime.setAttribute('cy', y);
      
      document.getElementById('innerColor').setAttribute('stop-color', getRandomColor());
      document.getElementById('outerColor').setAttribute('stop-color', getRandomColor());
      
      }
      
  };
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
 
svg.addEventListener('click', function(event) {
  const x = event.clientX;
  const y = event.clientY;
  
  createFood(x, y);

  for (const slime of slimes) {
    slime.targetFood = { cx: { baseVal: { value: x } }, cy: { baseVal: { value: y } } };
  }
});

for (let i = 0; i < 100; i++) {
    const x = 2560 / 2; 
    const y = 1440 / 2; 

    const dx = Math.random() * 100 - 50;
    const dy = Math.random() * 100 - 30;
    
    const slime = createSlime(x + dx, y + dy);
    slimes.push(slime);
  }

function animate() {
  for (const slime of slimes) {
    slime.move();
  }
  
  requestAnimationFrame(animate);
}

animate();