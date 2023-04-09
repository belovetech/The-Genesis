// BUDGET CONTROLLER
let budgetController = (function () {

    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1
    }

    Expense.prototype.calcPercentages = function(totalInccome) { 
        if (totalInccome > 0) {
            this.percentage = Math.round((this.value / totalInccome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    let calculateTotals = function(type) {
        let sum = 0;

        data.allItems[type].forEach(function(cur){
            sum += cur.value; 
        });

        data.totals[type] = sum;
    };

    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            let newItem, ID;

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;       // ID = Last ID + 1              
            } else {
                ID = 0;
            }

            // Create new item
            if (type === 'exp') {
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            }

            // Push it into the data Structure
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;
        },

        deleteItem: function(type, id) {
            let ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },

        calculateBudget: function() {
            // 1. Calculate total income and expenses
            calculateTotals('inc');
            calculateTotals('exp');

            // 2. calculate the budget income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // 3. calculate the percentage of income that we spent  expenses / income * 100
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentages(data.totals.inc);
            });            
        },

        getPercentages: function() {
           let allPerc = data.allItems.exp.map(function(cur) {
              return cur.getPercentage();
            });
            return allPerc;
        },
    
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };



})();

 
// UI CONTROLLER
let UIController = (function() {

    const DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn:'.add__btn',
        expensesContainer: ".expenses__list",
        incomeContainer: ".income__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: '.container',
        expensesPercLabel: ".item__percentage",
        dateLabel: ".budget__title--month",
    }
    
   let formatNumber = function(num, type) {
        let numSplit, int, dec;

        num = Math.abs(num);  // if num is 2000.00, the output = 2000
        num = num.toFixed(2);  // 2000.00
        numSplit = num.split('.'); // ['2000', '00']

        int = numSplit[0];   // '2000'
        if (int.length > 3) {
            //  integer should have comma after the integer position 0
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];


        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    
    let nodeListforEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return{
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            let html, newHTML, element;

            //  Create HTML string with plaaceholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = `<div class="item clearfix" id="inc-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix">
                    <div class="item__value">%value%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
                </div>`
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = `<div class="item clearfix" id="exp-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix">
                    <div class="item__value">%value%</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
                 </div>`
            }

            // Replace the string with actual data
            newHTML = html.replace("%id%", obj.id)
            newHTML = newHTML.replace("%description%", obj.description)
            newHTML = newHTML.replace("%value%", formatNumber(obj.value, type))

            // Insert the Html into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);
        },

        deleteListItem: function(selectorID) {
            let el;

            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearField: function() {
            let field, fieldArr;

            field = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

            fieldArr = Array.from(field); // Change Nodelist to Array

            fieldArr.forEach(function(cur, i, arr) {
                cur.value = "";
            });
           
            fieldArr[0].focus();
        },

        displayBudget: function(obj) {
            let type;

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }
        },

        displayPercentages: function(percentages) {

            let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

            nodeListforEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },

        displayMonth: function() {
            let now, month, months, year;

            now = new Date();
            month = now.getMonth();
            months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 
                     'October', 'November', 'December'];
            year = now.getFullYear();

            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedInput: function() {

            let fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );

            nodeListforEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },

        getDOMStrings: function() {
            return DOMStrings;
        }   
    };
    
})();


// GLOBALCONTROLLER
let Controller = (function(budgetCtrl, UICtrl) {
    
    let setupEventListeners = function() {
        let DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
           if (event.keycode === 13 || event.which === 13)  {
             ctrlAddItem();
           }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedInput);
    };

    
    let updateBudget = function() {
        // 1. Calculate the Budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
       let budget = budgetCtrl.getBudget();

        // 3. Display the budget to the UI
        UICtrl.displayBudget(budget);
    };

    let ctrlAddItem = function() {
        let input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

       if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

        // 2. Add item to the budegt controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Clear input field
        UICtrl.clearField();

        // 5.Calculate and Update budget
        updateBudget();

        // 6. claculate and update percentages
        updatePercentages();

       }
        
    };

    let updatePercentages = function() {
        // 1. calculate percentage
        budgetCtrl.calculatePercentages();

        // 2. get percentage
        let percentages = budgetCtrl.getPercentages();

        // 3. update percntage in the UI
        UICtrl.displayPercentages(percentages);
    };

    let ctrlDeleteItem = function(event) {
        let itemID, splitID, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {

            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Delete item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // Delete item from the UI interface
            UICtrl.deleteListItem(itemID);

            // Update the budget
            updateBudget();

            // calculate and update percentages
            updatePercentages();
        }

    };

    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            setupEventListeners();
        }
    }
})(budgetController, UIController);

Controller.init(); 


