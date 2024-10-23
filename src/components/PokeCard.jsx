// Main card to showcase pokemon
import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import TypeCard from "./TypeCard"

export default function PokeCard(props) {
    // Destructure the selected props
    const { selectedPokemon } = props

    // By setting the default value null, it makes it very clear when we do and do not have pokemon available
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    // destructuring info from data
    const {name, height, abilities, stats, types, moves, sprites} = data || {}    

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

                console.log(pokemonData)

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
        </div>
    )
}