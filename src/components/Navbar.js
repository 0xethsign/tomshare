import React, { Component } from 'react';
import photo from '../photo.png'

class Navbar extends Component {

  render() {
    return (
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "30px 10%"
      }}>
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={photo} width="50" height="50" className="d-inline-block align-top" alt="" />

        </a>
        <div>
          <h1>tomshare</h1>
          <p>the web3.0 image sharing platform</p>
        </div>
        <div style={{
          padding: "5px 5px",
          color: "slategray",
          backgroundColor: "black",
          borderRadius: "10px"
        }}>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block" >
              <small className="text-secondary">
                <p id="account" style={{
                  color: "white",
                  padding: "12px 0px 0px 0px",
                  fontWeight: "bold",
                }}>{this.props.account}</p>
              </small>
              {/* {this.props.account
                ? <img
                  alt="fdgfhgjg"
                  className='ml-2'
                  width='30'
                  height='30'
                  src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                />
                : <span></span>
              } */}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Navbar;