import { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "../../Button"

const FormFooter = (props) => {

    return (
        <Container>
        <LegendFooter>
          Clique no
          <SVG viewBox="0 0 20 20" className='svg-drag-handler' width="20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
          </SVG>
          para arrastar
        </LegendFooter>
        <Button onClick={props.handleSubmit} disabled={props.myTeams.length > 0 ? false : true}>Começar Draft</Button>
      </Container>
    )
}

export default FormFooter

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
    color: #7b8187;
`
const SVG = styled.svg`
    margin: 5px;
`