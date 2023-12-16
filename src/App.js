import './App.css';
import Phaser from "phaser";
import { useEffect } from 'react';
import WS from "./ws/WS";
//import Protocol from "./protocol/Protocol";

let platforms;
let player;
let cursors;
// let stars;
// let score = 0;
// let scoreText;
let dogs;
let gameOver = false;
let beds1;
let beds2;
let beds3;
let lastTick = null;
let ExistMove = false;
let LogicFrame = {
  Data: [],
  Num: 0
};

WS.connect();

// function collectStar(player, star) {
//   star.disableBody(true, true);

//   score += 10;
//   scoreText.setText('Score: ' + score);

//   if (stars.countActive(true) === 0) {
//     stars.children.iterate(function (child) {

//       child.enableBody(true, child.x, child.y, true, true);

//     });

//     var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

//     var dog = dogs.create(x, 16, 'dog');
//     dog.setBounce(1);
//     dog.setCollideWorldBounds(true);
//     //dog.setVelocity(Phaser.Math.Between(-200, 200), 20);
//   }

// }

function hitdog(player, dog) {
  this.physics.pause();

  player.setTint(0xff0000);

  //player.anims.play('turn');

  gameOver = true;
}

function App() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
      physics: {
        default: 'arcade',
        arcade: {
          //gravity: { y: 300 },
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      input: {
        keyboard: {
          target: document.body,
        },
      },
    };

    WS.open = (event) => {
      console.log(event);
    };
    WS.close = (event) => {
      console.log(event);
    };
    WS.message = (event) => {
      //console.log(event);
    };
    WS.error = (event) => {
      console.log(event);
    };

    //创建游戏实例
    const game = new Phaser.Game(config);

    // 预加载资源
    function preload() {
      this.load.spritesheet("sample_character_08", "assets/sample_character_08.png", { frameWidth: 14, frameHeight: 24 });
      this.load.image("ground", "assets/ground.png", { frameWidth: 800, frameHeight: 60 });
      this.load.image("star", "assets/star.png");
      this.load.image("dog", "assets/dog.png");
      this.load.image("bed", "assets/bed.png");
      this.load.image("dark_sky", "assets/dark_sky.png");
    }

    // 创建场景
    function create() {
      //const dude = this.add.image(400, 300, "dude");
      //const sample_character_08 = this.add.image(400, 300, "sample_character_08");
      platforms = this.physics.add.staticGroup();

      // 静态物体缩放需要refreshBody
      //platforms.create(200, 258, 'sample_character_08').setScale(1).refreshBody();
      //platforms.create(400, 600 - 30, 'ground').setScale(1).refreshBody();
      //platforms.create(300, 100, 'sample_character_08').setScale(2).refreshBody();
      //platforms.create(400, 300, 'sample_character_08').setScale(2).refreshBody();
      platforms.create(400, 62, 'dark_sky');

      beds1 = this.physics.add.staticGroup({
        key: 'bed',
        repeat: 6,
        setXY: { x: 40, y: 180, stepX: 120, stepY: 0 }
      });

      beds2 = this.physics.add.staticGroup({
        key: 'bed',
        repeat: 6,
        setXY: { x: 40, y: 360, stepX: 120, stepY: 0 }
      });


      beds3 = this.physics.add.staticGroup({
        key: 'bed',
        repeat: 5,
        setXY: { x: 140, y: 560, stepX: 100, stepY: 0 }
      });

      // 添加动态物体
      player = this.physics.add.sprite(400, 300, 'sample_character_08').setScale(1.3).refreshBody();

      player.setBounce(0.3);// 反弹值
      player.setCollideWorldBounds(true);// 与边界碰撞
      //player.body.setGravityY(6000);//重力
      //this.physics.world.disable(player);


      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('sample_character_08', {
          start: 0,
          end: 2,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('sample_character_08', {
          start: 3,
          end: 5,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('sample_character_08', {
          start: 6,
          end: 8,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('sample_character_08', {
          start: 9,
          end: 11,
        }),
        frameRate: 10,
        repeat: -1,
      });

      // 检测之间的碰撞与重叠事件
      this.physics.add.collider(player, platforms);
      this.physics.add.collider(player, beds1);
      this.physics.add.collider(player, beds2);
      this.physics.add.collider(player, beds3);

      // 键盘
      cursors = this.input.keyboard.createCursorKeys();
      cursors.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      cursors.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      cursors.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      cursors.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

      // stars = this.physics.add.group({
      //   key: 'star',
      //   repeat: 6,
      //   setXY: { x: 42, y: 40, stepX: 70, stepY: 10 },
      // });

      // stars.children.iterate((child) => {
      //   child.setScale(0.2);
      //   child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      // });
      // this.physics.add.collider(player, platforms);
      // this.physics.add.overlap(player, stars, collectStar, null, this);

      // scoreText = this.add.text(16, 506, 'score: 0', { fontSize: '32px', fill: '#ffff99' });

      //炸弹
      dogs = this.physics.add.group();
      this.physics.add.collider(dogs, platforms);
      this.physics.add.collider(player, dogs, hitdog, null, this);
    }

    // 更新游戏状态
    function update() {
      // 在每一帧执行的逻辑
      let currTime = new Date();
      if (!lastTick) {
        lastTick = currTime;
      } else if (currTime < lastTick) {
        lastTick = currTime;
      }
      // 逻辑帧率25
      if (currTime - lastTick >= 40) {
        lastTick = currTime;
        if (LogicFrame.Data.length > 0) {
          WS.send(JSON.stringify(LogicFrame));
          LogicFrame.Data = [];
          LogicFrame.Num++;
        }
      }

      // console.log("tick");
      const velocityCfg = 150;
      if (cursors.a.isDown) {
        player.setVelocityX(-velocityCfg);

        player.anims.play('left', true);
        //WS.send("left");
        ExistMove = true;
      }
      else if (cursors.d.isDown) {
        player.setVelocityX(velocityCfg);

        player.anims.play('right', true);
        //WS.send("right");
        ExistMove = true;
      }
      else if (cursors.w.isDown) {
        player.setVelocityY(-velocityCfg);

        player.anims.play('up', true);
        //WS.send("up");
        ExistMove = true;
      }
      else if (cursors.s.isDown) {
        player.setVelocityY(velocityCfg);

        player.anims.play('down', true);
        //WS.send("down");
        ExistMove = true;
      }
      else {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.stop();
        ExistMove = false;
      }

      // if (cursors.w.isDown && player.body.touching.down) {
      //   player.setVelocityY(-330);
      // }

      if (gameOver) {
        game.destroy(true);
      }

      if (ExistMove) {
        // 缓存Player逻辑帧
        LogicFrame.Data.push({
          x: parseInt(player.x),
          y: parseInt(player.y)
        });
      }

    }


    // 在组件卸载时销毁游戏实例
    return () => {
      game.destroy(true);
    };

  }, []);//仅在组件挂载时运行
  return (
    <div id="phaser-game-container"></div>
  );
}

export default App;
