const transactionForm = document.getElementById("transaction-form");

const transactionType = document.getElementById("type");
const transactionAmount = document.getElementById("amount");
const transactionCategory = document.getElementById("category");
const transactionDate = document.getElementById("date");
const transactionDescription = document.getElementById("description");

const transactions = [];

transactionForm.addEventListener("submit", e => {
    e.preventDefault();
    saveTransaction();
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