import { useEffect, useState, createContext } from "react"
import { ethers } from "ethers"

export const TransactionContext = createContext()

const { ethereum } = window
export const TransactioProvider = ({ children }) => {
    const [currentAccount, setCurrentAccoount] = useState()

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
