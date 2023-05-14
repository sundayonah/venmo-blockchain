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
            console.log(currentAccount)
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
                setIsLoading(true)
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
                const availableTransactions = await transactionContract.getAllTransactions()

                const structuredTransactions = availableTransactions.map((transaction) => ({
                    addressTo: transaction.reciever,
                    addressForm: transaction.sender,
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
            }}
        >
            {children}
        </TransactionContext.Provider>
    )
}
