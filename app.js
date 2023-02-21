
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express();
require('dotenv/config')
const api= process.env.API_URL;
const cors = require('cors');
app.use(cors());
app.options('*',cors())
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const mailer = require('nodemailer')
var transporter = mailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
        user:'rohitraj.smsit@gmail.com',
        pass:"qrbqvowbielwkffw"
    }
})
cloudinary.config({ 
    cloud_name: 'dd74og52k', 
    api_key: '965389974274484', 
    api_secret: 'KjXUrswCQLwrJOC0ehZXwGQP6Ik',
    secure: true
  });
//middleware
 //const  productRouter = require('./router/product.js')
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(fileUpload({ useTempFiles:true }))



 //app.use(`${api}/products`,productRouter)



const Product = require('./model/product.js')
const Inquiry = require('./model/inquiry.js');
const Subscribe = require('./model/subscribe.js');
const ContactUs = require('./model/contactUs.js')
const StaticData = require('./model/staticContent.js');
const User = require('./model/User.js');
const options = { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName:'hisarAuto'
}
mongoose.set('strictQuery', false);
mongoose.connect(process.env.CONNECTION_STRING,options).then(()=>{
    console.log('database is ready')
}).catch((error)=>{
console.log(error)
})
app.post('/register',async (req,res)=>{
    const user= new User(req.body)
    let result =  await user.save()
        res.send({data:result,success:true,status:200});
    } )
 
app.get(`${api}/products`,async (req,res)=>{ //api+'/products'
    const products = await Product.find()
    if(!products){
        res.status(500).json({success:false});
    }
    res.send(products)
   
})

app.post(`${api}/upload_productImage`,(req,res,next)=>{
    const file= req.files.user_file;
    cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        console.log(result.url, result.secure_url)
        res.send({data:{url:result.url,secure_url:result.secure_url,success:true,status:200}})
    })
  })
app.post(`${api}/products`,(req,res)=>{ 
    const product = new Product({
        image:req.body.image,
        images:req.body.images,
        title:req.body.title,
        contactNo:req.body.contactNo,
        emailId:req.body.emailId,
        description:req.body.description,
        richDescription:req.body.richDescription,
        countInStock:req.body.countInStock,
        createdAt:new Date().getTime()
    })
    product.save().then((createdProduct)=>{
        res.status(200).json(createdProduct)
    }).catch((error)=>{
        res.status(500).json({
            error: error,
            success:false
        })
    })
})

app.post(`${api}/inquiry`,(req,res)=>{ 
    //console.log(req.body)
    const inquiry = new Inquiry({
        name:req.body.name,
        emailId:req.body.emailId,
        contactNo:req.body.contactNo,
        message:req.body.message,
        productDetails:[{
        images:req.body.productDetails.images,
        productTitle:req.body.productDetails.productTitle,
        productId:req.body.productDetails.productId,
        richDescription:req.body.productDetails.richDescription,
        brand:req.body.productDetails.brand,
        price:req.body.productDetails.price,
        rating:req.body.productDetails.rating,
        }],
        countInStock:5,
        createdAt:new Date().getTime()
    })
    inquiry.save().then((createInquiry)=>{
        res.status(200).json(createInquiry)
    }).catch((error)=>{
        res.status(500).json({
            error: error,
            success:false
        })
    })
})
app.get(`${api}/inquiry`,async (req,res)=>{ //api+'/products'
    const inquiry = await Inquiry.find()
    if(!inquiry){
        res.status(500).json({success:false});
    }
    res.send(inquiry)
   
})
app.post(`${api}/subscribe`,async(req,res)=>{ 
    const subscribes = new Subscribe({
        emailId:req.body.emailId,
        createdAt:new Date().getTime()
    })
    subscribes.save().then((createSubscription)=>{
        res.status(200).json({data:createSubscription,emailId:req.body.emailId, success:true})
    }).catch((error)=>{
        res.status(500).json({
            error: error,
            success:false
        })
    })
})
app.get(`${api}/subscribe`,async (req,res)=>{ //api+'/products'
    const subscribe = await Subscribe.find()
    if(!subscribe){
        res.status(500).json({success:false});
    }
    res.send(subscribe)
   
})
app.post(`${api}/contactUs`,(req,res)=>{ 
    const contactUs = new ContactUs({
        name:req.body.name,
        emailId:req.body.emailId,
        contactNo:req.contactNo,
        message:req.message,
        createdAt:new Date().getTime()
    })
    contactUs.save().then((postcontactUs)=>{
        res.status(200).json(postcontactUs)
    }).catch((error)=>{
        res.status(500).json({
            error: error,
            success:false
        })
    })
})
app.post(`${api}/static`,(req,res)=>{ 
    const staticData = new StaticData({
        about:[
            { h1:"heading1",p:"description 1"}
           ],
           terms:req.body.terms,
           privacy:req.body.privacy,
        createdAt:new Date().getTime()
    })
    staticData.save().then((staticD)=>{
        res.status(200).json(staticD)
    }).catch((error)=>{
        res.status(500).json({
            error: error,
            success:false
        })
    })
})
app.get(`${api}/static`,async (req,res)=>{ //api+'/products'
    const static = await StaticData.find()
    if(!static){
        res.status(500).json({success:false});
    }
    res.send(static)
   
})
app.post(`${api}/sendMail`, async(req,res)=>{
    console.log('email',req.body.emailId)
    var mailOptions = {
        from :'rohitraj.smsit@gmail.com',
        to:req.body.emailId,//'rohitraj.smsit@gmail.com',
        subject:'hi!',
        text:'welcome to hisar auto private limited. Now your subscription has successfully registered with us',
    }
    await transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error)
        }
        else{
            res.send({ data: info.response, message:'email has been sent successfully', success:true});
         console.log('email has beeen send,!', info.response)
        }
        })

})
// app.use(`${api}/products`,productRouter)
app.listen(5000,(req,res)=>{
    console.log('backend2 console.')
}) 