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

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = TomShare.networks[networkId]
    if (networkData) {
      //let tomshare = new web3.eth.Contract(TomShare.abi, networkData.address)
      const tomshare = new web3.eth.Contract(TomShare.abi, networkData.address)
      this.setState({ tomshare: tomshare })
      console.log(TomShare.abi)
      console.log(networkData.address)
      console.log(tomshare)
      let postsCount = await tomshare.methods.postCount().call()
      console.log(postsCount)
      this.setState({ postCount: postsCount })
      for (var i = 1; i <= postsCount; i++) {
        const image = await tomshare.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
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
    this.state.tomshare.methods.tipOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
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
      buffer: null,
      postCount: 0
    }
    this.uploadImage = this.uploadImage.bind(this)
    this.tipImageOwner = this.tipImageOwner.bind(this)
    this.captureFile = this.captureFile.bind(this)
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
      </div>
    );
  }
}

export default App;