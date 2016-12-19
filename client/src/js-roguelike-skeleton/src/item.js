// https://github.com/unstoppablecarl/escape-from-ecma-labs/blob/gh-pages/js/item.js

(function(root) {
    'use strict';

    /**
    * Represents an item in the game map.
    * @class Item
    * @constructor
    * @param {Object} game - Game instance this obj is attached to.
    * @param {String} type - Type of tile. When created this object is merged with the value of Item.Types[type].
    * @param {Number} x - The map tile coordinate position of this tile on the x axis.
    * @param {Number} y - The map tile coordinate position of this tile on the y axis.
    */
    var Item = function Item(game, type, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type;

        var typeData = Item.Types[type];
        RL.Util.merge(this, typeData);
    };

    Item.prototype = {
        constructor: Item,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * The type of entity this is.
        * When created this object is merged with the value of Item.Types[type].
        * @property type
        * @type Object
        */
        type: null,

        /**
        * Display name for this item.
        * @property name
        * @type {String}
        */
        name: null,

        /**
        * The tile map coordinate position on the x axis.
        * @property x
        * @type Number
        */
        x: null,

        /**
        * The tile map coordinate position on the y axis.
        * @property y
        * @type Number
        */
        y: null,

        /**
        * The character displayed when rendering this tile.
        * @property char
        * @type String
        */
        char: null,

        /**
        * The color of the character displayed when rendering this tile. Not rendered if false.
        * @property color
        * @type String|bool
        */
        color: null,

        /**
        * The background color the character displayed when rendering this tile. Not rendered if false.
        * @property bgColor
        * @type String|bool
        */
        bgColor: false,
        charStrokeColor: '#000',
        charStrokeWidth: 2,
        // consoleColor: RL.Util.COLORS.blue_alt,

        /**
         * Checks if this item can be attached to an entity.
         * @method canAttachTo
         * @param {Entity} entity
         * @return {Bool}
         */
        canAttachTo: function(entity){
            if(this.game.player !== entity){ // Only the player can use this item
                return false;
            }
        },

        /**
         * Resolves the effects of attaching this item to an entity.
         * @method attachTo
         * @param {Entity} entity
         */
        attachTo: function(entity){

        },

        getConsoleName: function(){
            return {
                name: this.name,
            };
        },

        onRemove: function(){
            var tile = new RL.Tile(this.game, 'grass', this.x, this.y);
            tile.explored = true;
            this.game.map.set(this.x, this.y, tile);
            this.game.renderer.drawTile(this.x, this.y);
        }
    };

    var logPickUpHealing = function(player, item) {
        return 'You healed ' + item.healAmount + ' using the ' + item.name;
    };

    var logCanNotPickupHealing = function(player, item) {
        return 'You found a ' + item.name + ' but cannot use it.';
    };

    var Defaults = {
        healing: {
            canAttachTo: function(entity){
                if(this.game.player !== entity){ // Can only heal player
                    return false;
                }
                if(entity.health >= entity.healthMax){
                    this.game.console.log(logCanNotPickupHealing(entity, this));
                    return false;
                }
                return true;
            },
            attachTo: function(entity){
                this.game.console.log(logPickUpHealing(entity, this));
                heart.play('heart');
                entity.incrementPlayerHealth(this.healAmount);

                // After use, remove the item from the tile
                this.dead = true;
            },
            getConsoleName: function(){
                return {
                    name: this.name + ' [+' + this.healAmount + ' HP]',
                };
            }
        }
    };

    RL.Util.merge(Item.prototype, RL.Mixins.TileDraw);


    var makeHealingItem = function(obj){
        return RL.Util.merge(obj, Defaults.healing);
    };


    /**
    * Describes different types of tiles. Used by the Item constructor 'type' param.
    *
    *     Item.Types = {
    *         floor: {
    *            name: 'Floor',
    *            char: '.',
    *            color: '#333',
    *            bgColor: '#111',
    *            blocksLos: false
    *         },
    *         // ...
    *     }
    *
    * @class Item.Types
    * @static
    */
    Item.Types = {

        // healing items
        potion: makeHealingItem({
            name: 'Potion',
            color: '#fff',
            bgColor: false,
            char: ":",
            healAmount: 20,
        })
    };


    root.RL.Item = Item;

}(this));
