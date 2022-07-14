import styled from "styled-components"

const Button = (props) => {
    return (
        <Btn onClick={props.onClick}>{props.children}</Btn>
    )
}

export default Button

const Btn = styled.button`
    display: inline-block;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-transform: uppercase;
    height: 40px;
    line-height: 40px;
    background: #0a0a0a;
    color: #fff;
    padding: 0 25px;
    max-width: 100%;
    font-size: 10px;
    font-weight: 600;
    border: 0;
    outline: 0;
    position: relative;
    cursor: pointer;
    border-radius: 300px;
    white-space: nowrap;
    -moz-appearance: none;
    -webkit-appearance: none;
    transition: .3s;
    &:hover {
      background-color: #f65e1b;
    }
`