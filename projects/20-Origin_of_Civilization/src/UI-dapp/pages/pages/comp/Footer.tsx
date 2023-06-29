import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/Home.module.css';
import { faYoutube, faGithub, faTwitter, faInstagram, faBitcoin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container } from 'react-bootstrap';


const Footer = () => {

    return(
      <Container fluid className={styles.footerContainer}>
      <div className="copyright">&copy; 2023 Origin of Civilization Team. All Right Reserved.</div>
      <div className={styles.socials}>
          <div>
            <a href="https://github.com">
            <FontAwesomeIcon icon={faYoutube} className={styles.socialsicon} spin></FontAwesomeIcon>
            </a>
          </div>
          <span className={styles.span}></span>
  
          <div>
            <a href="https://github.com">
            <FontAwesomeIcon icon={faGithub} className={styles.socialsicon} spin></FontAwesomeIcon>
            </a>
          </div>
          <span className={styles.span}></span>
  
  
          <div>
            <a href="https://github.com">
            <FontAwesomeIcon icon={faTwitter} className={styles.socialsicon}></FontAwesomeIcon>
            </a>
          </div>
          <span className={styles.span}></span>
  
  
          <div>
            <a href="https://github.com">
            <FontAwesomeIcon icon={faInstagram} className={styles.socialsicon}></FontAwesomeIcon>
            </a>
          </div>
          <span className={styles.span}></span>
  
  
          <div>
            <a href="https://github.com">
            <FontAwesomeIcon icon={faBitcoin} className={styles.socialsicon}></FontAwesomeIcon>
            </a>
          </div>
  
      </div>
    </Container>
  
    )
  }
  

  export default Footer;