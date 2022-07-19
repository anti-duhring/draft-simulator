import styled, {css} from "styled-components"
import Button from "../../Button";
import { IconContext } from "react-icons";
import { GoChevronRight, GoChevronDown, GoSync } from 'react-icons/go'

const DraftMenu = (props) => {

    return (
        <Container>
            <IconContext.Provider value={{color: 'white',size:'2rem',style: { verticalAlign: 'middle' }}}>
            <Button disabled={props.disabled} onClick={props.handleNextPick} style={styleButton}>
                <GoChevronRight />
            </Button>
            <Button disabled={props.disabled} onClick={props.handleMyNextPick} style={styleButton}>
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