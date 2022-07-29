import { useContext } from "react";
import styled from "styled-components";
import { BORDER_GRAY, GRAY, ORANGE } from "../../../../constants/Colors";
import { DraftContext } from '../../../../Context/DraftContext'
import TradeScreen from '../../TradeScreen'

const ActionScreenDesktop = () => {
    const {
        isMyPick
    } = useContext(DraftContext)

    return ( 
        <Container>
            <Header>{isMyPick() ? 'DRAFTAR JOGADOR' : 'PROPOR TROCA'}</Header>
            <Content>
                <TradeScreen />
            </Content>
        </Container>
     );
}
 
export default ActionScreenDesktop;

const Container = styled.div`
    flex: 1.5;
    width: 40rem;
    height: fit-content;
    position: sticky;
    top: 5px;
`
const Header = styled.div`
    background-color: ${ORANGE};
    border-radius: 5px 5px 0 0;
    color: white;
    width: 100%;
    padding: .2rem 0 .2rem 0;
`
const Content = styled.div`
    border: 1px solid ${BORDER_GRAY};
    box-shadow: 0 1px 3px rgb(22 24 26 / 10%), 0 5px 10px -3px rgb(22 24 26 / 5%);
    border-radius: 0 0 5px 5px;
    height: 95vh;
    overflow: auto;
    //font-size: .8rem;
`