import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import '../styles/pokemonArena.css';
import axios from 'axios';
import { damage } from '../engine/damage';
import { usePokedexState } from '../context/PokedexStateContext';
import PreBattleTeamDisplay from '../components/PreBattleTeamDisplay';
import PostBattleTeamDisplay from '../components/PostBattleTeamDisplay';

const getVisualSpriteScale = (heightInMeters) => {
    if (heightInMeters === undefined || heightInMeters === null) return 1.2;
    const numericHeight = Number(heightInMeters);
    if (isNaN(numericHeight)) return 1.2;

    if (numericHeight < 0.5) return 1.0;
    if (numericHeight < 1.0) return 1.2;
    if (numericHeight < 2.0) return 1.4;
    if (numericHeight < 3.0) return 1.6;
    return 1.8;
};

const TYPE_ICON_FOLDER = 'TypeIcons';
const TYPE_ICON_EXTENSION = 'svg';

const formatApiNameToFileNameForIcon = (apiTypeName) => {
    if (!apiTypeName || typeof apiTypeName !== 'string') return '';
    return apiTypeName.charAt(0).toUpperCase() + apiTypeName.slice(1).toLowerCase();
};

const getTypeIconPath = (apiTypeName) => {
    if (!apiTypeName) return null;
    const fileName = formatApiNameToFileNameForIcon(apiTypeName);
    return `${process.env.PUBLIC_URL}/${TYPE_ICON_FOLDER}/${fileName}.${TYPE_ICON_EXTENSION}`;
};

