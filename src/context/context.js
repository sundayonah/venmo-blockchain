import { useEffect, useState, createContext } from "react"
import { ethers } from "ethers"
import contractAbi from "../utils/Transactions.json"

export const TransactionContext = createContext()
const { ethereum } = window

const contractAddress = "0x44D9639342223b2C4d502808cD5968eA22F88A6A"

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

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount }}>
            {children}
        </TransactionContext.Provider>
    )
}
