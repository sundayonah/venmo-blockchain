import { useEffect, useState, createContext } from "react"
import { ethers } from "ethers"
import { contractAbi, contractAddress } from "../utils/constants"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"

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
    const [currentAccount, setCurrentAccoount] = useState()
    const [addressTo, setAddressTo] = useState("")
    const [amount, setAmount] = useState(0)
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [balance, setBalance] = useState(null)

    const [transactionCount, setTransactionCount] = useState(
        localStorage.getItem("transactioCount")
    )

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
                console.log(`Succes -- ${transactionHash.hash}`)
                setIsLoading(false)

                const transactioCount = await transactionContract.getTransactionCount()
                setTransactionCount(transactioCount.toNumber())
                window.location.reload()
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
    // const getAccountBalance = async () => {
    //     try {
    //         // Fetch the account balance using the eth_getBalance method
    //         const balance = await ethereum.request({
    //             method: "eth_getBalance",
    //             params: [currentAccount, "latest"],
    //         })

    //         // Convert the balance from Wei to Ether or any other desired format
    //         const formattedBalance = convertWeiToEth(balance)
    //         console.log(formattedBalance)
    //         return formattedBalance
    //     } catch (error) {
    //         console.log("Error fetching account balance:", error)
    //         return null
    //     }
    // }

    // // Function to convert Wei value to Ether
    // const convertWeiToEth = (weiValue) => {
    //     const ethValue = parseFloat(weiValue) / 1e18
    //     return ethValue.toFixed(2)
    // }

    useEffect(() => {
        const getBalance = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const bal = await provider.getBalance(currentAccount)
                const balance = ethers.utils.formatEther(bal, "ether")
                const amountToString = parseFloat(balance.toString())
                const roundAmount = amountToString.toFixed(4)
                setBalance(balance.toString())
                console.log(roundAmount)
            } catch (error) {
                // console.log(error)
            }
        }
        getBalance()
    }, [currentAccount])


    const handleMaxChange = () => {}

    return (
        <TransactionContext.Provider
            value={{
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
            }}
        >
            {children}
        </TransactionContext.Provider>
    )
}
