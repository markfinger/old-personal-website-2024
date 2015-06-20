(function() {

  window.toDollars = function(n, noCents){
    var s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(2), 10) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    var amount = "$" + s + (j ? i.substr(0, j) + ',' : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ',');
    // Add cents only if $100 or more
    if (amount.length < 4 && !noCents){
      amount += (2 ? '.' + Math.abs(n - i).toFixed(2).slice(2) : "");
    }
    return amount;
  };

  window.niceNumber = function(n){
    var t = ',';
    var i = Math.round(n).toString();
    var j = (j = i.length) > 3 ? j % 3 : 0;
    return (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t);
  };

}());