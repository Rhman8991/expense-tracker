const transactionForm = document.getElementById("transaction-form");

const transactionType = document.getElementById("type");
const transactionAmount = document.getElementById("amount");
const transactionCategory = document.getElementById("category");
const transactionDate = document.getElementById("date");
const transactionDescription = document.getElementById("description");

const transactionsList = document.getElementById("transactions-list");

const transactions = [];

transactionForm.addEventListener("submit", e => {
    e.preventDefault();
    saveTransaction();
    renderTransactions()
    console.log(transactions);
})

function saveTransaction() {
    const transaction = {
        id: crypto.randomUUID(),
        type: transactionType.value,
        amount: Number(transactionAmount.value),
        category: transactionCategory.value,
        date: transactionDate.value,
        description: transactionDescription.value
    }
    transactions.push(transaction);
}

function renderTransactions() {
    transactionsList.innerHTML = "";

    if(transactions.length === 0) {
        const noTransactionsMsg = document.createElement("p");
        noTransactionsMsg.textContent = "No transactions yet.";
        transactionsList.appendChild(noTransactionsMsg);
        return;
    } else {
        transactions.forEach(transaction => {
            const card = createTransactionCard(transaction);
            transactionsList.appendChild(card);
        })
    }
}

function createTransactionCard(transaction) {
    const {id, type, amount, category, date, description} = transaction;

    const transactionCard = document.createElement("article");
    transactionCard.classList.add("transaction-card");
    transactionCard.dataset.id = id;

    const transCardType = document.createElement("p");
    transCardType.textContent = `Type: ${type}`;

    const transCardAmount = document.createElement("p");
    transCardAmount.textContent = `Amount $${amount}`

    const transCardCategory = document.createElement("p");
    transCardCategory.textContent = `Category: ${category.charAt(0).toUpperCase() + category.slice(1)}`;

    const transCardDate = document.createElement("p");
    transCardDate.textContent = `Date: ${date}`;

    const transCardDescription = document.createElement("p");
    transCardDescription.textContent = description === "" ? "No description" : `Description: ${description}`;

    transactionCard.append(transCardType, transCardAmount, transCardCategory, transCardDate, transCardDescription);
    return transactionCard;
}