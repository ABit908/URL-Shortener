const express=require("express");
const urlRoute=require("./routes/url")
const {connectToMongoDb}=require("./connect.js");
const URL =require("./models/url.js");
const path=require("path");
const staticRoute=require("./routes/staticRouter")



const app=express();
const PORT=8001;

connectToMongoDb("mongodb://127.0.0.1:27017/URL-Shortener")
.then(()=>{console.log(`MongoDB connected`);});


app.use(express.json())
app.use(express.urlencoded({extended: false}));


app.use("/url",urlRoute);

app.set("view engine", "ejs");
app.set('views',path.resolve("./views"));

//Rendering using Ejs

app.use("/",staticRoute);




app.get("/url/:shortId" ,async (req,res)=>{
    let { shortId }=req.params;
    console.log(`shortId received:`,{shortId});
    // const re=req.params.redirectURL;
    // console.log(req.params.redirectURL);
    try{const entry=await URL.findOneAndUpdate({shortId},{
        $push:{
            visitHistory:{
            timestamp: Date.now(),
        },
    },
},{new:true}
).then((data)=>{console.log(data);});

// if (!entry.redirectURL) {
//     return res.status(400).send("Redirect URL is undefined");
// }
 res.send(entry.redirectURL);
}catch (err) {
    console.error("Error fetching short URL:", err);
    res.status(500).send("Server error");
}
});


app.listen(PORT,()=>{console.log(`Server started at port no.${PORT}`);});