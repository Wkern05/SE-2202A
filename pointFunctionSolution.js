function Point(x, y) {
    //paste definition from task 1

    this.x = x
    this.y = y

    this.print = function() {
        // Keep same format as above
        console.log("(" + this.x + "," + this.y + ")")
    };

    this.midpoint = function(p2){
        //fill in as specified in README
        //don't forget to return the point

        x1 = this.x
        y1 = this.y
        x2 = p2.x
        y2 = p2.y

        let p3 = new Point()
        p3.x = (x1 + x2)/2
        p3.y = (y1 + y2)/2

        return p3
    }

    this.scaleTo = function(p2,t){
        //fill in as specified in README
        //don't forget to return the point

        x1 = this.x
        y1 = this.y
        x2 = p2.x
        y2 = p2.y

        let p3 = new Point()
        p3.x = x1 + (x2 - x1)*t
        p3.y = y1 + (y2 - y1)*t

        return p3
    }
}


/* Do not change the lines below */
let p1 = new Point(1,5)
let p2 = new Point(5,7)
p1.midpoint(p2).print()//expect (3, 6)
p2.midpoint(p1).print()//expect (3, 6)

/* Do not change the lines below */
let p3 = new Point(0,0)
let p4 = new Point(4,8)
p3.scaleTo(p4,0.25).print(1,2)// expect (1, 2)
p4.scaleTo(p3, 0.75).print() // expect (1, 2)
