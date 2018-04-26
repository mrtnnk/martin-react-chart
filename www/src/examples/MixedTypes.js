import React from 'react'

//

import Sidebar from 'components/Sidebar'
import ChartConfig from './components/ChartConfig'

import { Chart, Axis, Series, Tooltip, Line, Bar } from '../../../src'

export default () => (
  <Sidebar>
    <ChartConfig dataType="ordinal">
      {({ data }) => (
        <div>
          Ordinal Scale:
          <br />
          <br />
          <ChartConfig canRandomize={false}>
            {() => (
              <Chart data={data}>
                <Axis primary type="ordinal" />
                <Axis type="linear" min={0} />
                <Series type={(s, i) => (i % 2 ? Bar : Line)} />
                <Tooltip />
              </Chart>
            )}
          </ChartConfig>
          <br />
          <br />
          Linear Scale
          <br />
          <br />
          <ChartConfig canRandomize={false}>
            {() => (
              <Chart data={data}>
                <Axis primary type="linear" />
                <Axis type="linear" min={0} />
                <Series type={(s, i) => (i % 2 ? Bar : Line)} />
                <Tooltip />
              </Chart>
            )}
          </ChartConfig>
        </div>
      )}
    </ChartConfig>
  </Sidebar>
)
