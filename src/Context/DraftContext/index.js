import { createContext } from "react";
import { useState } from "react";
import data from '../../data/draft_picks.json'
import dataPlayers from '../../data/players.json'

export const DraftContext = createContext();

export const DraftContextProvider = ({children}) => {
    const [step, setStep] = useState('order');
    const [draftOrder, setDraftOrder] = useState(data.teams);
    const [myTeams, setMyTeams] = useState([]);

    const [currentPick, setCurrentPick] = useState(1);
    const [picksPlayers, setPicksPlayers] = useState([]);
    const MyPicks = draftOrder.map((team, index) => { 
        if(myTeams.indexOf(team.id) != -1) {
            return index + 1
        }
        return null
    }).filter(team => team != null);

    const [allPicks, setAllPicks] = useState(null);

    const getPicks = (order, round, season) => {
        const arr = []
        order.map((team, index) => {
            arr.push({
                round: round,
                pick: (index +1) + (32 * (round - 1)),
                season: season,
                original_team_id: team.id,
                current_team_id: team.id,
            })
        })
        return arr;
    }

    const handleDraftOrder = (order, myTeams) => {
        //console.log(order, myTeams);
        setStep('picks');
        setDraftOrder(order);
        setMyTeams(myTeams);

        const picks = {
            round1: getPicks(order, 1, 2023),
            round2: getPicks(order, 2, 2023),
            round3: getPicks(order, 3, 2023),
            round4: getPicks(order, 4, 2023),
            round5: getPicks(order, 5, 2023),
            round6: getPicks(order, 6, 2023),
            round7: getPicks(order, 7, 2023),
        }

        setAllPicks(picks)

        console.log(picks);

      }

    const handleDraftPlayer = (player) => {
        setCurrentPick(currentPick + 1);
        setPicksPlayers(prevPicks => prevPicks ? ([...prevPicks,player.id]) : ([player.id]));
    }

    const handleNextPick = () => {
        if(currentPick > draftOrder.length) return

        setCurrentPick(currentPick + 1)

        if(picksPlayers.length <= 0) {
            setPicksPlayers([dataPlayers.players[0].id])
        } else {
            const playersAvaliable = dataPlayers.players.filter(item => picksPlayers.indexOf(item.id)==-1);

            setPicksPlayers(prevPicks => ([...prevPicks,playersAvaliable[0].id]));
        }
    }

    const handleMyNextPick = () => {
        if(currentPick >= draftOrder.length) return

        const MyNextPick = draftOrder.map((team, index) => { 
            if(index + 1 > currentPick && myTeams.indexOf(team.id) != -1) {
                return index + 1
            }
            return null
        }).filter(team => team != null)[0] || null;

        if(MyNextPick) {
            let newPlayers = []
            for(let i=currentPick; i<MyNextPick; i++) {
                const playersAvaliable = dataPlayers.players.filter(item => picksPlayers.indexOf(item.id)==-1 && newPlayers.indexOf(item.id) == -1);

                newPlayers.push(playersAvaliable[0].id)
                
            }
            setPicksPlayers(prevPicks => ([...prevPicks,...newPlayers]));

            document.querySelector(`.pick-${MyNextPick}`).scrollIntoView({
                behavior: 'smooth'
            });
            setCurrentPick(MyNextPick);

        }
        else if(!MyNextPick) {
            let newPlayers = []
            for(let i=currentPick; i<33; i++) {
                const playersAvaliable = dataPlayers.players.filter(item => picksPlayers.indexOf(item.id)==-1 && newPlayers.indexOf(item.id) == -1);

                newPlayers.push(playersAvaliable[0].id)
                
            }
            setPicksPlayers(prevPicks => ([...prevPicks,...newPlayers]));

            document.querySelector(`.pick-32`).scrollIntoView({
                behavior: 'smooth'
            });
            setCurrentPick(33);

        }
    }

    return ( 
        <DraftContext.Provider value={{
            step, 
            setStep, 
            draftOrder,
            setDraftOrder,
            myTeams,
            setMyTeams,
            currentPick,
            setCurrentPick,
            picksPlayers,
            setPicksPlayers,
            MyPicks,
            allPicks,
            setAllPicks,
            handleDraftOrder,
            handleDraftPlayer,
            handleNextPick,
            handleMyNextPick
            }}>
            {children}
        </DraftContext.Provider>
     );
}