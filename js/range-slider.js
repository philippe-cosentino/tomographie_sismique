var down=false;
function creeRangeSlider(id, onDrag) {

    var range = document.getElementById(id),
        dragger = range.children[0],
        draggerWidth = Math.round(lGL/100), // width of your dragger
        down = false,
        rangeWidth, rangeLeft;

    dragger.style.width = draggerWidth + 'px';
    dragger.style.left = -draggerWidth + 'px';
    dragger.style.marginLeft = (draggerWidth / 2) + 'px';
	
	var rect = range.getBoundingClientRect();
	
	this.id=id;
	
    range.addEventListener("mousedown", function(e) {
        rangeWidth = this.offsetWidth;
        rangeLeft = this.getBoundingClientRect().left;
        down = true;
        updateDragger(e);
        return false;
    });

    document.addEventListener("mousemove", function(e) {
        updateDragger(e);
    });

    document.addEventListener("mouseup", function(e) {
        down = false;
    });
	
    function updateDragger(e) {

        if (down && e.pageX >= rangeLeft && e.pageX <= (rangeLeft + rangeWidth)) {
            dragger.style.left = e.pageX - rangeLeft - draggerWidth + 'px';
			var x1=rangeLeft+rangeWidth*0.05;
			var x2=rangeLeft+rangeWidth*0.95;
			var x=(e.pageX-x1)/(x2-x1);
			if (x<0) {x=0;} else if (x>1) {x=1;}
            if (typeof onDrag == "function") onDrag(x*100);
        }
    }

}

var coucou=3;

function redimSlider (id) {
	var range = document.getElementById(id),
	dragger = range.children[0],
	draggerWidth = Math.round(lGL/100);

		
	dragger.style.width = draggerWidth + 'px';
    dragger.style.left = -draggerWidth + 'px';
    dragger.style.marginLeft = (draggerWidth / 2) + 'px';
}

function setSliderValue (id,v) {
	var range = document.getElementById(id),
	dragger = range.children[0],
	draggerWidth = Math.round(lGL/100), // width of your dragger
	rangeWidth = range.offsetWidth;
		
	if (down===true) {return false;}//deja en mouvement
		
	var x1=rangeWidth*0.05;
	var x2=rangeWidth*0.95;
	
	var x=Math.round(v/100*(x2-x1)-draggerWidth+x1);
	dragger.style.left= x+ 'px';
}