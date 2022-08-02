import styled from "styled-components"

const FormHeader = ({checkbox,checkAll}) => {
    return (
        <Container>
        <Legend>
            <LegendTitle>Selecione seus times</LegendTitle>
            <LegendSubtitle>Cada time não selecionado terá o draft automatizado</LegendSubtitle>
        </Legend>
        <Checkbox>
          <CheckboxContainer>
          <Label>Todos
            <InputCheckbox type="checkbox" checked={checkbox} onChange={checkAll} />
            <Checkmark className='checkmark'></Checkmark>
          </Label>
          </CheckboxContainer>
        </Checkbox>
      </Container>
    )
}

export default FormHeader

const Legend = styled.div`
  flex:1;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 10px;
`
const LegendTitle = styled.span`
  font-weight: bold;
`

const LegendSubtitle = styled.span`
  font-size: .75rem;
  color: #7b8187;
`

const Container = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
`

const Checkbox = styled.div`
  flex: 1;
  text-align: right;
`

const CheckboxContainer = styled.div`
  margin-right: 10px;
`

const InputCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
  border-radius: 5px;
  &:checked ~ .checkmark {
    background-color: #f65e1b !important;
  }
  &:checked ~ .checkmark::after {
    display: block;
  }
`

const Label = styled.label`
  position: relative;
  padding-right: 35px;
  cursor: pointer;
  &:hover .checkmark{
    background-color: #ccc;
  }
  user-select: none;
  -webkit-touch-callout: none;
`

const Checkmark = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border-radius: 5px;
  &::after {
    content: "";
    position: absolute;
    display: none;
    left: 8px;
    top: 2px;
    width: 9px;
    height: 15px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`
