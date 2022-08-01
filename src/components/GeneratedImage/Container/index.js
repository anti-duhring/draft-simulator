import { useContext, useState, useEffect, useRef } from "react";
import {DraftContext} from '../../../Context/DraftContext'
import { drawImageProp } from "../../../services/GenerateImage";
import dataPlayers from '../../../data/players.json'
import {useAllTeams} from '../../../hooks/useAllTeams'
import styled, {css} from "styled-components";
import { isMobile } from "react-device-detect";

const GeneratedImage = () => {
    const {
        allPicks,
        picksPlayers
    } = useContext(DraftContext);
    const teams = useAllTeams();

    const canvasRef = useRef();
    const downloadRef = useRef();

    const generateText = (ctx) => {

        ctx.font = 'bold 40px arial';
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3; 
        
        ctx.strokeText(`MOCK DRAFT DO 1º ROUND`, (ctx.canvas.height / 4), 45);

        ctx.fillText(`MOCK DRAFT DO 1º ROUND`, (ctx.canvas.height / 4) , 45);

        allPicks[1].map((pick, index) => {
            const playerPick = dataPlayers.players.find(item => item.id == picksPlayers[index]);
            const team = teams?.find(i => i.id == pick.current_team_id);
            const x = index <=15? 20 : (ctx.canvas.height / 2) + 10;
            const y = index <=15? (ctx.canvas.height / 17) * (index + 1) + 40 : (ctx.canvas.height / 17) * (index - 15) + 40;

            ctx.font = 'bold 35px arial';
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3; 
            
            ctx.strokeText(`#${pick.pick} ${team.nflData.team_abbr} - ${playerPick?.name}`, x, y);

            ctx.fillText(`#${pick.pick} ${team.nflData.team_abbr} - ${playerPick?.name}`, x , y);
            
        })
    }

    const generateImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d'); 

        let img = new Image();

        img.src = '/otc_bg.jpg';
        img.addEventListener("load", () => {
            const dpr = window.devicePixelRatio;
            canvas.width = img.width;
            canvas.height = img.height;

            //ctx.drawImage(img, 0, 0, img.width,    img.height,0, 0, canvas.width, canvas.height);
            drawImageProp(ctx, img, 0, 0, ctx.canvas.width, ctx.canvas.height, 0.5, 0.5)
            generateText(ctx);
            downloadRef.current.href = canvas.toDataURL("image/jpg");
            /*ctx.font = 'bold 20px arial';
            ctx.fillText('Hello world', 50, 90);*/
        });
    }

    useEffect(() => {
        if(!teams) return

        generateImage();
    },[teams]);

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