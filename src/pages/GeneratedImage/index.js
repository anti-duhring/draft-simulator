import { useContext, useState, useEffect, useRef } from "react";
import {DraftContext} from '../../Context/DraftContext'
import { drawImageProp } from "../../services/GenerateImage";
import dataPlayers from '../../data/players.json'
import {useAllTeams} from '../../hooks/useAllTeams'
import styled, {css} from "styled-components";
import { isMobile } from "react-device-detect";
import {useNavigate} from 'react-router-dom'

const GeneratedImage = () => {
    const navigate = useNavigate();
    const {
        allPicks,
        picksPlayers
    } = useContext(DraftContext);
    const teams = useAllTeams();
    const canvasRef = useRef();
    const downloadRef = useRef();

    const generateText = (ctx, canvas) => {
        const bodyImageHeight = (ctx.canvas.height - 160);
        const paddingTop = 130;
        const halfTeamsLength = 17;

        allPicks[1].map((pick, index) => {
            const playerPick = dataPlayers.players.find(item => item.id == picksPlayers[index]);
            const team = teams?.find(i => i.id == pick.current_team_id);

            let logo = new Image();
            logo.src = team.nflData.team_logo_espn;
            logo.crossOrigin="anonymous"

            const x = index <=15? 20 : (ctx.canvas.height / 2) + 10;
            const y = index <=15 ? (bodyImageHeight / halfTeamsLength) * (index + 1) + paddingTop : (bodyImageHeight / halfTeamsLength) * (index - 15) + paddingTop;

            ctx.font = 'bold 35px myFont';
            ctx.fillStyle = "#0a0a0a";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3; 
            
            //ctx.strokeText(`#${pick.pick} ${team.nflData.team_abbr} - ${playerPick?.name}`, x, y);

            ctx.fillText(`${playerPick?.name} - ${playerPick?.position}`, x + 100 , y);
            
            logo.addEventListener("load", () => {
                ctx.drawImage(logo, x , y - 50, 80,80);
                downloadRef.current.href = canvas.toDataURL("image/png");
            })
            //ctx.drawImage(, x, y);
            
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
    },[])

    if(!allPicks) {
        return (
            <div>
                Você será redirecionado...
            </div>
        )
    }

    return ( 
        <div>
            <div>
                Clique na imagem para baixar
            </div>
            <div>
                <a ref={downloadRef} href="/" download={true}>
                    <Canvas ref={canvasRef} id="canvas"></Canvas>
                </a>
            </div>
        </div>
     );
}
 
export default GeneratedImage;

const Canvas = styled.canvas`
    width: ${isMobile ? '90vw' : '40vw'};
`