const transactionForm = document.getElementById("transaction-form");

const transactionType = document.getElementById("type");
const transactionAmount = document.getElementById("amount");
const transactionCategory = document.getElementById("category");
const transactionDate = document.getElementById("date");
const transactionDescription = document.getElementById("description");
const submitBtn = document.querySelector("button[type='submit']");

const transactionsList = document.getElementById("transactions-list");

const transactions = [];

let editingTransactionId = null;

transactionForm.addEventListener("submit", e => {
    e.preventDefault();
    saveTransaction();
    renderTransactions();
    resetTransaction();
})

transactionsList.addEventListener("click", e => {
    const button = e.target.closest("button");

    if(!button) {
        return;
    }

    const card = button.closest(".transaction-card");

    if(!card) {
        return;
    }

    const cardId = card.dataset.id

    if(button.classList.contains("delete-btn")) {
        deleteTransaction(cardId);
        renderTransactions();
        if(editingTransactionId === cardId) {
            resetTransaction();
        }
    }

    if(button.classList.contains("edit-btn")) {
        editTransaction(cardId);
    }
})

function saveTransaction() {
    const transactionId = editingTransactionId ? editingTransactionId : crypto.randomUUID();

    const transaction = {
        id: transactionId,
        type: transactionType.value,
        amount: Number(transactionAmount.value),
        category: transactionCategory.value,
        date: transactionDate.value,
        description: transactionDescription.value
    }

    if(editingTransactionId) {
        const index = transactions.findIndex(transaction => transaction.id === editingTransactionId);
        
        if(index === -1) {
            return;
        }
        
        transactions[index] = transaction
    } else {
        transactions.push(transaction);
    }
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

    const deleteTransactionBtn = document.createElement("button");
    deleteTransactionBtn.classList.add("delete-btn");
    deleteTransactionBtn.textContent = "Delete";

    const editTransactionBtn = document.createElement("button");
    editTransactionBtn.classList.add("edit-btn");
    editTransactionBtn.textContent = "Edit";

    transactionCard.append(transCardType, transCardAmount, transCardCategory, transCardDate, transCardDescription, editTransactionBtn, deleteTransactionBtn);
    return transactionCard;
}

function deleteTransaction(id) {
    const index = transactions.findIndex(transaction => transaction.id === id);

    if(index === -1) {
        return;
    }

    transactions.splice(index, 1);
}

function resetTransaction() {
    transactionType.value = "";
    transactionAmount.value = "";
    transactionCategory.value = "";
    transactionDate.value = "";
    transactionDescription.value = "";

function editTransaction(transactionId) {
    const index = transactions.findIndex(transaction => transaction.id === transactionId);

    if(index === -1) {
        return;
    }

    const {id, type, amount, category, date, description} = transactions[index];

    editingTransactionId = id;
    transactionType.value = type;
    transactionAmount.value = amount;
    transactionCategory.value = category;
    transactionDate.value = date;
    transactionDescription.value = description;

    submitBtn.textContent = "Update transaction";
}