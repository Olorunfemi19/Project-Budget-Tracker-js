const form = document.querySelector(".add");
// This line of code helps to make sure that after a page refresh, the previously stored datas remain
let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");
const transactionHistory = document.querySelector(".transaction-history")

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");


function generateTemplate(id, source, time, amount){
    return `<li data-id="${id}">
                                    <p>
                                        <span>${source}</span>
                                        <span id="time">${time}</span>
                                    </p>
                                    <span>$${Math.abs(amount)}</span>
                                    <i class="bi bi-trash-fill delete"></i>
                                </li>`;
}

function addTransaction(source, amount){
    const time = new Date();
    const transaction = {
        id: Math.floor(Math.random()*100000),
        source: source,
        amount: amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    addTransactionDom(transaction.id, source, amount, transaction.time);
    updateStatistics();
    hideTransactionHistory()
}

function addTransactionDom(id, source, amount, time){
    if (amount > 0){
        incomeList.innerHTML += generateTemplate(id, source, time, amount);
    } else {
        expenseList.innerHTML += generateTemplate(id, source, time, amount);
    }
}

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    if (form.source.value.trim() === "" || form.amount.value === ""){
        alert("Kindly enter an input!!")
    }else{
        addTransaction(form.source.value.trim(), Number(form.amount.value));
    }          
    form.reset();
})

function getTransaction(){
    transactions.forEach(transaction => {
        if (transaction.amount > 0){
            incomeList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.time, transaction.amount);
        } else{
            expenseList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.time, transaction.amount);
        }
    });
}

function deleteTransaction(id){
    transactions = transactions.filter(transaction =>{
        return transaction.id !== id;
        
    });
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateStatistics();
    hideTransactionHistory()
    
}

incomeList.addEventListener("click", event => {
    if (event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
    }   
})
expenseList.addEventListener("click", event => {
    if (event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
    }       
})

//Separating the Expense from Income using Array filter method.
function updateStatistics(){
    const updatedIncome = transactions
                            .filter(transaction => transaction.amount > 0)
                            .reduce((total, transaction) => total += transaction.amount, 0);

    const updatedExpense = transactions
                            .filter(transaction => transaction.amount < 0)
                            .reduce((total, transaction) => total += transaction.amount, 0)
    let UpdatedBalace = updatedIncome - Math.abs(updatedExpense); //Math.abs is used here because the value transaction.amount < 0 will return is negative, that Math fnctn returns the postive value.
    income.textContent = updatedIncome;
    expense.textContent = Math.abs(updatedExpense);
    balance.textContent = UpdatedBalace;
}

function hideTransactionHistory(){
    if (transactions.length === 0){
        transactionHistory.classList.add('hide');
    }
    else
    {
        transactionHistory.classList.remove('hide');
    }

}

//This calls all the functions at intialization;
function init(){
    updateStatistics();
    getTransaction();
    hideTransactionHistory();
}

init();