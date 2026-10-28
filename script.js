/* Локальная викторина: без библиотек, хранения данных и сетевых запросов. */
"use strict";

const quizForm = document.getElementById("quiz-form");
if (quizForm) {
  const questions = Array.from(quizForm.querySelectorAll(".quiz-question"));
  const error = document.getElementById("quiz-error");
  const result = document.getElementById("quiz-result");
  const score = document.getElementById("quiz-score");
  const message = document.getElementById("quiz-message");
  const submit = quizForm.querySelector('[type="submit"]');
  const reset = quizForm.querySelector('[type="reset"]');
  submit.disabled = false;
  reset.disabled = false;

  function clearFeedback() {
    error.hidden = true;
    error.textContent = "";
    result.hidden = true;
    questions.forEach((question) => {
      question.classList.remove("is-correct", "is-incorrect", "is-missing");
      question.querySelector(".quiz-feedback").hidden = true;
      question.querySelectorAll(".quiz-option").forEach((option) => {
        option.classList.remove("correct-option", "wrong-option");
      });
    });
  }

  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFeedback();
    const missing = questions.filter((question) => !question.querySelector("input:checked"));
    if (missing.length) {
      error.textContent = "Выберите ответ в каждом вопросе. Осталось без ответа: " + missing.length + ".";
      error.hidden = false;
      missing.forEach((question) => question.classList.add("is-missing"));
      missing[0].querySelector("input").focus();
      return;
    }

    let correctCount = 0;
    questions.forEach((question) => {
      const selected = question.querySelector("input:checked");
      const correct = question.dataset.answer;
      const isCorrect = selected.value === correct;
      if (isCorrect) correctCount += 1;
      question.classList.add(isCorrect ? "is-correct" : "is-incorrect");
      question.querySelector(".answer-status").textContent = isCorrect
        ? "Верно!" : "Пока неверно. Правильный ответ отмечен в списке.";
      question.querySelectorAll("input").forEach((input) => {
        if (input.value === correct) input.closest("label").classList.add("correct-option");
        else if (input.checked) input.closest("label").classList.add("wrong-option");
      });
      question.querySelector(".quiz-feedback").hidden = false;
    });

    score.textContent = correctCount + " из " + questions.length;
    message.textContent = correctCount === questions.length
      ? "Отлично! Вы знаете основные преобразования Байкова. Попробуйте объяснить, какая из реформ сильнее всего изменила жизнь горожан."
      : correctCount >= 3
        ? "Хороший результат! Прочитайте объяснения под вопросами и попробуйте ещё раз."
        : "Начало положено. Вернитесь к карточкам преобразований, прочитайте объяснения и повторите викторину.";
    result.hidden = false;
    result.focus();
  });

  quizForm.addEventListener("change", clearFeedback);
  quizForm.addEventListener("reset", () => {
    clearFeedback();
    questions[0].querySelector("input").focus();
  });
}
