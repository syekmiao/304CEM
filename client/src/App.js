import React, { Component } from 'react';
import './App.css';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import axios from 'axios';
import Popup from 'react-popup';
import './Popup.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      songs: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getAllSongs = () => {
    axios
      .get('/getallsongs')
      .then(result => {
        this.setState({ songs: result.data });
        console.log(this.state.songs);
      })
      .catch(error => {
        console.log(error);
      });
  };
  componentDidMount() {
    this.getAllSongs();
  }

  handleSubmit(e) {
    const query = `/getmusic?title=${this.input.value}`;

    console.log(query);
    e.preventDefault();
    axios
      .get(query)
      .then(result => {
        console.log(result);
        if (result.data === 'Not found') {
          Popup.alert('Movie Not Found');
        }
        this.getAllSongs();
      })
      .catch(error => {
        alert('Error: ', error);
      });
  }

  deleteRecord = value => {
    console.log('to delete: ', value);
    const query = `/deletesong?songid=${value}`;
    axios
      .get(query)
      .then(result => {
        this.getAllSongs();
      })
      .catch(error => {
        alert('Error: ', error);
      });
  };

  //https://www.codementor.io/blizzerand/building-forms-using-react-everything-you-need-to-know-iz3eyoq4y
  //todo add buttons to delete rows
  //https://codepen.io/aaronschwartz/pen/awOyQq?editors=0010
  //https://github.com/react-tools/react-table/issues/324
  render() {
    var data = this.state.songs;
    data = data.reverse();

    return (
      <div className="App">
        <div className="jumbotron text-center header">
          <h1>Music</h1>
          <p>Search for songs</p>
        </div>
        <div className="container search">
          <div className="col-sm-12">
            <p />
            <form onSubmit={this.handleSubmit}>
              <label>Enter song name:</label>
              <input
                type="text"
                className="form-control"
                ref={input => (this.input = input)}
              />
              <p />
              <input type="submit" value="Submit" />
            </form>
            <p />
          </div>
          <div>
            <Popup />
          </div>
        </div>

        <div className="container">
          <div className="col-sm-12">
            <p />
            <ReactTable
              data={data}
              columns={[
                {
                  Poster: 'Poster',
                  Cell: row => {
                    return (
                      <div>
                        <img height={250} src={row.original.songImage} />
                      </div>
                    );
                  }
                },
                
                {
                  Header: 'Music Name',
                  accessor: 'songName'
                },
                {
                  Header: 'Artist',
                  accessor: 'songArtist'
                },
                {
                  Header: 'Lyrics',
                  accessor: 'songLyrics',
                  style: { 'white-space': 'unset' }
                },
                {
                  Header: 'Delete',
                  accessor: 'songId',
                  Cell: ({ value }) => (
                    <button
                      onClick={() => {
                        this.deleteRecord(value);
                      }}
                    >
                      Delete
                    </button>
                  )
                }
              ]}
              defaultPageSize={5}
              className="-striped -highlight"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;