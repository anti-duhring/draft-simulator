import {useContext} from 'react'
import styled, {css} from "styled-components"
import Button from "../../Button";
import { IconContext } from "react-icons";
import { GoChevronRight, GoChevronDown, GoSync } from 'react-icons/go'
import { DraftContext } from '../../../context/DraftContext'
import Popover from '../../Popover';

const DraftMenu = (props) => {
    const {
        MyPicks,
        currentPick,
        handleNextPick,
        handleMyNextPick,
        isJumpingTo
    } = useContext(DraftContext);

    return (
        <Container>
            <IconContext.Provider value={{color: 'white',size:'2rem',style: { verticalAlign: 'middle' }}}>
                <Popover id="nextPick" message="Ir para próxima pick" position="left">
                    <Button 
                    disabled={MyPicks().indexOf(currentPick)!= -1 || isJumpingTo} 
                    onClick={() => {
                        handleNextPick();
                    }} 
                    style={styleButton}
                    >
                        <GoChevronRight />
                    </Button>
                </Popover>
                <Popover id="myNextPick" message={MyPicks().find(i => i > currentPick) ? `Pular para pick ${MyPicks().find(i => i > currentPick)}` : `Pular até o final`} position="left">
                    <Button 
                    disabled={MyPicks().indexOf(currentPick)!= -1 || isJumpingTo} 
                    onClick={() => {
                        handleMyNextPick();
                    }} 
                    style={styleButton}
                    >
                        <GoChevronDown />
                    </Button>
                </Popover>
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
    alignItems: 'center',
}