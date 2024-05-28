var cartItems = document.getElementsByClassName('product-item'); //products in the right panel


function remember(event){
}
function rename(event){
}

//function to delete a product from the cart and the left panel
function deleteProduct(event){
    var removeListItemButtons = document.getElementsByClassName('cancel');
    for(var i = 0; i< removeListItemButtons.length; i++){
        var button = removeListItemButtons[i];
        button.addEventListener('click', function(event){
            var buttonClicked = event.target;
            var productItem = buttonClicked.parentElement.parentElement;
            var productName = productItem.getElementsByClassName('name')[0].textContent.trim();

            // remove from the left panel
            productItem.remove();

            // remove from the right panel
            console.log(cartItems);
            updateRightPanel();
        });
    }
   
}

function buy(event){
}

//function to !increase the quantity of a product in the cart
function increase(event){
    var buttonClicked = event.target;
    var productItem = buttonClicked.parentElement.parentElement;
    var productQuantity = productItem.getElementsByClassName('number')[0];

    // increase the quantity
    var currentQuantity = parseInt(productQuantity.textContent);
    currentQuantity++;
    if(currentQuantity > 1){
        productItem.getElementsByClassName('minus')[0].style.backgroundColor = '#DB2828';
        productItem.getElementsByClassName('minus')[0].style.boxShadow = '0 4px #BF2728';
    }
    productQuantity.textContent = currentQuantity; 
    updateRightPanel();
}

//function to !decrease the quantity of a product in the cart
function decrease(event){
    var buttonClicked = event.target;
    var productItem = buttonClicked.parentElement.parentElement;
    var productQuantity = productItem.getElementsByClassName('number')[0];

    // decrease the quantity
    var currentQuantity = parseInt(productQuantity.textContent);
    if (currentQuantity > 1) { 
        currentQuantity--;
        if(currentQuantity == 1){
            buttonClicked.style.backgroundColor = '#EF9F9E';
            buttonClicked.style.boxShadow = '0 4px #EF9F9E';
        }
    }
    productQuantity.textContent = currentQuantity; 
    updateRightPanel();
}

function addProduct(event) {
    event.preventDefault(); // prevent form submission

    // get the product
    var productName = document.querySelector('.product-name').value;

    var newProduct = document.createElement('section');
    newProduct.className = 'product';
    newProduct.style.height = '51.2px';

    var nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    nameDiv.textContent = productName;

    var quantityDiv = document.createElement('div');
    quantityDiv.className = 'quantity';

    var minusButton = document.createElement('button');
    minusButton.className = 'minus';
    minusButton.textContent = '-';
    minusButton.onclick = decrease;
    minusButton.style.backgroundColor = '#EF9F9E';
    minusButton.style.boxShadow = '0 4px #EF9F9E';

    var numberButton = document.createElement('button');
    numberButton.className = 'number';
    numberButton.textContent = '1';
    numberButton.disabled = true;

    var plusButton = document.createElement('button');
    plusButton.className = 'plus';
    plusButton.textContent = '+';
    plusButton.onclick = increase;

    quantityDiv.appendChild(minusButton);
    quantityDiv.appendChild(numberButton);
    quantityDiv.appendChild(plusButton);

    var statusDiv = document.createElement('div');
    statusDiv.className = 'status';

    var isBoughtButton = document.createElement('button');
    isBoughtButton.className = 'isBought';
    isBoughtButton.textContent = 'Куплено';
    isBoughtButton.onclick = buy;

    var cancelButton = document.createElement('button');
    cancelButton.className = 'cancel';
    cancelButton.textContent = 'x';
    cancelButton.onclick = deleteProduct;

    statusDiv.appendChild(isBoughtButton);
    statusDiv.appendChild(cancelButton);

    newProduct.appendChild(nameDiv);
    newProduct.appendChild(quantityDiv);
    newProduct.appendChild(statusDiv);

    document.querySelector('.product-box').appendChild(newProduct);
    updateRightPanel();

    document.querySelector('.product-name').value = '';
    document.querySelector('.product-name').focus();
}   

function updateRightPanel() {
    var products = document.getElementsByClassName('product'); //products in the left panel
    // to clear the right panel
    var remainingItems = document.getElementsByClassName('remaining-item')[0];
    var boughtItems = document.getElementsByClassName('bought-item')[0];
    remainingItems.innerHTML = '';
    boughtItems.innerHTML = '';

    // update the right panel (check each product)
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var productName = product.getElementsByClassName('name')[0].textContent.trim();
        var productQuantity = product.getElementsByClassName('number')[0].textContent;
        var productStatus = product.getElementsByClassName('isBought')[0].textContent.trim();

        // create a new product item for the right panel
        var productItem = document.createElement('span');
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
