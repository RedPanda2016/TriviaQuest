(function(root) {
    'use strict';

    /**
    * Represents the player.
    * Very similar to Entity
    * Handles functionality triggered by keyboard and mouse Input
    * @class Player
    * @constructor
    * @uses TileDraw
    * @param {Game} game - game instance this obj is attached to
    */
    var Player = function Player(game) {
        this.game = game;
        this.fov = new RL.FovROT(game);

        // modify fov to set tiles as explored
        this.fov.setMapTileVisible = function(x, y, range, visibility){
            RL.FovROT.prototype.setMapTileVisible.call(this, x, y, range, visibility);
            if(visibility){
                var tile = this.game.map.get(x, y);
                if(tile){
                    tile.explored = true;
                }
            }
        };

        if(this.init){
            this.init(game);
        }
    };

    Player.prototype = {
        constructor: Player,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * FovRot instance representing this entity's vision.
        * @property fov
        * @type FovROT
        */
        fov: null,

        /**
        * Name used when referencing describing this player.
        * Used in console messages.
        * @property name
        * @type String
        */
        name: 'Player',

        /**
        * Optional Callback. Called when the entity is first created. Intended to be assigned by Entity.Types.
        * @method init
        * @param {Game} game - Game instance this obj is attached to.
        */
        init: false,

        /**
        * The map tile coordinate position of the player on the x axis.
        * @property x
        * @type Number
        */
        x: null,

        /**
        * The map tile coordinate position of the player on the y axis.
        * @property y
        * @type Number
        */
        y: null,

        /**
        * The character displayed when rendering this player.
        * @property char
        * @type String
        */
        char: '@',

        /**
        * The color of the character displayed when rendering this player.
        * @property color
        * @type String|bool
        */
        color: '#fff',

        /**
        * The background color the character displayed when rendering this player.
        * @property bgColor
        * @type String|bool
        */
        bgColor: false,

        /**
        * Field Range of this.fov (90, 180, or 360)
        * @property fovFieldRange
        * @type Number
        */
        fovFieldRange: 360,

        /**
        * Direction of fov (not used for fieldRange 360) valid directions: ['up', 'down', 'left', 'right', 'up_left', 'up_right', 'down_left', 'down_right'].
        * @property fovDirection
        * @type String
        */
        fovDirection: 'up',

        /**
        * Max visible distance in tiles
        * @property fovMaxViewDistance
        * @type Number
        */
        fovMaxViewDistance: 10,

        /**
        * Determines if the player has been killed.
        * @property dead
        * @type bool
        */
        dead: false,

        /**
         * Optional callback called when added to an `ObjectManager` or `MultiObjectManager`.
         * @metod onAdd
         */
        onAdd: false,

        /**
         * Optional callback called when removed from an `ObjectManager` or `MultiObjectManager`.
         * @metod onRemve
         */
        onRemve: false,

        // Starting health points
        healthMax: 100,

        // Can this start at healthMax?
        health: 100,

        /**
        * Updates this.fov
        * @method updateFov
        */
        updateFov: function(){
            var x = this.x,
                y = this.y,
                fieldRange = this.fovFieldRange,
                direction = this.fovDirection,
                maxViewDistance = this.fovMaxViewDistance;
            this.fov.update(x, y, fieldRange, direction, maxViewDistance, this);
        },

        /**
        * Checks if this entity can move to the specified map tile
        * @method canMoveTo
        * @param {Number} x - The tile map x coord to check if this entity can move to.
        * @param {Number} y - The tile map y coord to check if this entity can move to.
        * @return {Bool}
        */
        canMoveTo: function(x, y){
            return this.game.entityCanMoveTo(this, x, y);
        },

        /**
        * Changes the position of this entity on the map.
        * this.canMoveTo() should always be checked before calling this.moveTo
        * @method moveTo
        * @param {Number} x - The tile map x coord to move to.
        * @param {Number} y - The tile map y coord to move to.
        */
        moveTo: function(x, y) {
            return this.game.entityMoveTo(this, x, y);
        },

        /**
        * Called when user key is pressed with action of key pressed as an arg.
        * @method update
        * @param {String} action - action bound to key pressed by user
        * @return {Bool} true if action was taken.
        */
        update: function(action) {
            // if the action is a direction
            if(RL.Util.DIRECTIONS_4.indexOf(action) !== -1){
                var offsetCoord = RL.Util.getOffsetCoordsFromDirection(action),
                    moveToX = this.x + offsetCoord.x,
                    moveToY = this.y + offsetCoord.y;
                return this.move(moveToX, moveToY);
            }

            if(action === 'wait'){
                this.wait();
                return true;
            }

            return false;
        },

        /**
        * Move action.
        * @method move
        * @param {Number} x - Map tile cood to move to.
        * @param {Number} y - Map tile cood to move to.
        * @return {Bool} true if action was taken.
        */
        move: function(x, y){
            if(this.canMoveTo(x, y)){
                walkThisWay();
                this.moveTo(x, y);

                // item occuping target tile (if any)
                var targetTileItem = this.game.itemManager.get(x, y);

                if (targetTileItem) {
                    if (targetTileItem.canAttachTo(this)) {
                        // Use the item and update the board
                        targetTileItem.attachTo(this);
                        this.game.itemManager.update();
                    }
                }

                return true;

            } else {
                // entity occupying target tile (if any)
                var targetTileEnt = this.game.entityManager.get(x, y);
                console.log(targetTileEnt);
                //console.log(targetTileEnt);
                // if already occupied
                if(targetTileEnt){
                    this.game.console.log('Excuse me <strong>Mr.' + targetTileEnt.name + '</strong>, you appear to be in the way.');
                    return targetTileEnt.bump(this, targetTileEnt);
                } else {
                    // targeted tile (attempting to move into)
                    var targetTile = this.game.map.get(x, y);
                    if(targetTile.type === 'exitDoorLevel1') {
                        game.itemGenerator(mapDataLevel2, 3);
                        game.enemyGenerator(mapDataLevel2, 21);

                        game.player.x = 4;
                        game.player.y = 3;
                        game.map.loadTilesFromArrayString(mapDataLevel2, mapCharToType, 'grass');
                        game.itemManager.loadFromArrayString(mapDataLevel2, itemCharToType);
                        game.entityManager.loadFromArrayString(mapDataLevel2, entityCharToType, null, null, game.player);

                        game.setMapSize(game.map.width, game.map.height);
                        game.renderer.resize(10, 10);

                        // get existing DOM elements
                        var mapContainerEl = document.getElementById('roguelike-map-container');
                        var consoleContainerEl = document.getElementById('roguelike-console-container');

                        // append elements created by the game to the DOM
                        mapContainerEl.appendChild(game.renderer.canvas);
                        consoleContainerEl.appendChild(game.console.el);

                        game.renderer.layers = [
                          new RL.RendererLayer(game, 'map',       {draw: false,   mergeWithPrevLayer: false}),
                          new RL.RendererLayer(game, 'item',      {draw: false,   mergeWithPrevLayer: true}),
                          new RL.RendererLayer(game, 'entity',    {draw: false,   mergeWithPrevLayer: true}),
                          new RL.RendererLayer(game, 'lighting',  {draw: true,    mergeWithPrevLayer: false}),
                          new RL.RendererLayer(game, 'fov',       {draw: true,    mergeWithPrevLayer: false})
                        ];
                    }
                    if(targetTile.type === 'exitDoorLevel2') {
                        game.itemGenerator(mapDataLevel3, 2);
                        game.enemyGenerator(mapDataLevel3, 21);

                        game.player.x = 1;
                        game.player.y = 2;
                        game.map.loadTilesFromArrayString(mapDataLevel3, mapCharToType, 'grass');
                        game.itemManager.loadFromArrayString(mapDataLevel3, itemCharToType);
                        game.entityManager.loadFromArrayString(mapDataLevel3, entityCharToType, null, null, game.player);

                        game.setMapSize(game.map.width, game.map.height);
                        game.renderer.resize(10, 10);

                        var mapContainerEl = document.getElementById('roguelike-map-container');
                        var consoleContainerEl = document.getElementById('roguelike-console-container');

                        mapContainerEl.appendChild(game.renderer.canvas);
                        consoleContainerEl.appendChild(game.console.el);

                        game.renderer.layers = [
                          new RL.RendererLayer(game, 'map',       {draw: false,   mergeWithPrevLayer: false}),
                          new RL.RendererLayer(game, 'item',      {draw: false,   mergeWithPrevLayer: true}),
                          new RL.RendererLayer(game, 'entity',    {draw: false,   mergeWithPrevLayer: true}),
                          new RL.RendererLayer(game, 'lighting',  {draw: true,    mergeWithPrevLayer: false}),
                          new RL.RendererLayer(game, 'fov',       {draw: true,    mergeWithPrevLayer: false})
                        ];
                    }
                    if(targetTile.type === 'exitDoorLevel3') {
                        game.itemGenerator(mapDataLevel4, 2);
                        game.enemyGenerator(mapDataLevel4, 21);

                        game.player.x = 1;
                        game.player.y = 2;
                        game.map.loadTilesFromArrayString(mapDataLevel4, mapCharToType, 'grass');
                        game.itemManager.loadFromArrayString(mapDataLevel4, itemCharToType);
                        game.entityManager.loadFromArrayString(mapDataLevel4, entityCharToType, null, null, game.player);

                        game.setMapSize(game.map.width, game.map.height);
                        game.renderer.resize(10, 10);

                        var mapContainerEl = document.getElementById('roguelike-map-container');
                        var consoleContainerEl = document.getElementById('roguelike-console-container');

                        mapContainerEl.appendChild(game.renderer.canvas);
                        consoleContainerEl.appendChild(game.console.el);

                        game.renderer.layers = [
                          new RL.RendererLayer(game, 'map',       {draw: false,   mergeWithPrevLayer: false}),
                          new RL.RendererLayer(game, 'item',      {draw: false,   mergeWithPrevLayer: true}),
                          new RL.RendererLayer(game, 'entity',    {draw: false,   mergeWithPrevLayer: true}),
                          new RL.RendererLayer(game, 'lighting',  {draw: true,    mergeWithPrevLayer: false}),
                          new RL.RendererLayer(game, 'fov',       {draw: true,    mergeWithPrevLayer: false})
                        ];
                    }

                    return targetTile.bump(this, targetTile);
                }
            }
            return false;
        },

        decrementPlayerHealth: function(amount) {
            this.health -= amount;
            // Update state in React App component
            updateReactHealth(this);
        },

        incrementPlayerHealth: function(amount) {
            this.health += amount;
            // Update state in React App component
            updateReactHealth(this);
        },

        /**
        * Wait action.
        * @method wait
        */
        wait: function(){
            this.game.console.log('You wait for a moment.');
        },

    };

    // Update the playerHealth property on the App component's state (so hearts meter will update)
    function updateReactHealth(player) {
        var app = window.gameAppConnector.app;
        app.setState({
            playerHealth: player.health
        });
    }

    RL.Util.merge(Player.prototype, RL.Mixins.TileDraw);
    RL.Util.merge(Player.prototype, RL.Mixins.PerformableActionInterface);
    RL.Util.merge(Player.prototype, RL.Mixins.ResolvableActionInterface);


    root.RL.Player = Player;

}(this));
