import { useState } from "react";
import styled from "styled-components";
import { IconContext } from "react-icons/lib";
import { GoChevronUp, GoChevronDown } from 'react-icons/go'

const TradePickScreenMobile = (props) => {
    const [showScreen, setShowScreen] = useState(false);
    const MyPicks = props.draftOrder.map((team, index) => { 
        if(props.myTeams.indexOf(team.id) != -1) {
            return index + 1
        }
        return null
    }).filter(team => team != null);
    const isMyPick = MyPicks.indexOf(props.currentPick)!= -1;

    const toggleShowScreen = () => {
        setShowScreen(showScreen ? false : true);
    }

    return ( 
        <Container>
            <TitleTab onClick={toggleShowScreen}>
                <IconContext.Provider value={{color: 'white',size:'1.5rem',style: { verticalAlign: 'middle' }}}>
                    {isMyPick ? 'Fazer pick' : 'Oferecer troca'} {showScreen ? <GoChevronDown /> : <GoChevronUp />}
                </IconContext.Provider>   
            </TitleTab>
            <ContentTab style={{display:showScreen ? 'flex' : 'none'}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pretium, felis sed commodo pellentesque, felis purus congue justo, in mattis nulla enim nec ante. Nunc volutpat, sapien vel molestie varius, massa ipsum congue nunc, at fermentum libero elit quis metus. Donec cursus scelerisque elit, rhoncus facilisis purus mattis in. Mauris et viverra erat, non condimentum felis. Aliquam venenatis accumsan libero, eu rutrum ex molestie in. Donec tempus, est eget malesuada condimentum, enim odio iaculis ipsum, id accumsan dui tellus a nisl. Nullam vitae augue aliquet, mattis lorem eget, vulputate eros.
            </ContentTab>
        </Container>
     );
}
 
export default TradePickScreenMobile;

const Container = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
`
const TitleTab = styled.div`
    background-color: black;
    height: 2rem;
    color: white;   
    display: flex;
    justify-content: center;
    align-items: center;
`
const ContentTab = styled.div`
    background-color: white;
    height: 90vh;
`