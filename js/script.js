const transactionForm = document.getElementById("transaction-form");

const transactionType = document.getElementById("type");
const transactionAmount = document.getElementById("amount");
const transactionCategory = document.getElementById("category");
const transactionDate = document.getElementById("date");
const transactionDescription = document.getElementById("description");
const submitBtn = document.querySelector("button[type='submit']");
const summaryBalance = document.getElementById("balance");
const summaryIncomes = document.getElementById("income");
const summaryExpenses = document.getElementById("expenses");

const transactionsList = document.getElementById("transactions-list");

let transactions = [];

try{
    const transactionsData = JSON.parse(localStorage.getItem("transactionsData"))
    if(transactionsData !== null && Array.isArray(transactionsData)) {
        transactions = transactionsData;
    }
} catch(err) {
    transactions = [];
}

let editingTransactionId = null;

const categories = {
    income: ["salary", "freelance", "business", "investment", "gifts"],
    expense: ["housing", "groceries", "transportation", "bills", "medical", "entertainment"]
}

transactionForm.addEventListener("submit", e => {
    e.preventDefault();
    if(!validateTransForm()) {
        return;
    }
    const transactionSaved = saveTransaction();

    if(transactionSaved) {
        resetTransaction();
        renderApp();
    }
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
        renderApp();
        if(editingTransactionId === cardId) {
            resetTransaction();
        }
    }

    if(button.classList.contains("edit-btn")) {
        editTransaction(cardId);
    }
})

transactionForm.addEventListener("change", e => {
    const id = e.target.id;
    const inputEl = e.target;

    if(id === "type") {
        const validateChange = validateTransType();
        const isHaveErrMsgType = checkErrorMsg(inputEl);
        const isHaveErrMsgCat = checkErrorMsg(transactionCategory);

        if(validateChange) {
            if(isHaveErrMsgType) {
                removeErrorMsg(inputEl);
            }

            if(isHaveErrMsgCat) {
                removeErrorMsg(transactionCategory);
            }
            
            renderTransactionCategoryOptions(inputEl.value);
        }
    } else if(id === "category") {
        const selectedCategory = inputEl.value;

        for(const categoryType in categories) {
            if(categories[categoryType].includes(selectedCategory)) {
                transactionType.value = categoryType;
                break;
            }
        }

        const validateChange = validateTransCategory();
        const errMsgInTransType = checkErrorMsg(transactionType);
        const errMsgInTransCat = checkErrorMsg(inputEl);

        if(validateChange) {
            if(errMsgInTransType) {
                removeErrorMsg(transactionType);
            }
            if(errMsgInTransCat) {
                removeErrorMsg(inputEl);
            }
            renderTransactionCategoryOptions(transactionType.value);
            transactionCategory.value = selectedCategory;
        }

    } else if(id === "amount") {
        const validateChange = validateTransAmount();
        const isHaveErrMsg = checkErrorMsg(inputEl);

        if(validateChange) {
            if(isHaveErrMsg) {
                removeErrorMsg(inputEl);
            }
        }
    } else if(id === "date") {
        const validateChange = validateTransDate();
        const isHaveErrMsg = checkErrorMsg(inputEl);

        if(validateChange) {
            if(isHaveErrMsg) {
                removeErrorMsg(inputEl);
            }
        }
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
            return false;
        }
        
        transactions[index] = transaction;
    } else {
        transactions.push(transaction);
    }

    localStorage.setItem("transactionsData", JSON.stringify(transactions));
    return true;
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
    transCardAmount.textContent = `Amount ${currencyFormatter(amount)}`;

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
    localStorage.setItem("transactionsData", JSON.stringify(transactions));
}

function resetTransaction() {
    transactionType.selectedIndex = 0;
    transactionAmount.value = "";
    transactionCategory.value = "";
    transactionDate.value = "";
    transactionDescription.value = "";
    submitBtn.textContent = "Add transaction";
    editingTransactionId = null;
    removeErrorMsg();
    renderTransactionCategoryOptions();
}

function editTransaction(transactionId) {
    const index = transactions.findIndex(transaction => transaction.id === transactionId);

    if(index === -1) {
        return;
    }

    resetTransaction()

    const {id, type, amount, category, date, description} = transactions[index];

    editingTransactionId = id;
    transactionType.value = type;

    renderTransactionCategoryOptions(type);
    transactionCategory.value = category;

    transactionAmount.value = amount;
    transactionDate.value = date;
    transactionDescription.value = description;

    submitBtn.textContent = "Update transaction";
}

