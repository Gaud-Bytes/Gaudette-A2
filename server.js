var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == undefined)
      throw Error("A command must be specified");
      
    var result = {};
    if (query['cmd'] == 'CalcCharge')
    {
      result = serviceCharge(query);
    }
    else
    {
      throw Error("Invalid command: " + query['cmd']);
    }
 
    res.write(JSON.stringify(result));
    res.end('');
  }
  catch (e)
  {
    var error = {'error' : e.message};
    res.write(JSON.stringify(error));
    res.end('');
  }
}

function serviceCharge(query)
{
  if (query['checkBal'] == undefined)  
    throw Error("Expecting a checkBal Value");
    
  if (query['savingsBal'] == undefined)  
    throw Error("Expecting a savingsBal Value");
    
  if (query['checks'] == undefined)  
    throw Error("Expecting a checks Value");
    
  if(query['checkBal'] <= 0 || isNaN(query['checkBal']))
    throw Error("Invalid checkBal Value");
    
  if(query['savingsBal'] <= 0 || isNaN(query['savingsBal']))
    throw Error("Invalid savingBal Value");
    
  if(query['checks'] <= 0 || isNaN(query['checks']))
    throw Error("Invalid checks Value");
    
  var charge = 0;

  if(parseInt(query['checkBal']) > 1000 || parseInt(query['savingsBal']) > 1500)
  {
    charge = 0;
  }
  else
  {
    for (var i = 0; i < parseInt(query['checks']); i++)
    {
      charge+=0.15;
      
    }
  }
  
  charge = parseFloat(charge.toFixed(2));
    
  var result = {'charge' : charge}; 
  return result;
}
