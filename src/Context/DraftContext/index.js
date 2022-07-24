import { createContext } from "react";
import { useState, useEffect } from "react";
import data from '../../data/draft_picks.json'
import dataPlayers from '../../data/players.json'

export const DraftContext = createContext();

export const DraftContextProvider = ({children}) => {
    const NFLseason = 2023;
    const [waitToPick, setWaitToPick] = useState(500)
    const [step, setStep] = useState('order');
    const [draftOrder, setDraftOrder] = useState(data.teams);
    const [myTeams, setMyTeams] = useState([]);

    const [currentPick, setCurrentPick] = useState(1);
    const [picksPlayers, setPicksPlayers] = useState([]);

    const [allPicks, setAllPicks] = useState(null);
    const [futurePicks, setFuturePicks] = useState(null);
    
    const MyPicks = () => {
        const myPicks = [];
        for(let i = 1; i <= 7; i++) {
            allPicks[i].map(pick => {
                if(myTeams.indexOf(pick.current_team_id)!=-1) {
                    myPicks.push(pick.pick)
                }
            })
        }
        return myPicks
    }

    const handleOfferTrade = (otherTeamOffer, otherTeamID, currentTeamOffer, currentTeamID) => {
        let newAllPicks = {...allPicks};
        let newFuturePicks = {...futurePicks};

        [...otherTeamOffer,...currentTeamOffer].map(pick => {
            let thisPick = pick;
            let thisPickIndex = -1;

            thisPick.original_team_id = thisPick.current_team_id;
            thisPick.current_team_id = thisPick.current_team_id == otherTeamID ? currentTeamID : otherTeamID;

            if(pick.season == NFLseason) {
                thisPickIndex = newAllPicks[pick.round].findIndex(item => item == pick);

                newAllPicks[pick.round][thisPickIndex] = thisPick;

            } else {
                thisPickIndex = newFuturePicks[pick.season][pick.round].findIndex(item => item == pick);

                newFuturePicks[pick.season][pick.round][thisPickIndex] = thisPick;
            }
        });
        setAllPicks(prevAllPicks => newAllPicks);
        setFuturePicks(prevFuturePicks => newFuturePicks);
    }

    const getPicks = (order, round, season) => {
        const arr = []
        order.map((team, index) => {
            arr.push({
                round: round,
                pick: (index +1) + (32 * (round - 1)),
                season: season,
                original_team_id: team.id,
                current_team_id: team.id,
                pick_id: index,
            })
        })
        return arr;
    }

    const getFuturePicks = (order, season) => {
        let rounds = {
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
            "7": [],
        }
        order.map((team, index) => {
            for(let i = 1; i<=7; i++) {
                rounds[i].push({
                    round: i,
                    pick: 0,
                    season: season,
                    original_team_id: team.id,
                    current_team_id: team.id,
                    pick_id: index,
                })
            }
        })
        return rounds
    }

    const getValueFromFuturePicks = (round) => {
        let i = {
            "1": { value: 0, count: 0 },
            "2": { value: 0, count: 0 },
            "3": { value: 0, count: 0 },
            "4": { value: 0, count: 0 },
            "5": { value: 0, count: 0 },
            "6": { value: 0, count: 0 },
            "7": { value: 0, count: 0 }
        }

        data.pick_trade_values.map(item => {
            const p = item.pick;
            let r = 0;
            if(p <= 32) {
                r = 1;
            } else if(p <= 32 * 2) {
                r = 2;
            } else if(p <= 32 * 3) {
                r = 3;
            } else if(p <= 32 * 4) {
                r = 4;
            } else if(p <= 32 * 5) {
                r = 5;
            } else if(p <= 32 * 6) {
                r = 6;
            } else {
                r = 7;
            }
            i[r].value += item.chart_value;
            i[r].count++
        })
        return i[round].value / i[round].count
        
    }

    const getPicksFromTeam = (id) => {
        const myPicks = [];
        Object.entries(allPicks).map(item => {
            const picksFromThisRound = item[1].filter(pick => pick.current_team_id == id);

            myPicks.push(...picksFromThisRound)
        })
        Object.entries(futurePicks).map(item => {
            let picksFromThisSeason = []
            for(let i = 1; i<=7; i++) {
                picksFromThisSeason.push(...item[1][i].filter(pick => pick.current_team_id == id))
            }
            myPicks.push(...picksFromThisSeason)
        });

        return myPicks
    }

    const handleDraftOrder = (order, myTeams) => {
        setStep('picks');
        setDraftOrder(order);
        setMyTeams(myTeams);

        const picks = {
            "1": getPicks(order, 1, NFLseason),
            "2": getPicks(order, 2, NFLseason),
            "3": getPicks(order, 3, NFLseason),
            "4": getPicks(order, 4, NFLseason),
            "5": getPicks(order, 5, NFLseason),
            "6": getPicks(order, 6, NFLseason),
            "7": getPicks(order, 7, NFLseason),
        }

        const f_picks = {
          "2024": getFuturePicks(order, 2024),
          "2025": getFuturePicks(order, 2025),
        }

        setAllPicks(picks);
        setFuturePicks(f_picks);

      }

    const handleDraftPlayer = (player) => {
        setCurrentPick(prevPick => prevPick + 1);
        setPicksPlayers(prevPicks => prevPicks ? ([...prevPicks,player.id]) : ([player.id]));
    }

    const handleNextPick = () => {
        if(currentPick > draftOrder.length) return

        setCurrentPick(prevPick => prevPick + 1);

        if(picksPlayers.length <= 0) {
            setPicksPlayers([dataPlayers.players[0].id])
        } else {
            const playersAvaliable = dataPlayers.players.filter(item => picksPlayers.indexOf(item.id)==-1);

            setPicksPlayers(prevPicks => ([...prevPicks,playersAvaliable[0].id]));
        }
    }

    const handleMyNextPick = () => {
        if(currentPick >= draftOrder.length) return

        const MyNextPick = allPicks[1].find(item => myTeams.indexOf(item.current_team_id) != -1 && item.pick > currentPick);
        let i = currentPick;
        let newPlayers = [];

        const loop = (loopUntil) => {        
            i++;

            if(i <= loopUntil) {
                setCurrentPick(i);

                const playersAvaliable = dataPlayers.players.filter(item => picksPlayers.indexOf(item.id)==-1 && newPlayers.indexOf(item.id) == -1);

                setPicksPlayers(prevPicks => ([...prevPicks, playersAvaliable[0].id ]));
                newPlayers.push(playersAvaliable[0].id);

                document.querySelector(`.pick-${ i > 1 ?i - 1 : 1}`).scrollIntoView({
                    behavior: 'smooth'
                });

                setTimeout(() => loop(loopUntil), waitToPick);
            } else {
                if(!MyNextPick) return 

                document.querySelector(`.pick-${loopUntil > 32 ? 32 : loopUntil}`).scrollIntoView({
                    behavior: 'smooth'
                });
                setCurrentPick(loopUntil);
            }

        }

        if(MyNextPick) {
            loop(MyNextPick.pick);
        }
        else if(!MyNextPick) {
            loop(33);
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
            NFLseason,
            handleDraftOrder,
            handleDraftPlayer,
            handleNextPick,
            handleMyNextPick,
            handleOfferTrade,
            getPicksFromTeam,
            getValueFromFuturePicks
            }}>
            {children}
        </DraftContext.Provider>
     );
}