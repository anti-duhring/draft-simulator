import styled from "styled-components";
import {GRAY} from '../../constants/Colors'

const Footer = () => {
    return ( 
        <Container className="footer">
            <Text className="footer--text">
                Desenvolvido por <a href="https://github.com/anti-duhring">Anti-Duhring</a>
            </Text>
        </Container>
     );
}
 
export default Footer;

const Container = styled.div``
const Text = styled.p`
    color: ${GRAY};
    font-size: .8rem;
    
    a {
        text-decoration: none;
        color: black;
        
    }
`