const quizData = [{
    question: "What is the Capital of France?",
    Options: ["Lodon", "Berlin", "Paris", "Rome"],
    correct: "Paris"
},
{
    question: "Which language runs in a web browser",
    Options: ["Python", "C", "Java", "JavaScript"],
    correct: "JavaScript"
},
{
    question: "What does Css stands for?",
    Options: ["Central Serial sever", "Coding seek sever", "Computer styled syntax", "Cascading style sheets"],
    correct: "Cascading style sheets"
}
];

class Question{
    constructor(Question,options,correct){
        this.question=this.question;
        this.options=options;
        this.correct=correct;
    }

    isCorrectAnswer(answer){
        return this.correct===answer;
    }
}

class Quiz {
    constructor(question) {
        this.question = question.map(
            q => new Question(q.question, q.options, q.correct)
        );
        this.currentIndex = 0;
        this.score = 0;
        this.userAnswer = [];
    }

    getCurrentQuestion() {
        return this.question[this.currentIndex];
    }

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
        }
    }

    previousQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
    }

    submitAnswer(answer) {
        const currentQ = this.getCurrentQuestion();
        const isCorrect = currentQ.isCorrectAnswer(answer);
        if (this.userAnswers[this.currentIndex] === undefined) {
            if (isCorrect) this.score++;
        } else {
            const prevAnswer = this.userAnswers[this.currentIndex];
            if (prevAnswer !== currentQ.correct && isCorrect) this.score++;
            if (prevAnswer !== currentQ.correct && !isCorrect) this.score--;
        }
        this.userAnswers[this.currentIndex] = answer;
        return isCorrect;
    }

    isComplete() {
        return this.userAnswer.length === this.questions.length;
    }
}

//DOM 
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const resultSection = document.getElementById("result-section");
const scoreText = document.getElementById("score-text");
const summary = document.getElementById("summary");

const quiz = new Quiz(quizData);

//render logic
function renderQuestion(){
    const currentQ= quiz.getCurrentQuestion();
    questionText.textContent=currentQ.question;

    optionsList.innerHTML="",
    currentQ.options.forEach(option=>{
        const li = document.createElement('li');
        li.classList.add("list-group-item", "list-group-item-action");
        li.textContent=option;
        li.tabIndex=0;
        li.setAttribute("role", "button");

        if(quiz.userAnswer[quiz.currentIndex]===option){
            li.classList.add("active");
        }

        li.addEventListener("click", () => {
            const wasCorrect=quiz.submitAnswer(option);
            updateFeedeback(option, wasCorrect);
            renderQuestion();
        });

        optionsList.appendChild(li);
    });

    updateNavigation();
    updateProgress();
}
function updateFeedeback(option,isCorrect)
{
    [...optionsList.children].forEach(li=>{
        li.classList.remove("correct","incorrect","active");
        if(li.textContent===option){
        li.classList.add(isCorrect ? "correct":"incorrect");
    }
    });
    
}

function updateNavigation(){
    prevBtn.disabled=quiz.currentIndex===0;
    nextBtn.disabled= quiz.currentIndex >= quiz.questions.length-1;
    submitBtn.classList.toggle("d-one",!quiz.isComplete())
}

function updateProgress(){
    const percent=((quiz.currentIndex+1)/quiz.questions.length)*100;
progressBar.style.width=`${percent}%`;
}

nextBtn.addEventListener("click", ()=> {
    quiz.nextQuestion();
    renderQuestion();
});

prevBtn.addEventListener("click",()=>{
  quiz.previousQuestion();
  renderQuestion();
});

function displayResults(){
    document.querySelector("main").classList.add("d-one");
    resultSection.classList.remove("d-none");

    
    scoreText.textContent='you scored${quiz.score} out of ${quiz.questions.length}';

    summary,innerHTML=quiz.questions.map((q,index)=>{
        const userAnswer=quiz.userAnswer[index];
        const isCorrect=userAnswer===q.correct;
        return`
        <div class="mb-2> 
        <strong>Q${index+1}:</strong>${q.question} <br/>
        <span style="color:${isCorrect?'green':'red'}">
        Your answer:$(userAnswer||"No answer)(${isCorrect?'Correct':'Incorrect'})
        </span>
        </div>
        `;
    })
    .join("");

    const name = promp("Enter your name;");
    if(validateName(name)){
        const date = new Date().toLocaleString();
        const record = {
            name,
            score:quiz.questions.length,
            date
        };
        saveResult(record);
    } else{
      alert("Invalid name.Must be alphanumeric and 3-15 characters.");
    }
}

function validateName(name){
    let results = 
    JSON.parse(localStorage.getItem("quizResults"))||[];
    results.push(record);
    localStorage.setItem("quizResults", JSON.stringify(results));
}

//renderQuestion();

document.addEventListener("DOMContentLoaded", renderQuestion);