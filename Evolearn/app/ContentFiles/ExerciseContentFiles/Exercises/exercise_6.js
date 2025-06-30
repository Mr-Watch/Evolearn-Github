import { ExerciseTemplateComponent } from "../../../ExerciseManager/exercise-template-component.js";

class ExerciseComponent6 extends ExerciseTemplateComponent {
  constructor() {
    super();
    this.documentTitle;
    super.connectedCallback();
  }

  connectedCallback() {}
}

customElements.define("exercise-component-6", ExerciseComponent6);

export { ExerciseComponent6 as ExerciseComponent, ExerciseComponent6 };
