import express from "express"
import mongoose from "mongoose";
import { uri } from "./url.js";
import { Movie } from "./models/movies.js";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors())

const main = async() => {
    try{
await mongoose.connect(uri)
console.log("DB Connected")
    }catch(err){
console.log(err)
    }
}

main();


// GET

app.get("/api/movies-info",async(req,res)=>{
    try{
        const movies = await Movie.find();
        console.log(`Movies: ${movies}`)
        return res.json(movies)

    }catch(err){
        console.log(`Error : ${err} !`)
    }
})


// GET one movies
app.get("/api/movies-info/:id",async(req,res)=>{
    const {id} = req.params;
    try{
        const movies = await Movie.findById(id);
        console.log(`Movies: ${movies}`)
        return res.json(movies)

    }catch(err){
        console.log(`Error : ${err} !`)
    }
})

// POST

app.post("/api/add-movie", async(req, res) => {
    const movieObj = req.body;
    const movie = new Movie(movieObj); 

    console.log(movieObj);

    try {
        const savedMovie = await movie.save();
        console.log(`New Movie: ${savedMovie}`);
        res.status(201).json(savedMovie); 
    } catch (err) {
        console.log(`Error: ${err}`);
        res.status(500).json({ error: "Failed to save movie" }); 
    }
});

// DELETE a Movie
app.delete("/api/movies-info/:id", async (req, res) => {
    const { id } = req.params; 
  
    try {
      const deletedMovie = await Movie.findByIdAndDelete(id)
      if (!deletedMovie) {
        return res.status(404).json({ error: "Movie not found" });
      }
      console.log(`Deleted Movie: ${deletedMovie}`);
      res.status(200).json({ message: "Movie deleted successfully", deletedMovie });
    } catch (err) {
      console.log(`Error: ${err}`);
      res.status(500).json({ error: "Failed to delete the movie" });
    }
  });
  
//   UPDATE the movie
app.put("/api/movies-info/:id", async (req, res) => {
    const { id } = req.params; 
    const updateData = req.body;
    console.log(`Updates: ${updateData}`)
  
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      
      if (!updatedMovie) {
        return res.status(404).json({ error: "Movie not found" });
      }
  
      console.log(`Updated Movie: ${updatedMovie}`);
      res.status(200).json(updatedMovie);
    } catch (err) {
      console.log(`Error: ${err}`);
      res.status(400).json({ error: "Failed to update the movie" });
    }
  });
  

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Listening at Port: ${PORT}`)
})