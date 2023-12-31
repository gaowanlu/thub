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
let frame = 0;
let LogicFrame = {
  Data: [],
  Num: 0
};
let MessageQueue = [];
const playerUID = Math.random().toString();
let Players = {};
let player_before_frame_x = 0;
let player_before_frame_y = 0;

const WIDTH = 1820;
const HEIGHT = 680;

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
      width: WIDTH,
      height: HEIGHT,
      //backgroundColor: "#ffffff",
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

    //创建游戏实例
    const game = new Phaser.Game(config);

    WS.open = (event) => {
      console.log(event);
    };
    WS.close = (event) => {
      console.log(event);
    };
    WS.message = (event) => {
      //console.log(event);
      MessageQueue.push(JSON.parse(event.data));
      //console.log(MessageQueue);
    };
    WS.error = (event) => {
      console.log(event);
    };

    // 预加载资源
    function preload() {
      this.load.spritesheet("sample_character_08", "assets/sample_character_08.png", { frameWidth: 14, frameHeight: 24 });
      // this.load.image("ground", "assets/ground.png", { frameWidth: 800, frameHeight: 60 });
      // this.load.image("dog", "assets/dog.png");
      this.load.image("bed", "assets/bed.png");
      // 加载Tiled地图
      this.load.tilemapTiledJSON({ key: 'map', url: 'assets/map.json' });
      // 加载地图使用的图块集
      this.load.image('tiles', 'assets/Atlas/terrain_atlas.png');
    }

    // 创建场景
    function create() {
      // 创建地图
      let map = this.make.tilemap({ key: 'map' });
      // 添加图块集到地图
      let tiles = map.addTilesetImage('terrain_atlas', 'tiles');
      // console.log(map);
      // 添加图块层
      let layer3 = map.createLayer("scene_layer3", tiles, 0, 0);
      layer3.setCollisionByExclusion([-1]);
      let layer1 = map.createLayer("scene_layer1", tiles, 0, 0);
      layer1.setCollisionByExclusion([-1]);
      let layer2 = map.createLayer("scene_layer2", tiles, 0, 0);
      layer2.setCollisionByExclusion([-1]);
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      this.cameras.main.setSize(WIDTH, HEIGHT);


      //const dude = this.add.image(400, 300, "dude");
      //const sample_character_08 = this.add.image(400, 300, "sample_character_08");
      platforms = this.physics.add.staticGroup();

      // 静态物体缩放需要refreshBody
      //platforms.create(200, 258, 'sample_character_08').setScale(1).refreshBody();
      //platforms.create(400, 600 - 30, 'ground').setScale(1).refreshBody();
      //platforms.create(300, 100, 'sample_character_08').setScale(2).refreshBody();
      //platforms.create(400, 300, 'sample_character_08').setScale(2).refreshBody();

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
      player_before_frame_x = 200;
      player_before_frame_y = 200;
      player = this.physics.add.sprite(player_before_frame_x, player_before_frame_y, 'sample_character_08').setScale(1.3).refreshBody();

      player.setBounce(0.3);// 反弹值
      //player.setCollideWorldBounds(true);// 与边界碰撞
      //player.body.setGravityY(6000);//重力
      //this.physics.world.disable(player);
      Players[playerUID] = { player: player, message: [] };

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
      // this.physics.add.collider(player, platforms);
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
      // 解析每个数据包抛弃自己的那部分
      for (let i = 0; i < MessageQueue.length; i++) {
        let data = MessageQueue[i];
        if (data.Data && data.Data[0]) {
          if (data.Data[0].playerUID === playerUID) {
            continue;
          }
          let otherPlayerUID = data.Data[0].playerUID;
          if (!Players.hasOwnProperty(otherPlayerUID)) {
            // 创建角色
            let x = data.Data[0].x;
            let y = data.Data[0].y;
            let newPlayer = this.physics.add.sprite(x, y, 'sample_character_08').setScale(1.3).refreshBody();
            newPlayer.setBounce(0.3);// 反弹值
            // newPlayer.setCollideWorldBounds(true);// 与边界碰撞
            Players[otherPlayerUID] = { player: newPlayer, message: [] };
            // this.physics.add.collider(newPlayer, platforms);
            this.physics.add.collider(newPlayer, beds1);
            this.physics.add.collider(newPlayer, beds2);
            this.physics.add.collider(newPlayer, beds3);
          }
          // 将消息装入对应玩家的message
          for (let j = 0; j < data.Data.length; j++) {
            let message = data.Data[j];
            Players[data.Data[j].playerUID].message.push(message);
          }
          //console.log(Players);
        }
      }
      MessageQueue = [];

      // 在每一帧执行的逻辑
      let currTime = new Date();
      if (!lastTick) {
        lastTick = currTime;
      } else if (currTime < lastTick) {
        lastTick = currTime;
      }
      // 逻辑帧率25
      if (currTime - lastTick >= 60) {
        lastTick = currTime;
        if (LogicFrame.Data.length > 0) {
          WS.send(JSON.stringify(LogicFrame));
          LogicFrame.Data = [];
          LogicFrame.Num++;
        }
      }

      {
        let gap_x = player.x - player_before_frame_x;
        let gap_y = player.y - player_before_frame_y;
        if (Math.abs(gap_x) > 1) {
          this.cameras.main.scrollX += gap_x;
          player_before_frame_x = player.x;
        }
        if (Math.abs(gap_y) > 1) {
          this.cameras.main.scrollY += gap_y;
          player_before_frame_y = player.y;
        }
      }

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
          vx: player.body.velocity.x,
          vy: player.body.velocity.y,
          x: player.x,
          y: player.y,
          frame: frame++,
          anims: player.anims.currentAnim.key,
          playerUID: playerUID
        });
      }

      // 遍历所有player除了自己
      for (let key in Players) {
        if (key === playerUID) {
          continue;
        }

        let otherPlayer = Players[key].player;
        // Check if the other player is outside the camera's visible bounds
        const relativeX = otherPlayer.x - this.cameras.main.worldView.x;
        const relativeY = otherPlayer.y - this.cameras.main.worldView.y;
        const canBeView = relativeX < 0 || relativeX > this.cameras.main.width ||
          relativeY < 0 || relativeY > this.cameras.main.height;

        // console.log({ relativeX, relativeY, x: otherPlayer.x, y: otherPlayer.y });
        otherPlayer.setVisible(!canBeView);

        if (Players[key].message.length <= 0) {
          Players[key].player.setVelocityX(0);
          Players[key].player.setVelocityY(0);
          Players[key].player.anims.stop();
          continue;
        }
        let message = Players[key].message.shift();
        let gapX = Players[key].player.x - message.x;
        let gapY = Players[key].player.y - message.y;
        if (Math.abs(gapX) >= 4 || Math.abs(gapY) >= 4) {
          Players[key].player.x = message.x;
          Players[key].player.y = message.y;
        }

        Players[key].player.setVelocityX(message.vx);
        Players[key].player.setVelocityY(message.vy);
        Players[key].player.anims.play(message.anims, true);
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
