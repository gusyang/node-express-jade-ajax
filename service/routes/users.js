var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/userlist',function(req,res){
    var db = req.db;
    db.collection('userlist').find().toArray(function(err,items){
        res.json(items);
    });
});

router.post('/adduser', function (req,res) {
    var db = req.db;
    db.collection('userlist').insert(req.body,function(err,result){
        res.send(err === null?{msg:''}:{msg:err});
    });
});

router.delete('/deleteuser/:id',function(req,res){
    var db = req.db;
    var id = req.params.id;
    db.collection('userlist').removeById(id,function(err,result){
       res.send(result === 1?{msg:''}:{msg:'err:'+err});
    });
});

router.post('/updateuser/:id',function(req,res){
   var db = req.db;
    var id = req.params.id;
    db.collection('userlist').updateById(id,req.body,function(err,result){
        res.send(result === 1?{msg:''}:{msg:'err:'+err +' result:'+result});
    });
});


module.exports = router;