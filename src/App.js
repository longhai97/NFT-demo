import { useEffect, useLayoutEffect, useState } from 'react';
import './App.css';
import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';
const contractAddress = "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097";
const abi = contract.abi;

function App() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState({});
    const [balance, setBalance] = useState('');
    const [myAddress, setMyAddress] = useState('');
    const transitionData = [paymentInfo.nonce, paymentInfo.from, paymentInfo.chainId]
    const [nonce, from, chainId] = transitionData;

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


    const tokenAddress = '0xd00981105e61274c8a5cd5a88fe7e037d935b513';
    const tokenSymbol = 'TUT';
    const tokenDecimals = 18;
    const tokenImage = 'http://placekitten.com/200/300';

    useLayoutEffect(() => {
        const fetchInitialData = async () => {
            // Crete Provider
            const { ethereum } = window;
            const provider = new ethers.providers.Web3Provider(ethereum);

            // Get Current Address Wallet
            ethereum.request({ method: 'eth_requestAccounts' }).then(res => setMyAddress(res))

            // Get Balance of Wallet
            const initialBalance = await provider.getBalance('0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097')
            const formatBalance = ethers.utils.formatEther(initialBalance)
            setBalance(formatBalance)
            console.log('balance', balance);
        }
        fetchInitialData()
        const autoAddToken = async () => {
            const { ethereum } = window;
            try {
                // wasAdded is a boolean. Like any RPC method, an error may be thrown.
                const wasAdded = await ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20', // Initially only supports ERC20, but eventually more!
                        options: {
                            address: tokenAddress, // The address that the token is at.
                            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                            decimals: tokenDecimals, // The number of decimals in the token
                            image: tokenImage, // A string url of the token logo
                        },
                    },
                });

                if (wasAdded) {
                    console.log('Thanks for your interest!');
                } else {
                    console.log('Your loss!');
                }
            } catch (error) {
                console.log(error);
            }
        }
        autoAddToken()
    }, [balance]);

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
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const block = await provider.getBlockNumber()
                console.log('block', block);

                const nftContract = new ethers.Contract(contractAddress, abi, signer);

                console.log("Initialize payment");
                let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.001") });

                setPaymentInfo(nftTxn)

                console.log("Mining... please wait");
                await nftTxn.wait();

                const someThing = await signer.getGasPrice();
                console.log('someThing', someThing);

                let balance = await provider.getBalance('0x805e67770511B4BF80c3adf726Ab4E470838fC58')
                console.log('balance', balance);
                let formatBalance = ethers.utils.formatEther(balance)
                setBalance(formatBalance)
                console.log('formatBalance', formatBalance)

                // console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${ nftTxn.hash }`);

            } else {
                console.log("Ethereum object does not exist");
            }

        } catch (err) {
            console.log(err);
        }
    }

    const connectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
                Connect Wallet
            </button>
        )
    }

    const mintNftButton = () => {
        return (
            <button onClick={mintNftHandler} className='main-mint-btn '>
                Buy Car
            </button>
        )
    }

    useEffect(() => {
        checkWalletIsConnected();
    }, [])

    return (
        <div className="App">

            {/* MAIN BANNER */}
            <div className="main-card-wrapper" style={{ backgroundImage: `url(${mainBgImage})` }}>
                <div className="main-card__inner-wrapper">
                    <h1 className="header-txt" style={{ color: '#170426' }}>Vinfast Smart Contract</h1>

                    <h2>
                        <div>
                            {myAddress ? mintNftButton() : connectWalletButton()}
                        </div>
                        <>
                            {
                                nonce && from && chainId !== undefined ?
                                    <div className={''}>
                                        {`Nonce:${nonce}  From:${from}  ChainId:${chainId}`}

                                    </div>
                                    : ''
                            }
                        </>
                        <div>
                            {`Balance ETH: ${balance}`}
                        </div>
                        <div>
                            {`Wallet Address: ${myAddress}`}
                        </div>
                    </h2>

                </div>
            </div>

            {/* CAR LIST */}
            <div className="cards-wrapper">
                {apes.map((ape, index) => (
                    <div className="cards-item" key={index}>
                        <div className="img-wrapper">
                            <img src={ape.img} alt={`ape_${index}`} />
                        </div>
                        <div className="btn-wrapper">
                            <div>
                                {myAddress ? mintNftButton() : connectWalletButton()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App;
