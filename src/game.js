//get started
//https://github.com/replit/kaboom

//sprites https://www.piskelapp.com/p/create/sprite

import kaboom from "kaboom";

// initialize context
kaboom
  ({
  width: 800,
  height: 676,
  font: "sinko",
  background: [180, 170, 255],
  });

// load assets
loadSprite("wall_green", "assets/wall_green.png");
loadSprite("wall_blue", "assets/wall_blue.png");
loadSprite("player", "assets/player.png");
loadSprite("pill", "assets/pill.png")
loadSprite("fire", "assets/fire.png");
loadSprite("robot", "assets/robot.png");

loadSound("collect", "assets/audio/collect.wav");

let currentLevel = 0

const LEVELS = [
  [
    "  xxxxx                       ",
    "  x   xxxxxxxxxxxxxxxxxxxxxx  ",
    "  x       p                x  ",
    "  x          f         h   x  ",
    "  x    p  v         p      x  ",
    "  x        XXXX  f        xx  ",
    "  xx       XXXX        f  x   ",
    "   xxx                    x   ",
    "     x f         XXX   p  x   ",
    "     x       p   XXX      x   ",
    "  xxxx   v                x   ",
    "  x    p     f   h    xxxxx   ",
    "  x  f                x       ",
    "  x        pp      f  x       ",
    "  xxxxxxxxxxxxxxxx    xxxxxxx ",
    "                 x    h     x ",
    "                 x p        x ",
    "                 x     f  p x ",
    "                 xx        xx ",
    "                  xxxxxxxxxx  ",
  ],
  [
    "  XXXX                       ",
    "  x p XXXXxxxxxxxxxxxxxxxxxx  ",
    "  x       h                x  ",
    "  x          f         h   x  ",
    "  x   f   v         p      x  ",
    "  x        XXX  f         xx  ",
    "  xx       XXX         f  x   ",
    "   xxx                    x   ",
    "     x f         XXX   p  x   ",
    "     x       f   XXX      x   ",
    "  xxxx   v                x   ",
    "  x    p     f   h    xxxxx   ",
    "  x  f       h        x       ",
    "  x        p       f  x       ",
    "  xxxxxxxxxxxxxxxx    xxxxxxx ",
    "                 x    h     x ",
    "                 x p        x ",
    "                 x     f  p x ",
    "                 xx        xx ",
    "                  xxxxxxxxxx  ",
  ]
];


  // const LEVELSs = [

  //   [
  //     "  XXXXX                       ",
  //     "  X   XXXXXXXXXXXXXXXXXXXXXX  ",
  //     "  X                        X  ",
  //     "  X          h         f   X  ",
  //     "  X   p      x       p      X  ",
  //     "  X          x   f        XX  ",
  //     "  XX         x        v  X   ",
  //     "   XXX       x            X   ",
  //     "     X           xx    p  X   ",
  //     "     X       p   xx    x  X   ",
  //     "  XXXX f                f X   ",
  //     "  X    p     p   h    XXXXX   ",
  //     "  X    v     x        X       ",
  //     "  X       h p         X       ",
  //     "  XXXXXXXXXXXXXXXX    XXXXXXX ",
  //     "                 X          X ",
  //     "                 X f   x    X ",
  //     "                 X     v  p X ",
  //     "                 XXX        X ",
  //     "                  XXXXXXXXXX  ",
  //   ],
  // ];

  const LevelConfig = {
    // define the size of each tile
    width: 32,
    height: 32,
    //  => define what each symbol means, by a function returning a component list (what will be passed to add())
    x: () => [sprite("wall_green"), area(), solid()],
    X: () => [sprite("wall_blue"), area(), solid()],
    p: () => [sprite("pill"), area(), "pill"],
    f: () => [sprite("fire"), area(), "fire"],
    h: () => [sprite("robot"), area(), "robotH", "enemy"],
    v: () => [sprite("robot"), area(), "robotV", "enemy"],
  };

