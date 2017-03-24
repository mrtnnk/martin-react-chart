import { Component } from 'react'
import {
  scaleLinear,
  scaleLog,
  scaleTime,
  scaleBand
 } from 'd3-scale'
//

const scales = {
  linear: scaleLinear,
  log: scaleLog,
  time: scaleTime,
  ordinal: scaleBand
}

class Scale extends Component {
  constructor () {
    super()
    this.updateScale = this.updateScale.bind(this)
  }
  componentDidMount () {
    this.updateScale(this.props)
  }
  componentWillUpdate (newProps) {
    const oldProps = this.props
    // If scale dependencies settings change, update the scale
    if (
      newProps.primary !== oldProps.primary ||
      newProps.type !== oldProps.type ||
      newProps.id !== oldProps.id ||
      newProps.invert !== oldProps.invert ||
      newProps.data !== oldProps.data ||
      newProps.getSeries !== oldProps.getSeries ||
      newProps.getX !== oldProps.getX ||
      newProps.getY !== oldProps.getY ||
      newProps.height !== oldProps.height ||
      newProps.width !== oldProps.width
    ) {
      this.updateScale(newProps)
    }
  }
  updateScale (props) {
    const {
      id,
      primary,
      type,
      invert,
      //
      data,
      getSeries,
      getX,
      getY
    } = props

    if (!data) {
      return
    }

    const getter = primary ? getX : getY
    let uniqueVals = []
    let min = 0
    let max = 0
    let negativeTotal = 0
    let positiveTotal = 0

    let domain
    let totalDomain

    if (type === 'ordinal') {
      data.forEach(s => {
        let series = getSeries(s)
        const seriesValues = series.map(getter)
        seriesValues.forEach(d => {
          if (uniqueVals.indexOf(d) === -1) {
            uniqueVals.push(d)
          }
        })
      })
      domain = invert ? [...uniqueVals].reverse() : uniqueVals
    } else {
      // Determine the min/max and negative/positive totals
      data.forEach(s => {
        let series = getSeries(s)
        const seriesValues = series.map(getter)
        const seriesMin = Math.min(seriesValues)
        const seriesMax = Math.max(seriesValues)
        min = Math.min(min, seriesMin)
        max = Math.max(max, seriesMax)
        if (min < 0) {
          negativeTotal += min
        }
        if (max > 0) {
          positiveTotal += max
        }
      })
      domain = invert ? [max, min] : [min, max]
      totalDomain = invert ? [positiveTotal, negativeTotal] : [negativeTotal, positiveTotal]
    }

    const newScale = scales[type]()
      .domain(domain)

    if (type !== 'ordinal') {
      newScale.nice()
    }

    Object.assign(newScale, {
      isPrimary: !!primary,
      isInverted: !!invert,
      totalDomain
    })

    // Provide the scale to the rest of the chart
    this.props.dispatch(state => ({
      scales: {
        ...state.scales,
        [id]: newScale
      }
    }))
  }
  render () {
    const {
      scale,
      children
    } = this.props

    if (!scale) {
      return null
    }

    return children || null
  }
}

export default Connect((state, props) => {
  const {
    id
  } = props

  return {
    data: state.data,
    getSeries: state.getSeries,
    getX: state.getX,
    getY: state.getY,
    width: Selectors.gridWidth(state),
    height: Selectors.gridHeight(state),
    scale: state.scales && state.scales[id]
  }
})(Scale)
