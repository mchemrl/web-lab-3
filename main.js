var cartItems = document.getElementsByClassName('product-item'); //products in the right panel
var products = JSON.parse(localStorage.getItem('products')) || [];
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


function remember(event){
    var productItem = event.target.parentElement;
    var editedName = productItem.getElementsByClassName('name')[0].textContent.trim();
}
function rename(event){
    var productItem = event.target.parentElement;
    var newName = productItem.getElementsByTagName('p')[0].textContent.trim();
    if (newName !== "") {
        editedName = newName;
    } else {
        productItem.getElementsByTagName('p')[0].textContent = editedName;
    }
    updateRightPanel();
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

            // Find the corresponding product in the products array
            var productIndex = products.findIndex(product => product.name === productName);

            // Remove the product from the array
            products.splice(productIndex, 1);

            // Save the updated products array to local storage
            localStorage.setItem('products', JSON.stringify(products));

            // remove from the right panel
            console.log(cartItems);
            updateRightPanel();
        });
    }
}

function buy(event){
    var buttonClicked = event.target;
    var productItem = buttonClicked.parentElement.parentElement;

    // Get the product name
    var productName = productItem.getElementsByClassName('name')[0].textContent;

    // Find the corresponding product in the products array
    var productIndex = products.findIndex(product => product.name === productName);

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

        // Update the product status in the array
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

        // Update the product status in the array
        products[productIndex].status = 'Куплено';
        products[productIndex].plusVisible = true;
        products[productIndex].minusVisible = true;
        products[productIndex].cancelVisible = true;
    }

    // Save the updated products array to local storage
    localStorage.setItem('products', JSON.stringify(products));

    updateRightPanel();
}

function changeQuantity(event, delta) {
    var buttonClicked = event.target;
    var productItem = buttonClicked.closest('.product');
    var productQuantity = productItem.querySelector('.number');
    var productName = productItem.querySelector('.name').textContent.trim();

    // to find product
    var productIndex = products.findIndex(product => product.name === productName);

    var currentQuantity = parseInt(productQuantity.textContent);
    currentQuantity = Math.max(1, currentQuantity + delta);
    productQuantity.textContent = currentQuantity;

    //get minus button and change styles accordingly
    var minusButton = productItem.querySelector('.minus');

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


function addProduct(event) {
    event.preventDefault(); // prevent form submission
    var productName = document.querySelector('.product-name').value;

    products.push({
        name: productName,
        quantity: 1,
        status: 'Куплено',
        plusVisible: true,
        minusVisible: true,
        cancelVisible: true
    });


    localStorage.setItem('products', JSON.stringify(products));

    // get the product

    var newProduct = document.createElement('section');
    newProduct.className = 'product';
    newProduct.style.height = '51.2px';

    var nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    nameDiv.contentEditable = 'true';
    nameDiv.style.height = '51.2px';
    nameDiv.addEventListener('focus', function(event){
    nameDiv.style.height = '30%';nameDiv.style.marginTop = '1%';
    nameDiv.style.paddingBottom = '1%';
    nameDiv.style.paddingTop = '2%';
    nameDiv.style.marginBottom = '2%';
    nameDiv.style.textIndent = '3px';
    }); 
    
    var pTag = document.createElement('p');
    pTag.textContent = productName;
    
    nameDiv.appendChild(pTag);

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

function addProductAfterReload(product) {
    let productName = product.name;
    let productQuantity = product.quantity;
    let productStatus = product.status;

    var newProduct = document.createElement('section');
    newProduct.className = 'product';
    newProduct.style.height = '51.2px';

    var nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    nameDiv.contentEditable = 'true';
    nameDiv.style.height = '51.2px';
    nameDiv.addEventListener('focus', function(event){
        nameDiv.style.height = '30%';
        nameDiv.style.marginTop = '1%';
        nameDiv.style.paddingBottom = '1%';
        nameDiv.style.paddingTop = '2%';
        nameDiv.style.marginBottom = '2%';
        nameDiv.style.textIndent = '3px';
    }); 

    var pTag = document.createElement('p');
    pTag.textContent = productName;
    nameDiv.appendChild(pTag);

    var quantityDiv = document.createElement('div');
    quantityDiv.className = 'quantity';    

    let minusButton = document.createElement('button');
    minusButton.style.backgroundColor = product.quantity > 1 ? '#DB2828' : '#EF9F9E';
    minusButton.style.boxShadow = product.quantity > 1 ? '0 4px #BF2728' : '0 4px #EF9F9E';
    minusButton.style.display = product.minusVisible ? 'block' : 'none';
 
    minusButton.className = 'minus';
    minusButton.textContent = '-';
    minusButton.onclick = changeQuantity;

    var numberButton = document.createElement('button');
    numberButton.className = 'number';
    numberButton.textContent = productQuantity;
    numberButton.disabled = true;

    let plusButton = document.createElement('button');
    plusButton.style.display = product.plusVisible ? 'block' : 'none';
    plusButton.className = 'plus';
    plusButton.textContent = '+';
    plusButton.onclick = changeQuantity;

    quantityDiv.appendChild(minusButton);
    quantityDiv.appendChild(numberButton);
    quantityDiv.appendChild(plusButton);

    var statusDiv = document.createElement('div');
    statusDiv.className = 'status';

    var isBoughtButton = document.createElement('button');
    isBoughtButton.className = 'isBought';
    isBoughtButton.textContent = productStatus;
    if(productStatus === 'Не куплено'){
        isBoughtButton.style.marginRight = '7%';
      //  let pElement = newProduct.querySelector('.name p');
        //pElement.style.textDecoration = 'line-through';
    }
    isBoughtButton.onclick = buy;

    let cancelButton = document.createElement('button');
    cancelButton.style.visibility = product.cancelVisible ? 'visible' : 'hidden';
    cancelButton.style.position = product.cancelVisible ? 'relative' : 'absolute';
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
}

window.onload = function() {
    products = JSON.parse(localStorage.getItem('products')) || [];
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        addProductAfterReload(product);
    }
}