var express=require('express');
var app=express();
var fs=require('fs');
var url=require('url');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
app.use(express.static('/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(8080);

app.get('/form',function(req,res){
	res.sendFile(__dirname+'/index.html');
});

mongoose.connect('mongodb://localhost/mydb');


mongoose.connection.once('open',function(){
	console.log('Connection is made');
}).on('error',function(error){
	console.log('Connection error',error);
});

const Schema = mongoose.Schema;
 //   ObjectId = Schema.ObjectId;
 
const MySchema = new Schema({
	 name:{type:String,required:true, trim:1},
	 description: {type:String,required:true, trim:1},
	 price:{type:Number,required:true, trim:1},
	 quantity: {type:Number,required:true, trim:1}
});

const Mymodel=mongoose.model('Cart',MySchema);


app.post('/save',function(req,res){

	var item = new Mymodel(
		{
			
			name:req.body.name,
			description:req.body.des,
			price:req.body.price,
			quantity:req.body.quantity
		});

	item.save(function(error){
		if(error)
		{
			res.status(500).send('Failed to save data: ' + error )
			return;	
		}
		else{
			res.status(200).send('Successfully saved data ' + req.body.name);
        }
	});	

})

app.post('/find',function(req,res){
	Mymodel.findOne({'name':req.body.name1},function(err,item) {
		if(err) {
			console.log('Item not Found');
			return;
		}
		else
		res.send(item.name+' '+item.description+' '+item.quantity+' '+item.price);
	})
})
