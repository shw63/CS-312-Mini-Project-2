import express from 'express';
import axios from 'axios';

const app = express();

const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// home page
app.get('/', (req, res) => {
    res.render('index.ejs', { joke: null, error: null });
});

// joke handling
app.post('/joke', async (req, res) => {
    let joke;
    // get name from form 
    const { name } = req.body;
    // calculate ID
    let id = 0;
    for (let i = 0; i < name.length; i++) {
        // gets ASCII value of each character and adds it to the ID
        id += name.charCodeAt(i);
    }
    // 319 is the total number of jokes in the API
    id = id % 319; 
    try {
        // Axios request
        const response = await axios.get(`https://v2.jokeapi.dev/joke/Any?idRange=${id}`);
        // check if the joke is a single or two-part joke
        if (response.data.type === 'single') {
            // use response.data.joke
            joke = response.data.joke;
        } else {
            // use response.data.setup and response.data.delivery
            joke = `${response.data.setup} - ${response.data.delivery}`;
        }
        // render joke
        res.render('index.ejs', { joke: joke, error: null });
    }
    catch (error) {
        res.render('index.ejs', { joke: null, error: 'Error fetching joke. Please try again.' });
    }
    
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});