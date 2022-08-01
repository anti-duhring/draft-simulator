import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { ORANGE } from "../../constants/Colors";
import ReactTooltip from "react-tooltip";

const Popover = (props) => {
    const position = props.position || 'top';
    const marginOffset = props.marginOffset || 5;
    const widthContent = props.style?.width || 250;
    const heightContent = props.style?.width || 40;

    const modalRef = useRef();

    const [showTooltip, setShowTooltip] = useState(true); //localStorage.getItem(props.id) ? (localStorage.getItem(props.id) === 'true') : true

    const closeTooltip = () => {
        setShowTooltip(false);
    }

    useEffect(() => {
        const storage = 'true'//localStorage.getItem(props.id);

        if(!storage || storage=='true') {
            ReactTooltip.show(document.querySelector(`[data-for=${props.id}]`))
            localStorage.setItem(props.id, 'false');
        }
        //modalRef.current.showTooltip();
        /*setTimeout(() => {
            setShowTooltip(false)
        },5000)*/
    },[])

    return ( 
        <Container>
            {showTooltip && 
                <ReactTooltip 
                    place={position} 
                    clickable={true} 
                    id={props.id} 
                    effect='solid' 
                    backgroundColor={ORANGE} 
                    ref={modalRef}
                    padding={`0px`}
                >
                    <ToolTipContainer>
                        <Message>{props.message}</Message>
                        <OKbutton onClick={() => closeTooltip()}>OK</OKbutton>
                    </ToolTipContainer>
                </ReactTooltip>
            }

            <div data-tip data-for={props.id}>
            {props.children}
            </div>
        </Container>
     );
}
 
export default Popover;

const Container = styled.div`
    position: relative;
`
const OKbutton = styled.div`
    background-color: white;
    color: ${ORANGE};
    width: 2rem;
    height: 1.3rem;
    border-radius: 5px;
`
const Message = styled.div`

`
const ToolTipContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    row-gap: .5rem;
`