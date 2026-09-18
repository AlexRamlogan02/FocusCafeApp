import './styles/Header.component.css'
import '../index.css'
import MoonLightLogo from '../assets/logos/Moon_Light.png'
import TransitionLink from './TransitionLink.jsx'

export default function Header() {
  return (
    <div className="header">
      <TransitionLink className="header-brand" to="/" aria-label="Go to PomoCha home">
        <img className="header-logo" src={MoonLightLogo} alt="" />
        <h1 className="header-title">PomoCha</h1>
      </TransitionLink>
      <div className="header-links">
        <span className="header-link"><a href="https://github.com/AlexRamlogan02/FocusCafeApp">GitHub</a></span>
        <span className="header-link"><TransitionLink to="/account">Account</TransitionLink></span>
      </div>
    </div>
  )
}