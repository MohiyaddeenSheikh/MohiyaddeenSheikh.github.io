var http=require('http');
http.createServer(
    function(req,res){
        
        res.writeHead(200,{'Content-Type':'text/html'})
        res.write('hello Moin');
        res.end()
    }


).listen(3000,'192.168.0.111');