function renderTransactionCategoryOptions(type = "") {
    if(type === "") {
        transactionCategory.innerHTML = "<option value='' selected disabled>Select transaction category</option>";

        for(const categoryType in categories) {
            const optGroup = document.createElement("optgroup");
            optGroup.label = categoryType.charAt(0).toUpperCase() + categoryType.slice(1,);
            
            categories[categoryType].forEach(category => {
                const option = createOption(category);
                optGroup.appendChild(option);
            })

            transactionCategory.appendChild(optGroup);
        }
    } else if(type === "income" || type === "expense") {
        transactionCategory.innerHTML = `<option value='' selected disabled>Select ${type} category</option>`;

        categories[type].forEach(category => {
                const option = createOption(category);
                transactionCategory.appendChild(option);
            })
    }
}

function createOption(category) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1,);
    return option;
}

function validateTransType() {
    const transType = transactionType;

    if(transType.value === "") {
        const errMsg = "Please select transaction type.";
        showErrorMsg(transType, errMsg);
    }

    return transType.value !== "";
}

function validateTransAmount() {
    const transAmount = transactionAmount;

    if(transAmount.value.trim() === "") {
        const errMsg = "Please input transaction amount.";
        showErrorMsg(transAmount, errMsg);
        return false;
    }
    
    const inputAmount = Number(transAmount.value);

    if(inputAmount <= 0) {
        const errMsg = "Transaction amount must be greater than 0.";
        showErrorMsg(transAmount, errMsg);
        return false;
    }

    if(Number.isFinite(inputAmount)) {
        return true;
    } else {
        const errMsg = "Please input valid transaction amount."
        showErrorMsg(transAmount, errMsg);
        return false;
    }
}

function validateTransCategory() {
    const transType = transactionType;
    const transCategory = transactionCategory;

    if(transCategory.value === "") {
        const errMsg = "Please select transaction category.";
        showErrorMsg(transCategory, errMsg);
        return false;
    }

    const validTransType = transType.value === "income" || transType.value === "expense";

    if(validTransType && categories[transType.value].includes(transCategory.value)) {
        return true;
    } else {
        const errMsg = "Wrong type and transaction category.";
        showErrorMsg(transCategory, errMsg);
        return false;
    }
}

function validateTransDate() {
    const transDate = transactionDate;

    if(transDate.value === "") {
        const errMsg = "Please input transaction date.";
        showErrorMsg(transDate, errMsg);
    }

    return transDate.value !== "";
}

function validateTransForm() {
    if(!validateTransType()) {
        return false;
    }

    if(!validateTransAmount()) {
        return false;
    }

    if(!validateTransCategory()) {
        return false;
    }

    if(!validateTransDate()) {
        return false;
    }

    return true;
}

function checkErrorMsg(input) {
    const inputContainer = input.closest(".form-group");

    if(inputContainer) {
        const foundErrorMsg = inputContainer.querySelector(".error-message");
        return foundErrorMsg ? true: false;
    }

    return false;
}

function showErrorMsg(input, message) {
    const inputContainer = input.closest(".form-group");

    if(inputContainer) {
        const foundErrorMsg = inputContainer.querySelector(".error-message");
        
        if(foundErrorMsg) {
            foundErrorMsg.remove();
        }

        const errorMessage = document.createElement("p");
        errorMessage.classList.add("error-message");
        errorMessage.textContent = message;
        inputContainer.appendChild(errorMessage);
    }
}

function removeErrorMsg(input = "") {
    if(input === "") {
        const errorMessages = document.querySelectorAll(".error-message");

        if(errorMessages && errorMessages.length > 0) {
            errorMessages.forEach(message => message.remove());
        }
        
    } else {
        const inputIds = ["type", "amount", "category", "date"];

        if(inputIds.includes(input.id)) {
            const inputContainer = input.closest(".form-group");
            const errorMessage = inputContainer.querySelector(".error-message");

            if(errorMessage) {
                errorMessage.remove();
            }
        }
    }
}

function calculateIncomes() {
    return transactions.filter(transaction => transaction.type === "income").reduce((total, transaction) => total + transaction.amount, 0);
}

function calculateExpenses() {
    return transactions.filter(transaction => transaction.type === "expense").reduce((total, transaction) => total + transaction.amount, 0);
}

function calculateBalance(incomes, expenses) {
    return incomes - expenses;
}

function renderSummary() {
    const incomes = calculateIncomes();
    const expenses = calculateExpenses();
    const balance = calculateBalance(incomes, expenses);

    summaryBalance.textContent = `${currencyFormatter(balance)}`;
    summaryIncomes.textContent = `${currencyFormatter(incomes)}`;
    summaryExpenses.textContent = `${currencyFormatter(expenses)}`;
}

const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

function currencyFormatter(value) {
    return formatter.format(value);
}

function renderApp() {
    renderTransactions();
    renderSummary();
}

renderApp();

renderTransactionCategoryOptions();