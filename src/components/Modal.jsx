// Pop-up Overlay 
import ReactDom from 'react-dom'

export default function Modal() {
    // Create portal takes in two inputs: the JSX to be rendered, and the id of the div where stuff will be rendered
    // Rendering the modal content that doesn't get injected into the original div with an Id of root
    return ReactDom.createPortal(
        <div className='modal-container'>
            <button onClick={handleCloseModal} className='modal-underlay'/>
                <div className='modal-content'>
                    {children}
                </div>
        </div>,
        // rendering modal content inside of the div with an id of portal
        document.getElementById('portal')
    )
}