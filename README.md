# React Charts

<a href="https://travis-ci.org/react-charts/react-charts" target="\_parent">
  <img alt="" src="https://travis-ci.org/react-charts/react-charts.svg?branch=master" />
</a>
<a href="https://npmjs.com/package/react-charts" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/react-charts.svg" />
</a>
<a href="https://react-chat-signup.herokuapp.com/" target="\_parent">
  <img alt="" src="https://img.shields.io/badge/slack-react--chat-blue.svg" />
</a>

Simple, immersive &amp; interactive charts for React

## Features

- Line, Bar, Bubble, Area.
- Hyper Responsive (container-based)
- Powered by D3
- Rendered by React
- Flexible data model

## Intro

React-Charts is currently in an **alpha** state! This means:

- The api is constantly changing as use-cases evolve
- Support is limited to my personal immediate working memory of the system and 10 seconds of my time. If I can't answer your question with those limitations, I will invite you to read the source and contribute to your own answer so I can keep moving forward towards a stable release.

## Table of Contents

- [Installation](#installation)
- [Quick Example](#quick-example)
- [Examples](https://react-charts.js.org)

## Installation

```bash
$ yarn add react-charts
# or
$ npm i react-charts --save
```

## Quick Start

React

This will render a very basic line chart:

```javascript
import React from "react";
import { Chart } from "react-charts";

const lineChart = (
  // A react-chart hyper-responsively and continuusly fills the available
  // space of its parent element automatically
  <div
    style={{
      width: "400px",
      height: "300px"
    }}
  >
    <Chart
      data={[
        {
          label: "Series 1",
          data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
        },
        {
          label: "Series 2",
          data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
        }
      ]}
      axes={[
        { primary: true, type: "linear", position: "bottom" },
        { type: "linear", position: "left" }
      ]}
    />
  </div>
);
```

## Documentation

Documentation is **not complete**. The most detailed usage examples are visible by [browsing the website's examples](https://github.com/mrtnnk/martin-react-chart).

What sparse documentation is available in this readme is being progressively worked on below.

## Data Model

React-Charts uses a common and very flexible data model based on arrays of **series** and arrays of **datums**. You can either use the model defaults directly, or use **data accessors** to materialize this structure.

Typical visualization data can come in practically any shape and size. The following examples show data structures that are all reasonably equivalent **at some level** since they each contain an array of **series[]** and **datums[]**. They also show how to parse that data.

In the following example, there is no need to use any accessors. The **default** accessors are able to easily understand this format:

```javascript
const data = [
  {
    label: "Series 1",
    data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
  },
  {
    label: "Series 2",
    data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
  },
  {
    label: "Series 3",
    data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
  }
];

<div
  style={{
    width: "400px",
    height: "300px"
  }}
>
  <Chart
    data={data}
    axes={[
      { primary: true, type: "linear", position: "bottom" },
      { type: "linear", position: "left" }
    ]}
  />
</div>;
```

In the following example, there is no need to use any accessors. The **default** accessors are able to easily understand this format, but **please note** that this format limits you from passing any **meta data** about your series and datums.

```javascript
const data = [
  [[1, 10], [2, 10], [3, 10]],
  [[1, 10], [2, 10], [3, 10]],
  [[1, 10], [2, 10], [3, 10]]
];

<div
  style={{
    width: "400px",
    height: "300px"
  }}
>
  <Chart
    data={data}
    axes={[
      { primary: true, type: "linear", position: "bottom" },
      { type: "linear", position: "left" }
    ]}
  />
</div>;
```

#### Data Accessors

When data isn't in a convenient format for React Charts, **your first instinct will be to transform your data into the above formats**. Don't do that! There is an easier way 🎉 We can use the `Chart` components' **accessor props** to point things in the right direction. **Accessor props** pass the original data and the series/datums you return down the line to form a new data model. See the [`<Chart>` component](#chart) for all available accessors.

In the following example, the data is in a very funky format, but at it's core is the same as the previous examples.

```javascript
const data = {
  axis: [1, 2, 3],
  lines: [
    { data: [{ value: 10 }, { value: 10 }, { value: 10 }] },
    { data: [{ value: 10 }, { value: 10 }, { value: 10 }] },
    { data: [{ value: 10 }, { value: 10 }, { value: 10 }] }
  ]
};

<div
  style={{
    width: "400px",
    height: "300px"
  }}
>
  <Chart
    // Pass the original data object
    data={data}
    // Use data.lines to represent the different series
    getSeries={data => data.lines}
    // Use data.lines[n].data to represent the different datums for each series
    getDatums={series => series.data}
    // Use the original data object and the datum index to reference the datum's primary value.
    getPrimary={(datum, i, series, seriesIndex, data) => data.axis[i]}
    // Use data.lines[n].data[n].value as each datums secondary value
    getSecondary={datum => datum.value}
  />
</div>;
```

#### Series Labels

Multiple series are often useless without labels. By default, React Charts looks for the `label` value on the series object you pass it. If not found, it will simply label your series as `Series [n]`, where `[n]` is the zero-based `index` of the series, plus `1`.

If the default label accessor doesn't suit your needs, then you can use the `<Chart>` component's `getLabel` accessor prop:

```javascript
const data = [{
  specialLabel: 'Hello World!',
  data: [
    //...
  ]
}]

<div
  style={{
    width: "400px",
    height: "300px"
  }}
>
  <Chart data={data} getLabel={series => series.specialLabel} />
</div>;
```

## Axes & Scales

React Charts supports an `axes` prop that handles both the underlying scale and visual rendering. These axes can be combined and configured to plot data in many ways. To date, we have the following scale types available:

- Cartesian
  - `linear` - A continuous axis used for plotting numerical data on an evenly distributed scale. Works well both as a **primary and secondary** axis.
  - `ordinal` - A banded axis commonly used to plot categories or ordinal information. Works well as the **primary** axis for bar charts.
  - `time` - A continuous axis used for plotting localized times and dates on an evenly distributed scale. Works well as a **primary** axis.
  - `utc` - Similar to the `time` scale, but supports UTC datetimes instead of localized datetimes. Works well as a **primary** axis.
  - `log` - A continuous axis used for plotting numerical data on a logarithmically distributed scale. Works well as a **secondary** axis
    <!-- - Radial
  - `pie` - A standalone numerical axis used for plotting arc lengths on a pie chart. Use this as the only axis when plotting a Pie chart. -->

Axes are a required component of a React Chart and can used like so:

```javascript
import { Chart } from 'react-charts'

<div
  style={{
    width: "400px",
    height: "300px"
  }}
>
  <Chart
    axes={[
      { primary: true, type: "time", position: "bottom" },
      { type: "linear", position: "left" }
    ]}
  />
</div>
```

For more information on usage and API, see the [`axes` prop](#axes)

## Series Types

- Cartesian
  - `line`
  - `area`
  - `bar`
  - `bubble`
- Radial
  - `pie`

Example

```javascript
<Chart series={{ curve: "cardinal" }} />
```

# Advanced API

**`<Chart />` Props**

- `getSeries()` - Responsible for returning an array of series.
  - Default - `() => null`
  - Arguments:
    - `data` - The original
  - Returns an `Object`
- `getLabel()`
  - Default - `() => null`
  - Arguments:
    - Thing
  - Returns an `Object`
- `getSeriesID()`
  - Default - `() => null`
  - Arguments:
    - Thing
  - Returns an `Object`
- `getDatums()`
  - Default - `() => null`
  - Arguments:
    - Thing
  - Returns an `Object`
- `getPrimary()`
  - Default - `() => null`
  - Arguments:
    - Thing
  - Returns an `Object`
- `getSecondary()`
  - Default - `() => null`
  - Arguments:
    - Thing
  - Returns an `Object`

**Curve Types**

All series types that support lines or curves can be configured to use any [curve function from `d3-shape`](https://github.com/d3/d3-shape#curves) by passing one of the following strings as the `curve` prop to a series component. You may also pass your own curve function directly from d3 or if you're feeling powerful, even create your own!

Note the following string correspond to their respective d3 curve functions but with the `curve` prefix removed.

- `basisClosed`
- `basisOpen`
- `basis`
- `bundle`
- `cardinalClosed`
- `cardinalOpen`
- `cardinal`
- `catmullRomClosed`
- `catmullRomOpen`
- `catmullRom`
- `linearClosed`
- `linear`
- `monotoneX` (default)
- `monotoneY`
- `natural`
- `step`
- `stepAfter`
- `stepBefore`
