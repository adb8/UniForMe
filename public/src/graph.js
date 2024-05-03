const home = document.querySelector(".home");
const sat = document.querySelector(".sat");
const act = document.querySelector(".act");
const admission = document.querySelector(".admission");
const graduation = document.querySelector(".graduation");
const debt = document.querySelector(".debt");
const tuition_in_state = document.querySelector(".tuition-in-state");
const tuition_out_state = document.querySelector(".tuition-out-state");
const earnings = document.querySelector(".earnings");
const population = document.querySelector(".population");
const search = document.querySelector(".college-search-cont");
const graph = document.querySelector("#stats-graph");

home.style.backgroundColor = "rgb(255, 110, 110)";
const buttons = [
  sat,
  act,
  admission,
  graduation,
  debt,
  tuition_in_state,
  tuition_out_state,
  earnings,
  population,
  home,
];

buttons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});

function handleButtonClick(e) {
  if (window.waiting_for_response) {
    console.log("Rate limited");
    return;
  }
  window.waiting_for_response = true;
  buttons.forEach((button) => {
    button.style.backgroundColor = "rgb(255, 150, 150)";
    if (button === e.target) {
      button.style.backgroundColor = "rgb(255, 110, 110)";
    }
  });
  if (e.target === home) {
    search.style.display = "flex";
    graph.style.display = "none";
    window.waiting_for_response = false;
    return;
  }
  graph.style.display = "none";
  search.style.display = "none";

  let data_type;
  switch (e.target) {
    case sat:
      data_type = "sat";
      break;
    case act:
      data_type = "act";
      break;
    case admission:
      data_type = "admission";
      break;
    case graduation:
      data_type = "graduation";
      break;
    case debt:
      data_type = "debt";
      break;
    case tuition_in_state:
      data_type = "tuition-in-state";
      break;
    case tuition_out_state:
      data_type = "tuition-out-state";
      break;
    case earnings:
      data_type = "earnings";
      break;
    case population:
      data_type = "population";
      break;
    default:
      break;
  }

  fetch("/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: data_type,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      window.waiting_for_response = false;
      graph.style.display = "block";
      draw(truncateStrings(data.x), data.y);
    });
}

function truncateStrings(strings) {
  return strings.map((string) => {
    if (string.length > 25) {
      return string.substring(0, 25) + "...  ";
    } else {
      return string + "  ";
    }
  });
}

let chart_instance = null;
function draw(x, y) {
  if (chart_instance) {
    chart_instance.destroy();
  }
  chart_instance = new Chart(graph, {
    type: "bar",
    data: {
      labels: x,
      datasets: [{ backgroundColor: "white", data: y }],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              fontSize: 28,
              fontColor: "black",
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontSize: 28,
              fontColor: "black",
            },
          },
        ],
      },
      legend: {
        display: false,
        labels: {
          font: {
            size: 64,
            color: "black",
          },
        },
      },
    },
  });
}
