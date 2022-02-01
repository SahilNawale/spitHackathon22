/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Tuxemon, https://github.com/Tuxemon/Tuxemon
 */

 const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 540,
    parent: "game-container",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
      },
    },
  
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };
  
  const game = new Phaser.Game(config);
  let cursors;
  let player;
  let hit = false;
  let showDebug = false;
  let isModalOpen = false;
  let checkPoints = [];
  let links = [
    "https://momento360.com/e/u/be204b8cce24487c8ce1182de7b169bf?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium",
    "https://momento360.com/e/u/efc29f1d331c455582c2e61abc2dd703?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium",
    "https://momento360.com/e/u/99e095078a5a4c328f7fb7c824ea483c?utm_campaign=embed&utm_source=other&heading=-34.18&pitch=-18.52&field-of-view=72.5&size=medium"
  ];
  
  
  function preload() {
    this.load.image("sign", "https://raw.githubusercontent.com/KeshavThosar/projectAssets/master/stop.jpg");
    this.load.image("tiles", "https://raw.githubusercontent.com/KeshavThosar/projectAssets/master/tuxmon-sample-32px-extruded.png");
    this.load.tilemapTiledJSON("map", "https://raw.githubusercontent.com/KeshavThosar/projectAssets/master/tuxemon-town.json");
    this.load.atlas(
      "atlas",
      "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.png",
      "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.json"
    );
  }
  
  function create() {
    const map = this.make.tilemap({ key: "map" });
  
    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
  
    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
    const worldLayer = map.createLayer("World", tileset, 0, 0);
    const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);
  
    worldLayer.setCollisionByProperty({ collides: true });
  
    // By default, everything gets depth sorted on the screen in the order we created things. Here, we
    // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    aboveLayer.setDepth(10);
  
    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
    const spawnPoint = map.findObject(
      "Objects",
      (obj) => obj.name === "Spawn Point"
    );
  
    let pointObjs = map.objects[0].objects.filter(elem => elem.name.startsWith("pt"));
    for(let i = 0; i < pointObjs.length; i++){
      checkPoints.push(this.add.sprite(pointObjs[i].x, pointObjs[i].y, "sign").setScale(0.05));
    }
  
  
    // ptr2 = this.add.sprite(pt2.x, pt2.y, "sign").setScale(0.05);
    // ptr3 = this.add.sprite(pt3.x, pt3.y, "sign").setScale(0.05);
  
    // Create a sprite with physics enabled via the physics system. The image used for the sprite has
    // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
    player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
      .setSize(30, 40)
      .setOffset(0, 24);
  
    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(player, worldLayer);
  
    // Create the player's walking animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    const anims = this.anims;
    anims.create({
      key: "misa-left-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-left-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  
    anims.create({
      key: "misa-right-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-right-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  
    anims.create({
      key: "misa-front-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-front-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  
    anims.create({
      key: "misa-back-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-back-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  
    const camera = this.cameras.main;
    camera.startFollow(player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  
    cursors = this.input.keyboard.createCursorKeys();
  
    // Debug graphics
    this.input.keyboard.once("keydown-D", (event) => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();
  
      // Create worldLayer collision graphic above the player, but below the help text
      const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
      worldLayer.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
      });
    });
  }
  function update(time, delta) {
    if(isModalOpen) return;
  
    this.input.keyboard.once("keydown-M", (event) => {
  
      for(let i = 0; i < checkPoints.length; i++){
        let point = checkPoints[i];
        if(checkOverlap(point, player) && !hit){
          openModal(i);
          isModalOpen = true;
          // console.log("pt" + i);
          hit = true;
        }
      }
    });
  
    let cond = true;
    for(let i = 0; i < checkPoints.length; i++){
      let point = checkPoints[i];
      cond &&= !checkOverlap(point, player);
    }
  
    if(cond) hit = false;
  
  
    const speed = 175;
    const prevVelocity = player.body.velocity.clone();
  
    // Stop any previous movement from the last frame
    player.body.setVelocity(0);
  
    // Horizontal movement
    if (cursors.left.isDown) {
      player.body.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
      player.body.setVelocityX(speed);
    }
  
    // Vertical movement
    if (cursors.up.isDown) {
      player.body.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
      player.body.setVelocityY(speed);
    }
  
    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);
  
    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown) {
      player.anims.play("misa-left-walk", true);
    } else if (cursors.right.isDown) {
      player.anims.play("misa-right-walk", true);
    } else if (cursors.up.isDown) {
      player.anims.play("misa-back-walk", true);
    } else if (cursors.down.isDown) {
      player.anims.play("misa-front-walk", true);
    } else {
      player.anims.stop();
  
      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
      else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
      else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
      else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
    }
  }
  
  function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
  
    let rect = Phaser.Geom.Rectangle.Intersection(boundsA, boundsB);
  
    return rect.width > 0 && rect.height > 0;
  }
  
  let mapElem = document.getElementById("map-container");
  let modalWrapper = document.querySelector(".modal-wrapper");
  let instructions = modalWrapper.querySelector('.inst');
  
  function openModal(i) {
    let iFrame = modalWrapper.querySelector('iframe');
    
    if(i == -1){
      instructions.classList.remove("hidden");
      iFrame.classList.add("hidden");
    }else{
      iFrame.classList.remove("hidden");
      iFrame.src = links[i]; 
    }
  
    mapElem.classList.add("hidden");
    modalWrapper.classList.remove("hidden");
    
    
  
  }
  
  function closeModal() {
    modalWrapper.classList.add("hidden");
    isModalOpen = false;
    mapElem.classList.remove("hidden");
    instructions.classList.add("hidden");
  }
  