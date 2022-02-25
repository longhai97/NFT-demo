import { useEffect, useLayoutEffect, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    InputNumber

} from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import axios from 'axios';
import web3 from 'web3';
import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';
const contractAddress = "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097";
const abi = contract.abi;
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const ved = {
    address: "0xc1f334070eB88B8a4985779D3e8F4B2aeA6f38D2",
    abi: [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function gimmeSome() external",
        "function balanceOf(address _owner) public view returns (uint256 balance)",
        "function transfer(address _to, uint256 _value) public returns (bool success)",
    ],
};

function App() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState({});
    const [balanceETH, setBalanceETH] = useState('');
    const [balanceVED, setBalanceVED] = useState('');
    const [myAddress, setMyAddress] = useState('');
    const [customerData, setCustomerData] = useState({});
    const [token, setToken] = useState({})
    const [visiable, setVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const transitionData = [paymentInfo.nonce, paymentInfo.from, paymentInfo.chainId]


    async function getVEDBalance() {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        let userAddress = await signer.getAddress();
        const vedContract = new ethers.Contract(ved.address, ved.abi, signer);
        let vedBalance = await vedContract.balanceOf(userAddress);
        vedBalance = ethers.utils.formatUnits(vedBalance, 1);
        setBalanceVED(vedBalance)
    }

    getVEDBalance();

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
                url: `http://192.168.66.125:9999/api/v1.0/user/${myAddress}`,
            })
                .then(response => {
                    setCustomerData(response.data.data)
                })
                .catch(Error => {
                    console.log(Error)
                });
        }
        getUser()
    }, [myAddress])

    useEffect(() => {
        axios({
            method: "get",
            url: 'http://192.168.66.125:9999/api/v1.0/contract/erc20',
        })
            .then(response => {
                setToken(response.data.data)
            })
            .catch(Error => {
                console.log(Error)
            });
    }, [])

    const handleSubmit = async (value) => {
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
            }).then(response => {
                setTimeout(function () {
                    alert("Nhập thông tin thành công");
                }, 700);
            });
        } catch (error) {
            console.log(error)
        }
    }

    const tokenAddress = token.address;
    const tokenSymbol = token.symbol;
    const tokenDecimals = token.decimals;

    useEffect(() => {
        if (balanceVED === '0.0') {
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
        }
    }, [balanceVED])


    useLayoutEffect(() => {
        const fetchInitialData = async () => {
            // Crete Provider
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                ethereum.request({ method: 'eth_requestAccounts' }).then(res => setMyAddress(res))

                // Get Balance of Wallet
                const initialBalance = await provider.getBalance('0x0161d8F7FFcb0f50c3bD24707ddEE7c57A5c6758')
                const formatBalance = ethers.utils.formatEther(initialBalance)
                setBalanceETH(formatBalance)
                console.log('balance', balanceETH);
            }
            // Get Current Address Wallet
        }
        fetchInitialData()

    }, [balanceETH]);



    const checkWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            setTimeout(function () {
                alert("Bạn chưa cài đặt ví Metamask!");
            }, 1000);
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
                if (!customerData) {
                    setIsModalVisible(true)
                }
                let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.001") });

                setPaymentInfo(nftTxn)

                setTimeout(function () {
                    alert("Đang thanh toán, xin vui lòng đợi ");
                }, 1000);

                await nftTxn.wait();

                const someThing = await signer.getGasPrice();
                console.log('someThing', someThing);

                let balance = await provider.getBalance('0x805e67770511B4BF80c3adf726Ab4E470838fC58')
                console.log('balance', balance);
                let formatBalance = ethers.utils.formatEther(balance)
                setBalanceETH(formatBalance)
                setTimeout(function () {
                    alert("Giao dịch thành công");
                }, 1000);

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
                const address = '0x10C100988038943327D485e1D7e5E1F83EBDD4C0';
                const abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getValue", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }], "name": "setValue", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }];
                const signer = new ethers.VoidSigner(address, provider)
                const contract = new ethers.Contract(address, abi, signer);
                console.log(6666, contract);
                let sendPromise = await contract.getValue();

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
                <button className='main-mint-btn '
                    onClick={() => {
                        mintNftHandler();
                    }}>
                    Mua xe
                </button>
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
                    Mua token
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
                        <div>
                            {buyToken()}
                        </div>
                        <div>
                            {`Balance ETH: ${balanceETH}`}
                        </div>
                        <div>
                            {`Balance VED: ${balanceVED}`}
                        </div>
                        {customerData && customerData.full_name && <div>
                            {`Tên khách hàng: ${customerData.full_name}`}
                        </div>}
                        {customerData && customerData.phone && <div>
                            {`Số điện thoai : ${customerData.phone}`}
                        </div>}
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

            <Modal title="User Information" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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
                    <Form.Item wrapperCol={{ offset: 8, marginRight: '20px' }}>
                        <Button type="primary" htmlType="submit" block>
                            Gửi
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default App;
