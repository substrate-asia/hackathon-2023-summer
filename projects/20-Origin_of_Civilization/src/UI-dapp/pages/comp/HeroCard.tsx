
import styles from '../../styles/Home.module.css';

export const FirstCard = () => {

    return(
      <div className={styles.card}>
        <div className={styles.inCardContainer}>
          <div>
            <h1 className={styles.inCardTitle}>Welcome to </h1>
            <h1 className={styles.inCardTitle}>Origin of Civilization</h1>
            <h1 className={styles.inCardTitle}>Game World</h1>

          </div>

          <div className={styles.inCarddescription}>
            <p>
              A GameFi across multiChain, and Build AAA 3D Games For it.
            </p>
          </div>

          <div className={styles.inCarddescription}>
            <p>
              With a Proven Sustainable Economic Model 
            </p>
          </div>
        </div>
      </div>
    )
}

export default FirstCard;