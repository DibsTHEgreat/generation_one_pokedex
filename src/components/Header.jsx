// This explanation applies to all components. The reason we choose to export default instead of the normal export is because
// when we are importing these components into other files we want to import them directly, instead of destructuring 
// the components out of the export object. This results in cleaner syntax

export default function Header(props) {

  const { handleToggleMenu } = props

  return (
    <header>
        {/* When calling or invoking a function, it is only possible from within an arrow function () => {} */}
        {/* For this situation, we are only passing in the function as reference, as in, refer to this function when you go to invoke it*/}
        <button  onClick={handleToggleMenu} className='open-nav-button'>
          <i class="fa-solid fa-bars"></i>
        </button>
        <h1 className="text-gradient">
          Pokédex
        </h1>
    </header>
  )
}
