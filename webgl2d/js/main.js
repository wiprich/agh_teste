var player, result = flwebgl.Player.S_OK;
var atlasList = [], content = undefined;

function loadContent() {
	getAsset("assets/webgl.json?1500572428233", function (response) {content = JSON.parse(response); assetLoaded(); });
	getAsset("assets/webgl_atlas.json?1500572428233", function (response) { atlasList.push({json:JSON.parse(response), image:"assets/webgl_atlas.png?1500572428233"}); assetLoaded(); });
}

function assetLoaded() {
	if (atlasList.length == 1 && content) {
		var canvas = document.getElementById("canvas");
		player = new flwebgl.Player();

		//Create textureatlas object for all the textures which you have
		var textureAtlasList = [];
		for (var i = 0; i < atlasList.length; i++) {
			textureAtlasList.push(new flwebgl.TextureAtlas(atlasList[i].json, atlasList[i].image));
		}

		result = player.init(canvas, content, textureAtlasList, handleComplete);

		if(result === flwebgl.Player.E_CONTEXT_CREATION_FAILED) {
			document.getElementById("err_nowebglsupport").style.display="block";
			return;
		} else if(result === flwebgl.Player.E_REQUIRED_EXTENSION_NOT_PRESENT) {
			document.getElementById("err_extensionnotpresent").style.display="block";
			return;
		}

		//Resize the canvas and reset the viewport
		var w = player.getStageWidth();
		var h = player.getStageHeight();
		canvas.width = w;
		canvas.height = h;
		player.setViewport(new flwebgl.geom.Rect(0, 0, w, h));

		
		if(player.getStage())
		{
			player.getStage().addEventListener(flwebgl.events.Event.REMOVED, function(evt){
				if( evt && evt.getTarget() && evt.getTarget().getName() === "___camera___instance" )
					player.getStage().setLocalTransform(new flwebgl.geom.Matrix());
			});
			player.getStage().addEventListener(flwebgl.events.Event.ENTER_FRAME, function(evt) {
				var stage = player.getStage();
				var cameraInstance = stage.getChildAt(0);
				if(cameraInstance && cameraInstance.getName() === "___camera___instance")
				{
					var mat = cameraInstance.getLocalTransform();
					var bounds = cameraInstance.getBounds();
					var stageCenterX = Math.round(bounds.width)/2;
					var stageCenterY = Math.round(bounds.height)/2;
					var inverseMat = mat.invert();
					inverseMat.translate(stageCenterX, stageCenterY);
					stage.setLocalTransform(inverseMat);
					stage.setLocalColorTransform(cameraInstance.getLocalColorTransform());
				}
			});
		}
	}
}

function getAsset(url, callbk) {
	if (!window.XMLHttpRequest) {
		document.getElementById("err_nowebglsupport").style.display="block";
		return;
	}

	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200)
			callbk(req.responseText);
	};
	req.open("GET", url, true);
	req.send();
}

function handleComplete() {
	if(result === flwebgl.Player.S_OK) {
		player.play();

		// ==> This is a good place to add code <==
	}
}

jQuery.noConflict()(function ($) { // this was missing for me
    $(document).ready(function() { 

   $(document).ready(function()
	{
		console.log("não há o que desenvolver com jQuery, então fica aqui um comentário :D")
	});

    });
});