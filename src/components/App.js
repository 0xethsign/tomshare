import React, { Component } from 'react';
import Web3 from 'web3';
//import Identicon from 'identicon.js';
import './App.css';
import TomShare from '../abis/TomShare.json'
import Navbar from './Navbar'
import Main from './Main'
import Loader from "react-loader-spinner";
//import Portis from '@portis/web3';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      // const portis = new Portis('YOUR_DAPP_ID', 'mainnet');
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert("Non-Ethereum browser detected. Please try installing MetaMask for this to work.")
    }
  }

  // async loadBlockchainData() {
  //   const web3 = window.web3
  //   const accounts = await web3.eth.getAccounts()
  //   console.log('The account connected to this dapp is ', accounts[0])
  //   this.setState({ account: accounts[0] })

  //   const networkID = await web3.eth.net.getId()
  //   const networkData = TomShare.networks[networkID]
  //   if (networkData) {
  //     const tomshare = web3.eth.Contract(TomShare.abi, networkData.address)
  //     this.setState({ tomshare })
  //     const postCount = await tomshare.methods.postCount().call()
  //     this.setState({ postCount })

  //     for (var i = 1; i <= postCount; i++) {
  //       const image = await tomshare.methods.images(i).call()
  //       this.setState({
  //         images: [...this.state.images, image]
  //       })
  //     }

  //     this.setState({
  //       images: this.state.images.sort((a, b) => b.tipAmount - a.tipAmount)
  //     })

  //     this.setState({ loading: false })
  //   } else {
  //     window.alert("Smart contract not deployed on the detected network.")
  //   }
  // }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = TomShare.networks[networkId]
    if (networkData) {
      const tomshare = new web3.eth.Contract(TomShare.abi, networkData.address)
      this.setState({ tomshare })
      const postCount = await tomshare.methods.postCount().call()
      this.setState({ postCount })
      // Load images
      for (var i = 1; i <= postCount; i++) {
        const image = await tomshare.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
      // Sort images. Show highest tipped images first
      this.setState({
        images: this.state.images.sort((a, b) => b.tomAmount - a.tomAmount)
      })
      this.setState({ loading: false })
    } else {
      window.alert('Decentragram contract not deployed to detected network.')
    }
  }


  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadImage = description => {
    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if (error) {
        console.error(error)
        return
      }
      this.setState({ loading: true })
      this.state.tomshare.methods.uploadImage(result[0].hash, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }


  tipImageOwner(id, tipAmount) {
    this.setState({ loading: true })
    this.state.tomshare.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      tomshare: null,
      images: [],
      loading: true,
    }
  }

  render() {
    document.body.style.backgroundColor = "white";
    return (
      <div style={{ fontFamily: "Inter" }}>
        <Navbar account={this.state.account} />
        {this.state.loading
          ? <div id="loader" className="text-center mt-5">
            <div style={{ margin: "10% 30px" }}>
              <Loader
                type="MutatingDots"
                color="#00000"
                height={100}
                width={100}
              />
            </div>
          </div>
          : <Main
            images={this.state.images}
            captureFile={this.captureFile}
            uploadImage={this.uploadImage}
            tipImageOwner={this.tipImageOwner}
          />
        }
        <h1>{this.state.images}</h1>
      </div>
    );
  }
}

export default App;