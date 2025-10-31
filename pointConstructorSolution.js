// Create a template object (prototype) for a 2D point
let PointPrototype = {
    // properties for coordinates
    // make a property x and a property y
    // that contain default values of 0 

    x: 0,
    y: 0,

    /*
    Make a property called print that contains a function
    that prints:
    console.log("(" + [x] + ", " + [y] + ")");
    with [x] and [y] replaced with the appropriate way of
    accessing the values.
    */
    print: function() {
        // Use the format specified above
        console.log("(" + this.x + ", " + this.y + ")")
    }
};

// Function that creates a point object using the prototype
function createPoint(x, y) {
    /* Fill in the body to create and return an object using
    Object.create that has type PointPrototype 
    and two properties x and y. x and y should be
    assigned values based on the corresponding paremeters 
    of createPoint.
    */
   let point = Object.create(PointPrototype)

   point.x = x
   point.y = y

   return point
}

// test the prototype-based objects
// do not change
let p1 = createPoint(3, 4);
p1.print();
p1 = createPoint(10, 15);
p1.print();
p1 = createPoint(-2, 8);
p1.print();

// Now create a constructor function version
function Point(x, y) {
    /*Write a constructor function to be called with new
    to produce objects with x and y defined similarly to createPont.

    This time we'll make print a method of the object, rather than
    part of the prototype.
    */

    this.x = x
    this.y = y

    this.print = function() {
        // Keep same format as above
        console.log("(" + this.x + ", " + this.y + ")")
    };
}

/* Test creating objects with the constructor Point.
 The x and y values should be the same as those for 
 createPoint above and in the same order.
 Do not change the print statements */
let p2 = new Point(3, 4)// make with constructor function
p2.print();
p2 = new Point(10, 15)//make with constructor function
p2.print();
p2 = new Point(-2, 8)//make with constructor function
p2.print();

