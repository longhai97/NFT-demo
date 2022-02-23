import { useEffect, useLayoutEffect, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    Checkbox,
    InputNumber

} from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import axios from 'axios';
import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';
const contractAddress = "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097";
const abi = contract.abi;

function App() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState({});
    const [balance, setBalance] = useState('');
    const [myAddress, setMyAddress] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const transitionData = [paymentInfo.nonce, paymentInfo.from, paymentInfo.chainId]
    const [nonce, from, chainId] = transitionData;
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


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

    useEffect(() => {
        axios({
            method: "get",
            url: "http://192.168.66.125:9999/api/v1.0/user",
        })
            .then(response => {
                console.log(response);
            })
            .catch(Error => {
                console.log(Error)
            });
    }, [])

    const handleSubmit = async (value) => {
        console.log(4444, value.user);
        // store the states in the form data
        try {
            // make axios post request
            const response = await axios({
                method: "post",
                url: "http://192.168.66.125:9999/api/v1.0/user",
                data: {
                    full_name: value.user.full_name,
                    phone: value.user.phone,
                    address: value.user.address,
                    wallet: myAddress.toString()
                },
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.log(error)
        }
    }
    useLayoutEffect(() => {
        const fetchInitialData = async () => {
            // Crete Provider
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                ethereum.request({ method: 'eth_requestAccounts' }).then(res => setMyAddress(res))

                // Get Balance of Wallet
                const initialBalance = await provider.getBalance('0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097')
                const formatBalance = ethers.utils.formatEther(initialBalance)
                setBalance(formatBalance)
                console.log('balance', balance);
            }
            // Get Current Address Wallet
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
            setTimeout(function () { alert("Bạn chưa cài đặt ví Metamask!"); }, 1000);
            return;
        } else {
            window.alert("Wallet exists! We're ready to go!")
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
            alert("Hãy cài ví Metamask!");
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
                setIsModalVisible(true)

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
                console.log('formatBalance', formatBalance);

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
            <div>
                <button className='main-mint-btn '
                    onClick={() => {
                        mintNftHandler();
                    }}>
                    Buy Car
                </button>
            </div>
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

            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} >
                <Form name="nest-messages" onFinish={handleSubmit} >
                    <Form.Item name={['user', 'full_name']} label="Full name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'phone']} label="Phone" rules={[{ required: true }]} >
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'address']} label="Address" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8 }}>
                        <Button type="primary" htmlType="submit">
                            Gửi
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default App;
