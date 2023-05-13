import styles from "../styles/Navbar.module.css"
import { ChevronDownIcon } from "@heroicons/react/outline"
import VenmoImg from "../assets/venmo-logo.svg"
import Avatar from "../assets/favicon.png"

const Navbar = () => {
    return (
        <nav className={styles.navigationContainer}>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <img src={VenmoImg} alt="Venmo Logo" className={styles.logoImage} />
                </div>
                <div className={styles.actionsContainer}>
                    <p>
                        Hello, <span className={styles.accentColor}>UserAddres!</span>
                    </p>
                    <ChevronDownIcon className={styles.arrowDownIcon} />
                    <div className={styles.avatarContainer}>
                        <img src={Avatar} width={30} height={30} alt="Avater" />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