scene("mapGame", (levelNumber) => {

  let playing = true;
  
  let maxTime = 30;
  let robotVSpeed = 20;
  let robotHSpeed = 20;

  switch (levelNumber) {

    case 0:
      maxTime = 30;
      robotVSpeed = 20;
      robotHSpeed = 20;
      break;
    
    case 1:
      maxTime = 25;
      robotVSpeed = 25;
      robotHSpeed = 25;
      break;
    
    default:
      maxTime = 30;
      robotVSpeed = 20;
      robotHSpeed = 20;
      break;
  }

  addLevel(LEVELS[levelNumber ?? 0], LevelConfig);

  const allPills = get("pill").length; //length of the array

  const score = add([
    text("Score: 0", { size: 28 }),
    pos(50, 50),
    fixed(),
    { value: 0 },
  ]);

  const gameOverText = add([
    text("Game Over", { size: 36 }),
    pos(250, 300),
    fixed(),
    opacity(0),
  ]);

  const winText = add([
    text("!!!!! You WIN !!!!!", { size: 42 }),
    pos(100, 300),
    fixed(),
    opacity(0),
  ]);

  const myTimer = add([
    text(`Time: ${maxTime}`, { size: 28 }),
    pos(400, 50),
    fixed(),
    { value: maxTime },
  ]);

  let player = add([
    // list of components
    sprite("player"),
    pos(140, 80),
    area(), //give collision area around sprite
    solid(), //cannot go through walls
    "player", //tag to use later in the code
  ]);

  player.onCollide("enemy", (enemy) => {
    gameOver();
  });

  onKeyDown("right", () => {
    if (playing == true) {
      player.move(200, 0);
    }
  });

  onKeyDown("right", () => {
    if (playing) player.move(200, 0);
  });

  onKeyDown("left", () => {
    if (playing) player.move(-200, 0);
  });

  onKeyDown("up", () => {
    if (playing) player.move(0, -200);
  });

  onKeyDown("down", () => {
    if (playing) player.move(0, 200);
  });

  camScale(1.2, 1.2);

  player.onUpdate(() => {
    camPos(player.pos);
  });

  player.onCollide("pill", (thePill) => {
    destroy(thePill);
    score.value += 1;
    score.text = `Score: ${score.value}`;
    
    play("collect")

    if (score.value == allPills) gameOverWin();
  });

  //moving enemy code

  onUpdate("robotV", (robotV) => {
    if (playing) robotV.move(0, -robotVSpeed);
  });

  onUpdate("robotH", (robotH) => {
    if (playing) robotH.move(robotHSpeed, 0);
  });

  loop(3, () => {
    robotHSpeed *= -1;
  });

  loop(2, () => {
    robotVSpeed *= -1;
  });

  //end moving enemy code

  loop(1, () => {
    if (playing) {
      if (myTimer.value > 0) {
        myTimer.value -= 1;
        myTimer.text = `Time: ${myTimer.value}`;
      } else {
        gameOver();
      }
    }
  });

  loop(3, () => {
    if (playing) {
      every("fire", (aFire) => {
        if (aFire.opacity == 1) {
          aFire.opacity = 0;
        } else {
          aFire.opacity = 1;
        }
      });
    }
  });

  function gameOver() {
    playing = false;
    gameOverText.opacity = 1;
  }

  function gameOverWin() {
    playing = false;
    winText.opacity = 1;
    currentLevel++; //+1 currentLevel = currentLevel + 1 //currentLevel += 1
    // length = 3 (0,1,2)
    // 3
    if (currentLevel == LEVELS.length) { 
      currentLevel = 0;
    }
  }


  player.onCollide("fire", (theFire) => {
    if (theFire.opacity == 1) {
      gameOver();
    }
  });

  // myTimer.value = 0;
  // myTimer.text = "Time: " + myTimer.value;

  //arrow function

  onClick(() => {
    //exclamation mark == NOT
    if (!playing) go("mapGame", currentLevel);
    //if (playing == false) go("mapGame")
  });
});

go("mapGame",currentLevel)