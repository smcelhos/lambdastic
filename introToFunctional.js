/*Functional Javascript -
* Higher Order Functions, Closures, Currying, Partial Application and function compostion
*
* --- Code for slide deck on presentation I did ---
*/

/** Higher Order functions either 1) take one or more functions as arguments
*	2) Output a function.
*	Some common Higher Order functions
*	General Callbacks
*	Returning functions
*/

/*Collection iterator, probably familiar to those of us in imperative world*/
// array.forEach(callback[, thisArg]) 
// callback 
// Function to execute for each element 
// thisArg 
// Object to use as this when executing callback 

var data = [1, 2, 3, 4]; 
data.forEach(function(element, index, array) { 
	console.log("a[" + index + "] = " + element); 
}); 
// logs: // a[0] = 1 // a[1] = 2 // a[2] = 3 // a[3] = 4

/* Test if every element in collection mets some criteria */
// array.every(callback[, thisArg]) 
// callback 
// Function to test for each element 
// thisArg 
// Object to use as this when executing callback 
// return Boolean 
// True if every element passes test, otherwise false 
var data = [1, 2, 3, 4]; 
var result = data.every(function(element, index, array) { 
	return element <= 3; 
}); 

// result === false

/* Test if some of the elements in collection pass the test */
/* maybe known as any to some */
// array.some(callback[, thisArg])
 // callback 
 // Function to test for each element 
 // thisArg 
 // Object to use as this when executing callback 
 // return Boolean 
 // True if any element passes test, otherwise false 
 
 var data = [1, 2, 3, 4]; 
 var result = data.some(function(element, index, array) { 
	console.log("a[" + index + "] =" + element); 
	return element > 3; 
}); 

// result === true

/*Select only those element in the collection which meet some criteria.
Similar to select in c#/linq */
// array.filter(callback[, thisArg]) 
// callback 
// Function to test each element of the array 
// thisArg 
// Object to use as this when executing callback 
// return Array 
// A new Array with only the elements in the array that 
// pass the call back var data = [1, 2, 3, 4]; 

var result = data.filter(function(element, index, array) {
	return (element < 3); 
}); 
// result = [1, 2]


/* Pulling out the big guns in the functional world.  
* It is somewhat surprising how unknown map/fold are in the imperative world.
* Map produces a new collection by applying the function to each element of the current collection.
*/
// array.map(callback[, thisArg]) 
// callback 
// Function that produces an element of the new Array from 
// an element of the current one 
// thisArg 
// Object to use as this when executing callback 
// return Array 
// A new Array where each element i is the result of 
// callback(originalArray[i]) 
var data = [1, 2, 3, 4]; 
var result = data.map(function(element, index, array) {
	// square 
	return element * element; 
 }); 
 // result = [1, 4, 9, 16]
 
 /* Reduce is the name better known for foldl in the imperative world.  Even so, it is surprisingly underutilized.
*	If coming from functional world one may notice that aggregator/initialValue isn't necessary.  If not supplied the first element
*	of the collection is used.
 */
 
 // array.reduce(callback[, initialValue]) 
 // callback 
 // Function to execute on each value in the array 
 // initialValue 
 // Object to be used as the first argument to the first call of the call back 
 // return Anything 
 // A new Array with only the elements in the array that pass the call back 
 var data = [1, 2, 3, 4]; 
 var result = data.reduce(function(previousValue, currentValue, index, array) {
	return previousValue + currentValue; 
 }); 
 // result = 10; 
 
 var result2 = data.reduce(function(previousValue, currentValue, index, array) { 
	return previousValue + currentValue; 
}, 10); 
// result 20;
 
/* This decievingly simple example often requires alot of explanation to those 
* not familiar with closure scope.
*/
 // Example of closures and returning a function 
var counter = (function() { 
	var count = 0; 
	return function() { console.log(++count); }; }
)(); 
// counter(); count = 1 
// counter(); count = 2 
// ... 
// counter(); count = n 
// count; => ReferenceError: count is not defined 
// count is in closure scope 


/* Memoization as a more concrete example, of closure scope and returning functions */

// standard fibonacci 
function slowFibonacci(n){ 
	if(n == 0 || n == 1){
		return n;
	}else{
		return slowFibonacci(n-1) + slowFibonacci(n-2);
	} 
} 

