// Main card to showcase pokemon
import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import TypeCard from "./TypeCard"
import Modal from "./Modal"

export default function PokeCard(props) {
    // Destructure the selected props
    const { selectedPokemon } = props

    // By setting the default value null, it makes it very clear when we do and do not have pokemon available
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [skill, setSkill] = useState(null)
    const [loadingSkill, setLoadingSkill] = useState(false)

    // destructuring info from data
    const {name, height, abilities, stats, types, moves, sprites} = data || {}  
    
    // I am using the filter method to filter out when sprites return an undefined or if the value has a keyname with the selected keywords
    // if neither of the two cases is true we return true
    const imgList = Object.keys(sprites || {}).filter(val => {
        // undefined checker
        if (!sprites[val]) {
            return false
        }
        // keyword checker
        if (['versions', 'other'].includes(val)) {
            return false
        }
        return true
    })

    async function fetchMoveData(move, moveURL) {
        // basic clauses to make sure that the fetching data doesn't break
        if (loadingSkill || !localStorage || !moveURL) { return }

        // now checking cache for move
        let cache = {} 
        // if we have an existing move from within the local storage, the cache is updated
        if (localStorage.getItem('pokemon-moves')) {
            cache = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        // check if move is currently within the cache
        if (move in cache) {
            setSkill(cache[move])
            console.log('Found move in cache')
        }

        // fetching data from API if none of the statements passed
        try {
            setLoadingSkill(true)
            const result = await fetch(moveURL)
            const moveData = await result.json()
            console.log('Fetched move from API', moveData)
            // Filtering out moves that do not have the correct version type name parameters
            // Reasoning, this project needs Gen 1 pokedex info
            const description = moveData?.flavor_text_entries.filter(val => {
                return val.version_group.name = 'firered-leafgreen'
            })[0]?.flavor_text

            const skillData = {
                name: move,
                description
            }
            // will rerender the screen with the new information
            // modal will open when new data is assigned
            setSkill(skillData)
            
            // adding data to the cache and saving it for next time
            cache[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(cache))

        } catch (err) {
            console.log(err)
        } finally {
            setLoadingSkill(false)
        }
    }

    // We invoke useEffect; takes in two inputs:
    // First Input: A callback Function to be executed whenever the event we are listening for is triggered
    // Second Input: Is the dependency array; if present, effect will only activate if the values in the list change
    // My use case: Listening for whenever the selectedPokemon event changes, since when the event changes I have to
    // refetch my data. Specifically, when a new pokemon is selected.
    useEffect(() => { 
        // If loading, exit logic
            // Reason we have this if statement is because we won't want to refetch the data
            // again, if we are already loading
            // If local storage does not exist we are not ready for the rest of the logic to be run
        if (loading || !localStorage) {
            return
        }
        
        // check if the selected Pokemon info is available in the cache
        // few steps needed to be done for this to work:
            // 1. Need to define the cache
        // The reason we use an object is because the PokiApi returns data as objects
        let cache = {}
        if (localStorage.getItem('pokedex')) {
            // data is returned as JSON, so we need to parse that information
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }
            // 2. Check if the selected Pokemon is in the cache, otherwise fetch the data
        if (selectedPokemon in cache) {
            // reading from cache
            setData(cache[selectedPokemon])
            console.log('Found pokemon in cache')
            return
        }
            // 3. If we do fetch from the API, than we have to make sure to save the data into the cache for next time
        // The reason these lines are hit is because we passed all the cache stuff to no avail and now we need to
        // fetch the data from the api
        
        async function fetchPokemonData() {
            setLoading(true)
            try {
                const baseURL = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalUrl = baseURL + suffix

                // we use await since this is an asynchronous process
                const res = await fetch(finalUrl)
                // accessing the response via the json
                const pokemonData = await res.json()
                // assigning the pokemon data to the state, so the screen can update to match
                setData(pokemonData)

                console.log('Fetched Pokemon Data')

                // also add the NEW pokemon data to the cache
                cache[selectedPokemon] = pokemonData
                // updating the cache by saving the info to local storage
                localStorage.setItem('pokedex', JSON.stringify(cache))

            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPokemonData()

        // By implementing these steps, we are ensuring that we won't overload the API with too many request calls
    }, [selectedPokemon])

    // Showing the user that data is being loaded
    if (loading || !data) {
        return (
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }

    return (
        <div className='poke-card'>
            {/* Conditional Rendering */}
            {/* If skill is true, than render the modal, if false, than do not render the modal */}
            { skill && (
                <Modal handleCloseModal={() => { setSkill(null) }}>
                    <div>
                        <h6>Name</h6>
                        <h2 className='skill-name'>{skill.name.replaceAll('-', ' ')}</h2>
                    </div>
                    <div>
                        <h6>Description</h6>
                        <p>{skill.description}</p>
                    </div>
                </Modal>  
            )}

            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className='type-container'>
                {types.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    )
                })}
            </div>
            <img className='default-img' src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt={`${name}-large-img`}/>
            <div className='img-container'>
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                    )
                })}
            </div>
            <h3>Stats</h3>
            <div className='stats-card'>
                {stats.map((statsObj, statIndex) => {
                    const {stat, base_stat} = statsObj

                    return (
                        <div key={statIndex} className='stat-item'>
                            <p>{stat?.name.replaceAll('-', ' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                })}
            </div>

            <h3>Moves</h3>
            <div className='pokemon-move-grid'>
                {moves.map((moveObj, moveIndex) => {
                    return (
                        <button className='button-card pokemon-move' key={moveIndex} onClick={() => { fetchMoveData(moveObj?.move?.name, moveObj?.move?.url) }}>
                            <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}