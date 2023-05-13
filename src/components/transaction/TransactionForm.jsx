import { CurrencyDollarIcon, SwitchVerticalIcon } from "@heroicons/react/outline"
import styles from "../../styles/Transaction.module.css"

function TransactionForm() {
    return (
        <div className={styles.container}>
            <h3 className={styles.formTitle}>Send Payment / Request</h3>
            <form>
                <div className={styles.formContainer}>
                    <div className={styles.swapContainer}>
                        <SwitchVerticalIcon className={styles.swapIcon} />
                        <p className={styles.swapText}>Swap to/from</p>
                    </div>
                    <div className={styles.formBody}>
                        <div className={styles.formInputContainer}>
                            <h4 className={styles.formInputTitle}>To</h4>
                            <input className={styles.formInput} type="text" autoComplete={false} />
                        </div>
                        <div className={styles.formInputContainer}>
                            <h4 className={styles.formInputTitle}>Message</h4>
                            <input className={styles.formInput} type="text" autoComplete={false} />
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
                                        autoComplete={false}
                                    />
                                </div>
                            </div>
                            <button className={styles.sendButton} type="submit">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default TransactionForm
