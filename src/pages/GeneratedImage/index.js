import { useContext, useState, useEffect, useRef } from "react";
import {DraftContext} from '../../Context/DraftContext'
import { drawImageProp } from "../../services/GenerateImage";
import dataPlayers from '../../data/players.json'
import {useAllTeams} from '../../hooks/useAllTeams'
import styled, {css} from "styled-components";
import { isMobile } from "react-device-detect";
import {useNavigate} from 'react-router-dom'
import {BORDER_GRAY, GRAY, ORANGE} from '../../constants/Colors'
import { ThreeCircles } from "react-loader-spinner";
import Container from "../../components/GeneratedImage/Container";

const GeneratedImage = () => {
    const navigate = useNavigate();
    const {
        allPicks,
        picksPlayers,
        rounds
    } = useContext(DraftContext);
    const teams = useAllTeams();
    const canvasRef = useRef();
    const downloadRef = useRef();
    const [isLoading, setIsLoading] = useState(true)

    const generateText = (ctx, canvas) => {
        const bodyImageHeight = (ctx.canvas.height - 160);
        const paddingTop = 130;
        const halfTeamsLength = 17;

        allPicks[1].map((pick, index) => {

            const playerPick = dataPlayers.players.find(item => item.id == picksPlayers[index]);
            const team = teams?.find(i => i.id == pick.current_team_id);
            const teamVia = pick.original_team_id != pick.current_team_id ? teams?.find(i => i.id == pick.original_team_id) : null;

            let logo = new Image();
            logo.src = `/${team.nflData.team_abbr}.png`;
            logo.crossOrigin="anonymous"

            const x = index <=15? 20 : (ctx.canvas.height / 2) - 150;
            const y = index <=15 ? (bodyImageHeight / halfTeamsLength) * (index + 1) + paddingTop : (bodyImageHeight / halfTeamsLength) * (index - 15) + paddingTop;

            ctx.font = 'bold 35px myFont';
            ctx.fillStyle = "#0a0a0a";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3; 
            
            //ctx.strokeText(`#${pick.pick} ${team.nflData.team_abbr} - ${playerPick?.name}`, x, y);

            ctx.fillText(`${playerPick?.name} - ${playerPick?.position}`, x + 180 , y);

            ctx.fillStyle = ORANGE; 
            ctx.font = 'bold 45px myFont';
            ctx.fillText(`${pick.pick}`, x + 75 , y + 5);

            if(pick.original_team_id != pick.current_team_id) {
                ctx.font = 'bold 20px arial';
                ctx.fillStyle = GRAY;
                ctx.fillText(`VIA ${teamVia?.nflData.team_abbr}`, x , y - 45);
            }

            logo.addEventListener("load", () => {
                ctx.drawImage(logo, 0, 0, logo.width , logo.height, x + 10 , y - 34, 50, 50);
                downloadRef.current.href = canvas.toDataURL("image/png");
                
            })
            setTimeout(() => setIsLoading(false), 4000)
        })
    }

    const generateImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d'); 
        const myFont = new FontFace('myFont', 'url(/NiveauGroteskBold.otf)');

        myFont.load().then((font) => {
            document.fonts.add(font);

            let img = new Image();
            img.src = '/draft-bg.png';
            img.addEventListener("load", () => {
                const dpr = window.devicePixelRatio;
                canvas.width = img.width;
                canvas.height = img.height;
    
                drawImageProp(ctx, img, 0, 0, ctx.canvas.width, ctx.canvas.height, 0.5, 0.5)
                generateText(ctx, canvas);
                

            });

        });
    }

    useEffect(() => {
        if(!teams) return

        generateImage();
    },[teams]);

    useEffect(() => {
        if(!allPicks){
            navigate('/');
        }
        //console.log(allPicks[1]);
    },[])

    if(!allPicks) {
        return (
            <div>
                Você será redirecionado...
            </div>
        )
    }
    if(!teams) {
        return (
            <div>
                Carregando...
            </div>
        )
    }

    const LoadingComponent = () => {
        return (
            <div>
                <Loading isLoading={isLoading}>
                    <ThreeCircles
                        height="100"
                        width="100"
                        color={ORANGE}
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel="three-circles-rotating"
                        outerCircleColor=""
                        innerCircleColor=""
                        middleCircleColor=""
                    />
                </Loading>
            </div>
        )
    }

    return ( 
        <div>
            <Container 
                title={`Resultado do draft`} 
                isLoading={isLoading}
                allPicks={allPicks}
                rounds={rounds}
                allTeams={teams}
            >
                <div>
                    <a ref={downloadRef} href="/" download={true}>
                        <Canvas isLoading={isLoading} ref={canvasRef} id="canvas"></Canvas>
                    </a>
                </div>
                {isLoading && <LoadingComponent />}
            </Container>
        </div>
     );
}
 
export default GeneratedImage;

const Canvas = styled.canvas((props) => css`
    width: ${isMobile ? '90vw' : '40vw'};
    //filter: drop-shadow(2px 4px 6px black);
    display: ${props.isLoading ? 'none' : 'auto'};
    border: 1px solid ${BORDER_GRAY};
`)
const Loading = styled.div((props) => css`
    display: ${props.isLoading ? 'flex' : 'none'};
    width: ${isMobile ? '90vw' : '40vw'};
    height: 20vh;
    align-content: center;
    justify-content: center;
    align-items: flex-end;
`)