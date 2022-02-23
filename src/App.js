import { useEffect, useLayoutEffect, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    Checkbox,
    InputNumber

}                                               from 'antd';
import {
    UserOutlined,
    EyeTwoTone,
    EyeInvisibleOutlined,
    MailFilled,
    EditFilled,
    PhoneFilled,
    CheckCircleOutlined,
    CloseCircleOutlined,
}                                               from '@ant-design/icons';
import 'antd/dist/antd.css';
import './App.css';
import contract                                 from './contracts/NFTCollectible.json';
import { ethers }                               from 'ethers';

const contractAddress = "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097";
const abi             = contract.abi;
const provider        = new ethers.providers.Web3Provider(window.ethereum, "any");
const ved             = {
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
    const [ currentAccount, setCurrentAccount ] = useState(null);
    const [ paymentInfo, setPaymentInfo ]       = useState({});
    const [ balanceETH, setBalanceETH ]         = useState('');
    const [ balanceVED, setBalanceVED ]         = useState('');
    const [ myAddress, setMyAddress ]           = useState('');
    const [ visiable, setVisible ]              = useState(false);
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    console.log(34343, isModalVisible);
    const [ form ]                 = Form.useForm();
    const transitionData           = [ paymentInfo.nonce, paymentInfo.from, paymentInfo.chainId ]
    const [ nonce, from, chainId ] = transitionData;

    async function getVEDBalance() {
        await provider.send("eth_requestAccounts", []);
        const signer      = provider.getSigner();
        let userAddress   = await signer.getAddress();
        const vedContract = new ethers.Contract(ved.address, ved.abi, signer);
        let vedBalance    = await vedContract.balanceOf(userAddress);
        vedBalance        = ethers.utils.formatUnits(vedBalance, 1);
        setBalanceVED(vedBalance)
        console.log('vedBalance', vedBalance);
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


    const tokenAddress  = '0xd00981105e61274c8a5cd5a88fe7e037d935b513';
    const tokenSymbol   = 'TUT';
    const tokenDecimals = 18;
    const tokenImage    = 'http://placekitten.com/200/300';

    useLayoutEffect(() => {
        const fetchInitialData = async () => {
            // Crete Provider
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                ethereum.request({ method: 'eth_requestAccounts' }).then(res => setMyAddress(res))

                // Get Balance of Wallet
                const initialBalance = await provider.getBalance('0x0161d8F7FFcb0f50c3bD24707ddEE7c57A5c6758')
                const formatBalance  = ethers.utils.formatEther(initialBalance)
                setBalanceETH(formatBalance)
                console.log('balance', balanceETH);
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
    }, [ balanceETH ]);

    const checkWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            setTimeout(function () {
                alert("Bạn chưa cài đặt ví Metamask!");
            }, 1000);
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
                const signer   = provider.getSigner();
                const block    = await provider.getBlockNumber()
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
                setBalanceETH(formatBalance)
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
            <button onClick={ connectWalletHandler } className='cta-button connect-wallet-button'>
                Connect Wallet
            </button>
        )
    }
    const mintNftButton       = () => {
        return (
            <div>
                <button className='main-mint-btn '
                        onClick={ () => {
                            mintNftHandler();
                        } }>
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

            {/* MAIN BANNER */ }
            <div className="main-card-wrapper" style={ { backgroundImage: `url(${ mainBgImage })` } }>
                <div className="main-card__inner-wrapper">
                    <h1 className="header-txt" style={ { color: '#170426' } }>Vinfast Smart Contract</h1>

                    <h2>
                        <div>
                            { myAddress ? mintNftButton() : connectWalletButton() }
                        </div>
                        <>
                            {
                                nonce && from && chainId !== undefined ?
                                    <div className={ '' }>
                                        { `Nonce:${ nonce }  From:${ from }  ChainId:${ chainId }` }

                                    </div>
                                    : ''
                            }
                        </>
                        <div>
                            { `Balance ETH: ${ balanceETH }` }
                        </div>
                        <div>
                            { `Balance VED: ${ balanceVED }` }
                        </div>
                        <div>
                            { `Wallet Address: ${ myAddress }` }
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
                                { myAddress ? mintNftButton() : connectWalletButton() }
                            </div>
                        </div>
                    </div>
                )) }
            </div>

            <Modal title="Basic Modal" visible={ isModalVisible } onOk={ handleOk } onCancel={ handleCancel }>
                <Form name="nest-messages" onFinish={ '' } validateMessages={ '' }>
                    <Form.Item name={ [ 'user', 'name' ] } label="Name" rules={ [ { required: true } ] }>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={ [ 'user', 'email' ] } label="Email" rules={ [ { type: 'email' } ] }>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={ [ 'user', 'age' ] } label="Age" rules={ [ { type: 'number', min: 0, max: 99 } ] }>
                        <InputNumber/>
                    </Form.Item>
                    <Form.Item name={ [ 'user', 'website' ] } label="Website">
                        <Input/>
                    </Form.Item>
                    <Form.Item name={ [ 'user', 'introduction' ] } label="Introduction">
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item wrapperCol={ { offset: 8 } }>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default App;
