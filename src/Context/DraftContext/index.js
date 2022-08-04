import { createContext } from "react";
import { useState, useEffect } from "react";
import data from '../../data/draft_picks.json'
import dataPlayers from '../../data/players.json'
import { changePicksOwners, changePlayersOwners, getFuturePicks, getPicks, hasToGoToSecondRound, scrollToPick } from "../../services/Draft";

export const DraftContext = createContext();

export const DraftContextProvider = ({children}) => {
    const NFLseason = 2023;
    const [waitToPick, setWaitToPick] = useState(500)
    const [step, setStep] = useState('order');
    const [rounds, setRounds] = useState(1);
    const [totalPicksToDraft, setTotalPicksToDraft] = useState(32 * rounds);
    const [draftOrder, setDraftOrder] = useState(data.teams);
    const [myTeams, setMyTeams] = useState([]);

    const [currentPick, setCurrentPick] = useState(1);
    const [currentRound, setCurrentRound] = useState(1);
    const [picksPlayers, setPicksPlayers] = useState([]);

    const [allPicks, setAllPicks] = useState(null);
    const [futurePicks, setFuturePicks] = useState(null);
    const [tradablePlayers, setTradablePlayers] = useState(null);
    const [tradeHistory, setTradeHistory] = useState([]);

    const [isJumpingTo, setIsJumpingTo] = useState(false)
    
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

    const isMyPick = () => {
        return MyPicks().indexOf(currentPick)!=-1
    }

    const handleOfferTrade = (otherTeamOffer, otherTeamID, currentTeamOffer, currentTeamID, offerValues) => {
        const [newAllPicks, newFuturePicks] = changePicksOwners(
            [...otherTeamOffer.filter(item => !item.player_id),...currentTeamOffer.filter(item => !item.player_id)],
            NFLseason,
            {
                otherTeamID: otherTeamID, 
                currentTeamID: currentTeamID
            },
            {
                newAllPicks: {...allPicks},
                newFuturePicks: {...futurePicks}
            }
        )
        const newTradablePlayers = changePlayersOwners(
            [...otherTeamOffer.filter(item => item.player_id), ...currentTeamOffer.filter(item => item.player_id)],
            {
                otherTeamID: otherTeamID, 
                currentTeamID: currentTeamID
            },
            tradablePlayers
        );
        const tradeResume = {
            id: tradeHistory.length + 1,
            teams_involved: [otherTeamID, currentTeamID],
            assets_received_1: {
                prev_owner: otherTeamID,
                current_owner: currentTeamID,
                assets: [...otherTeamOffer]
            },
            assets_received_2: {
                prev_owner: currentTeamID,
                current_owner: otherTeamID,
                assets: [...currentTeamOffer]
            }
        };

        setAllPicks(newAllPicks);
        setFuturePicks(newFuturePicks);
        setTradablePlayers(newTradablePlayers);
        setTradeHistory(prevHistory => ([...prevHistory,tradeResume]))
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

        //myPicks.sort((a, b) => a.pick - b.pick)

        return myPicks
    }

    const handleDraftOrder = (order, myTeams, config) => {
        setStep('picks');
        setDraftOrder(order);
        setMyTeams(myTeams);
        setRounds(config.rounds);
        setTotalPicksToDraft(32 * config.rounds);

        const picks = {
            "1": getPicks(order, 1, NFLseason),
            "2": getPicks(order, 2, NFLseason),
            "3": getPicks(order, 3, NFLseason),
            "4": getPicks(order, 4, NFLseason),
            "5": getPicks(order, 5, NFLseason),
            "6": getPicks(order, 6, NFLseason),
            "7": getPicks(order, 7, NFLseason),
        }

        const f_picks = {}
        f_picks[NFLseason + 1] =  getFuturePicks(order, NFLseason + 1);
        f_picks[NFLseason + 2] =  getFuturePicks(order, NFLseason + 2);

        setAllPicks(picks);
        setFuturePicks(f_picks);
        setTradablePlayers(data.tradable_players);

      }

    const pickPlayer = (player, _current_pick) => {
        const current_pick = _current_pick || currentPick;
        let newAllPicks = {...allPicks}
        let picksFromRoundOneAndTwo = [...newAllPicks[1], ...newAllPicks[2]]

        picksFromRoundOneAndTwo[current_pick - 1].player_picked = {...player}
        newAllPicks[1] = picksFromRoundOneAndTwo.filter(i => i.round==1)
        newAllPicks[2] = picksFromRoundOneAndTwo.filter(i => i.round==2)
        
        setPicksPlayers(prevPicks => prevPicks ? ([...prevPicks,player.id]) : ([player.id]));
        setAllPicks(newAllPicks);
    }

    const handleDraftPlayer = (player) => {
        hasToGoToSecondRound(currentPick, setCurrentRound, 32)

        setCurrentPick(prevPick => prevPick == totalPicksToDraft ? 0 : prevPick + 1);
        pickPlayer(player)
    }

    const handleNextPick = () => {
        hasToGoToSecondRound(currentPick, setCurrentRound, 32)

        setCurrentPick(prevPick => prevPick == totalPicksToDraft ? 0 : prevPick + 1);

        if(picksPlayers.length <= 0) {
            pickPlayer(dataPlayers.players[0]);

        } else {
            const playersAvaliable = dataPlayers.players.filter(item => picksPlayers.indexOf(item.id)==-1);

            pickPlayer(playersAvaliable[0]);
        }

    }

    const handleMyNextPick = () => {

        const MyNextPick = [...allPicks[1],...allPicks[2]].find(item => myTeams.indexOf(item.current_team_id) != -1 && item.pick > currentPick && item.round <= rounds);
        let i = currentPick - 1;
        let newPlayers = [];
        setIsJumpingTo(true);

        // Loop until MyNextPick or until the last pick
        const loop = (loopUntil) => {        
            i++;
            hasToGoToSecondRound(i, setCurrentRound, 33)

            if(i < loopUntil) {
                setCurrentPick(i);

                const playersAvaliable = dataPlayers.players.filter(item => picksPlayers.indexOf(item.id)==-1 && newPlayers.indexOf(item.id) == -1);
                const playerToDraft = playersAvaliable[0];

                pickPlayer(playerToDraft, i);
                newPlayers.push(playerToDraft.id);

                scrollToPick(i > 1 ? i - 1 : 1)
                setTimeout(() => loop(loopUntil), waitToPick);
                
            } else {
                setIsJumpingTo(false)

                if(!MyNextPick) {
                    setCurrentPick(0);
                    scrollToPick(32)
                    
                } else {
                    setCurrentPick(MyNextPick.pick);
                    scrollToPick(MyNextPick.pick)
                }
            }
            
        }

        if(MyNextPick) {
            loop(MyNextPick.pick);
        }
        else if(!MyNextPick) {
            loop(totalPicksToDraft + 1);
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
            isMyPick,
            allPicks,
            tradeHistory,
            NFLseason,
            tradablePlayers,
            isJumpingTo,
            rounds,
            currentRound,
            setCurrentRound,
            setTradeHistory,
            handleDraftOrder,
            handleDraftPlayer,
            handleNextPick,
            handleMyNextPick,
            handleOfferTrade,
            getPicksFromTeam,
            }}>
            {children}
        </DraftContext.Provider>
     );
}