function PokemonArena() {
    const [userTeamRoster, setUserTeamRoster] = useState([]);
    const [botTeamRoster, setBotTeamRoster] = useState([]);
    const [initialUserTeamRoster, setInitialUserTeamRoster] = useState([]);
    const [initialBotTeamRosterForRematch, setInitialBotTeamRosterForRematch] = useState([]);

    const [activeUserIdx, setActiveUserIdx] = useState(0);
    const [activeBotIdx, setActiveBotIdx] = useState(0);
    const [battleLog, setBattleLog] = useState(["Wähle eine Aktion oder starte den Kampf!"]);
    const { allTypes, fullPokemonListFromApi } = usePokedexState();

    const [showTeamOverview, setShowTeamOverview] = useState(true);
    const [isBattleOver, setIsBattleOver] = useState(false);
    const [battleResultText, setBattleResultText] = useState("");

    const [battleStats, setBattleStats] = useState(null);
    const [currentTurn, setCurrentTurn] = useState(1);

    const [teamsLoading, setTeamsLoading] = useState(true);
    const [transitionPhase, setTransitionPhase] = useState('none');
    const battleLogRef = useRef(null);
    const [isTurnProcessing, setIsTurnProcessing] = useState(false);

    useEffect(() => {
        if (battleLogRef.current) {
            battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
        }
    }, [battleLog]);

    const germanToApiTypeMap = useMemo(() => {
        const map = {};
        if (allTypes && Array.isArray(allTypes)) {
            allTypes.forEach(t => {
                map[t.ger_name.toLowerCase()] = t.api_name.toLowerCase();
            });
        }
        return map;
    }, [allTypes]);

    const getPokemonName = useCallback((pokemon) => {
        if (!pokemon) return "Pokémon";
        if (pokemon.isTransformed && pokemon.originalName && pokemon.transformedIntoName) { return `${pokemon.originalName} (${pokemon.transformedIntoName})`; }
        return pokemon.pokemon_ger_name || pokemon.pokemon_api_name || "Pokémon";
    }, []);

    const parsePokemonData = useCallback((pokemonData) => {
        const data = { ...pokemonData };
        data.max_hp = data.hp;
        data.current_hp = data.hp;

        try {
            let movesSource = data.moves;
            if (typeof movesSource === 'string') { movesSource = JSON.parse(movesSource); }
            if (movesSource && Array.isArray(movesSource.moves)) { data.moves_array = movesSource.moves; }
            else if (Array.isArray(movesSource)) { data.moves_array = movesSource; }
            else { data.moves_array = []; }
        } catch (e) { data.moves_array = []; }

        let typeApiArray = [];
        if (Array.isArray(data.typen_api) && data.typen_api.length > 0) {
            typeApiArray = data.typen_api.map(t => t.toLowerCase());
        } else if (Array.isArray(data.typen_ger) && data.typen_ger.length > 0) {
            typeApiArray = data.typen_ger.map(gt => germanToApiTypeMap[gt.toLowerCase()] || 'normal');
        }
        data.processed_typen_api = typeApiArray;
        data.primary_type_api = typeApiArray.length > 0 ? typeApiArray[0] : 'normal';

        if (!data.typen_ger && data.processed_typen_api && allTypes.length > 0) {
            const apiToGerMap = allTypes.reduce((acc, curr) => { acc[curr.api_name.toLowerCase()] = curr.ger_name; return acc; }, {});
            data.typen_ger = data.processed_typen_api.map(apiName => apiToGerMap[apiName] || apiName);
        }

        data.pokedex_sprite_url = `${process.env.PUBLIC_URL}/pokeball_placeholder.png`;
        if (fullPokemonListFromApi && fullPokemonListFromApi.length > 0) {
            const pokedexEntry = fullPokemonListFromApi.find(p => Number(p.pokemon_id) === Number(data.pokemon_id));
            if (pokedexEntry && pokedexEntry.pokemon_front_sprites) {
                data.pokedex_sprite_url = pokedexEntry.pokemon_front_sprites;
            }
        }
        const bstEntry = fullPokemonListFromApi.find(p => Number(p.pokemon_id) === Number(data.pokemon_id));
        data.bst = bstEntry ? bstEntry.pokemon_bst : 0;

        return data;
    }, [allTypes, germanToApiTypeMap, fullPokemonListFromApi]);

    const initializeBattleStats = useCallback((userTeam, botTeam) => {
        const initializeTeamStats = (team) => team.map(p => ({
            pokemonId: p.pokemon_id,
            pokemonName: getPokemonName(p),
            damageDealt: 0,
            damageTaken: 0,
            kills: 0,
            fainted: false,
            faintedBy: null,
            turnsInBattle: 0,
            movesUsed: [],
            bst: p.bst || 0
        }));

        return {
            userTeamStats: initializeTeamStats(userTeam),
            botTeamStats: initializeTeamStats(botTeam),
            turnDetails: [],
            highestSingleDamage: { pokemonName: null, moveName: null, damage: 0, targetName: null },
            teamBst: {
                user: userTeam.reduce((sum, p) => sum + (p.bst || 0), 0),
                bot: botTeam.reduce((sum, p) => sum + (p.bst || 0), 0)
            },
            totalDamageDealt: { user: 0, bot: 0 },
            totalKills: { user: 0, bot: 0 },
            battleStartDate: new Date(),
            battleEndDate: null,
            winner: null
        };
    }, [getPokemonName]);

    const fetchBotTeamAndUpdateState = useCallback(async () => {
        try {
            const botRes = await axios.get('http://localhost:3001/battlemechanic/botteamroster');
            const parsedBotTeam = botRes.data.map(p => parsePokemonData(p));
            setBotTeamRoster(parsedBotTeam);
            setInitialBotTeamRosterForRematch(JSON.parse(JSON.stringify(parsedBotTeam)));
            if (botRes.data.length === 0) {
                setBattleLog(prev => [...prev, "Konnte Gegner-Team nicht laden."]);
            }
            return parsedBotTeam;
        } catch (error) {
             setBattleLog(prev => [...prev, "Fehler beim Laden des Gegner-Teams."]);
             return [];
        }
    }, [parsePokemonData]);

    useEffect(() => {
        async function loadInitialData() {
            if (!fullPokemonListFromApi || fullPokemonListFromApi.length === 0 || !allTypes || allTypes.length === 0) {
                setTeamsLoading(true);
                return;
            }
            setTeamsLoading(true);
            try {
                const userRes = await axios.get('http://localhost:3001/battlemechanic/userteamroster');
                const parsedUserTeam = userRes.data.map(p => parsePokemonData(p));
                setUserTeamRoster(parsedUserTeam);
                setInitialUserTeamRoster(JSON.parse(JSON.stringify(parsedUserTeam)));

                const parsedBotTeam = await fetchBotTeamAndUpdateState();

                if (userRes.data.length === 0) {
                    setBattleLog(prev => [...prev, "Konnte Spieler-Team nicht laden. Bitte stelle im Pokédex ein Team zusammen."]);
                     setShowTeamOverview(false);
                     setIsBattleOver(true);
                     setBattleResultText("Fehler: Kein Spielerteam gefunden!");
                } else if (parsedBotTeam.length > 0 && parsedUserTeam.length > 0) {
                    setBattleStats(initializeBattleStats(parsedUserTeam, parsedBotTeam));
                }

            } catch (error) {
                console.error("Fehler beim initialen Laden der Teams:", error);
                setBattleLog(prev => [...prev, "Fehler beim initialen Laden der Teams."]);
            }
            finally {
                setTeamsLoading(false);
            }
        }
        loadInitialData();
    }, [fullPokemonListFromApi, allTypes, parsePokemonData, fetchBotTeamAndUpdateState, initializeBattleStats]);

    const activeUserPokemon = userTeamRoster[activeUserIdx];
    const activeBotPokemon = botTeamRoster[activeBotIdx];

    const updateBattleStats = useCallback((statsUpdater) => {
        setBattleStats(prevStats => {
            if (!prevStats) return null;
            const newStats = JSON.parse(JSON.stringify(prevStats));
            statsUpdater(newStats);
            return newStats;
        });
    }, []);

    const endBattle = useCallback((resultText, winner) => {
        setBattleResultText(resultText);
        setIsBattleOver(true);
        setTransitionPhase('fadingInPostBattle');
        updateBattleStats(stats => {
            stats.battleEndDate = new Date();
            stats.winner = winner;
        });
    }, [updateBattleStats]);

    const startBattleTransitionLogic = useCallback((logMessage) => {
        setShowTeamOverview(false);
        setIsBattleOver(false);
        setCurrentTurn(1);
        setTransitionPhase('fadingInBattle');

        const firstUser = userTeamRoster.find(p => p.hp > 0);
        const firstBot = botTeamRoster.find(p => p.hp > 0);

        if (firstUser && firstBot) {
             setBattleStats(initializeBattleStats(userTeamRoster, botTeamRoster));
        }

        setBattleLog([logMessage || `Der Kampf zwischen ${getPokemonName(firstUser)} und ${getPokemonName(firstBot)} beginnt!`]);
        setActiveUserIdx(userTeamRoster.findIndex(p => p.hp > 0));
        setActiveBotIdx(botTeamRoster.findIndex(p => p.hp > 0));
        setIsTurnProcessing(false);
        setTimeout(() => {
            setTransitionPhase('none');
        }, 500);
    }, [userTeamRoster, botTeamRoster, getPokemonName, initializeBattleStats]);

    const handleStartBattleFromOverview = () => {
        if (teamsLoading || transitionPhase !== 'none' || userTeamRoster.length === 0 || botTeamRoster.length === 0) return;
        setTransitionPhase('fadingOutTeamOverview');
         setTimeout(() => startBattleTransitionLogic(), 500);
    };

    const handleRemixBotTeamInPreBattle = useCallback(async () => {
        if (!fullPokemonListFromApi || fullPokemonListFromApi.length === 0) {
            setBattleLog(prev => [...prev, "Pokémon-Daten (Kontext) noch nicht bereit für Neumischen."]);
            return;
        }
        setBattleLog(prev => [...prev, "Gegnerisches Team wird neu gemischt..."]);
        setTeamsLoading(true);
        try {
            await axios.delete('http://localhost:3001/battlemechanic/botteamroster');
            await axios.post('http://localhost:3001/battlemechanic/fillbotteamroster');
            const newBotTeam = await fetchBotTeamAndUpdateState();
            if (userTeamRoster.length > 0 && newBotTeam.length > 0) {
                 setBattleStats(initializeBattleStats(userTeamRoster, newBotTeam));
            }
        } catch (error) {
            console.error("Fehler beim Neu-Mischen des Bot-Teams:", error);
        } finally {
            setTeamsLoading(false);
            setActiveBotIdx(0);
            setBattleLog(prev => [...prev, "Gegnerisches Team wurde neu gemischt!"]);
        }
    }, [fullPokemonListFromApi, fetchBotTeamAndUpdateState, userTeamRoster, initializeBattleStats]);

    function transformPokemon(targetPokemon, transformingPokemon) {
        return {
            ...targetPokemon,
            hp: transformingPokemon.hp,
            max_hp: transformingPokemon.max_hp,
            current_hp: transformingPokemon.hp,
            front_sprite: targetPokemon.front_sprite,
            back_sprite: targetPokemon.back_sprite,
            isTransformed: true,
            originalName: transformingPokemon.pokemon_ger_name || transformingPokemon.pokemon_api_name,
            transformedIntoName: targetPokemon.pokemon_ger_name || targetPokemon.pokemon_api_name
        };
    }

    const handleMoveClick = useCallback((move) => {
        if (isTurnProcessing || !activeUserPokemon || activeUserPokemon.hp <= 0 || !activeBotPokemon || activeBotPokemon.hp <= 0 || !move || isBattleOver) return;
        setIsTurnProcessing(true);
        let turnLogEntries = [];
        let userPokeCurrent = { ...activeUserPokemon };
        let botPokeCurrent = { ...activeBotPokemon };
        const moveName = move.ger_name || move.move_name || "eine Attacke";
        let currentTurnLogForStats = { turn: currentTurn, playerActions: [], botActions: [] };

        if (moveName.toLowerCase() === "wandler" || moveName.toLowerCase() === "transform") {
            const transformedUser = transformPokemon(botPokeCurrent, userPokeCurrent);
            setUserTeamRoster(prevUserTeam => prevUserTeam.map((p, idx) => idx === activeUserIdx ? transformedUser : p));
            const transformMsg = `${getPokemonName(transformedUser)} verwandelt sich in ${transformedUser.transformedIntoName}!`;
            turnLogEntries.push(transformMsg);
            currentTurnLogForStats.playerActions.push({ pokemon: getPokemonName(userPokeCurrent), move: moveName, effect: transformMsg });
            userPokeCurrent = transformedUser;
        } else {
            const actionMsg = `${getPokemonName(userPokeCurrent)} setzt ${moveName} ein!`;
            turnLogEntries.push(actionMsg);
            const damageValue = damage(userPokeCurrent, botPokeCurrent, move);
            const newBotHP = Math.max(0, botPokeCurrent.hp - damageValue);
            const damageMsg = `${getPokemonName(botPokeCurrent)} verliert ${damageValue} KP.`;
            turnLogEntries.push(damageMsg);

            currentTurnLogForStats.playerActions.push({ pokemon: getPokemonName(userPokeCurrent), move: moveName, target: getPokemonName(botPokeCurrent), damage: damageValue, log: [actionMsg, damageMsg] });

            updateBattleStats(stats => {
                const userStat = stats.userTeamStats.find(p => p.pokemonId === userPokeCurrent.pokemon_id);
                const botStat = stats.botTeamStats.find(p => p.pokemonId === botPokeCurrent.pokemon_id);
                if (userStat) {
                    userStat.damageDealt += damageValue;
                    userStat.movesUsed.push({ name: moveName, damage: damageValue, target: getPokemonName(botPokeCurrent) });
                    if (damageValue > stats.highestSingleDamage.damage) {
                        stats.highestSingleDamage = { pokemonName: getPokemonName(userPokeCurrent), moveName: moveName, damage: damageValue, targetName: getPokemonName(botPokeCurrent) };
                    }
                }
                if (botStat) botStat.damageTaken += damageValue;
                stats.totalDamageDealt.user += damageValue;
            });

            setBotTeamRoster(prevBotTeam => prevBotTeam.map((pokemon, index) =>
                index === activeBotIdx ? { ...pokemon, hp: newBotHP } : pokemon
            ));
            botPokeCurrent = { ...botTeamRoster.find(p=>p.pokemon_id === botPokeCurrent.pokemon_id), hp: newBotHP } || { ...botPokeCurrent, hp: newBotHP };

            if (newBotHP <= 0) {
                const defeatMsg = `${getPokemonName(botPokeCurrent)} wurde besiegt!`;
                turnLogEntries.push(defeatMsg);
                currentTurnLogForStats.playerActions[currentTurnLogForStats.playerActions.length -1].log.push(defeatMsg);

                updateBattleStats(stats => {
                    const userStat = stats.userTeamStats.find(p => p.pokemonId === userPokeCurrent.pokemon_id);
                    if (userStat) userStat.kills += 1;
                    const botStat = stats.botTeamStats.find(p => p.pokemonId === botPokeCurrent.pokemon_id);
                    if (botStat) {
                         botStat.fainted = true;
                         botStat.faintedBy = getPokemonName(userPokeCurrent);
                    }
                    stats.totalKills.user +=1;
                });
                
                const nextBotRoster = botTeamRoster.map((pokemon, index) => index === activeBotIdx ? { ...pokemon, hp: newBotHP } : pokemon);
                const nextAvailableBotIdx = nextBotRoster.findIndex(p => p.hp > 0);

                if (nextAvailableBotIdx !== -1) {
                    setActiveBotIdx(nextAvailableBotIdx);
                    const switchMsg = `${getPokemonName(nextBotRoster[nextAvailableBotIdx])} kommt in den Kampf!`;
                    turnLogEntries.push(switchMsg);
                    currentTurnLogForStats.playerActions[currentTurnLogForStats.playerActions.length -1].log.push(switchMsg);
                    botPokeCurrent = nextBotRoster[nextAvailableBotIdx];
                } else {
                    const winMsg = `Du hast gewonnen!`;
                    turnLogEntries.push(winMsg);
                    currentTurnLogForStats.playerActions[currentTurnLogForStats.playerActions.length -1].log.push(winMsg);
                    setBattleLog(prev => [...prev, ...turnLogEntries]);
                    updateBattleStats(stats => stats.turnDetails.push(currentTurnLogForStats));
                    endBattle("Du hast gewonnen!", "user");
                    setIsTurnProcessing(false); return;
                }
            }
        }
        
        setTimeout(() => {
            let currentBotState = botTeamRoster.find(p => p.pokemon_id === botPokeCurrent.pokemon_id && p.hp > 0) || botTeamRoster[activeBotIdx];
            let currentUserState = userTeamRoster.find(p=>p.pokemon_id === userPokeCurrent.pokemon_id && p.hp > 0) || userTeamRoster[activeUserIdx];
            
            if (!currentBotState || currentBotState.hp <= 0 || !currentUserState || currentUserState.hp <= 0 || isBattleOver) {
                if (turnLogEntries.length > 0) {
                    setBattleLog(prev => [...prev, ...turnLogEntries]);
                    updateBattleStats(stats => stats.turnDetails.push(currentTurnLogForStats));
                }
                setIsTurnProcessing(false);
                return;
            }
            
            const botMoveOptions = currentBotState.moves_array;
            if (!botMoveOptions || botMoveOptions.length === 0) {
                const noMoveMsg = `${getPokemonName(currentBotState)} hat keine Attacken!`;
                turnLogEntries.push(noMoveMsg);
                currentTurnLogForStats.botActions.push({pokemon: getPokemonName(currentBotState), log: [noMoveMsg]});
                setBattleLog(prev => [...prev, ...turnLogEntries]);
                updateBattleStats(stats => stats.turnDetails.push(currentTurnLogForStats));
                setCurrentTurn(prev => prev + 1);
                setIsTurnProcessing(false); return;
            }
            const botMove = botMoveOptions[Math.floor(Math.random() * botMoveOptions.length)];
            const botMoveName = botMove.ger_name || botMove.move_name || "eine Attacke";

            if (botMoveName.toLowerCase() === "wandler" || botMoveName.toLowerCase() === "transform") {
                if (!currentUserState || currentUserState.hp <= 0) {
                    const cantTransformMsg = `${getPokemonName(currentBotState)} wollte sich verwandeln, aber das Ziel ist nicht mehr kampffähig!`;
                    turnLogEntries.push(cantTransformMsg);
                    currentTurnLogForStats.botActions.push({ pokemon: getPokemonName(currentBotState), move: botMoveName, effect: cantTransformMsg });
                } else {
                    const transformedBot = transformPokemon(currentUserState, currentBotState);
                    setBotTeamRoster(prevBotTeam => prevBotTeam.map((p, idx) => idx === activeBotIdx ? transformedBot : p));
                    const transformMsg = `${getPokemonName(transformedBot)} verwandelt sich in ${transformedBot.transformedIntoName}!`;
                    turnLogEntries.push(transformMsg);
                    currentTurnLogForStats.botActions.push({ pokemon: getPokemonName(currentBotState), move: botMoveName, effect: transformMsg });
                }
            } else {
                const actionMsg = `${getPokemonName(currentBotState)} setzt ${botMoveName} ein!`;
                turnLogEntries.push(actionMsg);
                const damageToUser = damage(currentBotState, currentUserState, botMove);
                const newUserHP = Math.max(0, currentUserState.hp - damageToUser);
                const damageMsg = `${getPokemonName(currentUserState)} verliert ${damageToUser} KP.`;
                turnLogEntries.push(damageMsg);

                currentTurnLogForStats.botActions.push({ pokemon: getPokemonName(currentBotState), move: botMoveName, target: getPokemonName(currentUserState), damage: damageToUser, log: [actionMsg, damageMsg] });

                updateBattleStats(stats => {
                    const botStat = stats.botTeamStats.find(p => p.pokemonId === currentBotState.pokemon_id);
                    const userStat = stats.userTeamStats.find(p => p.pokemonId === currentUserState.pokemon_id);
                    if (botStat) {
                        botStat.damageDealt += damageToUser;
                        botStat.movesUsed.push({ name: botMoveName, damage: damageToUser, target: getPokemonName(currentUserState) });
                         if (damageToUser > stats.highestSingleDamage.damage) {
                            stats.highestSingleDamage = { pokemonName: getPokemonName(currentBotState), moveName: botMoveName, damage: damageToUser, targetName: getPokemonName(currentUserState) };
                        }
                    }
                    if (userStat) userStat.damageTaken += damageToUser;
                    stats.totalDamageDealt.bot += damageToUser;
                });
                
                setUserTeamRoster(prevUserTeam => prevUserTeam.map((pokemon, index) =>
                    index === activeUserIdx ? { ...pokemon, hp: newUserHP } : pokemon
                ));
                const userPokeAfterBot = { ...userTeamRoster.find(p=>p.pokemon_id === currentUserState.pokemon_id), hp: newUserHP } || { ...currentUserState, hp: newUserHP};

                if (newUserHP <= 0) {
                    const defeatMsg = `${getPokemonName(userPokeAfterBot)} wurde besiegt!`;
                    turnLogEntries.push(defeatMsg);
                    currentTurnLogForStats.botActions[currentTurnLogForStats.botActions.length -1].log.push(defeatMsg);

                    updateBattleStats(stats => {
                        const botStat = stats.botTeamStats.find(p => p.pokemonId === currentBotState.pokemon_id);
                        if (botStat) botStat.kills += 1;
                        const userStat = stats.userTeamStats.find(p => p.pokemonId === userPokeAfterBot.pokemon_id);
                        if (userStat) {
                            userStat.fainted = true;
                            userStat.faintedBy = getPokemonName(currentBotState);
                        }
                        stats.totalKills.bot +=1;
                    });

                    const nextUserRoster = userTeamRoster.map((pokemon, index) => index === activeUserIdx ? { ...pokemon, hp: newUserHP } : pokemon);
                    const nextAvailableUserIdx = nextUserRoster.findIndex(p => p.hp > 0);

                    if (nextAvailableUserIdx !== -1) {
                        setActiveUserIdx(nextAvailableUserIdx);
                        const switchMsg = `${getPokemonName(nextUserRoster[nextAvailableUserIdx])} kommt in den Kampf!`;
                        turnLogEntries.push(switchMsg);
                        currentTurnLogForStats.botActions[currentTurnLogForStats.botActions.length -1].log.push(switchMsg);
                    } else {
                        const lossMsg = `Der Bot hat gewonnen!`;
                        turnLogEntries.push(lossMsg);
                        currentTurnLogForStats.botActions[currentTurnLogForStats.botActions.length -1].log.push(lossMsg);
                        setBattleLog(prev => [...prev, ...turnLogEntries]);
                        updateBattleStats(stats => stats.turnDetails.push(currentTurnLogForStats));
                        endBattle("Der Bot hat gewonnen!", "bot");
                        setIsTurnProcessing(false); return;
                    }
                }
            }
            setBattleLog(prev => [...prev, ...turnLogEntries]);
            updateBattleStats(stats => {
                stats.turnDetails.push(currentTurnLogForStats);
                const finalCurrentUserPokemon = userTeamRoster[activeUserIdx];
                const finalCurrentBotPokemon = botTeamRoster[activeBotIdx];

                if (finalCurrentUserPokemon && finalCurrentUserPokemon.hp > 0) {
                    const userStat = stats.userTeamStats.find(p => p.pokemonId === finalCurrentUserPokemon.pokemon_id);
                    if(userStat) userStat.turnsInBattle +=1;
                }
                if (finalCurrentBotPokemon && finalCurrentBotPokemon.hp > 0) {
                    const botStat = stats.botTeamStats.find(p => p.pokemonId === finalCurrentBotPokemon.pokemon_id);
                    if(botStat) botStat.turnsInBattle +=1;
                }
            });
            setCurrentTurn(prev => prev + 1);
            setIsTurnProcessing(false);
        }, 1500);
    }, [isTurnProcessing, activeUserPokemon, activeBotPokemon, isBattleOver, currentTurn, getPokemonName, updateBattleStats, botTeamRoster, userTeamRoster, activeUserIdx, activeBotIdx, endBattle]);

    const handleRematch = useCallback(() => {
        const healedUserTeam = initialUserTeamRoster.map(p => ({ ...p, hp: p.max_hp, isTransformed: false, originalName: null, transformedIntoName: null }));
        const healedBotTeam = initialBotTeamRosterForRematch.map(p => ({ ...p, hp: p.max_hp, isTransformed: false, originalName: null, transformedIntoName: null }));
        setUserTeamRoster(healedUserTeam);
        setBotTeamRoster(healedBotTeam);
        startBattleTransitionLogic("Revanche! Der Kampf beginnt erneut!");
    },[initialUserTeamRoster, initialBotTeamRosterForRematch, startBattleTransitionLogic]);

    const handleNewOpponentAndRestart = useCallback(async () => {
        setTeamsLoading(true);
        const healedUserTeam = initialUserTeamRoster.map(p => ({ ...p, hp: p.max_hp, isTransformed: false, originalName: null, transformedIntoName: null }));
        setUserTeamRoster(healedUserTeam);
        try {
            await axios.delete('http://localhost:3001/battlemechanic/botteamroster');
            await axios.post('http://localhost:3001/battlemechanic/fillbotteamroster');
            await fetchBotTeamAndUpdateState();
        } catch (error) {
            console.error("Fehler beim Erstellen eines neuen Gegner-Teams:", error);
        } finally {
            setTeamsLoading(false);
            startBattleTransitionLogic("Ein neuer Gegner erscheint! Kampf beginnt!");
        }
    }, [initialUserTeamRoster, fetchBotTeamAndUpdateState, startBattleTransitionLogic]);

    const renderHpBar = (pokemon) => {
        if (!pokemon || typeof pokemon.hp !== 'number' || typeof pokemon.max_hp !== 'number' || pokemon.max_hp === 0) {
            return <div className="hp-bar-container"><div className="hp-bar-fill" style={{ width: '0%' }}></div></div>;
        }
        const hpPercentage = (pokemon.hp / pokemon.max_hp) * 100;
        let hpBarColorClass = 'green';
        if (hpPercentage < 50 && hpPercentage >= 20) hpBarColorClass = 'yellow';
        if (hpPercentage < 20) hpBarColorClass = 'red';
        return ( <div className="hp-bar-container"> <div className={`hp-bar-fill ${hpBarColorClass}`} style={{ width: `${hpPercentage}%` }}></div> </div> );
    };

    const renderTeamSlots = (team, currentActiveIdx) => team.slice(0,6).map((pokemon, i) => {
        const isFainted = pokemon && pokemon.hp <= 0;
        const isActive = i === currentActiveIdx;
        let slotStyle = {};
        if (isFainted) slotStyle.opacity = 0.25;
        else if (isActive) slotStyle.opacity = 1;
        else slotStyle.opacity = 0.5;
        const pkmnPrimaryTypeApi = pokemon && pokemon.processed_typen_api && pokemon.processed_typen_api.length > 0 ? pokemon.processed_typen_api[0] : null;
        return (
            <div key={i} className={`team-slot ${isFainted ? 'fainted-slot' : ''}`} title={getPokemonName(pokemon)} style={slotStyle}>
                {pkmnPrimaryTypeApi ? <img src={getTypeIconPath(pkmnPrimaryTypeApi)} alt={pkmnPrimaryTypeApi} className="team-slot-icon" style={{ filter: isFainted ? 'grayscale(100%)' : 'none' }}/> : null}
            </div>
        );
    });

    if (teamsLoading && (showTeamOverview || isBattleOver)) {
        return ( <div className="content-wrap styled-box arena-page-wrapper"> <div className="arena-main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '1.2em' }}> Lade Team-Informationen... </div> </div> );
    }

    const arenaMainContentClasses = `arena-main-content ${ transitionPhase === 'fadingInBattle' ? 'fade-in' : (transitionPhase === 'fadingOutTeamOverview' || transitionPhase === 'fadingOutPostBattleOrTeamOverview') ? 'fade-out-active' : '' }`;
    const preBattleDisplayClasses = `pre-battle-display-container ${ transitionPhase === 'fadingOutTeamOverview' || transitionPhase === 'fadingOutPostBattleOrTeamOverview' ? 'fade-out' : showTeamOverview && !isBattleOver && (transitionPhase === 'fadingInTeamOverview' || transitionPhase === 'none') ? 'fade-in' : '' }`;
    const postBattleDisplayClasses = `post-battle-overview-container-wrapper ${ isBattleOver && (transitionPhase === 'fadingInPostBattle' || transitionPhase === 'none') ? 'fade-in' : transitionPhase === 'fadingOutPostBattleOrTeamOverview' ? 'fade-out-active' : '' }`;

    return (
        <div className="content-wrap styled-box arena-page-wrapper">
            <div className={arenaMainContentClasses} style={{ display: (showTeamOverview || isBattleOver) ? 'none' : 'grid' }}>
                {activeBotPokemon && ( <div className="pokemon-sprite-container opponent-sprite-container"> <img className="sprite-opponent" src={`data:image/gif;base64,${activeBotPokemon.front_sprite}`} alt={getPokemonName(activeBotPokemon)} style={{ transform: `scale(${getVisualSpriteScale(activeBotPokemon.height)})` }} /> </div> )}
                {activeUserPokemon && ( <div className="pokemon-sprite-container player-sprite-container"> <img className="sprite-player" src={`data:image/gif;base64,${activeUserPokemon.back_sprite}`} alt={getPokemonName(activeUserPokemon)} style={{ transform: `scale(${1.5 * getVisualSpriteScale(activeUserPokemon.height)})` }} /> </div> )}
                <div className="battleground">
                    {activeBotPokemon && ( <div className="status-box opponent-status-box"> <div className="team-slots-container">{renderTeamSlots(botTeamRoster, activeBotIdx)}</div> <div className={`name-type-line type-bg-${activeBotPokemon.primary_type_api || 'normal'}`}> <span className="poke-name">{getPokemonName(activeBotPokemon)}</span> <div className="type-icons-display">{activeBotPokemon.processed_typen_api?.map(typeApi => ( <img key={typeApi} src={getTypeIconPath(typeApi)} alt={typeApi} className="status-type-icon" /> ))}</div> </div> <div className="hp-bar-area">{renderHpBar(activeBotPokemon)}</div> <div className="hp-numeric-area"><div className="hp-numeric">{`${activeBotPokemon.hp || 0}/${activeBotPokemon.max_hp || 0}`}</div></div> </div> )}
                    {activeUserPokemon && ( <div className="status-box player-status-box"> <div className="team-slots-container">{renderTeamSlots(userTeamRoster, activeUserIdx)}</div> <div className={`name-type-line type-bg-${activeUserPokemon.primary_type_api || 'normal'}`}> <span className="poke-name">{getPokemonName(activeUserPokemon)}</span> <div className="type-icons-display">{activeUserPokemon.processed_typen_api?.map(typeApi => ( <img key={typeApi} src={getTypeIconPath(typeApi)} alt={typeApi} className="status-type-icon" /> ))}</div> </div> <div className="hp-bar-area">{renderHpBar(activeUserPokemon)}</div> <div className="hp-numeric-area"><div className="hp-numeric">{`${activeUserPokemon.hp || 0}/${activeUserPokemon.max_hp || 0}`}</div></div> </div> )}
                </div>
                <div className="battle-ui-bar">
                    <div className="battle-textbox" ref={battleLogRef}>{battleLog.map((entry, index) => ( <p key={index}>{entry}</p> ))}</div>
                    <div className="battle-action-menu">
                        <div className="move-buttons">
                            {activeUserPokemon?.moves_array?.slice(0, 4).map((move, idx) => {
                                const moveTypeApiName = move.dmg_typ ? move.dmg_typ.toLowerCase() : 'normal';
                                const typeIconSrc = getTypeIconPath(moveTypeApiName);
                                const moveNameDisplay = move.ger_name || move.move_name || `Attacke ${idx + 1}`;
                                return ( <button key={idx} className={`move-btn type-bg-${moveTypeApiName}`} onClick={() => handleMoveClick(move)} title={moveNameDisplay} disabled={isTurnProcessing || isBattleOver || !activeUserPokemon || activeUserPokemon.hp <= 0}> {typeIconSrc && <img src={typeIconSrc} alt={moveTypeApiName} className="move-type-icon-arena" />} <span className="move-btn-name">{moveNameDisplay}</span> </button> );
                            })}
                            {(!activeUserPokemon?.moves_array || activeUserPokemon.moves_array.length === 0) && ( <p className="no-moves-text">Keine Attacken</p> )}
                        </div>
                    </div>
                </div>
            </div>
            {showTeamOverview && !isBattleOver && (
                <div className={preBattleDisplayClasses} style={{ display: showTeamOverview ? 'flex' : 'none' }}>
                    <PreBattleTeamDisplay
                        userTeam={userTeamRoster}
                        botTeam={botTeamRoster}
                        onStartBattle={handleStartBattleFromOverview}
                        onRemixBotTeam={handleRemixBotTeamInPreBattle}
                        allTypes={allTypes}
                    />
                </div>
            )}
            {isBattleOver && battleStats && (
                 <div className={postBattleDisplayClasses} style={{ display: isBattleOver ? 'flex' : 'none' }}>
                    <PostBattleTeamDisplay
                        userTeam={userTeamRoster}
                        botTeam={botTeamRoster}
                        onRematch={handleRematch}
                        onNewOpponentAndRestart={handleNewOpponentAndRestart}
                        allTypes={allTypes}
                        battleResultText={battleResultText}
                        battleLog={battleLog}
                        battleStats={battleStats}
                    />
                </div>
            )}
        </div>
    );
}

export default PokemonArena;