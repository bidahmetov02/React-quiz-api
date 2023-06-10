const express = require("express"); 
const pgPromise = require("pg-promise"); 
const cors = require("cors")
 
const app = express(); 
const pgp = pgPromise(); 

// Allow any origin
app.use(cors())
 
const dbConfig = {   
  connectionString: 
    "postgres://xlralosa:8RteJwNO8GNe1dSV_K7YwJCjgIU-QGjW@dumbo.db.elephantsql.com/xlralosa", 
  ssl: { 
    rejectUnauthorized: false, 
  }, 
}; 
 
const db = pgp(dbConfig); 

const getQuestions = async (amount, category, difficulty) => {
  let query = `SELECT category, difficulty, question, correct_answer, incorrect_answers FROM Questions WHERE difficulty = $1 AND category = $2 LIMIT $3`;

  return await db.any(query, [difficulty, category, amount]); 
}
 
app.get("/questions", async (req, res) => { 
  try { 
    const { amount, category, difficulty } = req.query;
    
    if (!amount || !category || !difficulty) {
      res.status(500).send("Error executing query");
    }
 
    const result = await getQuestions(amount, category, difficulty)   
 
    res.json(result); 
  } catch (error) { 
    console.error("Error executing query", error); 
    res.status(500).send("Error executing query"); 
  } 
}); 
 
app.listen(3000, () => { 
  console.log("Server is running on port 3000"); 
});

module.exports = app;