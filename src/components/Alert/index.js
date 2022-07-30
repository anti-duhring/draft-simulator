import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import {BORDER_GRAY, DARK_BLACK, GRAY} from '../../constants/Colors'
import Button from '../Button'
import { isMobile } from "react-device-detect";

const Alert = (props) => {
    const [active, setActive] = useState(props.alert.active)

    useEffect(() => {
        setActive(props.alert.active);
    },[props.alert]);

    return ( 
        <>
            <Overlay active={active} onClick={() => setActive(false)}></Overlay>
            <Container active={active}>
                <Header>
                    {props.alert.title}
                </Header>
                <Content>
                <Message>
                    {props.alert.message}
                </Message>
                <Footer>
                    <Button onClick={() => setActive(false)} style={{borderRadius:5}}>
                        Entendi
                    </Button>
                </Footer>
                </Content>
            </Container>
        </>
     );
}
 
export default Alert;

const Container = styled.div((props) => css`
    display: ${props.active? 'flex' : 'none' };
    position: fixed;
    left: ${isMobile? '5%' : '35%'};
    top: 35%;
    z-index: 999;
    width: ${isMobile? '90%' : '30%'};
    height: 25%;
    flex-direction: column;
`)
const Overlay = styled.div((props) => css`
    display: ${props.active? 'flex' : 'none' };
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.2);
    z-index: 99;
    cursor: pointer;
`)
const Message = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
`
const Footer = styled.div`
    flex: 1;
    display: flex;
    align-content: flex-end;
    justify-content: flex-end;
    align-items: flex-end;
`
const Header = styled.div`
    background-color: ${DARK_BLACK};
    color: white;
    border-radius: 5px 5px 0 0;
    padding: .3rem;
`
const Content = styled.div`
    flex: 1;
    padding: .5rem;
    display: flex;
    flex-direction: column;
    border: 1px solid ${BORDER_GRAY};
    box-shadow: 0 1px 3px rgb(22 24 26 / 10%), 0 5px 10px -3px rgb(22 24 26 / 5%);
    border-radius: 0 0 5px 5px;
    background-color: white;
`