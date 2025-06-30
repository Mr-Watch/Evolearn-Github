import { createModal } from "../../ModalManager/modal-manager.js";
import { plotQuizStats } from "../../Plotters/quiz-stats-plotter.js";
import { getThemePreference } from "../../SettingsManagers/theme-settings-manager.js";
import {
  roundToTwoDecimals,
  stringToNode,
  stringToStyleSheetNode,
} from "../../AuxiliaryScripts/utils.js";
import { getQuizStats } from "../quiz-manager.js";

function showStatsModal(quizSelector) {
  let stats = getQuizStats(quizSelector.slice(1));

  let average = roundToTwoDecimals(
    stats.scoreHistory.reduce((a, b) => a + b, 0) / stats.scoreHistory.length
  );

  if (isNaN(average)) {
    average = 0;
  }

  let element = stringToNode(`
    <div class="quiz_stats">
        <h5>Passed attempts :  ${stats.passed}</h5>
        <hr />
        <h5>Failed attempts :  ${stats.failed}</h5>
        <hr />
        <h5>Canceled attempts :  ${stats.canceled}</h5>
        <hr />
        <h5>Average Score :  ${average}%</h5>
        <hr />
        <div id="quiz_stats"></div>
        </div>
        `);

  element.appendChild(
    stringToStyleSheetNode(`
      .quiz_stats {
          text-align: center;
        }
      .quiz_stats>h5{
        white-space: pre;
        margin: 0;
      }
      .quiz_stats>hr{
        margin: 0.3rem;
      }
      `)
  );

  if (getThemePreference() === "dark") {
    element.appendChild(
      stringToStyleSheetNode(`
      .modebar-group{
        background-color: var(--bs-body-bg)!important;
      }
      .main-svg:first-child{
        background-color: var(--bs-body-bg)!important;
      }
      .xtick>text{
        fill: white!important;
      }
      .ytick>text{
        fill: white!important;
      }
      .modebar-group>*>svg>path{
        fill: white!important;
      }
      .g-gtitle>text{
        fill: white!important;
      }
      .g-xtitle>text{
        fill: white!important;
      }
      .g-ytitle>text{
        fill: white!important;
      }
      `)
    );
  }

  createModal("Quiz Stats", element, undefined, undefined, undefined, true);
  plotQuizStats("quiz_stats", stats.scoreHistory);
  window.dispatchEvent(new Event("resize"));
}

export { showStatsModal };
