﻿var mycanvase = document.createElement("canvas");
mycanvase.width=10800;
mycanvase.height=5400;
var ctxe=mycanvase.getContext("2d");
ctxe.clearRect(0,0,mycanvase.width,mycanvase.height);

var imgelev=new Image();
imgelev.onload = function() {
		ctxe.drawImage(imgelev, 0, 0);
		ele=ctxe.getImageData(0,0,mycanvase.width,mycanvase.height);
		imgelev.src="";
		mycanvase.width=0;
		mycanvase.height=0;
        avanceCharge();
      };

