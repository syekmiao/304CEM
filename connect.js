const mongoose =  require ( 'mongoose' ); 
const db =  "mongodb+srv://shimo:SRX0mNjFwD9jspzL@apiproject.rwysew4.mongodb.net/?retryWrites=true&w=majority" ; 
mongoose.connect(
    process.env.MONGODB_URI || db, { useNewUrlParser: true }
    )
    .then (() => { 
    
    console . log ( "Connected to database" ); 
   })
   .catch(()=> { 
       console.log ( "Error Connecting to database" ); 
   }) 

   //A schema matched the table in your database 
const songSchema = mongoose. Schema ({ 
    songId : { type : String }, 
    songName : { type : String }, 
    songArtist : { type : String }, 
    songImage : { type : String },
    duration : { type : String },
    album: { type : String },
    genre: { type : String },
    songLyrics : { type : String }
    }); 
  
const Record =  mongoose . model ( 'songs' ,  songSchema, 'songCollection' );   
module.exports =  Record ;