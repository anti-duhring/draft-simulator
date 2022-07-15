import styled, {css} from "styled-components"
import {BORDER_GRAY} from '../../constants/Colors'

const Button = (props) => {
    return (
        <Btn onClick={props.disabled ? null : props.onClick} style={props.style} disabled={props.disabled}>{props.children}</Btn>
    )
}

export default Button

const Btn = styled.button((props) => css`
    display: inline-block;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-transform: uppercase;
    height: 40px;
    line-height: 40px;
    background: ${props.disabled ? BORDER_GRAY : `#0a0a0a` };
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
      background-color: ${props.disabled ? BORDER_GRAY : `#f65e1b` } ;
    }
`)