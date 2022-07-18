import styled, {css} from "styled-components"
import Button from "../../Button";
import { IconContext } from "react-icons";
import { GoChevronRight, GoChevronDown, GoSync } from 'react-icons/go'

const DraftMenu = (props) => {
    const handleNextPick = () => {
        if(props.currentPick == props.draftOrder.length) return

        props.setCurrentPick(props.currentPick + 1)
    }

    const handleMyNextPick = () => {
        if(props.currentPick >= props.draftOrder.length) return

        const MyNextPick = props.draftOrder.map((team, index) => { 
            if(index + 1 > props.currentPick && props.myTeams.indexOf(team.id) != -1) {
                return index + 1
            }
            return null
        }).filter(team => team != null)[0] || null;

        if(MyNextPick) {
            props.setCurrentPick(MyNextPick);
            
            document.querySelector(`.pick-${MyNextPick}`).scrollIntoView({
                behavior: 'smooth'
              });

        }
        else if(!MyNextPick) {
            props.setCurrentPick(32);
            document.querySelector(`.pick-32`).scrollIntoView({
                behavior: 'smooth'
              });
        }
    }

    return (
        <Container>
            <IconContext.Provider value={{color: 'white',size:'2rem',style: { verticalAlign: 'middle' }}}>
            <Button style={styleButton}>
                <GoSync />
            </Button>
            <Button onClick={props.handleNextPick} style={styleButton}>
                <GoChevronRight />
            </Button>
            <Button onClick={props.handleMyNextPick} style={styleButton}>
                <GoChevronDown />
            </Button>
            </IconContext.Provider>
        </Container>
    )
}

export default DraftMenu;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: .5rem;
`
const styleButton = {
    width:'3rem',
    height:'3rem',
    borderRadius:'3rem',
    padding:0,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
}