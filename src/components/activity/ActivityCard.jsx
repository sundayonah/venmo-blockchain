import {
    ChatAltIcon,
    GlobeIcon,
    HeartIcon,
    UserGroupIcon,
    UserIcon,
} from "@heroicons/react/outline"
import styles from "../../styles/Activity.module.css"
import { useContext } from "react"
import { TransactionContext } from "../../context/context"
import truncateEthAddress from "truncate-eth-address"

function ActivityCard() {
    const { transactions, currentAccount } = useContext(TransactionContext)

    const generateRandomAvatar = () => {
        const randomAvatar = Math.floor(Math.random() * 1000)
        return `https://avatars.dicebear.com/api/adventurer/${randomAvatar + currentAccount}.svg`
    }
    return (
        <div className={styles.container}>
            <div className={styles.tabContainer}>
                <p className={styles.tabTitle}>Activity</p>
                <div className={styles.navigationContainer}>
                    <div className={styles.navigationItem} data-current>
                        <GlobeIcon className={styles.navigationIcon} />
                    </div>
                    <div className={styles.navigationItem}>
                        <UserIcon className={styles.navigationIcon} />
                    </div>
                    <div className={styles.navigationItem}>
                        <UserGroupIcon className={styles.navigationIcon} />
                    </div>
                </div>
            </div>
            <div className={styles.feedList}>
                {transactions.map(({ id, addressFrom, timestamp, message, addressTo }, index) => (
                    <div className={styles.feedItem} key={index}>
                        <div className={styles.avatarContainer}>
                            <img
                                className={styles.avatarImage}
                                src={generateRandomAvatar()}
                                alt="randomAvatar"
                            />
                        </div>
                        <div className={styles.feedDetails}>
                            <h3 className={styles.feedAuthor}>
                                from {truncateEthAddress(addressFrom)} to{" "}
                                {truncateEthAddress(addressTo)}
                            </h3>
                            <span className={styles.feedCreatedAt}>
                                {timestamp}
                                <GlobeIcon className={styles.globeIcon} />
                            </span>
                            <p className={styles.feedBody}>{message}</p>
                        </div>
                        <div className={styles.feedCta}>
                            <HeartIcon className={styles.likeIcon} />
                            <ChatAltIcon className={styles.commentIcon} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ActivityCard
