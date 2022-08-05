"use strict";
// Create a Paper.js Path to draw a line into it:
var path = new Path();
var textItem = new PointText(new Point(20, 30));
textItem.fillColor = 'black';
textItem.content = 'Click and drag to draw a line.';

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = user+" says "+message;
});

connection.on("ReceivePoints", function (pointsAsString) {
    console.log("test1")
    if (path) {
        path.selected = false;
    }
    console.log("test2")

    path = new Path();
    path.strokeColor = 'black';
    
    path.fullySelected = false;

    console.log("test3")
    
    var points = JSON.parse(pointsAsString);
    console.log(points);
    for (var i = 0; i < points.length; i++) {
        path.add(points[i]);
        
    }

    path.simplify();
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

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
    
    // TODO. Every X ms break drawing and send result and continue drawing. <-- Have to. If drawing to much the network will die!
    // TODO. This will also make the drawing exp. look nicer for the ones looking.
}

function onMouseUp(event) {
    var segmentCount = path.segments.length;
    //var roughObjSize = JSON.stringify(test).length;

    // When the mouse is released, simplify it:
    
    
    
    var pointsToTransfer = [];
    var i = 0;
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

    path.simplify();
    
    var test = JSON.stringify(pointsToTransfer);
    
    connection.invoke("SendDrawing", test);
    console.log("Sending drawing")
    //savePoints(test);

    // Select the path, so we can see its segments:
    path.fullySelected = false;

    var newSegmentCount = path.segments.length;
    var difference = segmentCount - newSegmentCount;
    var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);
    textItem.content = difference + ' of the ' + segmentCount + ' segments were removed. Saving ' + percentage + '%';

}