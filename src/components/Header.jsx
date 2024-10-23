// This explanation applies to all components. The reason we choose to export default instead of the normal export is because
// when we are importing these components into other files we want to import them directly, instead of destructuring 
// the components out of the export object. This results in cleaner syntax

export default function Header() {
  return (
    <header>Header</header>
  )
}
