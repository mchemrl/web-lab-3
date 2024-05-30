var products = JSON.parse(localStorage.getItem('products')) || [];
var editedName = '';
function product(name, quantity, status) {
    return { 
        name, 
        quantity, 
        status, 
        plusVisible: true, 
        minusVisible: true, 
        cancelVisible: true ,
        minusColor: quantity > 1 ? '#DB2828' : '#EF9F9E',
        minusShadow: quantity > 1 ? '0 4px #BF2728' : '0 4px #EF9F9E'
    };
}

//function to remember the name of the product in the cart
function remember(event){
    productItem = event.target.parentElement;
    editedName = productItem.getElementsByClassName('name')[0].textContent.trim();
    
}

//function to rename a product in the cart
function rename(event){
    var productItem = event.target.parentElement;
    let newName = productItem.getElementsByTagName('p')[0].textContent.trim();
    if (newName !== "") {
        // Update the product name in the products array
        let productIndex = products.findIndex(product => product.name === editedName);
        if (productIndex !== -1) {
            products[productIndex].name = newName;
        }
    } else {
        // If newName is empty, set it to the previous name
        productItem.getElementsByTagName('p')[0].textContent = editedName;
    }
    localStorage.setItem('products', JSON.stringify(products));
    updateRightPanel();
}
//function to delete a product from the cart and the left panel
function deleteProduct(event){
    var removeListItemButtons = document.getElementsByClassName('cancel');
    for(let i = 0; i< removeListItemButtons.length; i++){
        let button = removeListItemButtons[i];
        button.addEventListener('click', function(event){
            let buttonClicked = event.target;
            let productItem = buttonClicked.parentElement.parentElement;
            let productName = productItem.getElementsByClassName('name')[0].textContent.trim();

            productItem.remove();
            let productIndex = products.findIndex(product => product.name === productName);
            products.splice(productIndex, 1);
            localStorage.setItem('products', JSON.stringify(products));

            updateRightPanel();
        });
    }
}

//function to change the status of the product in the cart
function buy(event){
    var buttonClicked = event.target;
    let productItem = buttonClicked.parentElement.parentElement;
    let productName = productItem.getElementsByClassName('name')[0].textContent;
    let productIndex = products.findIndex(product => product.name === productName);

    // change the status
    if (buttonClicked.textContent === 'Куплено') {
        buttonClicked.textContent = 'Не куплено';
        productItem.getElementsByClassName('cancel')[0].style.visibility='hidden';
        productItem.getElementsByClassName('cancel')[0].style.position='absolute';
        productItem.getElementsByClassName('plus')[0].style.visibility='hidden';
        productItem.getElementsByClassName('minus')[0].style.visibility='hidden';
        buttonClicked.style.marginRight = '7%';
        productItem.getElementsByClassName('name')[0].style.textDecoration = 'line-through';
        productItem.getElementsByClassName('name')[0].contentEditable = 'false';

        // update the product status in the array
        products[productIndex].status = 'Не куплено';
        products[productIndex].plusVisible = false;
        products[productIndex].minusVisible = false;
        products[productIndex].cancelVisible = false;
    } else {
        buttonClicked.textContent = 'Куплено';
        productItem.getElementsByClassName('cancel')[0].style.visibility='visible';
        productItem.getElementsByClassName('cancel')[0].style.position='relative';
        productItem.getElementsByClassName('plus')[0].style.visibility='visible';
        productItem.getElementsByClassName('minus')[0].style.visibility='visible';
        buttonClicked.style.marginRight = '0';
        productItem.getElementsByClassName('name')[0].contentEditable = 'true';
        productItem.getElementsByClassName('name')[0].style.textDecoration = 'none';

        // update the product status in the array
        products[productIndex].status = 'Куплено';
        products[productIndex].plusVisible = true;
        products[productIndex].minusVisible = true;
        products[productIndex].cancelVisible = true;
    }
    localStorage.setItem('products', JSON.stringify(products));
    updateRightPanel();
}

function changeQuantity(event, delta) {
    var buttonClicked = event.target;
    let productItem = buttonClicked.closest('.product');
    let productQuantity = productItem.querySelector('.number');
    let productName = productItem.querySelector('.name').textContent.trim();

    // to find product
    let productIndex = products.findIndex(product => product.name === productName);

    let currentQuantity = parseInt(productQuantity.textContent);
    currentQuantity = Math.max(1, currentQuantity + delta);
    productQuantity.textContent = currentQuantity;

    //get minus button and change styles accordingly
    let minusButton = productItem.querySelector('.minus');

    if (currentQuantity === 1) {
        minusButton.style.backgroundColor = '#EF9F9E';
        minusButton.style.boxShadow = '0 4px #EF9F9E';
    } else {
        minusButton.style.backgroundColor = '#DB2828';
        minusButton.style.boxShadow = '0 4px #BF2728';
    }
    //update local storage data
    products[productIndex].quantity = currentQuantity;
    localStorage.setItem('products', JSON.stringify(products));
    updateRightPanel();
}

