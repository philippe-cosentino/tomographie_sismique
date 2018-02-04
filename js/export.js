var imgTemp=new Image();

function saveAsJpeg () {
	if (!coupeFaite) {return false;}
	
	//traceCoupe (ctCoupe);
	downloadJpeg ();
}

function downloadJpeg () {

	imgTemp.src=canvCoupe.toDataURL('image/jpeg');
	
	// atob to base64_decode the data-URI
	var image_data = atob(imgTemp.src.split(',')[1]);
	// Use typed arrays to convert the binary data to a Blob
	var arraybuffer = new ArrayBuffer(image_data.length);
	var view = new Uint8Array(arraybuffer);
	for (var i=0; i<image_data.length; i++) {
		view[i] = image_data.charCodeAt(i) & 0xff;
	}
	try {
		// This is the recommended method:
		var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
	} catch (e) {
		// Old Browsers
		var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
		bb.append(arraybuffer);
		var blob = bb.getBlob('application/octet-stream'); // <-- Here's the Blob
	}

	var fileNameToSaveAs = "tomographie sismique.jpg";

	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (URL != null)
	{
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.URL.createObjectURL(blob);
	}
	else
	{
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(blob);
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

		downloadLink.click();

	//Canvas2Image.saveAsPNG(canvTemp);
	//window.location.href=imgData; 
	//var texte="<html><body><p>Pour enregistrer cette image, essayez le clic droit de la souris</p></html><img src='"+imgData+"'></body></html>";
	//window.open("data:text/html,"+texte,'_blank');
}
