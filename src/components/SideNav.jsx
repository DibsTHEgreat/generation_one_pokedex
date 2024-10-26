import { useState } from "react"
import { first151Pokemon, getFullPokedexNumber } from "../utils"
// Side Note: Any file called index is the default export from that specified folder in the path


export default function SideNav(props) {

    const { selectedPokemon, setSelectedPokemon, handleCloseMenu, showSideMenu} = props

    const [searchValue, setSearchValue] = useState('')

    // Taking the full list and filtering out the values that don't match the search Input
    const filteredPokemon = first151Pokemon.filter( (ele, eleIndex) => {
        // if full pokedex number includes the current search value
            // return true
        if (getFullPokedexNumber(eleIndex).includes(searchValue)) {
            return true
        }

        // if the pokemon name includes the current search value
            // return true
        if(ele.toLowerCase().includes(searchValue.toLowerCase())) {
            return true
        }

        // otherwise, exclude value from array
        return false
    })

    return (
        <nav className={'' + (!showSideMenu ? "open" : '')}>
            <div className={"header " + (!showSideMenu ? "open" : '')}>
                <button onClick={handleCloseMenu} className='open-nav-button'>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className="text-gradient">Pokédex</h1>
            </div>
            <input placeholder="Search up a Pokemon" value={searchValue} onChange={(e) => {
                setSearchValue(e.target.value)
            }} />
            {filteredPokemon.map((pokemon, pokemonIndex) => {
                const truePokeDexNumber = first151Pokemon.indexOf(pokemon)
                return (
                    <button onClick={() => {
                        setSelectedPokemon(truePokeDexNumber)
                        handleCloseMenu()
                    }} key={pokemonIndex} className={'nav-card ' + (pokemonIndex === selectedPokemon ? ' nav-card-selected' : ' ')}>
                        <p>{getFullPokedexNumber(truePokeDexNumber)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}