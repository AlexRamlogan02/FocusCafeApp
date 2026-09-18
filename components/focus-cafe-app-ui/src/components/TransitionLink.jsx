import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function TransitionLink({ to, children, ...props }) {
  const navigate = useNavigate()
  const isTransitioning = useRef(false)

  function handleClick(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()

    if (isTransitioning.current) {
      return
    }

    isTransitioning.current = true
    document.documentElement.classList.add('is-navigating')

    window.setTimeout(() => {
      navigate(to)
      document.documentElement.classList.remove('is-navigating')
      isTransitioning.current = false
    }, 600)
  }

  return <Link to={to} onClick={handleClick} {...props}>{children}</Link>
}