// memoized fibonacci 
var fibonacci = (function() { 
	var memo = {}; // our hash to memo 
	function f(n) { 
		var value; 
		if (n in memo) { 
			value = memo[n]; 
		} else { 
			if (n === 0 || n === 1) 
				value = n; 
			else 
				value = f(n - 1) + f(n - 2); 
			
			memo[n] = value; 
		} 
		
		return value; 
	} 
	
	return f; 
	
	// return memoized function 
})(); 

console.time("slow"); 
console.log( "value", slowFibonacci(34)); console.timeEnd("slow"); 
// value 5702887 
// slow: 10711ms (that’s almost 11 seconds!!!) 
// mileage may very, ran MUCH faster in chrome 
// however crashed shortly after this number just like other versions
// 2*fib(n+1)-1 calls to slowFib (that is 40Billion+ for slowFibonacci(50)

console.time("memo"); 
console.log("value", fibonacci(34)); 
console.timeEnd("memo"); 
// value 5702887 
// memo: 1ms
// n + (n-1) calls to fibonacci in the worst case, that is 99 for fibonacci(50)

/* Abstracting memoization as a higher order function 
* Not as effiecient as our custom memomized version (we are only memomizing last call, isntead of every recursive call)
* but still pretty snazzy.
*/

// function to convert a non-memoized function to memoized version 
function memoize(func) { 
	var memo = {}; 
	var slice = Array.prototype.slice; 
	
	return function () { 
		var args = slice.call(arguments); //convert args to array 
		
		if (args in memo) // auto-magic conversion to string of args 
			return memo[args]; 
		else 
			return (memo[args] = func.apply(this, args)); 
			
	} 
		
} 
	
var memoFib = memoize(slowFibonacci);


/* Partial Applicstion/Currying
* this code is prety abstract, but partial application/currying is immensely useful.
*/
// partially apply a set of arguments to a function 
function partial() { 
	var fn = arguments[0]; // use first argument as function 
	// save rest of arguments for final call 
	var args = Array.slice(arguments, 1); 
	return function () { 
		// use previous args + any arguments from this call and apply them 
		// to function 
		return fn.apply(this, args.concat(Array.slice(arguments, 0))); 
	}; 
} 

function test(x, y) { 
	return x + y; 
} 

var pTest = partial(test, 4); // x = 4 in PTest
 pTest(6); // 10

 
 /* In javascript world currying/partial application are generally synonymous 
 * a library might use either verbage to mean the same thing.
 *	Here we extend the function prototype to add same functionality as before
 */

 
 Function.prototype.curry = function (/*args...*/) {
	var fn = this; var args = Array.slice(arguments, 0); 
	// args to curry call 
	return function () { 
		return fn.apply(this, args.concat(Array.slice(arguments, 0))); 
	}; 
	
} 

function test(x, y, z) { 
	return x + y + z; 
} 

var a = test.curry(4); 
a(6, 5); // 15 
var b = test.curry(5,5); 
b(1); // 11
 
 
 /* An example of currying with a function */
 
 // an example with a function 
 function performOperation(oper, x, y) { 
	return oper(x, y); 
} 

var mult = performOperation.curry(function (x, y) { 
	return x * y; 
}); 

var add = performOperation.curry(function (x, y) { 
	return x + y; 
}); 

mult(2, 3); // 6 
add(2, 3); // 5


/*Function Composition 
* Your standard compose f(g(x))
*/

function compose() { 
	var fns = arguments; // we need the list of our functions, put them in closure scope 
	var arglen = fns.length; 
	return function() { 
		for (var i = arglen - 1; i >= 0; --i) {
			arguments = [fns[i].apply(this, arguments)]; // apply supplied args first 
			//time, or computed args each time after 
		} 
		return arguments[0]; // return our final computation 
	}; 
} 
// examples
function sq(x) { return x * x;} 
function inc(x) {return x + 1;} 

var test = compose(inc, sq); 
test(3); // 10 = (3^2)+1 = inc(sq(3));

/*Pipe or sequence, like compostion but composes argumetns in reverse order
*	g(f(x)), which can sometimes feel more natural
*/

function pipe() { 
	var fns = arguments; 
	var arglen = fns.length; 
	return function() { 
		for (var i = 0; i < arglen; i++) { 
			arguments = [fns[i].apply(this, arguments)]; 
		} 
		return arguments[0]; 
	}; 
} 

// examples
function sq(x) { return x * x;} 
function inc(x) {return x + 1;} 
var test1 = pipe(inc, sq); 
test1(3); //16 = (3+1)^2 = sq(inc(3));