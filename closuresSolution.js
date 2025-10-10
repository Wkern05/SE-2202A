let counter = function (increment) {
    /*
        Uncomment the line that will correctly result in a separate (rather than shared) 
        counter if multiple counter functions are defined
    */
    //count = 0
    let count = 0;

    /*
        Create and return an inner function that receives a value increment
        and increments the value stored in count by increment.
    */
   let innerCounter = function(){
    count += increment;
    return count;
   }
   return innerCounter;
}

let countByTwo = counter(2); // set this variable to a closure that produces a counter that adds two each time it's called
let countByOne = counter(1); // set this variable to a closure that produces a counter that adds 1 each time it's called

// DO NOT change the lines below
console.log(countByTwo());
console.log(countByOne());
console.log(countByTwo());
console.log(countByOne());
