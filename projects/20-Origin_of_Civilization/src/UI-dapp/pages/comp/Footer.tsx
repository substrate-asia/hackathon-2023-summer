import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/Home.module.css';
import { faYoutube, faGithub, faTwitter, faInstagram, faBitcoin, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container } from 'react-bootstrap';


const Footer = () => {

    return(
      <Container fluid className={styles.footerContainer}>
      <div className="copyright">&copy; 2023 Origin of Civilization Team. All Right Reserved.</div>
      <div className={styles.socials}>
          <div>
            <a href="https://www.youtube.com/@OriginofCivilization/featured">
            <FontAwesomeIcon icon={faYoutube} className={styles.socialsicon} spin></FontAwesomeIcon>
            </a>
          </div>
          <span className={styles.span}></span>
  
          <div>
            <a href="https://github.com/differs">
            <FontAwesomeIcon icon={faGithub} className={styles.socialsicon} spin></FontAwesomeIcon>
            </a>
          </div>
          <span className={styles.span}></span>
  
  
          <div>
            <a href="https://twitter.com/Origin_Of_Civil">
            <FontAwesomeIcon icon={faTwitter} className={styles.socialsicon} spin></FontAwesomeIcon>
            </a>
          </div>
          <span className={styles.span}></span>
  
  
          <div>
            <a href="https://t.me/Origin_of_Civilization">
            <FontAwesomeIcon icon={faTelegram} className={styles.socialsicon} spin></FontAwesomeIcon>
            </a>
          </div>
          <span className={styles.span}></span>
  
  
          <div>
            <a href="https://link.civi.ink">
            <FontAwesomeIcon icon={faBitcoin} className={styles.socialsicon} spin></FontAwesomeIcon>
            </a>
          </div>
  
      </div>
    </Container>
  
    )
  }
  

  export default Footer;