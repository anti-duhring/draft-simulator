import { useState, useEffect, useContext } from "react"
import styled, { css } from "styled-components"
import Button from "../../Button"
import {DraftContext} from '../../../Context/DraftContext'
import {useNavigate} from 'react-router-dom'
import { BORDER_GRAY, DARK_BLACK, GRAY, ORANGE } from "../../../constants/Colors"
import { isMobile } from "react-device-detect"

const FormFooter = (props) => {
  let navigate = useNavigate();
  const { 
    handleDraftOrder,
    myTeams,
    draftOrder
  } = useContext(DraftContext);
  const [rounds, setRounds] = useState(1)

  const startDraft = () => {
    handleDraftOrder(draftOrder, myTeams, {rounds: rounds});
    navigate('/draft')
  }

    return (
      <Wrapper>
        <Rounds>
          <RoundsLegend>
            Rounds
          </RoundsLegend>
          <RoundsInputWrapper>
            <RoundsInput
              onClick={() => setRounds(1)}
              isActive={rounds==1}
            >1</RoundsInput>
            <RoundsInput
              onClick={() => setRounds(2)}
              isActive={rounds==2}
            >2</RoundsInput>
          </RoundsInputWrapper>
        </Rounds>
        <Container>
        <LegendFooter>
          Clique no
          <SVG viewBox="0 0 20 20" className='svg-drag-handler' width="20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
          </SVG>
          para arrastar
        </LegendFooter>
        <Button onClick={startDraft} disabled={myTeams.length > 0 ? false : true}>Começar Draft</Button>
      </Container>
      </Wrapper>
    )
}

export default FormFooter

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const Container = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-right: 10px;
    padding-left: 10px;
`

const LegendFooter = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    font-size: .75rem;
    color: ${GRAY};
`
const SVG = styled.svg`
    margin: 5px;
`
const Rounds = styled.div`
  display: flex;
  flex-direction: row;
  padding-right: 10px;
  padding-left: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: .5rem;
  height: 3rem;
`
const RoundsLegend = styled.div`
  flex: 1;
  text-align: left;
  //font-size: .75rem;
  //color: ${GRAY};
  font-weight: bold;
`
const RoundsInputWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`
const RoundsInput = styled.div((props) => css`
  background-color: ${props.isActive ? DARK_BLACK : 'white'};
  color: ${props.isActive ? 'white' : GRAY};
  padding: .3rem .7rem .3rem .7rem;
  margin-left: .7rem;
  border: none;
  border-radius: 5px;
  //line-height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: .2s;
  &:hover {
    background-color: ${props.isActive ? DARK_BLACK : !isMobile? BORDER_GRAY : DARK_BLACK};
  }
`)