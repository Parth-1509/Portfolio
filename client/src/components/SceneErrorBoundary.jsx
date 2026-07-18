import { Component } from 'react'

export default class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.warn('3D scene failed to render, falling back gracefully:', error.message)
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}