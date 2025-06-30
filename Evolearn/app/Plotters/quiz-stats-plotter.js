function plotQuizStats(elementId, scoreHistoryArray) {
  const xArray = [];
  const yArray = scoreHistoryArray;

  for (let index = 0; index < scoreHistoryArray.length; index++) {
    xArray.push(index + 1);
  }

  const data = [
    {
      x: xArray,
      y: yArray,
      type: "bar",
      text: yArray.map(String),
      orientation: "v",
      automargin: "true",
      marker: { color: "rgb(13, 110, 253)" },
    },
  ];

  const layout = {
    title: "Quiz Score Progression",
    yaxis: {
      title: "Score Percent",

      titlefont: {
        size: 16,

        color: "rgb(107, 107, 107)",
      },
    },
    xaxis: {
      dtick: "tick0",
      title: "Attempt Number",

      titlefont: {
        size: 16,

        color: "rgb(107, 107, 107)",
      },
    },
  };
  const config = {
    autosize: true,
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ["toImage", "select2d", "lasso2d"],
  };

  Plotly.newPlot(elementId, data, layout, config);
}

export { plotQuizStats };
