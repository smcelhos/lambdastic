function ones() {
    // as simple stream
    return {
	val: 1 /*value*/, 
  	next: ones/*thunk to generate next element in stream*/ 
};
}

function nats(x) {
    // generate the next elment of this stream
    var next = function () { return nats(x + 1); };
    // the stream
    return { val: x, next: next };
}
function fibonacci(x, y) {
    // the continuation of our stream
    var next = function() {
        return fibonacci(y, x + y);
    };
    // the stream
    return { val: x, next: next };
}
function take(stream, x) {
    /*initialize an array*/
    var vals = [];
    // push first x values onto array
    for (; x > 0; x--) {
        vals.push(stream.val);
        stream = stream.next();
    }

    return vals;
}

function range(stream, x, y){
	var values = take(stream, y);
	return values.slice(x-1);
}




range(nats(1), 10, 20);

range(fibonacci(0, 1), 10, 20);


// filter (f, stream)
// f
//      filtering function to execute on each element of stream
// stream
//      source stream
// return stream
//      return a new stream, which will filter source stream as it is lazily evaluated
function filter(f, stream) {
    var val = stream.val;
    var next = stream.next();
    if (f(val)) {
        return {
            val: val,
            next: function() {
                return filter(f, next);
            }
        };
    }

    return filter(f, next);

}
// map (f, stream)
// f:
// 		map function
// stream
//		source stream
// return stream
function map(f, stream){
	
	return { 
		val: f(stream.val), 
		next: function(){ return map(f, stream.next());}
		};
}
take(map(function(x){return x*x;}, nats(1)), 5);
// [1, 4, 9, 16, 25]


function sieve(s){
    var val = s.val;
    return {val: val, next: function() {
        return sieve( filter( function(x){
            return x % val != 0;
        }, s.next()))
    }}
}

take(sieve(nats(2)), 10);
// [2,3,5,7,11,13,17,19,23,29]







function JavaLikeIterator(){
    this.x = 1;
    this.y = 1;
    
}


JavaLikeIterator.prototype.constructor = JavaLikeIterator;
JavaLikeIterator.prototype.next = function(){
        var current = this.y;
        this.y = this.x;
        this.x = this.x + current;
        
        return current;
    };
JavaLikeIterator.prototype.hasNext = function(){
        return true;
    }


var jFib = new JavaLikeIterator();
var count = 0;
while(jFib.hasNext() && count <= 50){
    count++;
    console.log(jFib.next());
}

