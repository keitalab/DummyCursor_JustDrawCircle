// 領域とカーソルのサイズ
const box_sizes = [[1920, 1080], [1280,720], [720, 405], [1080, 1080], [720, 720], [405, 405]];
const cursor_sizes = [960, 640, 540, 360, 200, 100, 50];

// 初期設定
let box_size = [405, 405];
let cursor_size = 100;

// カーソル選択と挙動
let cursor_types = [0,1];
let cursorchoice;
let cursorPosition = [];
let adjust_num;

// カーソルイメージ
let img;

// csv出力
let table;

// ダミー変数
let value = false;


function setup() {
  createCanvas(windowWidth, windowHeight);
  load_mode();
  frameRate(60);
}

function draw() {
  background(0);
  make_field();
  cursor_trajectory();
  hit_box();
  set_data_in_table();
}

function load_mode() {
  rectMode(CENTER);
  ellipseMode(CENTER);
  imageMode(CENTER);
}

function create_table() {
  table = new p5.Table();
  table.addColumn('id');
  table.addColumn('x');
  table.addColumn('y');
}

function preload() {
  img = loadImage('Cursor_image.png');
}

function make_field() {
  fill(150);
  rect(windowWidth/2, windowHeight/2, box_size[0], box_size[1]);
}

function cursor_trajectory() {
  if (cursorchoice === 0){
    adjust_num = 0;
  } else {
    adjust_num = 2;
  }
  if (value){
    let position_adjust = [0, 0, cursor_size * 3 / 10, cursor_size / 2]
    for (let i = 1; i < cursorPosition.length; i += 1) {
      line(cursorPosition[i].x - position_adjust[0 + adjust_num], cursorPosition[i].y - position_adjust[1 + adjust_num], cursorPosition[i-1].x - position_adjust[0 + adjust_num], cursorPosition[i-1].y - position_adjust[1 + adjust_num]);
    }
  }
  cursorPosition.push({x: mouseX, y: mouseY});
}

function hit_box() {
  if (mouseX > windowWidth/2 - box_size[0] / 2 & mouseY > windowHeight/2 - box_size[1] /2 & mouseX < windowWidth/2 + box_size[0] / 2 & mouseY < windowHeight/2 + box_size[1] / 2) {
    fill(255);
    if (cursorchoice === 0) {
      ellipse(mouseX, mouseY, cursor_size);
    } else {
      image(img, mouseX, mouseY, cursor_size * 0.6, cursor_size);
    }
    noCursor();
    if (mouseX - cursor_size / 2 < windowWidth/2 - box_size[0] / 2 & (box_size[1] !== 1080 || box_size[0] === 1080)) {
      fill(0, 0, 0);
      rect(0, windowHeight / 2, windowWidth - box_size[0], windowHeight);
    }
    if (mouseY - cursor_size / 2 < windowHeight/2 - box_size[1] / 2 & box_size[1] !== 1080) {
      fill(0, 0, 0);
      rect(windowWidth / 2, 0, windowWidth, windowHeight - box_size[1]);
    }
    if (mouseX + cursor_size / 2 > windowWidth/2 + box_size[0] / 2) {
      fill(0, 0, 0);
      rect(windowWidth / 2 + windowWidth / 4 + box_size[0] / 4, windowHeight / 2, windowWidth - windowWidth / 2 - box_size[0] / 2, windowHeight);
    }
    if (mouseY + cursor_size > windowHeight/2 + box_size[1] / 2) {
      fill(0, 0, 0);
      rect(windowWidth / 2, windowHeight / 2 + windowHeight / 4 + box_size[1] / 4, windowWidth, windowHeight - windowHeight / 2 - box_size[1] / 2);
    }
  } else {
    cursor('progress');
  }
}

function set_data_in_table() {
  if (value) {
    let newRow = table.addRow();
    newRow.setNum('id', table.getRowCount());
    newRow.setNum('x', cursorPosition[cursorPosition.length - 1].x);
    newRow.setNum('y', cursorPosition[cursorPosition.length - 1].y);
  }
}

function mousePressed() {
  cursorPosition = []
  create_table();
  value = true;
}

function mouseReleased() {
  value = false;
  let export_filename = str(box_size[0]) + "x" + str(box_size[1]) + "-" + str(cursor_size) + '.csv'
  saveTable(table, export_filename);
  cursorPosition = [];
  console.log(cursorPosition);
}

function keyPressed() {
  if (keyCode === 32){
    box_size = random(box_sizes);
    cursor_size = random(cursor_sizes);
    cursorchoice = random(cursor_types);
    while (cursor_size > box_size[1]) {
      cursor_size = random(cursor_sizes);
    }
  }
}