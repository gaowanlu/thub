import './App.css';
import Phaser from "phaser";
import { useEffect } from 'react';

let platforms;
let player;
let cursors;
let stars;
let score = 0;
let scoreText;
let dogs;
let gameOver = false;

function collectStar(player, star) {
  star.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {

      child.enableBody(true, child.x, child.y, true, true);

    });

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var dog = dogs.create(x, 16, 'dog');
    dog.setBounce(1);
    dog.setCollideWorldBounds(true);
    //dog.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }

}

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
      physics: {
        default: 'arcade',
        arcade: {
          //gravity: { y: 0 },
          debug: true
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

    // 预加载资源
    function preload() {
      this.load.spritesheet("sample_character_08", "assets/sample_character_08.png", { frameWidth: 14, frameHeight: 24 });
      this.load.image("ground", "assets/ground.png", { frameWidth: 800, frameHeight: 60 });
      this.load.image("star", "assets/star.png");
      this.load.image("dog", "assets/dog.png");
    }

    // 创建场景
    function create() {
      //const dude = this.add.image(400, 300, "dude");
      //const sample_character_08 = this.add.image(400, 300, "sample_character_08");
      platforms = this.physics.add.staticGroup();

      // 静态物体缩放需要refreshBody
      //platforms.create(200, 258, 'sample_character_08').setScale(1).refreshBody();
      platforms.create(400, 600 - 30, 'ground').setScale(1).refreshBody();
      //platforms.create(300, 100, 'sample_character_08').setScale(2).refreshBody();
      //platforms.create(400, 300, 'sample_character_08').setScale(2).refreshBody();


      // 添加动态物体
      player = this.physics.add.sprite(100, 100, 'sample_character_08').setScale(1.3).refreshBody();

      player.setBounce(0.2);// 反弹值
      player.setCollideWorldBounds(true);// 与边界碰撞
      player.body.setGravityY(0);//重力
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

      // 键盘
      cursors = this.input.keyboard.createCursorKeys();
      cursors.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      cursors.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      cursors.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      cursors.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


      stars = this.physics.add.group({
        key: 'star',
        repeat: 6,
        setXY: { x: 42, y: 40, stepX: 70, stepY: 10 },
      });

      stars.children.iterate((child) => {
        child.setScale(0.2);
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });
      this.physics.add.collider(player, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);

      scoreText = this.add.text(16, 506, 'score: 0', { fontSize: '32px', fill: '#ffff99' });

      //炸弹
      dogs = this.physics.add.group();
      this.physics.add.collider(dogs, platforms);
      this.physics.add.collider(player, dogs, hitdog, null, this);
    }

    // 更新游戏状态
    function update() {
      // 在每一帧执行的逻辑
      // console.log("tick");
      const velocityCfg = 150;
      if (cursors.a.isDown) {
        player.setVelocityX(-velocityCfg);

        player.anims.play('left', true);
      }
      else if (cursors.d.isDown) {
        player.setVelocityX(velocityCfg);

        player.anims.play('right', true);
      }
      else if (cursors.w.isDown) {
        player.setVelocityY(-velocityCfg);

        player.anims.play('up', true);
      }
      else if (cursors.s.isDown) {
        player.setVelocityY(velocityCfg);

        player.anims.play('down', true);
      }
      else {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.stop();
        //player.anims.play('turn');
      }

      // if (cursors.w.isDown && player.body.touching.down) {
      //   player.setVelocityY(-330);
      // }

      if (gameOver) {
        game.destroy(true);
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