function updateRightPanel() {
    let products = document.getElementsByClassName('product'); //products in the left panel
    // to clear the right panel
    let remainingItems = document.getElementsByClassName('remaining-item')[0];
    let boughtItems = document.getElementsByClassName('bought-item')[0];
    remainingItems.innerHTML = '';
    boughtItems.innerHTML = '';

    // update the right panel (check each product)
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let productName = product.getElementsByClassName('name')[0].textContent.trim();
        let productQuantity = product.getElementsByClassName('number')[0].textContent;
        let productStatus = product.getElementsByClassName('isBought')[0].textContent.trim();

        // create a new product item for the right panel
        let productItem = document.createElement('span');
        productItem.className = 'product-item';
        productItem.innerHTML = productName + ' ' + '<span class="amount">' + productQuantity + '</span>';

        // sort products by status
        if (productStatus === 'Куплено') {
            remainingItems.appendChild(productItem);
        } else {
            boughtItems.appendChild(productItem);
        }
    }
}

function handleKeyDown(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // prevent form submission
        let inputField = document.querySelector('.product-name');
        let addButton = document.querySelector('.add-button');
        if (inputField.value.trim() !== '') {
            addButton.click(); 
        }
    }
}

function addProduct(event) {
    event.preventDefault(); // prevent form submission
    var productName = document.querySelector('.product-name').value.trim();

    if (!productName) return;  // if the input field is empty, do nothing
    let newProduct = product(productName, 1, 'Куплено');
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));

    createProductElement(newProduct);

    document.querySelector('.product-name').value = '';
    document.querySelector('.product-name').focus();
    updateRightPanel();
}

// create a section for a product
function createProductElement(product) {
    let newProductElement = document.createElement('section');
    newProductElement.className = 'product';
    newProductElement.style.height = '51.2px';

    let nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    nameDiv.contentEditable = 'true';
    nameDiv.style.height = '51.2px';
    nameDiv.onfocus = remember;
    nameDiv.onblur = rename;

    let pTag = document.createElement('p');
    pTag.textContent = product.name;
    nameDiv.appendChild(pTag);

    let quantityDiv = document.createElement('div');
    quantityDiv.className = 'quantity';

    let minusButton = document.createElement('button');
    minusButton.className = 'minus';
    minusButton.textContent = '-';
    minusButton.onclick = (event) => changeQuantity(event, -1);
    minusButton.style.backgroundColor = '#EF9F9E';
    minusButton.style.boxShadow = '0 4px #EF9F9E';

    if (product.quantity === 1) {
        minusButton.style.backgroundColor = '#EF9F9E';
        minusButton.style.boxShadow = '0 4px #EF9F9E';
    } else {
        minusButton.style.backgroundColor = '#DB2828';
        minusButton.style.boxShadow = '0 4px #BF2728';
    }

    let numberButton = document.createElement('button');
    numberButton.className = 'number';
    numberButton.textContent = product.quantity;
    numberButton.disabled = true;

    let plusButton = document.createElement('button');
    plusButton.className = 'plus';
    plusButton.textContent = '+';
    plusButton.onclick = (event) => changeQuantity(event, 1);

    quantityDiv.appendChild(minusButton);
    quantityDiv.appendChild(numberButton);
    quantityDiv.appendChild(plusButton);

    let statusDiv = document.createElement('div');
    statusDiv.className = 'status';

    let isBoughtButton = document.createElement('button');
    isBoughtButton.className = 'isBought';
    isBoughtButton.textContent = product.status;
    isBoughtButton.onclick = buy;

    let cancelButton = document.createElement('button');
    cancelButton.className = 'cancel';
    cancelButton.textContent = 'x';
    cancelButton.onclick = deleteProduct;

    if (product.status === 'Не куплено') {
        nameDiv.style.textDecoration = 'line-through';
        nameDiv.contentEditable = 'false';
        isBoughtButton.style.marginRight = '7%';
        cancelButton.style.visibility = 'hidden';
        cancelButton.style.position = 'absolute';
        minusButton.style.visibility = 'hidden';
        plusButton.style.visibility = 'hidden';
    }

    statusDiv.appendChild(isBoughtButton);
    statusDiv.appendChild(cancelButton);

    newProductElement.appendChild(nameDiv);
    newProductElement.appendChild(quantityDiv);
    newProductElement.appendChild(statusDiv);

    document.querySelector('.product-box').appendChild(newProductElement);
    updateRightPanel();
}

//after
function addProductAfterReload(product) {
    createProductElement(product);
}

window.onload = function() {
    products = JSON.parse(localStorage.getItem('products')) || [];
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        addProductAfterReload(product);
    }
}