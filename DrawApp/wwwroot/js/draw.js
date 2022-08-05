// Create a Paper.js Path to draw a line into it:
var path = new Path();
var textItem = new PointText(new Point(20, 30));
textItem.fillColor = 'black';
textItem.content = 'Click and drag to draw a line.';

/*
loadOldDrawing();
function loadOldDrawing(){
    var pointsAsJsonString = localStorage.getItem('drawing');
    
    if(pointsAsJsonString){
        // If we produced a path before, deselect it:
        if (path) {
            path.selected = false;
        }

        path = new Path();
        path.strokeColor = 'black';

        // Select the path, so we can see its segment points:
        path.fullySelected = false;
        
        
        console.log("Trying to load drawing")
        var points = JSON.parse(pointsAsJsonString);
        console.log(points);
        for (i = 0; i < points.length; i++) {
            path.add(points[i]);
        }
        
        path.simplify();
    }
}
 */

function onMouseDown(event) {
    // If we produced a path before, deselect it:
    if (path) {
        path.selected = false;
    }

    path = new Path();
    path.strokeColor = 'black';

    // Select the path, so we can see its segment points:
    path.fullySelected = false;
}

function onMouseDrag(event) {
    // Every drag event, add a point to the path at the current
    // position of the mouse:
    path.add(event.point);
    textItem.content = 'Segment count: ' + path.segments.length;
}

function onMouseUp(event) {
    var segmentCount = path.segments.length;
    //var roughObjSize = JSON.stringify(test).length;
    
    // When the mouse is released, simplify it:
    path.simplify();

    var pointsToTransfer = [];
    for (i = 0; i < path._segments.length; i++) {
        var p = path._segments[i]._point;
        var point = {
            x: p._x,
            y: p._y,
            angle: p.angle,
            angleInDegrees: p.angleInDegrees,
            angleInRadians: p.angleInRadians,
            length: p.length,
            quadrant: p.quadrant
        }
        pointsToTransfer.push(point);
    }
    
    //savePoints(test);
    
    // Select the path, so we can see its segments:
    path.fullySelected = false;

    var newSegmentCount = path.segments.length;
    var difference = segmentCount - newSegmentCount;
    var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);
    textItem.content = difference + ' of the ' + segmentCount + ' segments were removed. Saving ' + percentage + '%';

}

/*
function savePoints(points){
    var roughObjSize = JSON.stringify(test).length;
    var pointsAsJsonString = JSON.stringify(points);
    localStorage.setItem('drawing', pointsAsJsonString);
}
 */