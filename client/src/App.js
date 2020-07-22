import React, { Component } from "react";
import { motion } from "framer-motion";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linkArray: [],
      link: "",

      imageData: [],
    };
  }

  setData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  };

  add = (e) => {
    e.preventDefault();

    const { link } = this.state;

    fetch(`http://localhost:4000/getInfo?URL=${link}`, {
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          res.json();
        } else {
          throw new Error();
        }
      })
      .then((json) => {
        this.setState({ imageData: [...this.state.imageData, json] });
        this.setState({ linkArray: [...this.state.linkArray, link] });
      })
      .catch(() => {
        console.log("wrong link!");
      });

    this.setState({ link: "" });
  };

  submitForm = async (e) => {
    e.preventDefault();

    let { linkArray, imageData } = this.state;
    var tobeDownloaded = linkArray[0];

    if (tobeDownloaded) {
      window.location.href = `http://localhost:4000/download?URL=${tobeDownloaded}`;

      linkArray.splice(0, 1);
      imageData.splice(0, 1);

      this.setState({ linkArray });
      this.setState({ imageData });
    } else {
      console.log("no link provided");
    }
  };

  remove = (index) => {
    const { linkArray, imageData } = this.state;

    linkArray.splice(index, 1);
    imageData.splice(index, 1);

    this.setState({ linkArray });
    this.setState({ imageData });
  };
  render() {
    return (
      <>
        <div className="background-tube">
          <div className="container">
            <h1 className="title">Download MP3</h1>
            <form onSubmit={this.submitForm} className="container-input">
              <input
                name="link"
                onChange={this.setData}
                value={this.state.link}
                className="input"
              ></input>
              <div className="container-button">
                <button onClick={this.add} className="button-add">
                  Add
                </button>
                <button type="submit" className="button">
                  Download
                </button>
              </div>
            </form>
            {!!this.state.imageData.length && (
              <div className="list">
                {this.state.imageData.map((props, index) => {
                  return (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="container-list"
                      key={index}
                    >
                      <div className="close" onClick={() => this.remove(index)}>
                        X
                      </div>
                      <div className="container-image">
                        <img src={props.image}></img>
                      </div>
                      <div className="right">
                        <p>#{index + 1}</p>
                        <div className="top">
                          <h1 className="author">{props.author}</h1>
                          <div className="container-thumbnail">
                            <img src={props.avatar}></img>
                          </div>
                        </div>
                        <div className="song"> {props.song}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default App;
