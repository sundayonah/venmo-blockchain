import { useEffect, useState, createContext } from "react"
import { ethers } from "ethers"
import { contractAbi, contractAddress } from "../utils/Transactions.json"

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
    const [transactionCount, setTransactionCount] = useState(
        localStorage.getItem("transactioCount")
    )

    useEffect(() => {
        checkIfWalletIsConnected()
        checkIfTransactionExists()
    }, [])

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

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount }}>
            {children}
        </TransactionContext.Provider>
    )
}
