import {
  getRandomInteger,
  roundToTwoDecimals,
  stringToNode,
  stringToStyleSheetNode,
  valueBetween,
} from "../../AuxiliaryScripts/utils.js";

const messageAndIconDefinitions = {
  en: {
    Excellent: {
      gradeText: "Excellent",
      icon: "😎",
      messages: [
        "Oh my god!<br>No notes.",
        "You are the best of the best!",
        "You did an amazing job here!",
      ],
    },
    Great: {
      gradeText: "Great",
      icon: "😊",
      messages: [
        "Nice work there<br>Keep it up.",
        "Great display all around.",
        "With results like that<br>You have nothing to fear.",
      ],
    },
    Good: {
      gradeText: "Good",
      icon: "😅",
      messages: [
        "Not bad<br>But you still have room to improve",
        "Good... good...",
        "Nice work<br>Keep it up.",
      ],
    },
    Bad: {
      gradeText: "Bad",
      icon: "😟",
      messages: [
        "Come on<br>You can do better than that",
        "You need to try harder",
        "Sometimes you get attempts like those<br>Don't give up!",
      ],
    },
    VeryBad: {
      gradeText: "Very Bad",
      icon: "😭",
      messages: [
        "No way<br>You did it on purpose...",
        "Were you even trying?",
        "No words<br>You have a long way ahead...",
      ],
    },
  },
  el: {
    Excellent: {
      gradeText: "Εξαιρετικά",
      icon: "😎",
      messages: [
        "Θεέ μου!<br>Κανένα σχόλιο.",
        "Είσαι ο καλυτερος!",
        "Έκανες εξαιρετική δουλεία!",
      ],
    },
    Great: {
      gradeText: "Τέλεια",
      icon: "😊",
      messages: [
        "Πολύ καλή δουλειά<br>Συνέχισε έτσι.",
        "Εξαιρετική εμφάνιση στο Κουίζ",
        "Με τέτοια επίδοση<br>Μην φοβάσαι τίποτα.",
      ],
    },
    Good: {
      gradeText: "Καλά",
      icon: "😅",
      messages: [
        "Καθόλου άσχημα<br>Αλλά υπάρχει περιθώριο βελτίωσης.",
        "Καλός... καλός...",
        "Αρκετά καλά<br>Συνέχισε έτσι.",
      ],
    },
    Bad: {
      gradeText: "Άσχημα",
      icon: "😟",
      messages: [
        "Έλα τώρα<br>Μπορείς και καλύτερα.",
        "Θέλει και άλλη προσπάθεια.",
        "Δυστυχώς υπάρχουν και τέτοιες προσπάθειες<br>Μην τα παρατάς!",
      ],
    },
    VeryBad: {
      gradeText: "Πολύ Άσχημα",
      icon: "😭",
      messages: [
        "Αποκλείεται<br>Το έκανες επίτηδες...",
        "Τώρα προσπάθησες?",
        "Δεν έχω λόγια<br>Έχεις δρόμο μπροστά σου...",
      ],
    },
  },
};

export function returnFinalResultsModalElement(stats, language) {
  let messageSelection = {};
  if (valueBetween(stats.final, 0, 25)) {
    messageSelection = messageAndIconDefinitions[language].VeryBad;
  } else if (valueBetween(stats.final, 25, 49)) {
    messageSelection = messageAndIconDefinitions[language].Bad;
  } else if (valueBetween(stats.final, 50, 74)) {
    messageSelection = messageAndIconDefinitions[language].Good;
  } else if (valueBetween(stats.final, 75, 99)) {
    messageSelection = messageAndIconDefinitions[language].Great;
  } else if (valueBetween(stats.final, 100, 100)) {
    messageSelection = messageAndIconDefinitions[language].Excellent;
  }

  let correctQuestionMessage;
  let wrongQuestionMessage;
  let unansweredQuestionMessage;
  let restOfMessage;
  let element;
  if (language === "en") {
    correctQuestionMessage = stats.correct === 1 ? "question" : "questions";
    wrongQuestionMessage = stats.wrong === 1 ? "question" : "questions";
    unansweredQuestionMessage =
      stats.unanswered === 1 ? "question" : "questions";

    restOfMessage = "";
    if (stats.passOrFail === "Passed") {
      restOfMessage = "and Passed!";
    } else {
      if (
        messageSelection.gradeText === "Good" ||
        messageSelection.gradeText === "Great" ||
        messageSelection.gradeText === "Excellent"
      ) {
        restOfMessage = "but you still Failed...";
      } else {
        restOfMessage = "and Failed.";
      }
    }

    element = stringToNode(`
  <div class="final_score">
      <span class="mood_icon">${messageSelection.icon}</span>
      <p>You did ${messageSelection.gradeText} on this quiz ${restOfMessage}</p>
      <hr />
      <p>Final score is ${roundToTwoDecimals(stats.final)}%</p>
      <hr />
      <p>You had ${stats.correct} correct ${correctQuestionMessage}</p>
      <p>${stats.wrong} wrong ${wrongQuestionMessage}</p>
      <p>and ${stats.unanswered} unanswered ${unansweredQuestionMessage}</p>
      <hr />
      <p>
        ${
          messageSelection.messages[
            getRandomInteger(0, messageSelection.messages.length - 1)
          ]
        }
      </p>
    </div>`);
  } else {
    correctQuestionMessage = stats.correct === 1 ? "ερώτηση" : "ερωτήσεις";
    wrongQuestionMessage = stats.wrong === 1 ? "ερώτηση" : "ερωτήσεις";
    unansweredQuestionMessage =
      stats.unanswered === 1 ? "ερώτηση" : "ερωτήσεις";

    restOfMessage = "";
    if (stats.passOrFail === "Passed") {
      restOfMessage = "και Πέρασες!";
    } else {
      if (
        messageSelection.gradeText === "Καλά" ||
        messageSelection.gradeText === "Τέλεια" ||
        messageSelection.gradeText === "Εξαιρετικά"
      ) {
        restOfMessage = "αλλά δυστυχώς Απέτυχες...";
      } else {
        restOfMessage = "και Απέτυχες.";
      }
    }

    element = stringToNode(`
  <div class="final_score">
      <span class="mood_icon">${messageSelection.icon}</span>
      <p>Τα πήγες ${
        messageSelection.gradeText
      } σε αυτό το κουίζ ${restOfMessage}</p>
      <hr />
      <p>Το τελικό σκόρ είναι : ${roundToTwoDecimals(stats.final)}%</p>
      <hr />
      <p>Είχες ${stats.correct} σωστές ${correctQuestionMessage}</p>
      <p>${stats.wrong} λάθος ${wrongQuestionMessage}</p>
      <p>and ${stats.unanswered} αναπάντητες ${unansweredQuestionMessage}</p>
      <hr />
      <p>
        ${
          messageSelection.messages[
            getRandomInteger(0, messageSelection.messages.length - 1)
          ]
        }
      </p>
    </div>`);
  }

  element.appendChild(
    stringToStyleSheetNode(`
    .final_score {
        font-size: 1.2rem;
        text-align: center;
        text-justify: distribute;
      }
      .mood_icon {
        font-size: 7rem;
      }`)
  );

  return element;
}
