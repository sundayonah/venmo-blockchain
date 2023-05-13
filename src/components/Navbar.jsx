import styles from "../styles/Navbar.module.css"
import { ChevronDownIcon } from "@heroicons/react/outline"
import VenmoImg from "../assets/venmo-logo.svg"
import Avatar from "../assets/favicon.png"
import { TransactionContext } from "../context/context.js"
import { useContext } from "react"
import truncateEthAddress from "truncate-eth-address"
const Navbar = () => {
    const { currentAccount, connectWallet } = useContext(TransactionContext)
    return (
        <nav className={styles.navigationContainer}>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <h1>xhunTeq.</h1>
                    {/* <img src={VenmoImg} alt="Venmo Logo" className={styles.logoImage} /> */}
                </div>
                {currentAccount ? (
                    <div className={styles.actionsContainer}>
                        <p>
                            Hello,{" "}
                            <span className={styles.accentColor}>
                                {truncateEthAddress(currentAccount)}
                            </span>
                        </p>
                        <ChevronDownIcon className={styles.arrowDownIcon} />
                        <div className={styles.avatarContainer}>
                            <img src={Avatar} width={30} height={30} alt="Avatar" />
                        </div>
                    </div>
                ) : (
                    <button className={styles.connectBtn} onClick={connectWallet}>
                        Connect Wallet
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Navbar
