

var data = [{name: 'xy',age: 2}, 
  {name: 'xy',age: 2}];

function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}
console.log(arr.sort(compare('age')))