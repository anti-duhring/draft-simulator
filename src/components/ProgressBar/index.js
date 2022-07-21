import styled, { css } from "styled-components";
import { BORDER_GRAY } from "../../constants/Colors";

const ProgressBar = (props) => {
    return ( 
        <Container style={props.style} width={props.width} height={props.height}>
            <Progress progress={props.progress}></Progress>
        </Container>
     );
}
 
export default ProgressBar;

const Container = styled.div((props) => css`
    width: ${props.width || 100}px;
    height: ${props.height || 10}px;
    background-color: ${BORDER_GRAY};
    border-radius: 3px;
`)
const Progress = styled.div((props) => css`
    background-color: green;
    height: 100%;
    width: ${props.progress ? props.progress > 100 ? 100 : props.progress : 0}%;
    border-radius: 3px;
`)