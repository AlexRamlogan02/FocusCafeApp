import TransitionLink from '../components/TransitionLink.jsx'

export default function HomePage() {
  return (
    <div>
      <h1>PomoCha Home!</h1>
      <button><TransitionLink to="/focus">Click Me</TransitionLink></button>
    </div>
  )
}