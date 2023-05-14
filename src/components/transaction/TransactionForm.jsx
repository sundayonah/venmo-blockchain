import { CurrencyDollarIcon, SwitchVerticalIcon } from "@heroicons/react/outline"
import styles from "../../styles/Transaction.module.css"
import { useContext } from "react"
import { TransactionContext } from "../../context/context"

function TransactionForm() {
    const {
        sendTransaction,
        setAddressTo,
        addressTo,
        setAmount,
        amount,
        message,
        setMessage,
        isLoading,
    } = useContext(TransactionContext)

    // SEND TRANSACTION
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!addressTo || !amount || message) return
        sendTransaction()
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.formTitle}>Send Payment / Request</h3>
            <form onSubmit={handleSubmit}>
                <div className={styles.formContainer}>
                    <div className={styles.swapContainer}>
                        <SwitchVerticalIcon className={styles.swapIcon} />
                        <p className={styles.swapText}>Swap to/from</p>
                    </div>
                    <div className={styles.formBody}>
                        <div className={styles.formInputContainer}>
                            <h4 className={styles.formInputTitle}>To</h4>
                            <input
                                className={styles.formInput}
                                type="text"
                                autoComplete="off"
                                required
                                value={addressTo}
                                onChange={(e) => setAddressTo(e.target.value)}
                            />
                        </div>
                        <div className={styles.formInputContainer}>
                            <h4 className={styles.formInputTitle}>Message</h4>
                            <input
                                className={styles.formInput}
                                type="text"
                                autoComplete="off"
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.formFooter}>
                        <h4 className={styles.footerTitle}>Amount</h4>
                        <div className={styles.footerContainer}>
                            <div className={styles.amountContainer}>
                                <div className={styles.inputContainer}>
                                    <CurrencyDollarIcon className={styles.dollarIcon} />
                                    <input
                                        className={styles.formInput}
                                        type="number"
                                        autoComplete="off"
                                        step="0.001"
                                        required
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                className={styles.maxButton}
                                type="submit"

                                // onClick={sendTransaction}
                            >
                                MAX
                            </button>
                        </div>

                        {isLoading ? (
                            <div className={styles.sendButton}>
                                <div className={styles.spinner}></div>
                                <p className={styles.spinnerText}>Sending...</p>
                            </div>
                        ) : (
                            <button
                                className={styles.sendButton}
                                type="submit"
                                onClick={sendTransaction}
                            >
                                Send
                            </button>
                        )}
                    </div>
                </div>
            </form>
            {/* <div className={styles.container}>hell</div> */}
            {/* //0x01B94D550DC468a56132Fba9F9248e346c5Ba54c */}
        </div>
    )
}

export default TransactionForm
