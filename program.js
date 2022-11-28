const Record = require('./connect');
const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');

const PORT = process.env.PORT || 5000;
var songName, songArtist, songLyrics, songImage, songId; //matches;

app.get('/getmusic', (req, res) => {
    const title = req.query.title;
    const options = {
        method: 'GET',
        url: 'https://geniurl.p.rapidapi.com/search',
        params: {q: `${title}`},
        headers: {
          'X-RapidAPI-Key': '1719282c54mshab269b6f7a23c4ap14299bjsnfb62e3e72751',
          'X-RapidAPI-Host': 'geniurl.p.rapidapi.com'
        }
    };
    
    axios.request(options).then( (response) =>{
    
        //matches = response.data.matches;

        //for (let i=0; i<= matches; i++){
        songName = response.data.top.meta.title;
        songArtist = response.data.top.meta.artists;
        songImage = response.data.top.resources.image;
    
        const options2 = {
            method: 'GET',
            url: 'https://powerlyrics.p.rapidapi.com/getlyricsfromtitleandartist',
            params: {title: `${songName}`, artist: `${songArtist}`},
            headers: {
                'X-RapidAPI-Key': '1719282c54mshab269b6f7a23c4ap14299bjsnfb62e3e72751',
                'X-RapidAPI-Host': 'powerlyrics.p.rapidapi.com'
            }
        };
    
        axios.request(options2).then( (response) =>{
            songLyrics = response.data.lyrics;
            songId = Math.random(30);
    
            songValue = new Record ({
                songId:songId,
                songName:songName,
                songArtist:songArtist,
                songLyrics:songLyrics,
                songImage:songImage
            });

            if (!songValue.songName) {
                res.status(200).json('Not found');
                return;
            }
    
            songValue
            .save()
            .then(response => {
                res.status(200).json(response);
                //window.location.reload(false);
            })
            .catch(error=> {
                res.status(400).json(error);
                //console.log.
            });
        })
        .catch(error => {
            res.status(400).json(error);
        });
    //}
    });
});

app.get('/getallsongs', (req, res) => {
    Record.find((err, docs) => {
        if(err){
            res.status(400).json(err);
        }
        else{
            res.send(docs);
        }
    })
    /*    .then(response => {
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(400).json(error);
          });
          */
});

app.get('/deletesong', (req, res) => {
    Record.deleteMany({songId: req.query.songid})
        .then(response => {
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(400).json(error);
          });
});

if(process.env.NODE_ENV === 'production'){
    app.use(express.static( 'client/build' ));

    app.get('*', (res, req) =>{
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
});