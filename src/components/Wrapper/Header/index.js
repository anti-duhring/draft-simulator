import styled, { css } from "styled-components";
import './style.css'
import { isMobile } from "react-device-detect";

const Header = () => {
    return (
        <HeaderWrap classNameName="header">
            <Logo src="https://ontheclock.com.br/novo/wp-content/uploads/2019/08/LOGO-ON-THE-CLOCK.png" alt="On The Clock" />
            <Navbar isMobile={isMobile} classNameName="navbar">
            <div className="mobile-toggle-holder">
                        <div className="mobile-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
            <ul>
                <li>
                    <a href="https://ontheclock.com.br/sobre-o-otc/"><span>Sobre o OTC</span></a>
                </li>
                <li>
                    <a href="https://ontheclock.com.br/categoria/podcast/"><span>Podcast</span></a>
                </li>
                <li>
                    <a href="https://ontheclock.com.br/contato/"><span>Contato</span></a>
                </li>
                <li>
                    <a href="https://ontheclock.com.br/assinantes/"><span>Assine!</span></a>
                </li>
                <li>
                    <a href="https://ontheclock.com.br/categoria/assinantes/"><span>Área assinantes</span></a>
                </li>
                <li>
                    <a href="/"><span>Curso de Scouting RB</span></a>
                </li>
                <li>
                    <a href="https://ontheclock.com.br/produto/guia-draft-2022/"><span>Guia Draft 2022 🔥</span></a>
                </li>
                <li>
                    <a href="/"><span>Guias</span></a>
                </li>
                </ul>
            </Navbar>
        </HeaderWrap>
    )
}

export default Header;

const HeaderWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Logo = styled.img`
    max-height: 72px;
    object-fit: contain;
    margin-top:30px;
    margin-bottom: 30px;
`

const Navbar = styled.div((props) => css`
    flex: 1;
    width:70.375rem;
    border-top: 2px solid black;
    border-bottom: 1px solid black;
    display: ${props.isMobile ? 'none' : 'inline-flex'};
    align-items: center;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-bottom: 10px;
`)