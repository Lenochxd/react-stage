import '../styles/Banner.css'
import logo from '../assets/leaf.png'

function Banner() {
    return (
        <div 
            style={{
                color: 'white',
                backgroundColor: '#31b572',
                textAlign: 'right',
                padding: '32px',
                borderBottom: 'solid 3px black',
                borderImage: ''
            }}
            className='lmj-banner'
        >
            <img src={logo} alt='La maison jungle' className='lmj-logo' />
            <h1>La maison jungle</h1>
            
        </div>
    )
}

export default Banner