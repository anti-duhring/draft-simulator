import { useState } from "react";
import Button from "../../Button"
import styled from "styled-components";
import DraftList from "../DraftList";
import DraftMenu from "../DraftMenu";
import TradePickScreenMobile from "../TradePickScreen";
import data from '../../../data/players.json'

//console.log(data.players.map(item => item.id));

const DraftPicksContainer = (props) => {
    const [currentPick, setCurrentPick] = useState(1);
    const [picksPlayers, setPicksPlayers] = useState(null)
    const backToDraftOrder = () => {
        props.setStep('order');
    }

    const handleNextPick = () => {
        if(currentPick == props.draftOrder.length) return

        setCurrentPick(currentPick + 1)

        if(!picksPlayers) {
            setPicksPlayers([data.players[0].id])
        } else {
            const playersAvaliable = data.players.filter(item => picksPlayers.indexOf(item.id)==-1);

            setPicksPlayers(prevPicks => ([...prevPicks,playersAvaliable[0].id]));
        }
    }

    const handleMyNextPick = () => {
        if(currentPick >= props.draftOrder.length) return

        const MyNextPick = props.draftOrder.map((team, index) => { 
            if(index + 1 > currentPick && props.myTeams.indexOf(team.id) != -1) {
                return index + 1
            }
            return null
        }).filter(team => team != null)[0] || null;

        if(MyNextPick) {
            let newPlayers = []
            for(let i=currentPick; i<MyNextPick; i++) {
                const playersAvaliable = data.players.filter(item => picksPlayers.indexOf(item.id)==-1 && newPlayers.indexOf(item.id) == -1);

                newPlayers.push(playersAvaliable[0].id)
                
            }
            setPicksPlayers(prevPicks => ([...prevPicks,...newPlayers]));

            setCurrentPick(MyNextPick);
            document.querySelector(`.pick-${MyNextPick}`).scrollIntoView({
                behavior: 'smooth'
            });

        }
        else if(!MyNextPick) {
            let newPlayers = []
            for(let i=currentPick; i<33; i++) {
                const playersAvaliable = data.players.filter(item => picksPlayers.indexOf(item.id)==-1 && newPlayers.indexOf(item.id) == -1);

                newPlayers.push(playersAvaliable[0].id)
                
            }
            setPicksPlayers(prevPicks => ([...prevPicks,...newPlayers]));

            setCurrentPick(33);
            document.querySelector(`.pick-32`).scrollIntoView({
                behavior: 'smooth'
              });
        }
    }

    return (
        <Container>
            <DraftList 
                currentPick={currentPick} 
                setCurrentPick={setCurrentPick} 
                draftOrder={props.draftOrder}
                myTeams={props.myTeams}
                picksPlayers={picksPlayers}
                setPicksPlayers={setPicksPlayers}
            />
            <div className="footer">
                <Button onClick={backToDraftOrder}>Voltar</Button>
                <Button>Finalizar Draft</Button>
            </div>
            <Sticky>
                <DraftMenu 
                    myTeams={props.myTeams} 
                    draftOrder={props.draftOrder} 
                    currentPick={currentPick} 
                    setCurrentPick={setCurrentPick} 
                    handleNextPick={handleNextPick}
                    handleMyNextPick={handleMyNextPick}
                />
            </Sticky>
            <TradePickScreenMobile
                currentPick={currentPick} 
                setCurrentPick={setCurrentPick} 
                draftOrder={props.draftOrder}
                myTeams={props.myTeams} 
                picksPlayers={picksPlayers}
                setPicksPlayers={setPicksPlayers}
            />
        </Container>
    )
}

export default DraftPicksContainer;

const Container = styled.div`
    width: 100%;
    padding-bottom: 4rem;
`
const Sticky = styled.div`
    position: fixed;
    bottom: 3rem;
    right: 1rem;
`