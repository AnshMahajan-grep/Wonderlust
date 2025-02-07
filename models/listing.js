const mongoose=require("mongoose");
const Review =require("./review.js");
main() 
    .then(() => {
    console.log("connection  to DB ");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        set:(v)=> v===""?"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60":v,
        default:"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price:Number,
    location:String,
    country:String,
    reviews: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",

        }
    ]
})
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id :{$in:listing.reviews}});
    }
})
const Listing = mongoose.model("Listing",listingSchema);
module.exports= Listing;