import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5" >
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>

              <h2 style={{ textAlign: "center" }}>post something <span>🐼</span></h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = this.imageDescription.value
                this.props.uploadImage(description)
              }} >
                <label
                  className="btn btn-block"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    display: "inline-block",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}>
                  <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} style={{ display: "none" }} />
                  <span>➕</span>
                </label>
                <div className="form-group mr-sm-2">
                  <br></br>
                  <input
                    id="imageDescription"
                    type="text"
                    ref={(input) => { this.imageDescription = input }}
                    className="form-control"
                    placeholder="tell me about this picture"
                    style={{ borderRadius: "10px" }}
                    required />
                </div>
                <button
                  type="submit"
                  className="btn btn-block btn-lg"
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "black",
                    color: "white"
                  }}>post</button>
              </form>

              <p>&nbsp;</p>

              {this.props.images.map((image, key) => {
                console.log(image, key)
                return (
                  <div className="card mb-4" key={key} >
                    {/* <div className="card-header">
                      <small className="text-muted">{image.author}</small>
                    </div>
                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p class="text-center"><img src={`https://ipfs.infura.io/ipfs/${image.hash}`} style={{ maxWidth: '420px' }} /></p>
                        <p>{image.caption}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          toms: {window.web3.utils.fromWei(image.tomAmount.toString(), 'Ether')} ETH
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, tipAmount)
                            this.props.tipImageOwner(event.target.name, tipAmount)
                          }}
                        >
                          tip 0.1 ETH
                        </button>
                      </li>
                    </ul> */}
                    <h1>image.author</h1>
                  </div>
                )
              })}

            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;