import {useContext} from 'react'
import styled, {css} from "styled-components"
import Button from "../../Button";
import { IconContext } from "react-icons";
import { GoChevronRight, GoChevronDown, GoSync } from 'react-icons/go'
import { DraftContext } from '../../../Context/DraftContext'

const DraftMenu = (props) => {
    const {
        MyPicks,
        currentPick,
        handleNextPick,
        handleMyNextPick
    } = useContext(DraftContext);

    return (
        <Container>
            <IconContext.Provider value={{color: 'white',size:'2rem',style: { verticalAlign: 'middle' }}}>
            <Button 
                disabled={MyPicks().indexOf(currentPick)!= -1} 
                onClick={() => {
                    props.setTabToShow('pick')
                    handleNextPick();
                }} 
                style={styleButton}
            >
                <GoChevronRight />
            </Button>
            <Button 
                disabled={MyPicks().indexOf(currentPick)!= -1} 
                onClick={() => {
                    props.setTabToShow('pick')
                    handleMyNextPick();
                }} 
                style={styleButton}
            >
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
    alignItems: 'center',
}