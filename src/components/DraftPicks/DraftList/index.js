import styled from "styled-components"

const DraftList = (props) => {

    const PickItem = ({team, pick}) => {
        return (
            <PickItemContainer>
                <Pick>
                    <span className="pick-legend">Pick</span>
                    <span className="pick-number">{pick}</span>
                </Pick>
                <Team>
                    {team.nickname}
                </Team>
            </PickItemContainer>
        )
    }

    return (
        <Container>
            {props.draftOrder &&
                props.draftOrder.map((team, index) => {
                    return (
                        <PickItem key={index} team={team} pick={index+1} />
                    )
                })
            }
        </Container>
    )
}

export default DraftList;

const Container = styled.div`
    
`

const PickItemContainer = styled.div`
    display: flex;
    background-color: #ffded2;
    height: 3rem;
    align-items: center;
`
const Pick = styled.div`
    flex: 1;
`
const Team = styled.div`
    flex: 1;
`