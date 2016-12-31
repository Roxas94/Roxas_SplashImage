//-----------------------------------------------------------------------------
//  Roxas Splash Image
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  Roxas_SplashImage.js
//-----------------------------------------------------------------------------
//  2016-12-30 - Version 1.0 - release
//  2016-12-31 - Version 1.1 - bug fixed in showSplashImage(imageName, opacity)
//-----------------------------------------------------------------------------
// TODO Fade In / Out effect
// TODO Create a "namespace" to prevent collision with other global stuff
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.1) A plugin that allows you to splash an image from an event.
 * 
 * @author Roxas
 *
 * @param folder
 * @desc the folder in which the images are located
 * Default: img/pictures/
 * @default img/pictures/
 *
 * @param defaultOpacity
 * @desc the default opacity of the splash images
 * Default: 220
 * @default 220
 *
 * @help
 * Roxas Splash Image
 *
 * Description
 * A little and easy to use plugin for RPG Maker MV. 
 * It allows you to splash an image on the screen. 
 * It can be useful to show a letter, a plan or something else to the player.
 *
 * Parameters
 * folder         = the folder in which the images are located
 * defaultOpacity = the default opacity of the splash images
 *
 * How to use
 * Generally you have to make a script call in an event.
 * There are two ways to do this.
 * 
 * First
 * showSplashImage("imageName");
 * 
 * Second
 * showSplashImage("imageName", opacity);
 *
 * Examples
 * showSplashImage("image1");
 * showSplashImage("image2", 240);
 *
 * Recommended size for a big letter image
 * 350x550
 *
 * Recommended size for a medium sized map image
 * 500x300
 *
 * Try it out and have fun!
 *
 */
//-----------------------------------------------------------------------------




// READ PARAMETERS
//-----------------------------------------------------------------------------
var SplashImage_folder;
var SplashImage_defaultOpacity;
(function(){
    SplashImage_folder = PluginManager.parameters('Roxas_SplashImage')["folder"];
    if (SplashImage_folder !== "") SplashImage_folder = "img/pictures/";
    SplashImage_defaultOpacity = Number(PluginManager.parameters('Roxas_SplashImage')["defaultOpacity"]) || 220;
})();




// DEFINE SCRIPT CALL VARIABLES
//-----------------------------------------------------------------------------
var SplashImage_requestedImageName;
var SplashImage_requestedOpacity;




// DEFINE SCENE CLASS Scene_SplashImage
//-----------------------------------------------------------------------------
/*
 * Initializing stuff
 */
var instance = this;
var Scene_SplashImage_Sprite;
function Scene_SplashImage() {
    this.initialize.apply(this, arguments);
    instance = this;
}
Scene_SplashImage.prototype = Object.create(Scene_MenuBase.prototype);
Scene_SplashImage.prototype.constructor = Scene_SplashImage;
Scene_SplashImage.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_SplashImage.prototype.doNothing = function () {
}

/*
 * Method stuff
 */
Scene_SplashImage.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createBackground();
    this.createSplashImage();
    this.handleUserInput();
}

Scene_SplashImage.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
}

Scene_SplashImage.prototype.createSplashImage = function() {
    var bitmap = Bitmap.load(SplashImage_folder + SplashImage_requestedImageName + ".png");
    Scene_SplashImage_Sprite = new Sprite(bitmap);
    bitmap.addLoadListener(this.addSprite);
}

Scene_SplashImage.prototype.addSprite = function() {
    Scene_SplashImage_Sprite.opacity = SplashImage_requestedOpacity == null ? SplashImage_defaultOpacity : SplashImage_requestedOpacity;
    Scene_SplashImage_Sprite.x = Graphics.width / 2 - Scene_SplashImage_Sprite.width / 2;
    Scene_SplashImage_Sprite.y = Graphics.height / 2 - Scene_SplashImage_Sprite.height / 2;
    instance.addChild(Scene_SplashImage_Sprite);
}

Scene_SplashImage.prototype.handleUserInput = function() {
    this._commandWindow = new Window_MenuCommand(0, 0);
    this._commandWindow.playOkSound = this.doNothing;
    this._commandWindow.setHandler('ok', this.free);
    this._commandWindow.setHandler('cancel', this.free);
    this.addWindow(this._commandWindow);
}

Scene_SplashImage.prototype.handleUserTouchInput = function() {
    if (TouchInput.isTriggered()) {
        this.free();
    }
}

Scene_SplashImage.prototype.free = function() {
    this._commandWindow.close();
    this.popScene();
}

Scene_SplashImage.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    this.handleUserTouchInput();
}




// DEFINE FUNCTION FOR RPG MAKER CALL
//-----------------------------------------------------------------------------
function showSplashImage(imageName) {
    SplashImage_requestedImageName = imageName;
    SplashImage_requestedOpacity = null;
    SceneManager.push(Scene_SplashImage);
}
function showSplashImage(imageName, opacity) {
    SplashImage_requestedImageName = imageName;
    SplashImage_requestedOpacity = opacity;
    SceneManager.push(Scene_SplashImage);
}
