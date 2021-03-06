import { useEffect, useLayoutEffect, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Button, Menu, Avatar,
} from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import axios from 'axios';
import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';
import Navbar from "./Nav/Navbar";


const contractAddress = "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097";
const abi = contract.abi;
const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function App() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [transistion, setTransistion] = useState({});
    const [block, setBlock] = useState('');
    const [paymentInfo, setPaymentInfo] = useState('');
    const [balanceETH, setBalanceETH] = useState('');
    const [balanceVED, setBalanceVED] = useState('');
    const [myAddress, setMyAddress] = useState('');
    const [customerData, setCustomerData] = useState({});
    const [token, setToken] = useState({})
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const transitionData = [paymentInfo.nonce, paymentInfo.from, paymentInfo.chainId]
    const [current, setCurrent] = useState('mail');
    const [isRunAddNetwork, setIsRunAddNetwork] = useState(false)
    const [errorCode, setErrorCode] = useState();
    const [addedNetwork, setAddedNetwork] = useState(true);

     const {ethereum} = window
    const networkID = ethereum.networkVersion


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

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

    useEffect(() => {
        const getUser = async () => {
            await axios({
                method: "get",
                url: `${baseUrl}/api/v1.0/user/${myAddress}`,
            })
                .then(response => {
                    setCustomerData(response.data.data)
                    console.log('customerData', customerData)
                })
                .catch(Error => {
                    console.log(Error)
                });
        }
        getUser()
    }, [])

    useEffect(() => {
        axios({
            method: "get",
            url: `${baseUrl}/api/v1.0/contract/erc20`,
        })
            .then(response => {
                console.log('response', response);
                setToken(response.data.data)
            })
            .catch(Error => {
                console.log(Error)
            });
    }, [])

    const handleSubmit = async (value) => {
        // store the states in the form data
        const callBack = () => {
            setIsModalVisible(false)
            mintNftHandler()
        }
        try {
            // make axios post request
            const response = await axios({
                method: "post",
                url: `${baseUrl}/api/v1.0/user`,
                data: {
                    full_name: value.user.full_name,
                    phone: value.user.phone,
                    address: value.user.address,
                    wallet: myAddress.toString()
                },
                headers: { "Content-Type": "application/json" },
            }).then(response => {
                callBack()
            });
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        async function addPolygonTestnetNetwork() {
            const { ethereum } = window;
            try {
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x1f' }],
                });
            } catch (error) {
                console.log('ERROR_LOG', error);
                if (error.code === 4902) {
                    setErrorCode(4902);
                    try {
                        const wasAddedNetWork = await ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0x1F',
                                chainName: "RSK Testnet",
                                nativeCurrency: {
                                    name: "	tRBTC",
                                    symbol: ":tRBTC",
                                    decimals: 18
                                },
                                rpcUrls: ["https://public-node.testnet.rsk.co"],
                                blockExplorerUrls: ["https://explorer.testnet.rsk.co"],
                            }],
                        });
                        setAddedNetwork(wasAddedNetWork)
                    } catch (addError) {
                        console.log('Did not add network');
                    }
                }
            }
            setIsRunAddNetwork(true);
        }

        addPolygonTestnetNetwork()
        console.log('set_IsRun_TRUE', isRunAddNetwork);

    }, []);

    const fetchInitialData = async () => {
        // Crete Provider
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            ethereum.request({ method: 'eth_requestAccounts' }).then(res => setMyAddress(res) || console.log('RESS', res))

            // Get Balance of Wallet
            const initialBalance = await provider.getBalance(`${myAddress[0]}`)
            const formatBalance = ethers.utils.formatEther(initialBalance)
            setBalanceETH(formatBalance)
            console.log('balance', balanceETH);
        }
        // Get Current Address Wallet
    }


    useEffect(() => {
        console.log('isRun_after_useEffect', isRunAddNetwork);
        console.log('errorCode_after_useEffect', errorCode);
        console.log('addedNetWork', addedNetwork);
        if (addedNetwork && networkID && networkID === '31') {
            axios({
                method: "get",
                url: `${baseUrl}/api/v1.0/contract/erc20`,
            })
                .then(response => {
                    console.log('response', response);
                    setToken(response.data.data)

                    async function getVEDBalance() {
                        if (window.ethereum) {
                            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                            const ved = {
                                //change address dynamic ( get address from API )
                                address: response.data.data.address,
                                abi: [
                                    "function name() view returns (string)",
                                    "function symbol() view returns (string)",
                                    "function gimmeSome() external",
                                    "function balanceOf(address _owner) public view returns (uint256 balance)",
                                    "function transfer(address _to, uint256 _value) public returns (bool success)",
                                ],
                            };
                            await provider.send("eth_requestAccounts", []);
                            const signer = provider.getSigner();
                            let userAddress = await signer.getAddress();
                            const vedContract = new ethers.Contract(ved.address, ved.abi, signer);
                            let vedBalance = await vedContract.balanceOf(userAddress);
                            vedBalance = ethers.utils.formatUnits(vedBalance, 1);
                            setBalanceVED(vedBalance)
                            console.log('vedBalance', vedBalance);
                        }
                    }
                    getVEDBalance()
                })
                .catch(Error => {
                    console.log(Error)
                });

            fetchInitialData()
        }

    }, [balanceVED]);

    const formatTransactionValue = (value) => {
        if (value) {
            return ethers.utils.formatEther(value)
        }
    }
    const formatTransactionGas = (gas) => {
        if (gas) {
            return ethers.utils.formatEther(gas)
        }
    }

    const formatType = (type) => {
        if (type === 0) {
            return 'Normal'
        }
    }

    const pushTransactionInfo = async () => {
        try {
            // make axios post request
            const response = await axios({
                method: "post",
                url: `${baseUrl}/api/v1.0/transaction`,
                data: {
                    transaction_id: transistion.hash,
                    address_from: transistion.from,
                    address_to: transistion.to,
                    value: formatTransactionValue(transistion.value._hex),
                    type: formatType(transistion.type),
                    gas: formatTransactionGas(transistion.gasPrice._hex),
                    block: block,
                    wallet: myAddress.toString(),
                    status: 'SUCCESSFUL'
                },
                headers: { "Content-Type": "application/json" },
            }).then(response => {
                setTimeout(function () {
                    alert("Giao d???ch th??nh c??ng");
                }, 700);
            });
        } catch (error) {
            console.log(error)
        }
    }
    const checkWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log('ch??a c?? metamask');
            return;
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
            alert("H??y c??i v?? Metamask!");
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
                setBlock(block)

                console.log('block', block);
                const blockInfo = await provider.getBlock(block)

                const nftContract = new ethers.Contract(contractAddress, abi, signer);
                let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.000001") });
                setPaymentInfo(nftTxn)

                setTimeout(function () {
                    alert("??ang thanh to??n, xin vui l??ng ?????i ");
                }, 1000);

                await nftTxn.wait();

                const someThing = await signer.getGasPrice();
                console.log('someThing', someThing);

                if (nftTxn) {
                    setTransistion(nftTxn)
                }
                await pushTransactionInfo()
            } else {
                console.log("Ethereum object does not exist");
            }

        } catch (err) {
            console.log(err);
        }
    }

    const buyNftToken = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = ethers.providers.getDefaultProvider('https://public-node.testnet.rsk.co');
                const address = '0xdB4e76a6B78424BbF2A4A182803fc534B8750bB4';
                const abi = [
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "tokenAddress",
                                "type": "address"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "constructor"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "spender",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint256",
                                "name": "value",
                                "type": "uint256"
                            }
                        ],
                        "name": "Approval",
                        "type": "event"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": false,
                                "internalType": "address",
                                "name": "buyer",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint256",
                                "name": "amountOfETH",
                                "type": "uint256"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint256",
                                "name": "amountOfTokens",
                                "type": "uint256"
                            }
                        ],
                        "name": "BuyTokens",
                        "type": "event"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "previousOwner",
                                "type": "address"
                            },
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "newOwner",
                                "type": "address"
                            }
                        ],
                        "name": "OwnershipTransferred",
                        "type": "event"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": false,
                                "internalType": "address",
                                "name": "seller",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint256",
                                "name": "amountOfTokens",
                                "type": "uint256"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint256",
                                "name": "amountOfETH",
                                "type": "uint256"
                            }
                        ],
                        "name": "SellTokens",
                        "type": "event"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "from",
                                "type": "address"
                            },
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "to",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint256",
                                "name": "value",
                                "type": "uint256"
                            }
                        ],
                        "name": "Transfer",
                        "type": "event"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "spender",
                                "type": "address"
                            }
                        ],
                        "name": "allowance",
                        "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "spender",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "name": "approve",
                        "outputs": [
                            {
                                "internalType": "bool",
                                "name": "",
                                "type": "bool"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "account",
                                "type": "address"
                            }
                        ],
                        "name": "balanceOf",
                        "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "buyTokens",
                        "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "tokenAmount",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "payable",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "decimals",
                        "outputs": [
                            {
                                "internalType": "uint8",
                                "name": "",
                                "type": "uint8"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "spender",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "subtractedValue",
                                "type": "uint256"
                            }
                        ],
                        "name": "decreaseAllowance",
                        "outputs": [
                            {
                                "internalType": "bool",
                                "name": "",
                                "type": "bool"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "getValue",
                        "outputs": [
                            {
                                "internalType": "string",
                                "name": "",
                                "type": "string"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "spender",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "addedValue",
                                "type": "uint256"
                            }
                        ],
                        "name": "increaseAllowance",
                        "outputs": [
                            {
                                "internalType": "bool",
                                "name": "",
                                "type": "bool"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "name",
                        "outputs": [
                            {
                                "internalType": "string",
                                "name": "",
                                "type": "string"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "owner",
                        "outputs": [
                            {
                                "internalType": "address",
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "renounceOwnership",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "tokenAmountToSell",
                                "type": "uint256"
                            }
                        ],
                        "name": "sellTokens",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "string",
                                "name": "_value",
                                "type": "string"
                            }
                        ],
                        "name": "setValue",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "symbol",
                        "outputs": [
                            {
                                "internalType": "string",
                                "name": "",
                                "type": "string"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "tokensPerEth",
                        "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "totalSupply",
                        "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "to",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "name": "transfer",
                        "outputs": [
                            {
                                "internalType": "bool",
                                "name": "",
                                "type": "bool"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "from",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "to",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "name": "transferFrom",
                        "outputs": [
                            {
                                "internalType": "bool",
                                "name": "",
                                "type": "bool"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "newOwner",
                                "type": "address"
                            }
                        ],
                        "name": "transferOwnership",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "withdraw",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ];
                const signer = new ethers.VoidSigner(address, provider)
                // const signer = provider.getSigner()
                const contract = new ethers.Contract(address, abi, signer);


                // await contract.connect(provider);
                // await contract.connect(signer);
                // await signer.connect(provider);

                console.log(6666, contract);
                const options = { value: ethers.utils.parseEther("1.0") }
                let sendPromise = await contract.buyTokens(options);

                console.log(33331222, sendPromise);
            }

        } catch (e) {
            console.log(e);
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
                {!customerData ?
                    <button className='main-mint-btn '
                        onClick={() => {
                            setIsModalVisible(true)
                        }}>
                        Enter information for Buy Car
                    </button>
                    : <button className='main-mint-btn '
                        onClick={() => {
                            mintNftHandler()
                        }}>
                        Buy car
                    </button>
                }
            </div>
        )
    }

    const buyToken = () => {
        return (
            <div>
                <button className='main-mint-btn '
                    onClick={() => {
                        buyNftToken();
                    }}>
                    Buy Token
                </button>
            </div>
        )
    }

    useEffect(() => {
        checkWalletIsConnected();
    }, [])

    return (
        <div className="App">
            {customerData && (
                <Navbar address={myAddress[0]} fullName={customerData?.full_name} phone={customerData?.phone} />
            )}
            {/* MAIN BANNER */}
            <div className="main-card-wrapper" style={{ backgroundImage: `url(${mainBgImage})` }}>
                <div className="main-card__inner-wrapper">
                    <h1 className="header-txt" style={{ color: '#170426' }}>Vinfast Smart Contract</h1>

                    <h2>
                        <div>
                            {myAddress ? mintNftButton() : connectWalletButton()}
                        </div>
                        <div>
                            {buyToken()}
                        </div>
                        <div>
                            {`Balance ETH: ${balanceETH}`}
                        </div>
                        <div>
                            {`Balance VED: ${balanceVED}`}
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

            <Modal title="User Information" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
                footer={null}>
                <Form name="nest-messages"
                    labelCol={{
                        flex: '100px',
                    }}
                    labelAlign="left"
                    onFinish={handleSubmit}>
                    <Form.Item name={['user', 'full_name']} label="Full name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'phone']} label="Phone" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'address']} label="Address" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item style={{ marginLeft: '75px', marginRight: '75px' }}>
                        <Button type="primary" htmlType="submit" block>
                            G???i
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
