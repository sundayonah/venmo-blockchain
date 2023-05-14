import { useEffect, useState, createContext } from "react"
import { ethers } from "ethers"
import { contractAbi, contractAddress } from "../utils/constants"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import { Modal, message } from "antd"
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo("en-US")

export const TransactionContext = createContext()
const { ethereum } = window

const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(contractAddress, contractAbi, signer)
    return transactionContract
}

export const TransactioProvider = ({ children }) => {
    //message

    const [currentAccount, setCurrentAccoount] = useState()
    const [addressTo, setAddressTo] = useState("")
    const [amount, setAmount] = useState(0)
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [balance, setBalance] = useState(null)
    const [TransactionStatus, setTransaction] = useState(false)

    const [transactionCount, setTransactionCount] = useState(
        localStorage.getItem("transactioCount")
    )
    // const [messageApi, contextHolder] = message.useMessage()

    
    useEffect(() => {
        checkIfWalletIsConnected()
        checkIfTransactionExists()
    }, [transactionCount])

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) {
                return alert("please Install MetaMask")
            }
            const accounts = await ethereum.request({ method: "eth_requestAccounts" })
            if (accounts.length) {
                setCurrentAccoount(accounts[0])
                getAllTransactions()
            } else {
                console.log("No Accounts Fount")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) {
                return alert("please Install MetaMask")
            }
            const accounts = await ethereum.request({ method: "eth_requestAccounts" })
            setCurrentAccoount(accounts[0])
            window.location.reload()
            console.log(accounts)
            throw new Error("No ethereum Object Found")
        } catch (error) {
            console.log(error)
        }
    }

    const checkIfTransactionExists = async () => {
        try {
            if (ethereum) {
                const transactionContract = createEthereumContract()
                const currentTransactionCount = await transactionContract.getTransactionCount()
                window.localStorage.setItem("transactionCount", currentTransactionCount)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // //success f(x)
    // const success = () => {
    //     messageApi.open({
    //         type: "success",
    //         content: "Transaction Successfull",
    //     })
    // }

    // //error f(x)
    // const error = () => {
    //     messageApi.open({
    //         type: "error",
    //         content: "Transaction not Successfull",
    //     })
    // }

    const sendTransaction = async () => {
        setIsLoading(true)
        try {
            if (ethereum) {
                const transactionContract = createEthereumContract()
                const parseAmount = ethers.utils.parseEther(amount)

                await ethereum.request({
                    method: "eth_sendTransaction",
                    params: [
                        {
                            from: currentAccount,
                            to: addressTo,
                            gas: "0x5208",
                            value: parseAmount._hex,
                        },
                    ],
                })
                const transactionHash = await transactionContract.addBlockchain(
                    addressTo,
                    parseAmount,
                    message
                )
                console.log(`Loading -- ${transactionHash.hash}`)
                await transactionHash.wait()
                // success()
                console.log(`Succes -- ${transactionHash.hash}`)
                setIsLoading(false)
                // error()

                const transactioCount = await transactionContract.getTransactionCount()
                setTransactionCount(transactioCount.toNumber())
                // window.location.reload()
            } else {
                console.log("No ethereum Object")
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Get All Transaction
    const getAllTransactions = async () => {
        try {
            if (ethereum) {
                const transactionContract = createEthereumContract()
                const availableTransactions = await transactionContract.getAllTransaction()

                const structuredTransactions = availableTransactions.map((transaction) => ({
                    addressTo: transaction.reciever,
                    addressFrom: transaction.sender,
                    timestamp: timeAgo.format(
                        new Date(transaction.timestamp.toNumber() * 1000),
                        "mini"
                    ),
                    message: transaction.message,
                    amount: parseInt(transaction.amount._hex) / 10 ** 18,
                }))
                console.log(structuredTransactions)
                setTransactions(structuredTransactions)
            } else {
                console.log("No ethereum Object")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getBalance = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const bal = await provider.getBalance(currentAccount)
            const balance = ethers.utils.formatEther(bal, "ether")
            setBalance(balance)
            setAmount(balance)
        } catch (error) {
            console.log(error)
        }
    }
    const handleMaxChange = (e) => {
        getBalance()
    }

    return (
        <TransactionContext.Provider
            value={{
                handleMaxChange,
                getBalance,
                connectWallet,
                currentAccount,
                sendTransaction,
                setAddressTo,
                addressTo,
                setAmount,
                amount,
                message,
                setMessage,
                transactions,
                isLoading,
                balance,
            }}
        >
            {children}
        </TransactionContext.Provider>
    )
}
