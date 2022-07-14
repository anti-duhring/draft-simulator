import Button from "../../Button"
import styled from "styled-components";
import DraftList from "../DraftList";

const DraftPicksContainer = (props) => {
    const backToDraftOrder = () => {
        props.setStep('order');
    }

    return (
        <Container>
            <DraftList draftOrder={props.draftOrder} />
            <div>
                {props.myTeams.length}
                <Button onClick={backToDraftOrder}>Voltar</Button>
            </div>
        </Container>
    )
}

export default DraftPicksContainer;

const Container = styled.div`
    width: 100%;
`