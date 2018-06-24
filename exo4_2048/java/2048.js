let grid;
let score = 0;

//Fonction qui dit si on a gagné, le score limite a atteindre est 2048
function isGameWon(){
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (grid [i][j] == 2048){
				return true;
			}			
		}
	}
	return false;
}

//Fonction qui dit si on a perdu car plus aucune valeur ne peux être entré
function isGameOver(){
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (grid [i][j] == 0){
				return false;
			}
			if (i !== 3 && grid[i][j] === grid[i + 1][j]){
				return false;
			}
			if (j !== 3 && grid[i][j] === grid[i][j + 1]){
				return false;
			}
		}
	}
	return true;
}
//Créer une matrice de 4*4
function blankGrid(){
	return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}
//intialise et dessine le Tableau
function setup() {
  createCanvas(400, 400);
  noLoop();
  grid = blankGrid();
  addNumber();
  addNumber();
  draw();
}

//Ajoute les nombre dans le tableau de manière aléatoire (10% de 2 et 90% de 4)
function addNumber() {
  let options = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        options.push({
          x: i,
          y: j
        });
      }
    }
  }
  if (options.length > 0) {
    let spot = random(options);
    let r = random(1);
    grid[spot.x][spot.y] = r > 0.1 ? 2 : 4;
  }
}

function compare(a,b){
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (a[i][j] !== b[i][j]){
				return true;
			}
		}
	}
	return false;
}

function copyGrid(grid){
  let extra = blankGrid();
  for (let i = 0; i < 4; i++) {
	for (let j = 0; j < 4; j++) {
		extra[i][j] = grid[i][j];
	}
  }
  return extra;
}

function flipGrid(grid){
	for (let i = 0; i < 4; i++){
		grid[i].reverse();
	}
	return grid;
}

function rotateGrid(grid){
	let newGrid = blankGrid();
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			newGrid[i][j] = grid[j][i];
		}
	}
	return newGrid;
}
 
//Quand une touche est pressé, la fonction execute une série d'action
//-Déplace les case vers la direction choisi
//Additione les nombres et déplace les autres
//Verifie si le joueur a gagné ou pas
function keyPressed(){
	console.log(keyCode);
	let flipped = false;
	let rotate = false;
	let played = true;
	if (keyCode === DOWN_ARROW){
	}
	else if (keyCode === UP_ARROW){
		grid = flipGrid(grid);
		flipped = true;
	}
	else if (keyCode === RIGHT_ARROW){
		grid = rotateGrid(grid);
		rotate = true;
	}
	else if (keyCode === LEFT_ARROW){
		grid = rotateGrid(grid);
		grid = flipGrid(grid);
		rotate = true;
		flipped = true;
	}
	else{
		played = false;
	}
	
	
	if (played){
		let past = copyGrid(grid);
		for (let i = 0; i < 4; i++){
			grid[i] = operate(grid[i]);
		}
		
		let changed = compare(past, grid);
		
		if (flipped){
			grid = flipGrid(grid);
		}
		
		if (rotate){
			grid = rotateGrid(grid);
			grid = rotateGrid(grid);
			grid = rotateGrid(grid);
		}
		
		if (changed){
			addNumber();
		}
	draw();
	
	let gameover = isGameOver();
		if (gameover){
			alert("Tu as perdu!");
		}
	let gamewon = isGameWon();
		if (gamewon){
			alert("Tu as gagné!");
		}	
	}

}
function operate(row) {
	row = slide(row);
	row = combine(row);
	row = slide(row);
	return row;
}
//couleur de fond
function draw(){
	background(40,40,40);
	drawGrid();
	scoreS();
}

function scoreS(){
	select('#score').html(score);
}

//faire un nouveau tableau
function slide(row){
	let arr = row.filter(val => val);
	let missing = 4 - arr.length;
	let zeros = Array(missing).fill(0);
	arr = zeros.concat(arr);
	return arr;
}
//opération sur tableau
function combine(row){
	for (let i = 3; i >= 1; i--){
		let a = row[i];
		let b = row[i - 1];
		if (a == b){
			row[i] = a + b;
			score += row[i];
			row[i - 1] = 0;
		}
	}
	return row;
}

//couleur des grills
function drawGrid(){
	let w = 100;
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			noFill();
			strokeWeight(0.5);
			let val = grid[i][j];
			let s = val ;
			stroke(0);
			if (val != 0) {
				fill(colorsSizes[s].backgroundColor);
			}
			else{
				noFill(0);
			}
			rect(i*w, j*w, w, w,10,10,10,10);
			if (val !== 0){
				textAlign(CENTER, CENTER);
				noStroke();
				textSize(colorsSizes[s].size);
				fill(colorSizes[s].backgroundColor);
				text(val, i * w + w /2, j * w + w / 2);
			}
		}	
	}
}