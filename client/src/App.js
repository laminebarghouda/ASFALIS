import React, { Component } from "react";
import LocalAuthority from "./contracts/LocalAuthority.json";
import getWeb3 from "./getWeb3";
import axios from 'axios';
import "./App.css";
import ipfs from './ipfs'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      baseUrl: 'http://localhost:3000', // API url
      searchTerm: '', // Default search term
      searchResults: [], // Displayed search results
      numHits: null, // Total search results found
      searchOffset: 0, // Search result pagination offset
      selectedMedicine: null, // Selected paragraph object
      showRecModal: false, // to show or hide the reclamation modal
      didAtLeastOneSearch : false, // self explanatory
      web3: null,
      buffer: null,
      account: null,
      drugName: '',
      drugStoreAddress: '',
      ipfsHash: '',
    }
    this.searchDebounce = null
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    //binding functions
    this.onSearchInput = this.onSearchInput.bind(this)
    this.search = this.search.bind(this)
    this.nextResultsPage = this.nextResultsPage.bind(this)
    this.prevResultsPage = this.prevResultsPage.bind(this)
    this.showMedicineModal = this.showMedicineModal.bind(this)
    this.closeMedicineModal = this.closeMedicineModal.bind(this)
    this.report = null
  }


  componentDidMount = async () => {
      document.title = "Client"
    // Get network provider and web3 instance.
    getWeb3
        .then(results => {
          this.setState({
            web3: results.web3
          })

          // Instantiate contract once web3 provided.
          const contract = require('truffle-contract')
          const report = contract(LocalAuthority)
          report.setProvider(this.state.web3.currentProvider)

          // Get accounts.
          this.state.web3.eth.getAccounts((error, accounts) => {
            report.deployed().then((instance) => {
              this.report = instance
              console.log('instance', instance)
              console.log('accounts', accounts)
              // this.report.contract.events.reportEvent({ fromBlock: 0}, (error, event) => {
              //   console.log('event', event)
              // }).on("connected", function(subscriptionId){
              //   console.log("connected", subscriptionId);
              // }).on('data', function(event){
              //   console.log("event2", event); // same results as the optional callback above
              // }).on('changed', function(event){
              //   console.log("event3", event); // same results as the optional callback above
              // })

              this.setState({ account: accounts[0] })
            }).then((ipfsHash) => {
              // Update state with the result.
              return this.setState({ ipfsHash })
            })
          })


        })
        .catch(() => {
          console.log('Error finding web3.')
        })

  };


  initValue = async () => {
    const { contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ ipfsHash: response });
  };

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      ipfs.files.add(this.state.buffer, (error, result) => {
        if (error) {
          console.error(error)
          return
        }
        console.log('result', result)
        this.setState({ipfsHash: result[0].hash})

      })
    }

  }

  async onSubmit(event) {
    event.preventDefault()
    this.report.sendReclamation(this.state.drugName, this.state.drugStoreAddress, this.state.ipfsHash, {from: this.state.account}).then(() => {
      // Get the value from the contract to prove it worked.
      this.report.contract.getPastEvents('reclamationReceived',
          {
            fromBlock: 0,
          },
          (error, events) => {
            console.log("error", error)
            console.log('EVENTT : ', events)
          });
    });
  }




  /** Debounce search input by 100 ms */
  onSearchInput (evt) {
    this.setState({searchTerm : evt.target.value, didAtLeastOneSearch : true})

    clearTimeout(this.searchDebounce)
    this.searchDebounce = setTimeout(async () => {
      const rez = await this.search()
      this.setState({ searchOffset : 0, searchResults : rez })
    }, 100)

  }

  /** Call API to search for inputted term */
  async search () {
    const response = await axios.get(`${this.state.baseUrl}/search`, { params: { term: this.state.searchTerm.toUpperCase(), offset: this.state.searchOffset } })
    this.setState({numHits : response.data.hits.total })
    return response.data.hits.hits
  }

  /** Get next page of search results */
  async nextResultsPage () {
    if (this.state.numHits > 10) {
      let newOffset = this.state.searchOffset + 10
      this.setState({searchOffset : newOffset})

      if (this.state.searchOffset + 10 > this.state.numHits) {
        this.setState({searchOffset : this.state.numHits - 10 })
      }

      const rez = await this.search()
      this.setState({searchResults : rez})
    }
  }


  /** Get previous page of search results */
  async prevResultsPage () {
    let newOffset = this.state.searchOffset - 10

    if (newOffset < 0) {
      this.setState({searchOffset : 0})
    }else {
      this.setState({ searchOffset : newOffset })
    }

    const rez = await this.search()

    this.setState({searchResults : rez})
  }


  /** Display selected medicine in modal window */
  async showMedicineModal (searchHit) {
    this.setState({selectedMedicine : searchHit })
  }


  /** Close the medicine detail modal */
  closeMedicineModal () {
    this.setState({ selectedMedicine : null})
  }


  render() {
    return(
        <div className="app-container" style={{backgroundColor : '#001529'}}>

          {/* <!-- Search Bar Header --> */}
          <div className="mui-panel" style={{backgroundColor : '#001529' }}>
            <div className="mui-textfield">
              <input type="text" value={this.state.searchTerm} onChange={this.onSearchInput} style={{color : 'white'}}/>
              <label style={{color : 'white'}}>Search</label>
            </div>
          </div>

          {/* <!-- Search Metadata Card --> */}
          <div className="mui-panel" style={{backgroundColor : '#001529'}}>
            <div className="mui--text-headline" style={{color : 'white'}}>{ this.state.numHits } Hits</div>
            <div className="mui--text-subhead" style={{color : 'white'}}>Displaying Results { this.state.searchOffset } - { this.state.searchOffset + 9 }</div>
          </div>

          {/* <!-- Search Results Card List --> */}
          <div className="search-results">

            {/* when the are no output, give option to make reclamation */}
            {this.state.searchResults.length === 0 && this.state.didAtLeastOneSearch ?

                <div
                    className="mui-panel"
                    style={{display : 'flex' , justifyContent : 'center', flexDirection : 'column', alignItems: 'center', backgroundColor: '#001529'}}
                    onClick={() => this.setState({showRecModal : true})}
                >
                  <span className="material-icons md-48" style={{color : 'white'}}>help</span>
                  <div className="mui--text-title" style={{color : 'white'}}> Didn't find what you are looking for ? </div>
                </div>

                :null}

            {this.state.searchResults.map((hit, index) => {
              return (<div className="mui-panel"  style={{backgroundColor : '#001529', borderWidth : 1, borderStyle: 'solid', borderColor: 'white'}} onClick={() => this.showMedicineModal(hit)} key={index} >
                <div className="mui--text-title" style={{color : 'white'}}> { hit._source.specialite } </div>
                <div className="mui-divider" style={{textUnderline : 'white'}}></div>
                <div className="mui--text-subhead" style={{color : 'white'}}> { hit._source.dci }</div>
                <div className="mui--text-body2" style={{color : 'white'}}> Dosage : { hit._source.dosage }</div>
                <div className="mui--text-body2" style={{color : 'white'}}> Forme : { hit._source.forme }</div>
              </div>)
            })}

          </div>

          {/* <!-- Bottom Pagination Card --> */}
          <div className="mui-panel pagination-panel" style={{position : 'fixed', left : '40%', bottom: 0, backgroundColor : '#001529'}}>
            <button className="mui-btn mui-btn--flat" onClick={this.prevResultsPage} style={{color: 'white'}}>Prev Page</button>
            <button className="mui-btn mui-btn--flat"  onClick={this.nextResultsPage} style={{color : 'white'}}>Next Page</button>
          </div>

          {/* <!-- Medicine Modal Window --> */}
          {this.state.selectedMedicine ?

              <div className="medicine-modal" style={{backgroundColor : '#001529'}}>
                <div className="medicine-container">

                  {/* <!-- Medicine Section Metadata --> */}
                  <div className="title-row" style={{color : 'white'}}>
                    <div className="mui--text-display2 all-caps" style={{color : 'white'}}>{ this.state.selectedMedicine._source.specialite }</div>
                    <div className="mui--text-display1" style={{color : 'white'}}>{ this.state.selectedMedicine._source.dci }</div>
                  </div>

                  <br/>

                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> specialite : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.specialite }
                    </div>
                  </div>

                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> dosage : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.dosage }
                    </div>
                  </div>


                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> forme : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.forme }
                    </div>
                  </div>

                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> presentation : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.presentation }
                    </div>
                  </div>


                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> conditionnement_primaire : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.conditionnement_primaire }
                    </div>
                  </div>



                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> specification : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.specification }
                    </div>
                  </div>


                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> dci : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.dci }
                    </div>
                  </div>


                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> classement_VEIC : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.classement_VEIC }
                    </div>
                  </div>

                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> classe_therapeutique : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.classe_therapeutique }
                    </div>
                  </div>


                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> sous_classe : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.sous_classe }
                    </div>
                  </div>

                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> laboratoire : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.laboratoire }
                    </div>
                  </div>


                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> tableau : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.tableau }
                    </div>
                  </div>


                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}} > duree_conservation : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.duree_conservation }
                    </div>
                  </div>


                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> generique_princeps : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.generique_princeps }
                    </div>
                  </div>


                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> amm : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.amm }
                    </div>
                  </div>

                  <div className="info-row" >
                    <div className="mui--text-subhead" style={{color : 'white'}}> date_amm : </div> &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="mui--text-body2" style={{color : 'white'}}>
                      { this.state.selectedMedicine._source.date_amm }
                    </div>
                  </div>


                  <div className="mui--text-subhead" style={{color : 'white'}}> indication : </div>
                  <div className="mui--text-body2" style={{color : 'white'}}>
                    { this.state.selectedMedicine._source.indication }
                  </div>



                  {/* <!-- Medicine Pagination Footer --> */}
                  <div className="modal-footer">
                    <button className="mui-btn mui-btn--flat" onClick={this.closeMedicineModal}>Close</button>
                  </div>

                </div>
              </div>

              : <div style={{backgroundColor : '#001529', height: 780}}></div>}



          {/* <!-- Medicine Modal Window --> */}
          {this.state.showRecModal ?

              <div className="medicine-modal" style={{backgroundColor: '#001529'}}>
                <div className="medicine-container">

                  {/* <!-- Medicine Section Metadata --> */}
                  <div className="title-row">
                    <div className="mui--text-display2 all-caps" style={{color: 'white'}}>Report Drug</div>
                  </div>

                  <br/>

                  <form onSubmit={this.onSubmit}>
                    <div className="mui-textfield">
                      <input type="text" required style={{color: 'white'}} onChange={(event) => this.setState({drugName : event.target.value})}/>
                      <label style={{color: 'white'}}>Drug Name</label>
                    </div>
                    <div className="mui-textfield">
                      <input type="text" required style={{color: 'white'}} onChange={(event) => this.setState({drugStoreAddress : event.target.value})}/>
                      <label style={{color: 'white'}}>Drugstore Address</label>
                    </div>
                    <div className="mui-textfield">
                      <input type="file" onChange={this.captureFile} style={{color: 'white'}}/>
                      <label style={{color: 'white'}}>Attachment</label>
                    </div>
                    <button name="submit" type="submit" value="Submit" style={{width : 100, height: 30}}>Submit</button>

                  </form>
                  <div className="info-row" >
                  </div>


                  {/* <!-- Medicine Pagination Footer --> */}
                  <div className="modal-footer" style={{backgroundColor: '#001529'}}>
                    <button className="mui-btn mui-btn--flat"onClick={() => this.setState({showRecModal : false})} style={{color: 'white'}}>Close</button>
                  </div>

                </div>
              </div>

              : null}


        </div>
    )
  }
}

export default App;
