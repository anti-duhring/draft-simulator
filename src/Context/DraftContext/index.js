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
    const [futurePicks, setFuturePicks] = useState(null);

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
        //const myPicks = allPicks.filter(pick => pick.current_team_id == newValue.value)
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

        const f_picks = {
          "2024": getFuturePicks(order, 2024),
          "2025": getFuturePicks(order, 2025),
        }

        setAllPicks(picks);
        setFuturePicks(f_picks);

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
            handleMyNextPick,
            getPicksFromTeam,
            getValueFromFuturePicks
            }}>
            {children}
        </DraftContext.Provider>
     );
}