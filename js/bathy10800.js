﻿var mycanvasb = document.createElement("canvas");
mycanvasb.width=10800;
mycanvasb.height=5400;
var ctxb=mycanvasb.getContext("2d");
ctxb.clearRect(0,0,mycanvasb.width,mycanvasb.height);

var imgbathy=new Image();
imgbathy.onload = function() {
		ctxb.drawImage(imgbathy, 0, 0);
		bath=ctxb.getImageData(0,0,mycanvasb.width,mycanvasb.height);
		imgbathy.src="";
		mycanvasb.width=0;
		mycanvasb.height=0;
        avanceCharge();
      };