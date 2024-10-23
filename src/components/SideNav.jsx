import { first151Pokemon, getFullPokedexNumber } from "../utils"
// Side Note: Any file called index is the default export from that specified folder in the path


export default function SideNav() {

    return (
        <nav>
            <div className={"header"}>
                <h1 className="text-gradient">Pokédex</h1>
                <input />
            </div>
            {first151Pokemon.map((pokemon, pokemonIndex) => {
                return (
                    <button key={pokemonIndex} className={'nav-card'}>
                        <p>{getFullPokedexNumber(pokemonIndex)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}