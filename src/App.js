import { useEffect, useState } from 'react';
import './App.css';
import contract                from './contracts/NFTCollectible.json';
import { ethers }              from 'ethers';

const contractAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const abi             = contract.abi;

function App() {

    const [ currentAccount, setCurrentAccount ] = useState(null);
    const [ paymentInfo, setPaymentInfo ]       = useState({});
    const transitionData                        = [ paymentInfo.nonce, paymentInfo.from, paymentInfo.chainId ]
    const [ nonce, from, chainId ]              = transitionData;

    console.log('paymentInfo', paymentInfo);

    // Main Banner Image
    const mainBgImage = "https://wallpapercave.com/wp/wp8806153.jpg";

    // Apes Image Data
    const apes = [
        { img: 'https://wallpapercave.com/wp/wp8806155.jpg' },
        { img: 'https://wallpapercave.com/wp/wp8806278.jpg' },
        { img: 'https://wallpapercave.com/wp/wp8806155.jpg' },
        { img: 'https://wallpapercave.com/wp/wp8806278.jpg' },
        { img: 'https://wallpapercave.com/wp/wp8806155.jpg' },
        { img: 'https://wallpapercave.com/wp/wp8806278.jpg' },
        { img: 'https://wallpapercave.com/wp/wp8806155.jpg' },
        { img: 'https://wallpapercave.com/wp/wp8806278.jpg' },
        { img: 'https://wallpapercave.com/wp/wp8806155.jpg' },
        { img: 'https://wallpapercave.com/wp/wp8806278.jpg' },
        { img: 'https://wallpapercave.com/wp/wp8806155.jpg' },
        { img: 'https://wallpapercave.com/wp/wp8806278.jpg' },
    ]

    const checkWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have Metamask installed!");
            return;
        } else {
            console.log("Wallet exists! We're ready to go!")
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account: ", account);
            setCurrentAccount(account);
        } else {
            console.log("No authorized account found");
        }
    }

    const connectWalletHandler = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Please install Metamask!");
        }

        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Found an account! Address: ", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (err) {
            console.log(err)
        }
    }

    const mintNftHandler = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider    = new ethers.providers.Web3Provider(ethereum);
                const signer      = provider.getSigner();
                const nftContract = new ethers.Contract(contractAddress, abi, signer);

                console.log("Initialize payment");
                let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("100") });

                setPaymentInfo(nftTxn)

                console.log("Mining... please wait");
                await nftTxn.wait();

                const someThing = await signer.getGasPrice();
                console.log('someThing', someThing);

                console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${ nftTxn.hash }`);

            } else {
                console.log("Ethereum object does not exist");
            }

        } catch (err) {
            console.log(err);
        }
    }

    const connectWalletButton = () => {
        return (
            <button onClick={ connectWalletHandler } className='cta-button connect-wallet-button'>
                Connect Wallet
            </button>
        )
    }

    const mintNftButton = () => {
        return (
            <button onClick={ mintNftHandler } className='main-mint-btn '>
                Buy Car
            </button>
        )
    }

    useEffect(() => {
        checkWalletIsConnected();
    }, [])

    return (
        <div className="App">

            {/* MAIN BANNER */ }
            <div className="main-card-wrapper" style={ { backgroundImage: `url(${ mainBgImage })` } }>
                <div className="main-card__inner-wrapper">
                    <h1 className="header-txt" style={ { color: '#170426' } }>Vinfast Smart Contract</h1>

                    <h2>
                        <div>
                            { currentAccount ? mintNftButton() : connectWalletButton() }
                        </div>
                        <div>
                            {
                                nonce && from && chainId !== undefined ?
                                    <div className={ '' }>
                                        { `Nonce:${ nonce }  From:${ from }  ChainId:${ chainId }` }
                                    </div>
                                    : ''
                            }
                        </div>
                    </h2>

                </div>
            </div>

            {/* CAR LIST */ }
            <div className="cards-wrapper">
                { apes.map((ape, index) => (
                    <div className="cards-item" key={ index }>
                        <div className="img-wrapper">
                            <img src={ ape.img } alt={ `ape_${ index }` }/>
                        </div>
                        <div className="btn-wrapper">
                            <div>
                                { currentAccount ? mintNftButton() : connectWalletButton() }
                            </div>
                        </div>
                    </div>
                )) }
            </div>
        </div>
    )
}

export default App;
