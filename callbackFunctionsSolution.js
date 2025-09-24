let even_predicate = function (value)
{
    /* check whether the value is even 
     (a number is even when the remainder of its division by 2 is equal to 0)
     return true if the value is even or false when the value is odd 
   */
  return value%2 == 0
};

let odd_predicate = function (value)
{
    /*
    check whether the value is odd 
     return true if the value is even or false when the value is odd
    */ 
   return value%2 != 0
};

let undefined_predicate = function (value)
{
    /* 
        check and return a boolean value to indicate 
        whether the given value is undefined
         (be careful with the implicit coercion) 
    */
    return value === undefined;
};

let null_predicate = function (value)
{
    /* 
        check and return a boolean value to indicate 
        whether the given value is null
         (be careful with the implicit coercion) 
    */
    return value === null
};


//We're defining a function that takes predicate function to 'callback' 
// and a value to check using the given predicate
let check = function (predicate,value)
{
    // apply the predicate to the value and return the result
    return predicate(value)
};

//DO NOT CHANGE ORDER OF OUTPUT
console.log(/* call the check function here to check whether 9 is even */check(even_predicate,9));
console.log(/* call the check function here to check whether 9 is odd */check(odd_predicate,9));
console.log( /* call the check function here to check whether 8 is even */check(even_predicate,8));
console.log(/* call the check function here to check whether 8 is odd */check(odd_predicate,8));
let x;
console.log(/* call the check function here to check whether x is undefined */check(undefined_predicate,x));
console.log(/* call the check function here to check whether x is null */check(null_predicate,x));
