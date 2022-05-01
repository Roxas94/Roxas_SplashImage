//-----------------------------------------------------------------------------
//  Splash Image
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  SplashImage.js
//-----------------------------------------------------------------------------
//  2016-12-30 - Version 1.0 - release
//  2016-12-31 - Version 1.1 - bug fixed in showSplashImage(imageName, opacity)
//  2022-04-29 - Version 1.2 - update plugin description
//                             add defaultFileType plugin parameter
//  2022-05-01 - Version 1.3 - clear code and remove defaultFileType so
//                             loadlistener of bitmap can be replaced by direct
//                             imangemanager call, which only supports png file
//-----------------------------------------------------------------------------
// TODO Fade In / Out effect
//-----------------------------------------------------------------------------

/*:
 * @plugindesc Splash an image by using an event script call. (v1.3)
 * 
 * @author Roxas
 *
 * @param folder
 * @desc the folder in which the images are located
 * Default: img/pictures/
 * @default img/pictures/
 *
 * @param defaultOpacity
 * @desc the default opacity of the splash images (0-255)
 * Default: 220
 * @default 220
 *
 * @help
 * Splash an image (png) on screen by using a script call in an event.
 *
 * Syntax
 * showSplashImage(<image>);
 * showSplashImage(<image>, <opacity>);
 * 
 * Examples
 * showSplashImage("image1");       // use default opacity
 * showSplashImage("image2", 240);  // explicitly use opacity of 240
 *
 * Recommended size for a
 * - big letter image: 350x550
 * - medium sized map: 500x300
 */

var SplashImage_imageName;
var SplashImage_imageOpacity;

(function(){
	//-----------------------------------------------------------------------------
	// READ PLUGIN PARAMETERS
	//-----------------------------------------------------------------------------

	let plugin_pars = PluginManager.parameters('SplashImage');
	let SplashImage_folder = plugin_pars["folder"];
	let SplashImage_defaultOpacity = Number(plugin_pars["defaultOpacity"]) || 220;

	//-----------------------------------------------------------------------------
	// DEFINE SCENE CLASS Scene_SplashImage
	//-----------------------------------------------------------------------------

	Scene_SplashImage.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_SplashImage.prototype.constructor = Scene_SplashImage;

	/**
	 * Create an instance of Scene_SplashImage.
	 * 
	 * @instance
	 */
	Scene_SplashImage.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
		this._imgName = SplashImage_imageName;
		this._imgOpacity = SplashImage_imageOpacity;
		this._imgSprite = null;
		this._backgroundSprite = null;
	};

	/**
	 * Create the components and add them to the rendering process.
	 * 
	 * @method create
	 * @instance
	 */
	Scene_SplashImage.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);

		this._backgroundSprite = new Sprite();
		this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
		this.addChild(this._backgroundSprite);

		this._bitmap = ImageManager.loadBitmap(SplashImage_folder, this._imgName, 0, false);
		this._imgSprite = new Sprite(this._bitmap);
		this.addChild(this._imgSprite);

		this._commandWindow = new Window_MenuCommand(0, 0);
		this._commandWindow.playOkSound = this.doNothing;
		this._commandWindow.setHandler('ok', this.free); // left mouse button, touchscreen press
		this._commandWindow.setHandler('cancel', this.free); // right mouse button
		this.addWindow(this._commandWindow);
	}

	Scene_SplashImage.prototype.terminate = function() {
		Scene_MenuBase.prototype.terminate.call(this);
		this.removeChild(this._backgroundSprite);
		this.removeChild(this._imgSprite);
		this._commandWindow.close();
	};

	/**
	 * Start the scene processing.
	 * 
	 * @method start
	 * @instance
	 */
	Scene_SplashImage.prototype.start = function() {
		Scene_MenuBase.prototype.start.call(this);
		this._imgSprite.opacity = this._imgOpacity == null ? SplashImage_defaultOpacity : this._imgOpacity;
		this._imgSprite.opacity = this._imgSprite.opacity > 255 ? 255 : this._imgSprite.opacity;
		this._imgSprite.opacity = this._imgSprite.opacity < 0 ? 0 : this._imgSprite.opacity;
		this._imgSprite.x = Graphics.width / 2 - this._imgSprite.width / 2;
		this._imgSprite.y = Graphics.height / 2 - this._imgSprite.height / 2;
	}

	/**
	 * Update the scene processing each new frame.
	 * 
	 * @method update
	 * @instance
	 */
	Scene_SplashImage.prototype.update = function() {
		Scene_MenuBase.prototype.update.call(this);
		this.handleUserInput();
	}

	/**
	* Return whether the scene is busy or not.
	* 
	* @method isBusy
	* @instance
	* @return {Boolean} Return true if the scene is currently busy
	*/
	Scene_SplashImage.prototype.isBusy = function() {
		return this._commandWindow.isClosing() || Scene_MenuBase.prototype.isBusy.call(this);
	};

	/**
	 * Handles left mouse button and touchscreen press events.
	 * 
	 * @method handleUserInput
	 * @instance
	 * @memberof Scene_SplashImage
	 */
	Scene_SplashImage.prototype.handleUserInput = function() {
		if (TouchInput.isTriggered()) {
			this.free();
		}
	}

	/**
	 * Frees the scene.
	 * 
	 * @method free
	 * @instance
	 * @memberof Scene_SplashImage
	 */
	Scene_SplashImage.prototype.free = function() {
		if (this._commandWindow != null) this._commandWindow.close();
		SceneManager.pop();
	}

	/**
	 * Does nothing, can be used to override handlers.
	 * 
	 * @method doNothing
	 * @instance
	 * @memberof Scene_SplashImage
	 */
	Scene_SplashImage.prototype.doNothing = function () { }
})();

/**
 * The scene class for the "splash image".
 * 
 * @class Scene_SplashImage
 * @constructor 
 * @extends Scene_MenuBase
 */
function Scene_SplashImage() {
	this.initialize.apply(this, arguments);
}

//-----------------------------------------------------------------------------
// API FUNCTIONS FOR RPG MAKER CALLS
//-----------------------------------------------------------------------------

function showSplashImage(imageName) {
	SplashImage_imageName = imageName;
	SplashImage_imageOpacity = null;
	SceneManager.push(Scene_SplashImage);
}

function showSplashImage(imageName, opacity) {
	SplashImage_imageName = imageName;
	SplashImage_imageOpacity = opacity;
	SceneManager.push(Scene_SplashImage);
}
