 
import { Component } from "react";
import "./App.css";
//import Nav from "./components/Nav";
//import Main from "./components/Main";
import Web3 from 'web3';
import Buy from './contracts/Buy.json';


class App extends Component {

  

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3)
       {
        window.web3= new Web3(window.web3.currentProvider)
      }
    else {
      window.alert('No ethereum browser detected!')
    }
  }

  async loadBlockchainData(){
    const web3=window.web3
    
	const accounts = await web3.eth.getAccounts()
   // console.log(accounts);
   const bal= await web3.eth.getBalance(accounts[0]);
   this.setState({bal})
   console.log(bal);
	this.setState({account: accounts[0] })
  //const abi = Buy.abi
  
  
	const networkId = await web3.eth.net.getId()
  console.log(networkId);
  
	const networkData = Buy.networks[networkId]
  const address = networkData.address;
  this.setState({ address });
	
  
  
   if(networkData) {
    
    const buy = new web3.eth.Contract(Buy.abi,networkData.address)
    this.setState({ buy })
    //
  
    const productCount = await buy.methods.productCount().call()
   // console.log(Number(productCount))
   this.setState({ productCount })
      // Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await buy.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      console.log(Number(productCount));
      console.log(this.state.products);
    this.setState({ loading: false})
   
  } 
  else{
    window.alert("networkData nahi hua hai load")
  }
	 
   }

  constructor(props) {
    super(props)
    this.state= {
		
    account:'',
    address:'',
	  productCount:0,
	  products:[],
	  loading: true,
    name:'',
    price:'',
    bal:''
    }
    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
    //this.productCount = this.productCount.bind(this)
  }
  createProduct(name, price) {
    const buy=this.state.buy;
    console.log(buy);
    this.setState({ loading: true })
    buy.methods.creatProduct(name, price).send({ from: this.state.account })
    .on('receipt', (receipt) => {
      
        this.setState({ loading: false })
      })
  }

  
  
 
   purchaseProduct(id, price) {
    this.setState({ loading: true })
    this.state.buy.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
    .on('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }
  render(){
  return (
   
   <div className="main">
      
      <nav className="nav">The Hyper Mart <br /> <button>{this.state.account}</button></nav>
     < h1 className="h1">Hyper Mart is no longer adding products to it's dashboard</h1>
      <div className="container">
      {this.state.loading
                ? <div id="loader" className="load"><p className="text-center">Loading...</p></div>
              : <div className="oops">
              <h1>{this.state.name}</h1>
              <form onSubmit={(event) => {
                event.preventDefault();
                const name = this.state.name;
                const price = window.web3.utils.toWei(this.state.price.toString(), 'Ether');
                this.createProduct(name, price);
                }}>
                
                <div className="name">
                <input  
                placeholder="Product Name"
                
                value={this.state.name}
                   onChange={event => this.setState({name:event.target.value})} />
                </div>
                <div className="price">
                <input  
                placeholder="Product Price"
                value={this.state.price}
                   onChange={event => this.setState({price:event.target.value})} />
                
                
                </div>
                <button className="btn">Add Product</button>
              </form>

              <p>&nbsp;</p>
        <div className='lo'>
        
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.state.products.map((product, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                  <td>{product.owner}</td>
                  <td>
                    { !product.purchased
                      ? <button
                          name={product.id}
                          value={product.price}
                          onClick={(event) => {
                            this.purchaseProduct(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
              </div>
                 // : <Main
                //      products={this.state.products} 
                //      createProduct={this.createProduct}
                //      purchaseProduct={this.purchaseProduct}
                //      //productCount={this.state.productCount}
                //      />
              }
       </div>

    </div>
       
    
  );
}}

export default App;
