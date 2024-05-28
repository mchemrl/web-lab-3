let cart = document.getElementsByClassName('cart')[0];
let cart_items = cart.getElementsByClassName('product-item');
let edited_item_name = ""
let edited_item_quantity = 1;

function remember(event){
}
function rename(event){
}

function deleteProduct(event){
    var removeListItemButtons = document.getElementsByClassName('cancel');
    for(var i = 0; i< removeListItemButtons.length; i++){
        var button = removeListItemButtons[i];
        button.addEventListener('click', function(event){
            var buttonClicked = event.target;
            var productItem = buttonClicked.parentElement.parentElement;
            var productName = productItem.getElementsByClassName('name')[0].getElementsByTagName('p')[0].textContent.trim();

            // remove from the left panel
            productItem.remove();

            // remove from the right panel
            var cartItems = document.getElementsByClassName('product-item');
            for(var j = 0; j < cartItems.length; j++){
                var cartItem = cartItems[j];
                if(cartItem.textContent.trim().split("\n")[0].trim() === productName){
                    cartItem.remove();
                    break;
                }
            }
        });
    }
}

function buy(event){
}
function increase(event){
    
}
function decrease(event){
    
}
function addProduct(event){
    
}
